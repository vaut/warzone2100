namespace("rase_");

function rase_eventGameInit()
{
	if (alliancesType !== NO_ALLIANCES){return;}
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		for (var splaynum = 0; splaynum < maxPlayers; splaynum++)
		{	
//			debug ("???", playerData[splaynum].position, playerData[playnum].position );
			if (playerData[playnum].position - playerData[splaynum].position == 1 ||
			playerData[playnum].position - playerData[splaynum].position == maxPlayers-1)
			{
				setAlliance (playnum, splaynum, true);
				setAlliance (splaynum, playnum, true);
//				debug ( playerData[splaynum].position, playerData[playnum].position );
			}
		}
	}
} 
