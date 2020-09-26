namespace("comm_");
const BOOST = 4;
const BOOST_RANGE = 4;
var commandTurrets = [];
var unitsOld = [];

function comm_eventGameInit()
{
	setTimer("updateBoost", 200);
}

function updateBoost()
{
	var units = [];
	commandTurrets.forEach(function(turret){
		turret = getObject(turret.type, turret.player, turret.id);
		if (turret === null){return;}
		var objects = enumRange(turret.x, turret.y, BOOST_RANGE);
		units = units.concat(objects.filter(function (unit){
			if (unit.type == DROID && unit.player == turret.player){return true;}
			return false;
		}));
	});
	units.forEach(function (unit){
		unit =  getObject(unit.type, unit.player, unit.id);
		setDroidExperience(unit, Math.round(unit.experience + BOOST));
//		debug ("boost", unit.id);
	});
	unitsOld.forEach(function (unit){
		unit =  getObject(unit.type, unit.player, unit.id);
		if (unit ===  null){return;}
		setDroidExperience(unit, Math.round(unit.experience - BOOST));
//		debug ("unboost", unit.id);
	});
	unitsOld = units;
}

function comm_eventDroidBuilt(droid)
{	
	setDroidExperience(droid, 0);
	if (droid.droidType == DROID_COMMAND)
	{
		commandTurrets.push (droid);
//		debug("push");
	}
}
