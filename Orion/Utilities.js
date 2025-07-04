
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
			var durability = getDuraDelta(props);
			return durability > durabilityMin;
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
							Orion.MoveItem(itemId, 60000, dest);
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
			itemsInBackpack.forEach(function(itemId){
				var itemObject = Orion.FindObject(itemId);
				if(!itemObject) return;
				var dest = findContainer("0x0E76");
				if(dest){
					Orion.MoveItem(itemId, 5000, dest);
					Orion.Wait(1600);
				}				
			});
		}
	}
	
	// standard item drop off
	standardItemDropoff();
	
	// event item drop off
	eventItemDropOff();
	
	
	var pinkScrollDropOff = function(){	
		var dropDestinations = Orion.FindType('0x577E', "0x0490", "ground", "", 2);
		if(!dropDestinations || dropDestinations.length === 0) return null;
		dropDestinations = dropDestinations.filter(function(destId){
			var destObject = Orion.FindObject(destId);
			if(!destObject) return false;
			var destProps = destObject.Properties();
			if(destProps.indexOf('Locked Down') === -1) return false;
			var countLine = destProps.split('Scrolls In Book: ')[1];
			var countString = countLine.split('/300')[0];
			var count = Number(countString);
			return count < 300;
		});
		
		if(!dropDestinations || dropDestinations.length === 0) return;
		openBackpack();
	
		var itemsInBackpack = Orion.FindType('0x14EF', '0x0490');
		if(!itemsInBackpack || itemsInBackpack.length === 0) return;	
		
		Orion.MoveItem(itemsInBackpack[0], 1, dropDestinations[0]);
		Orion.Wait(1400);
	}
	 
	 pinkScrollDropOff();
	
	var whiteScrollDropOff = function(){	
		
		var dropDestinations = Orion.FindTypeEx('0x9AA7', "0x0481", "ground", "", 2);
		if(!dropDestinations || dropDestinations.length === 0) return null;
		dropDestinations = dropDestinations.filter(function(destObject){
			if(!destObject) return false;
			var destProps = destObject.Properties();
			if(destProps.indexOf('Locked Down') === -1) return false;
			var countLine = destProps.split('Scrolls In Book: ')[1];
			var countString = countLine.split('/300')[0];
			var count = Number(countString);
			return count < 300;
		});
		if(!dropDestinations || dropDestinations.length === 0) return;
		
		var bookLocations = {};
		var books = Orion.FindType('0x0FF2', "0x0000", "ground", "", 2);
		
		if(!books || books.length === 0) return null;
		books.forEach(function(book){
			var foundBook = Orion.FindObject(book);
			if(!foundBook) return false;
			var bookProps = foundBook.Properties();
			if(bookProps.indexOf('Locked Down') === -1) return false;
			if(bookProps.indexOf('120s') > -1) {
				bookLocations['120s'] = {
					x: foundBook.X(),
					y: foundBook.Y()
				};
			}
			if(bookProps.indexOf('115s') > -1) {
				bookLocations['115s'] = {
					x: foundBook.X(),
					y: foundBook.Y()
				};
			}
			if(bookProps.indexOf('110s') > -1) {
				bookLocations['110s'] = {
					x: foundBook.X(),
					y: foundBook.Y()
				};
			}
		});
		if(!dropDestinations || dropDestinations.length === 0) return;
		
		bookLocations
		var name105 = '(105 Skill)';
		var name110 = '(110 Skill)';
		var name115 = '(115 Skill)';
		var name120 = '(120 Skill)';
		
		openBackpack();
		var itemsInBackpack = Orion.FindTypeEx('0x14EF', '0x0481');
		if(!itemsInBackpack || itemsInBackpack.length === 0) return;	
		
		//todo determine if this is a 110, 115, or 120
		//todo determine which drop dest is for 110 115 or 120
		
		if(itemsInBackpack[0].Properties().indexOf(name105) > -1) {
			var trashBarrels = Orion.FindTypeEx("0x0E77", "any", "ground", "", 2);	
			if(trashBarrels && trashBarrels.length > 0) dropDestinations = trashBarrels;
			
		}
		if(itemsInBackpack[0].Properties().indexOf(name110) > -1) {
			dropDestinations = dropDestinations.filter(function(dest){
				if(!bookLocations['110s']) return false;
				if(dest.X() !== bookLocations['110s'].x || dest.Y() !== bookLocations['110s'].y) return false;
				return true;			
			});
		}
		if(itemsInBackpack[0].Properties().indexOf(name115) > -1) {
			dropDestinations = dropDestinations.filter(function(dest){
				if(!bookLocations['115s']) return false;
				if(dest.X() !== bookLocations['115s'].x || dest.Y() !== bookLocations['115s'].y) return false;
				return true;			
			});
		}
		if(itemsInBackpack[0].Properties().indexOf(name120) > -1) {
			dropDestinations = dropDestinations.filter(function(dest){
				if(!bookLocations['120s']) return false;
				if(dest.X() !== bookLocations['120s'].x || dest.Y() !== bookLocations['120s'].y) return false;
				return true;			
			});
		}
		
		if(!dropDestinations || dropDestinations.length === 0) {
			Orion.Ignore(itemsInBackpack[0].Serial());
		} else {
			Orion.MoveItem(itemsInBackpack[0].Serial(), 1, dropDestinations[0].Serial());
			Orion.Wait(1400);
		}		
	}	
	
	whiteScrollDropOff();
	
	
	var masteryDropOff = function(){
		// lumpy bagball 0x2257
		var trashBarrels = Orion.FindTypeEx("0x0E77", "any", "ground", "", 2);	
		if(!trashBarrels || trashBarrels.length === 0) return;
		
		var dropDestinations = Orion.FindTypeEx("0x2257", "any", "ground", "", 2);	
		if(!dropDestinations || dropDestinations.length === 0) return;
		
		dropDestinations = dropDestinations.filter(function(destObject){
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
		
		if(!dropDestinations || dropDestinations.length === 0) return;
		
		var itemsInBackpack = Orion.FindTypeEx('0x1E22', '0x0000');
		if(!itemsInBackpack || itemsInBackpack.length === 0) return;
		if(itemsInBackpack[0].Properties().indexOf('Volume III') > -1){
			Orion.MoveItem(itemsInBackpack[0].Serial(), 1, dropDestinations[0].Serial());
		} else {
			Orion.MoveItem(itemsInBackpack[0].Serial(), 1, trashBarrels[0].Serial());			
		}
		Orion.Wait(1400);
	}
	masteryDropOff();
	
}


var trashItems = [
		//Myrmidon Armor
  		['0x13D4', 'Armor Set'],  ['0x13DB', 'Armor Set'],  ['0x13D6', 'Armor Set'],
	  	['0x13DA', 'Armor Set'],  ['0x13D5', 'Armor Set'],	['0x140C', 'Armor Set'],
	  	//Elven Leafweave
	  	['0x2B75', 'Armor Set'],  ['0x2B78', 'Armor Set'],
	  	//Greymist Armor
 		['0x13CB', 'Armor Set'],	['0x13CC', 'Armor Set'],	['0x13C6', 'Armor Set'],
 		//Assassin Armor
 		['0x13C6', 'Armor Set'],	['0x13CC', 'Armor Set'],  ['0x13CB', 'Armor Set'],  
 		['0x13C5', 'Armor Set'],
	  	
	  	//Plate Of Honor
	  	['0x1411', 'Armor Set'],  ['0x1415', 'Armor Set'], 	['0x1412', 'Armor Set']
	  	//Death's Essence
  		['0x13C6', 'Armor Set'],	['0x13CB', 'Armor Set'],  
  		//Hunter's Garb
  		['0x2FC9', 'Armor Set'],  ['0x2FC8', 'Armor Set'],	['0x2FC5', 'Armor Set'],
  		['0x2FC6', 'Armor Set'],
  
  		// ML arties
  		['0x2D32', 'Blade Dance'],  ['0x2D33', 'Soul Seeker'],  ['0x268A', 'Helm Of Swiftness'],
  		['0x2FB7', 'Quiver Of Rage'],  ['0x2D34', 'Talon Bite'],  ['0x2D23', 'Raed'],
  		['0x2D21', 'Flesh Ripper'],  ['0x2D2B', 'Windsong'],  ['0x2D35', 'Righteous Anger'],
  		['0x13BE', 'Fey Leggings'],  ['0x2FB8', 'Brightsight Lenses'],  ['0x1F04', 'Robe Of The Equinox'],
  		['0x2D2A', 'Wildfire Bow'],  ['0x2D30', 'Bonesmasher'],  ['0x2B6E', 'Aegis Of Grace'],
  		['0x1F03', 'Robe Of The Eclipse'],  ['0x2D31', 'Boomstick'],  ['0x2F5A', 'Bloodwood Spirit'],
  		['0x2307', 'Pads Of The Cu Sidhe'],  ['0x2F5B', 'Totem Of The Void'],  ['0x2FB7', 'Quiver Of Rage'],
  
 		['0x2B08', 'Breastplate Of Justice'],  ['0x2B0A', 'Arms Of Compassion'],  ['0x2B12', 'Sollerets Of Sacrifice'],
  		['0x13F5', 'Katrina'],  ['0x3BB3', '10th Anniversary Sculpture'],  ['0x1BC4', 'Sentinel'],
  		['0x2B0C', 'Gauntlets Of Valor'],  ['0x13F8', 'Jaana'],  ['0x2B10', 'Helm Of Spirituality'],
	  	['0x3BB5', 'Ankh Pendant'],  ['0x0F61', "Dragon's End"],  ['0x2B06', 'Legs Of Honor'],
  		['0x1BC3', "Lord Blackthorn's Exemplar"],  ['0x3BB6', 'Map Of The Known World'],  ['0x2B0E', 'Gorget Of Honesty'],
  
  		['0x46B3', 'Page Of Lore'],
];
function SetAutoTrashItems(items){
	trashItems = items;
}

function isTrashItem(itemObject) {
    for (var i = 0; i < trashItems.length; i++) {
        var graphic = trashItems[i][0];
        var propertyName = trashItems[i][1];
        
        if (itemObject.Graphic() === graphic && itemObject.Properties().indexOf(propertyName) > -1) {
            return true;
        }
    }
    return false;
}

function AutoTrashItems (){
	var trashBarrels = Orion.FindType("0x0E77", "any", "ground", "", 2);	
	if(trashBarrels && trashBarrels.length > 0){
		openBackpack()
		var itemsInBackpack = Orion.FindType('any', 'any', 'backpack');
		itemsInBackpack.forEach(function(itemId){
			var itemObject = Orion.FindObject(itemId);
			if(!itemObject) return;
			if (isTrashItem(itemObject)) {
				Orion.MoveItem(itemId, 1, trashBarrels[0]);
				Orion.Wait(1600);	
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
	'Plunderin', //Pirate event
	'Bearing The Crest Of Minax',
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
	var corpses = Orion.FindType(any, any, ground, "", 2);
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
	     		Orion.MoveItem(item.Serial(), 1, 'ground', Player.X() - 1, Player.Y() - 1);	     		
	     		Orion.Wait(1400);
	     		if(Orion.FindObject(item.Serial()) && Orion.FindObject(item.Serial()).Container() !== '0xFFFFFFFF'){
	     			Orion.MoveItem(item.Serial(), 1, 'ground', Player.X() + 1, Player.Y() + 1);
	     			Orion.Wait(1400);
	     		}
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
	
function DumpDeathRobe(){
	var item = Orion.ObjAtLayer(22);	
	var items = Orion.FindTypeEx('0x1F03', '0x08FD', 'backpack');
	if(items !== null && items.length > 0) {
		item = items[0];
	}
	if(item !== null && item.Exists() && item.Graphic() === '0x1F03'  && item.Name() === 'Robe' && item.Color() === '0x08FD') {
		Orion.MoveItem(item.Serial(), 1, 'ground', Player.X() - 1, Player.Y() - 1);	     		
  		Orion.Wait(1400);
  		if(Orion.FindObject(item.Serial()) && Orion.FindObject(item.Serial()).Container() !== '0xFFFFFFFF'){
  			Orion.MoveItem(item.Serial(), 1, 'ground', Player.X() + 1, Player.Y() + 1);
  			Orion.Wait(1400);
  		}
	}
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
	DumpDeathRobe();
	//if(Orion.FindType('any', 'any').length > 115){
	//	return;
	//}
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

		var resourceBoxGraphic = '0x09A8|0x0E80';
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
		if((1000 - bandageCount) > 0) {
			if(validBandageBelts && validBandageBelts.length > 0) {
				Orion.MoveItem(resourceBandages[0].Serial(), (1000 - bandageCount), validBandageBelts[0].Serial());
			} else {
				Orion.MoveItem(resourceBandages[0].Serial(), (1000 - bandageCount));
			}
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
