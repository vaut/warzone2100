namespace("wave_");
debug ("run");
var waves = [];
function wave_eventGameInit()
{
	setTimer("attack", 5*1000);
	setTimer("takeUnits", 15*1000);
}

function attack()
{
	var targets = [];
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (playnum == me) {continue;}
		targets = targets.concat(enumStruct(playnum), enumDroid(playnum)) ;
	}
//	debug(JSON.stringify(targets));
//	targets = targets.filter(function (p){debug(p.player, me); if (p.player == me) return false; return true;});
	if (targets.length == 0){return;}
//	debug(JSON.stringify(targets));
	waves.forEach(function(num)
	{
		var myWave = enumGroup(num.group);
		if (myWave.length == 0)
		{
			return;
		}
		my = myWave[syncRandom(myWave.length)];
		var target = targets[syncRandom(targets.length)];
		for (var N=0; N < 5; N++)
		{
			var temp = targets[syncRandom(targets.length)];
			if (dist(target, my) > dist(my, temp))
			{
//			debug("dist", dist( temp,target));
			target = temp;
			}
		}
		var my = myWave[syncRandom(myWave.length)];
		if ((dist(target, my) < ((mapWidth/10)**2 + (mapHeight/10)**2)) ||
		num.oldTarget.x == Infinity ||
		(syncRandom(10)==1))
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
