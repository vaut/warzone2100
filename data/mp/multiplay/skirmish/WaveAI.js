/*jshint esversion: 7 */
namespace("wave_");
debug ("run");
var waves = [];
function wave_eventGameInit()
{
	setTimer("attack", 30*1000);
	setTimer("takeUnits", 5*1000);
}

function attack()
{
	var targets = [];
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (playnum == me || allianceExistsBetween(me, playnum)) {continue;}
		targets = targets.concat(enumStruct(playnum), enumDroid(playnum));
	}
	if (targets.length == 0){return;}
//	debug(JSON.stringify(targets));
	waves.forEach(function(num)
	{
		var myWave = enumGroup(num.group);
		if (myWave.length == 0)
		{
			return;
		}
		var my = myWave[0];
		var target = targets[Math.floor(Math.random()*targets.length)];
		for (var N=0; N < 5; N++)
		{
			var temp = targets[Math.floor(Math.random()*targets.length)];
			if (dist(target, my) > dist(my, temp))
			{
//			debug("dist", dist( temp,target));
			target = temp;
			}
		}
		if ((dist(target, my) < ((mapWidth/10)**2 + (mapHeight/10)**2)) ||
		num.oldTarget.x == Infinity ||
		(Math.floor(Math.random()*10)==1))
		{
			debug("target group", num.group, target.name, target.x, target.y);
			num.oldTarget = target;
			myWave.forEach(function(o)
			{
				orderDroidObj(o, DORDER_ATTACK, target );
			});
		}
	});
}

function takeUnits()
{
	var newWave = enumDroid(me, DROID_WEAPON);
	newWave = newWave.concat(enumDroid(me, DROID_CYBORG));
	newWave = newWave.filter(function(p){if(p.group) return false; return true;});
	if (!newWave || !newWave.length){return;}
//	debug(JSON.stringify(newWave));
	var num =  waves.length;
	waves[num] = {
		"group" : newGroup(),
		"oldTarget" : {x : Infinity, y:Infinity }
			};
	newWave.forEach(function(o){groupAdd(waves[num].group, o);});

}

function dist(a,b)
{
	return ((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}

function eventDroidIdle(droid){
	if (droid.player !== me){return;}
	if (!droid.group){takeUnits(); debug("take"); return;}
	var x = waves[droid.group-1].oldTarget.x;
	var y = waves[droid.group-1].oldTarget.y;
	if (x == Infinity)
	{
		waves[droid.group-1].oldTarget.x = Math.random()*mapWidth; 
		waves[droid.group-1].oldTarget.y = Math.random()*mapHeight; 
	}
	if (dist(droid, waves[droid.group-1].oldTarge) < 123 ){}
	debug ("DroidIdle", droid.group, x, y);
	enumGroup(droid.group).forEach(function(o)
		{
			orderDroidLoc(o, DORDER_SCOUT, x, y);
		});

}

function randTarget(group, targets)
{
}

function nearTarget(group, targets)
{
}

function clustering(group, targets)
{	
}


