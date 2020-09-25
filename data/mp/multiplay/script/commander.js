namespace("comm_");

var commandTurrets = [];
var unitsBoost = [];

function comm_eventGameInit()
{
	setTimer("updateBoost", 500);
}

function updateBoost()
{
	unitsBoost.forEach(function (unit){
	setDroidExperience(unit, -4);
	debug("remove boost ",  unit.experience);
	});
	unitsBoost = [];

	commandTurrets.forEach(function (turret){
		turret = getObject(turret.type, turret.player, turret.id);
		var objects = enumRange(turret.x, turret.y, 4);
		var units = objects.filter(function (unit){
			if (unit.type == DROID && unit.player == turret.player ){return true;}
			return false;
		});
		debug (JSON.stringify(units));
		units.forEach (function (unit){
			unitsBoost.push(unit);
			setDroidExperience(unit,  4);
			debug("boost");
		});
	});
}

function comm_eventDroidBuilt(droid)
{	

	debug (JSON.stringify(droid, null, '\t'));
	if (droid.droidType == DROID_COMMAND)
	{
		commandTurrets.push (droid);
		debug("push");
	}
}


