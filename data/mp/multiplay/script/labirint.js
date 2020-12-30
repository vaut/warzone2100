include ("multiplay/script/templates.js");
namespace("lab_");
const AI = 1;

function lab_eventGameInit()
{
	setTimer("getResearch", 1000*60);
	setTimer("landing", 1*60*1000);
	makeComponentAvailable("MG1Mk1", AI);
	var spotter = {
		X: mapWidth/2,
		Y: mapHeight/2,
		radius: Math.sqrt(mapWidth*mapWidth + mapHeight*mapHeight)/2*128
	};
	addSpotter(spotter.X, spotter.Y, AI, spotter.radius, 0, 0);
}


function landing()
{
	var avalibleTemplate = [];
	for (var key in allTemplates)
	{
		if  (makeTemplate(AI, key, allTemplates[key].body, allTemplates[key].propulsion, "", allTemplates[key].weapons) !== null &&
		(allTemplates[key].propulsion != "wheeled01" || !componentAvailable( "HalfTrack")))
		{
			avalibleTemplate.push(key);
		}
	}
//	debug (JSON.stringify(avalibleTemplate));

	var budget = 1*4*gameTime/1000;
	while (budget >0)
	{
		var droidName = avalibleTemplate[syncRandom(avalibleTemplate.length)];
		X = mapWidth/2;
		Y = mapHeight/2;

		var template = makeTemplate(AI, droidName, allTemplates[droidName].body, allTemplates[droidName].propulsion, "", allTemplates[droidName].weapons );
//		debug(JSON.stringify(template));
		addDroid(AI, X, Y, droidName, allTemplates[droidName].body, allTemplates[droidName].propulsion , "", "", allTemplates[droidName].weapons );
		budget -= template.power;
		debug (budget);
	}
}

function getResearch()
{
	completeResearchOnTime(gameTime/1000, AI);
}
