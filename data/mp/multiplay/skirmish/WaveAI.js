/*jshint esversion: 7 */
namespace("wave_");
debug ("run");
var waves = [];
function wave_eventGameInit()
{
	setTimer("attack", 30*1000);
	setTimer("takeUnits", 5*1000);
}
/*
function attack()
{
	var targets = getAllTargets();
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
*/
function attack()
{
	waves.forEach(function(num)
	{
		var myWave = enumGroup(num.group);
		if (myWave.length == 0)
		{
			return;
		}
		mainTarget(num);
	});
}

function takeUnits()
{
	var newWave = enumDroid(me, DROID_WEAPON);
	newWave = newWave.concat(enumDroid(me, DROID_CYBORG));
	newWave = newWave.filter(function(p){if(p.group) return false; return true;});
	if (!newWave || !newWave.length){return;}
//	debug(JSON.stringify(newWave));
	var num =  newGroup();
	waves[num] = {
		"mainTarget" : "",
		"secondTarget":[]
		};
	newWave.forEach(function(o){groupAdd(waves[num].group, o);});
	attack(num);

}

function dist(a,b)
{	
	if (!(a.x && b.x && a.y && b.y)) {return Infinity;}
	return ((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}
function cosPhy(cent, target1, target2)
{	
	let a = {x: target1.x-cent.x, y:target1.y-cent.y};
	let b = {x: target2.x-cent.x, y:target2.y-cent.y};
//	if (!(a.x && b.x && a.y && b.y)) {return -1;}
//	debug((a.x*b.x+a.y*b.y)/(Math.sqrt(a.x**2+a.y**2)*Math.sqrt(b.x**2+b.y**2)) );
	return (a.x*b.x+a.y*b.y)/(Math.sqrt(a.x**2+a.y**2)*Math.sqrt(b.x**2+b.y**2));
}
/*
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
*/
function mainTarget(group)
{
	let targets = getMainTargets();
	let target={x: Infinity, y: Infinity};
	let myWave = enumGroup(group);
	let my = myWave[0];
	for (var N=0; N < 5; N++)
	{
		var temp = targets[Math.floor(Math.random()*targets.length)];
		if (dist(target, my) > dist(my, temp))
		{
		target = temp;
		}
	}
	if (myWave.length == 0){ return;}
	
//	debug("random target", group, target.name, target.x, target.y);
	waves[group] = {"mainTarget" : target};
	definitionSecondTarget(group);
	let secondTarget = waves[group].secondTarget.shift();
	debug (secondTarget);
	myWave.forEach(function(o)
	{	
		orderDroidObj(o, DORDER_ATTACK, secondTarget);
	});
}

function definitionSecondTarget(group)
{
	if (enumGroup(group).length == 0){ return;}
	if (!waves[group].mainTarget){ return;}
	targets = getAllTargets();
	pos = enumGroup(group)[0];
	targets = targets.filter(function(p){
		if(cosPhy(pos, waves[group].mainTarget, p) < 0.98){return true;} 
		return false;
	});
	targets.sort(function (a, b) {
		if (dist (a, pos) > dist (b, pos)) {return 1;}
  		if (dist (a, pos) < dist (b, pos)){return -1;}
  		return 0;
	});
//	debug("second targets", JSON.stringify(targets));
	waves[group].secondTarget = targets;
}

function clustering(group)
{
	var [x, y] = [enumGroup(group)[0].x, enumGroup(group)[0].y];
	enumGroup(group).forEach(function(o)
		{
			orderDroidLoc(o, DORDER_SCOUT, x, y);
		});	
}

function getAllTargets()
{
	var targets = [];
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (playnum == me || allianceExistsBetween(me, playnum)) {continue;}
		targets = targets.concat(enumStruct(playnum), enumDroid(playnum));
	}
	return targets;
	
}

function getMainTargets()
{
	var targets=[];
	var structs = [HQ, FACTORY, POWER_GEN, RESOURCE_EXTRACTOR, LASSAT, RESEARCH_LAB, REPAIR_FACILITY, CYBORG_FACTORY, VTOL_FACTORY, REARM_PAD, SAT_UPLINK, GATE, COMMAND_CONTROL];
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (playnum == me || allianceExistsBetween(me, playnum)) {continue;}
		for (var i = 0; i < structs.length; ++i)
		{
			targets = targets.concat(enumStruct(playnum, structs[i]));
		}
		targets = targets.concat(enumDroid(playnum), DROID_CONSTRUCT);
	}
	if (targets.length == 0){targets=getAllTargets();}
	return targets;
}
	


