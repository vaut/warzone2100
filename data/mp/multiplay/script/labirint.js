namespace("lab_");
//setMissionTime (7*60);
const AI = 1;
//for (var playnum = 0; playnum < maxPlayers; playnum++)
//	if (playerData[playnum].isAI !== true)
  //      {       
//		AI = playnum;
 //       {

function lab_eventGameInit()
{
	setTimer("getResearch", 1000*60);
	setTimer("landing", 1*60*1000);
	makeComponentAvailable("MG1Mk1", AI);
}


//function lab_eventResearched (research, structure, player)
//{
//	if (player.isAI !== true)
//	{
//		enableResearch (research, AI);
//	}
//}

function landing()
{
	X = mapWidth/2;
	Y = mapHeight/2;
	addDroid(AI, X, Y, "name", "Body1REC", "HalfTrack", "", "", "MG3Mk1");

}

function getResearch()
{
	completeResearchOnTime(gameTime, AI);
}
