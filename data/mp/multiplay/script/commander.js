namespace("comm_");

var commandTurrets = [];
var unitBoost = [];

function comm_eventGameInit()
{
	setTimer("updateBoost", 500);
}

function updateBoost()
{
	commandTurrets.forEach(function (Turret){
		debug("turret");
		var units = enumRange(Turret.x, Turret.y, 3);
		units = units.filter(function (unit){
			if (unit.type == DROID){return true;}
			return false;
		});
		debug (JSON.stringify(units));
		units.forEach (function (unit){
			unitBoost.push(unit);
			setDroidExperience(unit, 4);
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


