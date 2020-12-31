namespace("wave_");
debug ("run");

function wave_eventGameInit()
{
	setTimer("attack", 10*1000);
	debug ("init");
}

function attack()
{
	var targets = enumStruct(0).concat( enumDroid(0)) ;
	if (targets.length == 0){return;}
	var target = targets[syncRandom(targets.length)];
	debug("target", target.name, target.x, target.y);
	X = target.x+syncRandom(512)/128-2;
	Y = target.y+syncRandom(512)/128-2;
	var myWave = enumDroid(me, DROID_WEAPON);
	myWave.forEach(function(o){orderDroidLoc(o, DORDER_SCOUT, X, Y);});
}
