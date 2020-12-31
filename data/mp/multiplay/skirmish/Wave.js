namespace("wave_");
debug ("run");
var waves = [];
function wave_eventGameInit()
{
	setTimer("attack", 15*1000);
	setTimer("takeUnits", 5*1000);
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

		var my = myWave[syncRandom(myWave.length)];
		var targetFirst = targets[syncRandom(targets.length)];
		var targetSecond = targets[syncRandom(targets.length)];

		if  (((targetFirst.x - my.x)^2 + (targetFirst.y-my.y)^2) < ((targetSecond.x - my.x)^2 + (targetSecond.y-my.y)^2))
		{
			target=targetFirst;
		}
		else
		{
			target=targetSecond;
		}
		debug("target group", num.group, target.name, target.x, target.y);

//		debug (JSON.stringify(num));
//			debug (JSON.stringify(num.oldTarget));
//			debug("if", ((target.x - my.x)^2 + (target.y-my.y)^2) < ((num.oldTarget.x-my.x)^2 + (num.oldTarget.y-my.y)^2));

		if (
			((target.x - my.x)^2 + (target.y-my.y)^2) < ((num.oldTarget.x- my.x)^2 + (num.oldTarget.y- my.y)^2) ||
			(syncRandom(100)==1)
		)
		{
			debug("new target", target.name, target.x, target.y );
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
