//START Setup Instructions

//mark runes to mining spots within 1 tile of the minable spot
//you must have 2 runes in your pack to your house named "HOME", please make them diffrent spots that are within 1 of mailbox
//At your house there must be a mailbox within 1 tile of your recall to HOME
//there must be at least one runebook in your pack named "MINE"
//There should not be any empty spaces in the runebook
//This will handle mining satchel if you have one (will increase volume between trips to house)
// END Setup Instructions


var keepNormalLogs = false;


//dont edit below this point

var recalllWaitTime = 5000;

var otherItemsHarvested = [
	'0x5732',
	//Crystalline Blackrock
	'0x3195', '0x3193', '0x3197', '0x3194', '0x3198', '0x3192', 
	//ecru, Turquoise, Fire Ruby, Perfect Emerald, Blue Diamond, Dark Sapphire	
	'0x0F26', '0x0F28', '0x0F2A', '0x0F2B', 
	//Small Piece Of Blackrock
];

var oreGraphics = ['0x19B9', '0x19B8', '0x19B7', '0x19BA', '0x1779'];
// big ore (12 stone), med ore (7 stone), small ore (2 stone), med ore 2 (7 stone), High Quality Granite

var satchelGraphic = '0xA272';

var noMetalText = "There is no metal here to mine.";
var notAMining = "You can't mine that"
var cannotSee = "You cannot see that location";
var runebookToUseIds = [];
var homeRuneIds = [];
var recallIndex = 0; //0 is first rune in runebook, 15 is last;
var runebookIndex = 0; //0 is the first runebook, you should have at least one

var shovelGraphic = '0x0F3A|0x0F39';


function main(){
	GetRunebooks();
	GetHomeRunes();
	
	DepositResources();
	GoToResourceLocation();
	while(true){
		if(Player.Weight() > (Player.MaxWeight() - 110)){
			MinimizeBag();
			if(Player.Weight() > (Player.MaxWeight() - 200)){
				DepositResources();
				GoToResourceLocation();
			}
		}
		if(!CheckTools()){
			DepositResources();
			GoToResourceLocation();
		}	
		CollectResource();
	}
}

function GetHomeRunes(){
	var runebooks = Orion.FindType("0x1F14", any, 'backpack', '', 'finddistance', '', false);
	runebooks.forEach(function(runeId){			
			var rune = Orion.FindObject(runeId);
			var properties = rune.Properties();
			if(properties.indexOf('HOME') > -1){
				homeRuneIds.push(runeId)
			}
		})
}
function GetRunebooks(){
	var runebooks = Orion.FindType("0x22C5", any, 'backpack', '', 'finddistance', '', false);
	runebooks.forEach(function(runebookId){			
			var runebook = Orion.FindObject(runebookId);
			var properties = runebook.Properties();
			if(properties.indexOf('MINE') > -1){
				runebookToUseIds.push(runebookId)
			}
		})
}


function CheckTools(){
	var tinkersToolsType = '0x1EB9';
	var foundShovels = Orion.FindType(shovelGraphic, any, 'backpack', '', 'finddistance', '', false);
	if(foundShovels && foundShovels.length > 0 ) return true;
	var ingots = Orion.FindTypeEx('0x1BF2', any, 'backpack', '', 'finddistance', '', false);
	if(!ingots || ingots.length === 0 || ingots[0].Count() < 10) return false;
	
	var find = Orion.FindType(tinkersToolsType, any, 'backpack', '', 'finddistance', '', false);
	if(!find) return false;
	if(find.length < 2){
		while(Orion.FindType(tinkersToolsType, any, 'backpack', '', 'finddistance', '', false).length < 3){
			find = Orion.FindType(tinkersToolsType, 'any', 'backpack');
			Orion.UseObject(find[0])
			if(Orion.WaitForGump(3000)){
				lastToolId = find[0];
			}
			Orion.Wait(750);
			var gump0 = Orion.GetGump('last');
			if (gump0.ID() === '0x000001CC')
			{
				gump0.Select(Orion.CreateGumpHook(9003));
				Orion.WaitForGump(3000);
			}
			Orion.Wait(750);
			var gump0 = Orion.GetGump('last');
			if (gump0.ID() === '0x000001CC')
			{
				gump0.Select(Orion.CreateGumpHook(11));
				Orion.WaitForGump(3000);
			}
		}
	}
	find = Orion.FindType(tinkersToolsType, any, 'backpack', '', 'finddistance', '', false)
	var initialTool = find[0];
	Orion.UseObject(find[0])
	if(Orion.WaitForGump(3000)){
		lastToolId = find[0];
	}
	Orion.Wait(750);
	var gump0 = Orion.GetGump('last');
	if (gump0.ID() === '0x000001CC')
	{
		gump0.Select(Orion.CreateGumpHook(9003));
		Orion.WaitForGump(3000);
	}
	Orion.Wait(750);
	
	for(var i = 0; i < 3; i++){
		if(!Orion.FindObject(initialTool)){
			// use new tool 
			find = Orion.FindType(tinkersToolsType, any, 'backpack', '', 'finddistance', '', false);
			initialTool = find[0];
			Orion.UseObject(initialTool);
			Orion.WaitForGump(3000);
			
		}
		gump0 = Orion.GetGump('last');
		if (gump0.ID() === '0x000001CC')
		{
			gump0.Select(Orion.CreateGumpHook(18));
			Orion.WaitForGump(3000);
			Orion.Wait(250);
		}
	}
	gump0 = Orion.GetGump('last');
	if (gump0.ID() === '0x000001CC')
	{
		gump0.Select(Orion.CreateGumpHook(0));
		Orion.Wait(250);
	}
	return true;
}




