
function uuidv4() {
    return 'xxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

var durabilityMin = 75;
function SetRepairDurabilityMin(value){
	durabilityMin = value;
}
function AutoRepair(){
	var getDura = function(props){
		if(!props || props.length === 0) return 255;
		var matches = /Durability (\d+)\s\/\s(\d+)/.exec(props);
		if(!matches || matches.length < 2) return 255;
		return matches[1];
	}
	var getDuraDelta = function(props){
		if(!props || props.length === 0) return 0;
		var matches = /Durability (\d+)\s\/\s(\d+)/.exec(props);
		if(!matches || matches.length < 2) return 0;
		return matches[2] - matches[1];
	}

	var isRepairableAndNeedsRepairs = function(props){
			if(!props || props.length === 0) return false;
			if(props.indexOf("Durability ") === -1) return false;
			var durability = getDura(props);
			return durabilityMin > durability;
	}
	
	var repairBenches = Orion.FindType("0xA27F", "any", "ground", "", 1);	
	if(!repairBenches || repairBenches.length === 0) return null;
	
	var paperdollItems = [];
	 for (var i=1; i<25; i++) {
     	var item = Orion.ObjAtLayer(i);
     	if (item) {
     		paperdollItems.push(item.Serial());
     	}
     }
	if(!paperdollItems || paperdollItems.length === 0) return;
	
	paperdollItemsNeedRepair = paperdollItems.filter(function(itemId){
		var itemObject = Orion.FindObject(itemId);
		if(!itemObject) {
			return false;
		}
		var props = itemObject.Properties();
		if(isRepairableAndNeedsRepairs(props)){
			return true;
		}
		return false;
	});
	if(!paperdollItemsNeedRepair || paperdollItemsNeedRepair.length === 0) return null;
	paperdollItemsNeedRepair.forEach(function(itemId){			
		var abandonShip = false;
		while(!abandonShip && isRepairableAndNeedsRepairs(Orion.FindObject(itemId).Properties())){
			Orion.UseObject(repairBenches[0]);
			if (Orion.WaitForGump(2000))
			{
				for(var i = 0; i < 7; i++){
					var gump0 = Orion.GetGump('last');
					if ((gump0 === null) || (gump0.Replayed()) || (gump0.ID() ==! '0x00002415'))
					{
						Orion.UseObject(repairBenches[0]);
						if (!Orion.WaitForGump(2000)) {
							abandonShip = true;
						} 
						gump0 = Orion.GetGump('last');
						if ((gump0 === null) || (gump0.Replayed()) || (gump0.ID() ==! '0x00002415')) {
							abandonShip = true;
						}
					}
					
					switch(i){ 
						case 0: {
							gump0.Select(Orion.CreateGumpHook(2001)); //tinker
							Orion.Wait(100);
							break;
						}
						case 1: {
							gump0.Select(Orion.CreateGumpHook(2002)); //smith
							Orion.Wait(100);
							break;
						}
						case 2: {
							gump0.Select(Orion.CreateGumpHook(2003)); //carp
							Orion.Wait(100);
							break;
						}
						case 3: {
							gump0.Select(Orion.CreateGumpHook(2006)); //tailor
							Orion.Wait(100);
							break;
						}
						case 4: {
							gump0.Select(Orion.CreateGumpHook(2010)); //mason
							Orion.Wait(100);
							break;
						}
						case 5: {
							gump0.Select(Orion.CreateGumpHook(2011)); //alch
							Orion.Wait(100);
							break;
						}
						case 6: {
							gump0.Select(Orion.CreateGumpHook(2009)); //alch
							Orion.Wait(100);
							break;
						}
					}
					
					if (Orion.WaitForTarget(2000))
					Orion.TargetObject(itemId);
					Orion.Wait(100);
				}
			}
		}
	});	
	Orion.Wait(1500);
	var benchGumpToClose = Orion.GetGump(repairBenches[0], '0x00002415');
	if (benchGumpToClose)
	{
		benchGumpToClose.Select(Orion.CreateGumpHook(0));
		Orion.Wait(100);
	}
	Orion.Print('AutoRepair Complete');	
}

var dropItems = ['Plunderin', 'Of The Shattered Sanctum']
function SetDropOffItems(items){
	dropItems = items;
}
	
var lastBackpackOpen = 0;
var openBackpack = function(){
	if(new Date().getTime() > lastBackpackOpen || !Orion.GumpExists('container', backpack)) {
		Orion.OpenContainer(backpack);
		Orion.Wait(1200);
		var bandageBelt = Orion.FindTypeEx("0xA1F6", 'any', 'backpack');
		var validBandageBelts = bandageBelt ? bandageBelt.filter(function(belt){
			return belt.Properties().indexOf('First Aid Belt') > -1;
		}) : bandageBelt;		
		if(validBandageBelts && validBandageBelts.length > 0) {
			if(!Orion.GumpExists('container', validBandageBelts[0].Serial())) {
				Orion.UseObject(validBandageBelts[0].Serial());
				Orion.Wait(1500);
			}
		}
		lastBackpackOpen = new Date().getTime() + 300000;
	}
}

var checkBackpackOpen = function(){
	if(!Orion.GumpExists('container', backpack)) {
		Orion.OpenContainer(backpack);
		Orion.Wait(1500);
		var bandageBelt = Orion.FindTypeEx("0xA1F6", 'any', 'backpack');
		var validBandageBelts = bandageBelt ? bandageBelt.filter(function(belt){
			return belt.Properties().indexOf('First Aid Belt') > -1;
		}) : bandageBelt;		
		if(validBandageBelts && validBandageBelts.length > 0) {
			if(!Orion.GumpExists('container', validBandageBelts[0].Serial())) {
				Orion.UseObject(validBandageBelts[0].Serial());
				Orion.Wait(1500);
			}
		}
	}
}
function ItemDropOff(){
	
	
	var findContainer = function(graphic){
		var dropDestinations = Orion.FindType(graphic, "any", "ground", "", 2);
		if(!dropDestinations || dropDestinations.length === 0) return null;
		dropDestinations = dropDestinations.filter(function(destId){
			var destObject = Orion.FindObject(destId);
			if(!destObject) return false;
			var destProps = destObject.Properties();
			if(destProps.indexOf('Locked Down & Secure') === -1) return false;
			var countLine = destProps.split('Contents: ')[1];
			var countString = countLine.split('/125')[0];
			var count = Number(countString);
			
			
			var weightLine =  destProps.split('Items, ')[1];
			var weightString =  weightLine.split(' Stones')[0];
			var weight =  Number(weightString);
			
			return count < 100 && weight < 475;
		});
		if(!dropDestinations || dropDestinations.length === 0) return null;
		return dropDestinations[0];
	}
	
	var eventItemDropOff = function(){
		if(findContainer("0x2256")){
			openBackpack();
			var itemsInBackpack = Orion.FindType('any', 'any', 'backpack');
			if(!itemsInBackpack || itemsInBackpack.length === 0) return;
			itemsInBackpack.forEach(function(itemId){
				var itemObject = Orion.FindObject(itemId);
				if(
					dropItems.filter(function(x){
						if(!itemObject) return false;
						return itemObject.Properties().indexOf(x) > -1
					}).length > 0
					){
						var dest = findContainer("0x2256");
						if(dest){
							Orion.MoveItem(itemId, 1, dest);
							Orion.Wait(1600);
						}						
					}			
			});
		}
	}
	
	
	var standardItemDropoff = function(){
		if(findContainer("0x0E76")){
			openBackpack();
			var backpackPouch = Orion.FindType('0x0E79', "any");
			if(!backpackPouch || backpackPouch.length === 0) return;
			
			var countLine = Orion.FindObject(backpackPouch).Properties().split('Contents: ')[1];
			var countString = countLine.split('/125')[0];
			var count = Number(countString);
			if(count === 0) return;
			
			Orion.OpenContainer(backpackPouch[0]);
			Orion.Wait(1400);
			var itemsInBackpack = Orion.FindType('any', 'any', backpackPouch[0]);
			Orion.Print(backpackPouch);
			itemsInBackpack.forEach(function(itemId){
				var itemObject = Orion.FindObject(itemId);
				if(!itemObject) return;
				var dest = findContainer("0x0E76");
				if(dest){
					Orion.MoveItem(itemId, 1, dest);
					Orion.Wait(1600);
				}				
			});
		}
	}
	
	// standard item drop off
	standardItemDropoff();
	
	// event item drop off
	eventItemDropOff();
	
	
	
}


var trashItems = {
		'0x2D32': 'Blade Dance',
		'0x2D33': 'Soul Seeker',
		'0x268A': 'Helm Of Swiftness',
		'0x2FB7': 'Quiver Of Rage',
		'0x2D34': 'Talon Bite',
		'0x2D23': 'Raed',
		'0x2D21': 'Flesh Ripper',
		'0x2D2B': 'Windsong',
		'0x2D35': 'Righteous Anger',
		'0x1411': 'Plate Of Honor',
		'0x13BE': 'Fey Leggings',
		'0x2FB8': 'Brightsight Lenses',
		'0x1F04': 'Robe Of The Equinox',
		'0x2B75': 'Elven Leafweave',
		'0x2D2A': 'Wildfire Bow',
		'0x13C6': 'Assassin Armor',
		'0x1415': 'Plate Of Honor',
		'0x13D4': 'Myrmidon Armor',
		'0x2D30': 'Bonesmasher',
		'0x13CB': 'Greymist Armor',
		'0x2B78': 'Elven Leafweave',
		'0x13DB': 'Myrmidon Armor',
		'0x13CC': 'Greymist Armor',
		'0x13D6': 'Myrmidon Armor',
		'0x13DA': 'Myrmidon Armor',
		'0x13CC': 'Assassin Armor',
		'0x13CB': 'Assassin Armor',
		'0x2B6E': 'Aegis Of Grace',
		'0x1F03': 'Robe Of The Eclipse',
		'0x2D31': 'Boomstick',
		'0x13C6': "Death's Essence",
		'0x2F5A': 'Bloodwood Spirit',
		'0x2FC9': "Hunter's Garb",
		'0x13CB': "Death's Essence",
	};
function SetAutoTrashItems(items){
	trashItems = items;
}

function AutoTrashItems (){
	var trashBarrels = Orion.FindType("0x0E77", "any", "ground", "", 2);	
	if(trashBarrels && trashBarrels.length > 0){
		openBackpack()
		var itemsInBackpack = Orion.FindType('any', 'any', 'backpack');
		itemsInBackpack.forEach(function(itemId){
			var itemObject = Orion.FindObject(itemId);
			if(!itemObject) return;
			if(trashItems.hasOwnProperty(itemObject.Graphic())){
				if(itemObject.Properties().indexOf(trashItems[itemObject.Graphic()]) > -1){
					Orion.MoveItem(itemId, 1, trashBarrels[0]);
					Orion.Wait(1600);
				}			
			}
		})
	}
}

var insurableText = [
	"Of Fey Wrath",
	"Of The Archlich",
	'Exodus Summoning Rite',
	'Exodus Sacrificial Dagger',
	'Exodus Summoning Altar',
	'Robe Of Rite',
	'Plunderin' //Pirate event
];
function SetItemsCheckBackpackUninsuredItems(items){
	insurableText = items;
}

function CheckBackpackUninsuredItems(){
		checkBackpackOpen();
		var itemsInBag = Orion.FindType('any', 'any', 'backpack');
		itemsInBag.forEach(function(itemId){
			var itemObject = Orion.FindObject(itemId);
			if(!itemObject) return;
			var props = itemObject.Properties();
			if(props.indexOf("Insured") > -1) {
				return;
			}
			if(props.indexOf("Blessed") > -1) {
				return;
			}
			if(insurableText.filter(function(text){
				return props.indexOf(text) > -1;
			}).length > 0){
				InsureItem(itemId);
			}
		})
}	


function RecoverCorpse(){
	var playerName = Player.Name();
	var corpses = Orion.FindType(any, any, ground, "inlos", 2);
	corpses.forEach(function(corpseId){
		var corpseObject =  Orion.FindObject(corpseId);
		if(!corpseObject) return;
		var props = corpseObject.Properties();
		if(props.indexOf(playerName) > -1 && corpseId !== Player.Serial()){
			Orion.Print("CORPSE FOUND");
			Orion.UseObject(corpseId);
			Orion.Wait(600);
			Orion.UseObject(corpseId);
			Orion.Wait(600);
			Orion.UseObject(corpseId);
			Orion.Wait(600);
			Orion.Ignore(corpseId);
		}
	});
}

var configFileName = Orion.CurrentScriptDirPath() + '/combatLoopConfig.json';
var ReadConfig = function (){
    var tmpFile = Orion.NewFile();
    tmpFile.Open(configFileName);
    var fileJson = {};
    var filestring = tmpFile.ReadAll();
    tmpFile.Close();
    if(filestring && filestring.length > 0){
        return JSON.parse(filestring);
    } else {
        return {};
    }
}
var WriteConfig = function (updatedConfig){	
    var tmpFile = Orion.NewFile();
    tmpFile.Remove(configFileName);
    tmpFile.Append(configFileName);
    tmpFile.Write(JSON.stringify(updatedConfig));
    tmpFile.Close();
}	
	
var SaveDressSet = function(){
	Orion.OpenPaperdoll(Player.Serial());
	Orion.Wait(1200);
	var savedConfig = ReadConfig();
	if(!savedConfig[Player.Serial()]) {
		savedConfig[Player.Serial()] = {dress: {}};
	}
	for (var i=1; i<33; i++) {
     	var item = Orion.ObjAtLayer(i);
     	if (item) {
     		Orion.Print(item.Graphic() !== '0x1F03' || item.Name() !== 'Robe');
	     	if(item.Graphic() !== '0x1F03' || item.Name() !== 'Robe'){
	     		savedConfig[Player.Serial()].dress[i] = item.Serial();
	     	} else {
	     		Orion.MoveItem(item.Serial(), 1, 'ground', Player.X() - 1, Player.Y() - 1)
	     		Orion.Wait(1400);
	     	}
     	}
     }
     WriteConfig(savedConfig);
}
	
	
function LastSuccessfullProfileRead(playerSerial){
	var savedConfig = ReadConfig(); // ReadConfiog();
	if(savedConfig[Player.Serial()] && savedConfig[Player.Serial()].profileContents){
		return savedConfig[Player.Serial()].profileContents;
	}
	return "";
}

function SaveSuccessfullProfileRead(friendProfile){
	var savedConfig = ReadConfig(); // ReadConfiog();
	if(!savedConfig[Player.Serial()]) {
		savedConfig[Player.Serial()] = {dress: {}};
	}
	savedConfig[Player.Serial()].profileContents = friendProfile;
	WriteConfig(savedConfig);
}
	
var timeBetweenNakedChecks = 30000;
var lastNakedCheck = 0;
function WhyAreWeNaked(){
	var nowTime = new Date().getTime();
	var deltaTime = nowTime - lastNakedCheck;
	if(deltaTime < timeBetweenNakedChecks){
		return;
	}
	lastNakedCheck = nowTime;
	checkBackpackOpen();
	
	if(Orion.FindType('any', 'any').length > 115){
		return;
	}
	var savedConfig = ReadConfig(); // ReadConfiog();
	if(savedConfig[Player.Serial()] && savedConfig[Player.Serial()].dress){
		if(!Orion.GumpExists('paperdoll', Player.Serial())) {
			Orion.OpenPaperdoll(Player.Serial());
			Orion.Wait(1200);
		}
		
		checkBackpackOpen();
		
		for (var i=1; i<33; i++) {
	     	var item = Orion.ObjAtLayer(i);
	     	if (!item) {
	     		if(savedConfig[Player.Serial()].dress[i] && Orion.FindObject(savedConfig[Player.Serial()].dress[i])){
	     			Orion.Equip(savedConfig[Player.Serial()].dress[i]);
	     			Orion.Wait(1200);
	     		}
	     	}
	     }
	}
}


function ResockBandages(){

		var resourceBoxGraphic = '0x09A8';
		var resourceBoxes = Orion.FindTypeEx(resourceBoxGraphic, "any", "ground", "", 1);	
		if(!resourceBoxes || resourceBoxes.length === 0) return;
		
		checkBackpackOpen();
		var bandageGraphic = '0x0E21';
		var bandageCount = 0;
		
		var bandageBelt = Orion.FindTypeEx("0xA1F6", 'any', 'backpack');
		var validBandageBelts = bandageBelt ? bandageBelt.filter(function(belt){
			return belt.Properties().indexOf('First Aid Belt') > -1;
		}) : bandageBelt;		
		if(validBandageBelts && validBandageBelts.length > 0) {
			if(!Orion.GumpExists('container', validBandageBelts[0].Serial())) {
				Orion.UseObject(validBandageBelts[0].Serial());
				Orion.Wait(1500);
			}
			
			var bandageBeltBandages = Orion.FindTypeEx(bandageGraphic, "any", validBandageBelts[0].Serial());
			if(bandageBeltBandages && bandageBeltBandages.length > 0){
				bandageBeltBandages.forEach(function(bandaid){
					bandageCount = bandageCount + bandaid.Count();
				})
			}
			if(bandageCount > 900) return;
		} else {
			var backpackBandages = Orion.FindTypeEx(bandageGraphic, "any", "backpack");
			
			if(backpackBandages && backpackBandages.length > 0){
				backpackBandages.forEach(function(bandaid){
					bandageCount = bandageCount + bandaid.Count();
				})
			}
			if(bandageCount > 1000) return;
		}
		
		
		
		
		
		Orion.OpenContainer(resourceBoxes[0].Serial());
		Orion.Wait(1200);
		
		var resourceBandages = Orion.FindTypeEx(bandageGraphic, "any", resourceBoxes[0].Serial());
		if(!resourceBandages || resourceBandages.length === 0) return;
				
		if(validBandageBelts && validBandageBelts.length > 0) {
			Orion.MoveItem(resourceBandages[0].Serial(), (1000 - bandageCount), validBandageBelts[0].Serial());
		} else {
			Orion.MoveItem(resourceBandages[0].Serial(), (1000 - bandageCount));
		}
				
		
		Orion.Wait(1200);
	}
	
	function RestockArrows(){
		var resourceBoxGraphic = '0x09A8';
		var resourceBoxes = Orion.FindTypeEx(resourceBoxGraphic, "any", "ground", "", 1);	
		if(!resourceBoxes || resourceBoxes.length === 0) return;
		var quiversToRestock = [];
		
		var paperdollItems = [];
		 for (var i=1; i<25; i++) {
	     	var item = Orion.ObjAtLayer(i);
	     	if (item) {
	     		paperdollItems.push(item.Serial());
	     	}
	     }
	     
	     var isQuiverNeedsReloaded = function(serial){
	     	if(!serial) return false;
	     	var quiverObject = Orion.FindObject(serial);
	     	if(!quiverObject) return false;
	     	var itemProps = quiverObject.Properties();
	     	if(!itemProps || itemProps.length === 0) return false;
	     	return itemProps.indexOf('Ammo: ') > -1 && itemProps.indexOf('Ammo: 500') === -1;
	     }
	     
	     if(paperdollItems && paperdollItems.length > 0){
	     	paperdollItems.forEach(function(id){
	     		if(isQuiverNeedsReloaded(id)) quiversToRestock.push(id);
	     	});
	     }
	     
	    var inventoryItems = Orion.FindType('any');
	     if(inventoryItems && inventoryItems.length > 0){
	     	inventoryItems.forEach(function(id){
	     		if(isQuiverNeedsReloaded(id)) quiversToRestock.push(id);
	     	});
	     }
	     
	    if(quiversToRestock && quiversToRestock.length > 0){
	    	quiversToRestock.forEach(function(id){
	    		Orion.RequestContextMenu(id);
				Orion.WaitContextMenuID(id, 720);
				Orion.Wait(2000);
	    	})
	    }
	    
		
	}

function AntiGM()
{
    // Discord
    var bot = "https://discord.com/api/webhooks/1229475741909913620/4ErLKZcMeD-L5-pfcLcMpHH59TfxhDyElXVA5sM7oagroLfHU4yrmGJgLJLYjgn5DyoU"; // Webhook url
    var charName = Player.Name();
    var paramText = "username="+charName+"&content=@everyone "+charName+" found a GM, need human confirmation!";
	
    while (true)
    {
        var startTime = Orion.Now();
        var msg = Orion.WaitJournal("GM | Seer |Counselor ", startTime, 0);
            Orion.Wait(1);
            Orion.HttpPost(bot, paramText);
            Orion.PlayWav('fileName');
            Orion.Wait(1000);
            Orion.PlayWav('fileName');
            Orion.Wait(1000);
            Orion.PlayWav('fileName');
            Orion.Wait(1000);
    }
}
