function printReportBattle()
{
	var colors =  [_("Green"),_("Orange"),_("Grey"),_("Black"),_("Red"),_("Blue"),_("Pink"),_("Cyan"),_("Yellow"),_("Purple"),_("White"),_("Bright blue"),_("Neon green"),_("Infrared"),_("Ultraviolet"),_("Brown")];
	var teams = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		console([
			playerData[playnum].usertype,
			colors[playerData[playnum].colour],
			playerData[playnum].name,
			_("Team"),
			teams[playerData[playnum].team],
			_("Position"),
			playerData[playnum].position
		].join(" "));
		debug([
			"USERJSDUMP",
			playerData[playnum].position,
			playerData[playnum].usertype,
			playerData[playnum].droidLost,
			playerData[playnum].structureLost,
			playerData[playnum].kills
			].join(" "));
		debug(JSON.stringify(playerData[playnum]));
	}
	debug(["GAMETIMEDUMP", gameTime].join(" "));
	if (playerData[selectedPlayer].usertype == USERTYPE.spectator)
	{
		console(_("the battle is over, you can leave the room"));
		debug("the battle is over, you can leave the room");
	}
}


function smallReportBattle()
{
	if (playerData[selectedPlayer].usertype !== USERTYPE.spectator){return;}
	debug("FRAMEUPDATE "+gameTime);
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (playerData[playnum].usertype == USERTYPE.spectator){continue;}
		debug([
		"FRAMEUPDATE2",
		playerData[playnum].position,
		playerData[playnum].kills,
		playerData[playnum].droidLost,
		playerData[playnum].droidLoss,
		playerData[playnum].structureLost,
		playerData[playnum].colour,
		countDroid(DROID_ANY, playnum),
		playerData[playnum].name
		].join(" "));
	}
	debug("FRAMEPUSH");
}



namespace("rp_");
function printStartGameSettings()
{
	//add human readable method
	var human =
	{
		scavengers : function () {
			if ( scavengers == true) {return _("Scavengers");}
			if ( scavengers == false) {return _("No Scavengers");}
		},

		alliancesType : function () {
			switch (alliancesType) {
				case NO_ALLIANCES: return _("No Alliances");
				case ALLIANCES: return _("Allow Alliances");
				case ALLIANCES_TEAMS: return _("Locked Teams");
				case ALLIANCES_UNSHARED: return _("Locked Teams, No Shared Research");
			}
		},

		powerType : function () {
			switch (powerType) {
				case 0: return _("Low Power Levels");
				case 1: return _("Medium Power Levels");
				case 2: return _("High Power Levels");
			}
		},

		baseType : function () {
			switch (baseType) {
				case CAMP_CLEAN: return _("Start with No Bases");
				case CAMP_BASE: return _("Start with Bases");
				case CAMP_WALLS: return _("Start with Advanced Bases");
			}
		},
	};
	debug(["BATTLEDUMP", scavengers, powerType, baseType, alliancesType].join(" "));
	console( [mapName, human.scavengers(), human.alliancesType(), human.powerType(), human.baseType() ].join("\n"));
	
}

var attacker = [];

function rp_eventGameInit()
{
	printStartGameSettings();
	for (var playnum = 0; playnum < maxPlayers; playnum++){
		playerData[playnum].droidLost=0;
		playerData[playnum].droidLoss=0;
		playerData[playnum].structureLost=0;
		playerData[playnum].kills=0;
		attacker[playnum]=[];
		attacker[playnum].droid=[];
	}
	attacker[scavengerPlayer]=[];
	attacker[scavengerPlayer].droid=[];
	setTimer("smallReportBattle", 10*1000);

}

function rp_eventDestroyed(victim)
{
//	console("dest:"+victim.player);
	if (victim.player == scavengerPlayer){return;}
	if (victim.type == DROID && attacker[victim.player].droid[victim.id]){
		if (attacker[victim.player].droid[victim.id] == scavengerPlayer)
		{
			playerData[victim.player].droidLoss++;
		}
		else
		{
			playerData[victim.player].droidLost++;
			playerData[attacker[victim.player].droid[victim.id]].kills++;
		}
	}
	if (victim.type == STRUCTURE){
		playerData[victim.player].structureLost++;
	}
}

function rp_eventAttacked(victimObj, attackerObj)
{
//	console("attack:"+attackerObj.player+"->"+victimObj.player);
	if (victimObj.type == DROID){
		{
			attacker[victimObj.player].droid[victimObj.id] = attackerObj.player;
		}
	}
}