var lastRune = null;
var lastRuneAttemptCount = 0;
function CollectResource(){
	var shovels = Orion.FindType(shovelGraphic, any, 'backpack', '', 'finddistance', '', false);
	if(!shovels || shovels.length === 0) return;
	var minableTiles = Orion.GetTilesInRect('mine', Player.X() - 1, Player.Y() - 1, Player.Z() - 14, Player.X() + 1, Player.Y() + 1, Player.Z() + 14);
	if(minableTiles && minableTiles.length > 0){
		Orion.UseObject(shovels[0]);
		if (Orion.WaitForTarget(1000)){
			Orion.TargetTile('mine', minableTiles[0].X(), minableTiles[0].Y(), minableTiles[0].Z());
			Orion.Wait(1200);
		}
	}
	var lastJournal = Orion.LastJournalMessage().Text();
	Orion.Print(lastJournal);
	var moveToNextSpot = lastJournal.indexOf(noMetalText) > -1 || 
										lastJournal.indexOf(notAMining) > -1  ||
										lastJournal.indexOf(cannotSee) > -1  ||
										!minableTiles || minableTiles.length === 0;
	var nextLastRune =  recallIndex + " - " + runebookIndex;
	
	if(nextLastRune === lastRune){
		lastRuneAttemptCount = lastRuneAttemptCount + 1;
	} else {
		lastRuneAttemptCount = 0;
		lastRune = nextLastRune;
	}
	
	
	
	if(moveToNextSpot || lastRuneAttemptCount > 75){
		if(recallIndex === 15){
			recallIndex = 0;
			if(runebookIndex === (runebookToUseIds.length - 1)){
				runebookIndex = 0;
			} else {
				runebookIndex = runebookIndex + 1;
			}			
		} 
		else {
			recallIndex = recallIndex + 1;
		}
		GoToResourceLocation();
	}
}

function GoToResourceLocation(){
	var buttonIndex = 50 + recallIndex;
	Orion.UseObject(runebookToUseIds[runebookIndex]);
	Orion.Print("Book: " + runebookIndex +  " Position: " + recallIndex)
	if (Orion.WaitForGump(3000))
	{
		var gump = Orion.GetGump('last');
		if ((gump !== null) && (!gump.Replayed()) && (gump.ID() === '0x00000059'))
		{
			gump.Select(Orion.CreateGumpHook(buttonIndex));
			Orion.Wait(recalllWaitTime);
		}
	}
}

function DepositResources(){
	var positionX = Player.X();
	var positionY = Player.Y();
	Orion.Cast('32');
	if (Orion.WaitForTarget(4000))
		Orion.TargetObject(homeRuneIds[0]);
	Orion.Wait(recalllWaitTime);
	if(positionY === Player.Y() && positionX === Player.X()){
		Orion.Cast('32');
		if (Orion.WaitForTarget(4000))
			Orion.TargetObject(homeRuneIds[1]);
		Orion.Wait(recalllWaitTime);
	}
	Orion.UseObject('backpack');
	Orion.Wait('1200');
	var foundLumberjackSatchels = Orion.FindType(satchelGraphic, any, 'backpack', '', 'finddistance', '', false);
	if(foundLumberjackSatchels && foundLumberjackSatchels.length > 0){
		Orion.UseObject(foundLumberjackSatchels[0]);
		Orion.Wait('1200');
	}
	
	function MoveResourceToMailbox(){
		for(var counter = 0; counter < oreGraphics.length; counter++){
			if(MoveGraphicToMailbox(oreGraphics[counter])) return true;			
		}	
		for(var counter = 0; counter < otherItemsHarvested.length; counter++){
			if(MoveGraphicToMailbox(otherItemsHarvested[counter])) return true;			
		}	
		return false;
	}
	
	function MoveGraphicToMailbox(graphic){
		var mailboxes = Orion.FindType("0x4142", -1, 'ground', '', '1');
		var item = Orion.FindType(graphic, -1, 'backpack', '', -1, '', true);
		if(item && item.length > 0){
			Orion.MoveItem(item[0], 1000, mailboxes[0]);
			Orion.Wait('1200');
			return true;
		}
		return false;
	}
	
	while(MoveResourceToMailbox()){}
	
	var backpackIngots = Orion.FindTypeEx('0x1BF2', any, 'backpack', '', 'finddistance', '', false);
	if(!backpackIngots || backpackIngots.length === 0 || backpackIngots[0].Count() < 50){
		var mailboxes = Orion.FindType("0x4142", -1, 'ground', '', '1');
		Orion.UseObject(mailboxes[0]);
		Orion.Wait(1400);
		var mailboxIngots = Orion.FindType('0x1BF2', 0x0000, mailboxes[0]);
		Orion.MoveItem(mailboxIngots[0], 100);
		Orion.Wait(1400);
	}
	
}


function MinimizeBag(){
	var foundSatchels = Orion.FindType(satchelGraphic, -1, 'backpack', '', 'finddistance', '', false);
	if(foundSatchels && foundSatchels.length > 0){
		var foundOre = Orion.FindType(oreGraphics.join('|'), any, 'backpack', '', 'finddistance', '', false);
		if(foundOre && foundOre.length > 0){
			foundOre.forEach(function(foundOreItem){
				Orion.MoveItem(foundOreItem, 1000, foundSatchels[0]);
				Orion.Wait('1200');
			});			
		}
	}
}
