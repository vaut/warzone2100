include ("multiplay/script/templates.js"); 
namespace("wa_");

// Defining script variables
var AI;	//num wawe AI
for (var playnum = 0; playnum < maxPlayers; playnum++)
{
	if (playerData[playnum].isAI == true && playerData[playnum].name == "Wave")
	{
	AI = playnum;
	}
}
if (!AI) {console("ERROR \n not found WaveAI");}


var waveDifficulty = (playerData[AI].difficulty+1)/2;	//general danger of waves 0.5, 1, 1.5, 2


var protectTime = 5/waveDifficulty;	//time to first attack in minutes
var PauseTime = 2/waveDifficulty;	//pause between attacks in minutes



function calcBudget()
{
	var budget = 4*gameTime/1000*waveDifficulty;
	//дописать зависимость от вышек на карте
	debug("budget", budget);
	return budget;
}

///further logic of landing



function wa_eventGameInit()
{
	console (["difficulty" + difficulty,"protectTime"+protectTime, "PauseTime"+PauseTime, "AI"+AI].join("\n"));
	setTimer("getResearch", 60*1000);
	setTimer("landing", PauseTime*60*1000);
	makeComponentAvailable("MG1Mk1", AI);
	var spotter = {
		X: mapWidth/2,
		Y: mapHeight/2,
		radius: Math.sqrt(mapWidth*mapWidth + mapHeight*mapHeight)/2*128
	};
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		addSpotter(spotter.X, spotter.Y, playnum, spotter.radius, 0, 1000);
	}
}


function landing()
{
	if (gameTime/1000 < protectTime*60 ){return;}
	var avalibleTemplate = [];
	for (var key in allTemplates)
	{
		if (!allTemplates[key].weapons){continue;}
		if (makeTemplate(AI, key, allTemplates[key].body, allTemplates[key].propulsion, "", allTemplates[key].weapons) !== null && //у makeTemplate изменен синтаксис в мастере. Не совместимо с 3.4.1
		(allTemplates[key].propulsion != "wheeled01" || !componentAvailable( "HalfTrack")))
		{
			avalibleTemplate.push(key);
		}
	}
	var budget = calcBudget();
	while (budget >0)
	{
		var droidName = avalibleTemplate[syncRandom(avalibleTemplate.length)];
		X = mapWidth/2+syncRandom(1024)/128-4;
		Y = mapHeight/2+syncRandom(1024)/128-4;
		addDroid(AI, X, Y, droidName, allTemplates[droidName].body, allTemplates[droidName].propulsion , "", "", allTemplates[droidName].weapons );
		budget -= makeTemplate(AI, droidName, allTemplates[droidName].body, allTemplates[droidName].propulsion , "", allTemplates[droidName].weapons).power;
		debug("add", droidName);
	}
}

function getResearch()
{
	completeResearchOnTime(gameTime/1000, AI);
}
