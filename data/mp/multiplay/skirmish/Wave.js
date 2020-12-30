namespace("wawe_");
debug ("run");

function wawe_eventGameInit()
{
	setTimer("attack", 10*1000);
	debug ("init");
}

function attack()
{
	var targets = enumStruct(0).concat( enumDroid(0)) ;

	var target = targets[syncRandom(targets.length)];
	debug(JSON.stringify(target));
	var myWave = enumDroid(me, DROID_WEAPON);
	myWave.forEach(function(o){orderDroidLoc(o, DORDER_SCOUT, target.x, target.y);});
}
