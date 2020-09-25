namespace("comm_");
const BOOST = 4;
const BOOST_RANGE = 4;
var commandTurrets = [];
var unitsOld = [];

function comm_eventGameInit()
{
	setTimer("updateBoost", 500);
}

function updateBoost()
{
	var units = [];
	commandTurrets.forEach(function (turret){
		turret = getObject(turret.type, turret.player, turret.id);
		var objects = enumRange(turret.x, turret.y, BOOST_RANGE);
		units = objects.filter(function (unit){
			if (unit.type == DROID && unit.player == turret.player ){return true;}
			return false;
		});
		
//		debug (JSON.stringify(units));
//		units.forEach (function (unit){
//			newBoost.push (unit);
//			unit.boost+=1;
//			setDroidExperience(unit, BOOST);
//			debug("boost ", unit.experience);
//		});
	});

//	debug ("new", JSON.stringify(units));
//	debug ("old", JSON.stringify(unitsOld));
	units.forEach(function (unit){
		debug("check new");
		if ( !contains(unitsOld, unit)){setDroidExperience(unit, Math.round(unit.experience+BOOST)); debug ("boost");}
	});
	unitsOld.forEach(function (unit){
		debug("check remove");
		if ( !contains(units, unit)){setDroidExperience(unit, Math.round(unit.experience-BOOST)); debug ("unboost");}

	});
	unitsOld = units;

}

function comm_eventDroidBuilt(droid)
{	

//	debug (JSON.stringify(droid, null, '\t'));
	if (droid.droidType == DROID_COMMAND)
	{
		commandTurrets.push (droid);
		debug("push");
	}
}

function contains(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == elem.id) {
            return true;
        }
    }
    return false;
}
