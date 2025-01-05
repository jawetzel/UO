
function InsureItem(itemId)
{
	Orion.Wait(200);
	Orion.RequestContextMenu('self');
	Orion.WaitContextMenuID('self', 418);
	if (Orion.WaitForTarget(1000))
		Orion.TargetObject(itemId);
	if (Orion.WaitForTarget(1000))
		Orion.TargetObject('0x00000000');
}

var lootItems = {
		'0x400B': true, //shame crystals
		'0x0F87': true, // lucky coin
		'0x226F': true, //wraith form
		//'0x2D51': true, //SW spell
		//'0x2D52': true, //SW spell
		//'0x2D53': true, //immolating weapon SW Spell
		//'0x2D54': true, //SW spell
		//'0x2D55': true, //SW Spell
		//'0x2D56': true, //SW Spell
		//'0x2D57': true, //SW Spell
		//'0x2D58': true, //SW Spell
		//'0x2D59': true, //SW Spell
		//'0x2D5A': true, //SW Spell
		//'0x2D5B': true, //SW Spell
		//'0x2D5C': true, //SW Spell
		//'0x2D5D': true, //SW Spell
		//'0x2D5E': true, //word of death SW spell
		//'0x2D5F': true, //Gift Of Life SW spell
		//'0x2D60': true, //Gift Of Life SW spell
		'0x573E': true, //void Orion
		'0x5728': true, //void core
		'0x0E21': true, //bandages
		'0x0F80': true, // demon bone
		'0x0EED': true,
	};
function SetLootItems(value){
	lootItems = value;
}

var useInsureItem =  false;
function SetUseInsureItem(value){
	useInsureItem = value;
}

var useCutCorpses = false;
function SetUseCutCorpses(value){
	useCutCorpses = value;
}
	
	
var lootBagType = '0x0E79';
function SetLootBagType(value){
	lootBagType = value;
}

var maxBagOfSendingWeight = 525;

function BagOfSendingItem(item, WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(!item) return;
	var bags = Orion.FindType('0x0E76', 'any', 'backpack');
	if(!bags || bags.length === 0) return;
	var validBags = bags.filter(function(bagid){
		var props = Orion.FindObject(bagid).Properties();
		if(props.indexOf('Bag Of Sending') === -1) return false;
		if(props.indexOf('Charges: 0') > -1) return false;
		return true;
	});
	if(!validBags || validBags.length === 0) return;
	var firstValidBag = validBags[0];
	WaitForObjectTimeout();
	Orion.UseObject(firstValidBag);
	Orion.WaitForTarget(1000);
	Orion.TargetObject(item);
	RegisterUseObjectTimeout()
}


function CheckGraphicBagOfSendingItem(WaitForObjectTimeout, RegisterUseObjectTimeout, graphic, count){
	var goldStacks = Orion.FindType(graphic, 'any', 'backpack');
	
	if(!goldStacks || goldStacks.length === 0) return;
	var bestGoldStack = goldStacks[0];
	var highestStackValue = 0;
	if(goldStacks.length> 1){
		for(var i = 0; i < goldStacks.length; i++){
				var stack = Orion.FindObject(goldStacks[i]);
				var count = stack.Count();
				if(count > highestStackValue){
					highestStackValue = count;
					bestGoldStack = goldStacks[i];
				}
		}
	} else {
		var stack = Orion.FindObject(goldStacks[0]);	
		highestStackValue = stack.Count();
	}
	Orion.Print(count);
	Orion.Print(highestStackValue);
	if(highestStackValue > count){
		BagOfSendingItem(bestGoldStack, WaitForObjectTimeout, RegisterUseObjectTimeout);
	}
}

function BagOfSendingGold(WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(Player.Weight() < maxBagOfSendingWeight) return;
	CheckGraphicBagOfSendingItem(WaitForObjectTimeout, RegisterUseObjectTimeout, '0x0F80', 1500);
	CheckGraphicBagOfSendingItem(WaitForObjectTimeout, RegisterUseObjectTimeout, '0x0F8F', 3000);
	CheckGraphicBagOfSendingItem(WaitForObjectTimeout, RegisterUseObjectTimeout, '0x1BD1', 3500);
	var goldStacks = Orion.FindType('0x0EED', 'any', 'backpack');
	
	if(!goldStacks || goldStacks.length === 0) return;
	var bestGoldStack = goldStacks[0];
	if(goldStacks.length> 1){
		var highestStackValue = 0;
		for(var i = 0; i < goldStacks.length; i++){
				var stack = Orion.FindObject(goldStacks[i]);
				var count = stack.Count();
				if(count > highestStackValue){
					highestStackValue = count;
					bestGoldStack = goldStacks[i];
				}
		}
	}
	BagOfSendingItem(bestGoldStack, WaitForObjectTimeout, RegisterUseObjectTimeout);
	
}


function LootGoldGround(WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(Orion.FindType('0x0E76', 'any', 'backpack').filter(function(bagid){
		var props = Orion.FindObject(bagid).Properties();
		if(props.indexOf('Bag Of Sending') === -1) return false;
		if(props.indexOf('Charges: 0') > -1) return false;
		return true;
	}).length > 0){
		var golds = Orion.FindType(0x0EED, any, ground, "inlos", 1);
		if(golds.length > 0){
			WaitForObjectTimeout();
			Orion.MoveItem(golds[0], 5000, backpack);
			RegisterUseObjectTimeout();
			BagOfSendingGold(WaitForObjectTimeout, RegisterUseObjectTimeout)
		}
	}
}

function LootCorpses(WaitForObjectTimeout, RegisterUseObjectTimeout, ShouldKeepItem){
	var corpseGraphic = '0x2006'
	var corpses = Orion.FindType(0x2006, any, ground, "inlos", 2);
	 if (!corpses.length)
    {
        return;
    }
    var corpseId = corpses[corpses.length - 1];
   
    var corpse = Orion.FindObject(corpseId);
    	
    if(!corpse){
    	Orion.Ignore(corpseId);
		return;
    }
    
	if(!corpse.IsCorpse()){
		Orion.Print("Is Not Corpse");
		Orion.Print(corpse.Properties());
		Orion.Ignore(corpseId);
		return;
	}
	if(!corpse.Properties() ){
		Orion.Wait(200);
		Orion.FindObject(corpseId);
	}
	if(!corpse.Properties() || corpse.Properties().toLowerCase().indexOf("A Corpse Of ".toLowerCase()) > -1) {
		Orion.Print("No Corpse Props");
		Orion.Print(corpse);

		Orion.Print(corpse.Properties());
		Orion.Ignore(corpseId);
		return;
	}
	WaitForObjectTimeout();
	
	if(useCutCorpses){
		var backpackCutter = Orion.FindType('0x0F51', 'any', 'backpack');
		if(backpackCutter && backpackCutter.length > 0) {
			WaitForObjectTimeout()
			Orion.UseObject(backpackCutter[0]);
			RegisterUseObjectTimeout()
			Orion.WaitForTarget(1000)
			Orion.TargetObject(corpseId);
			WaitForObjectTimeout()
		}
	}
	
	var containerId = Orion.OpenContainer(corpseId);
	RegisterUseObjectTimeout()
	Orion.Wait(900);
	Orion.Print("Start Evaluate Item")
	var bandageBelt = Orion.FindTypeEx("0xA1F6", 'any', 'backpack');
	var validBandageBelts = bandageBelt ? bandageBelt.filter(function(belt){
		return belt.Properties().indexOf('First Aid Belt') > -1;
	}) : bandageBelt;		
	if(validBandageBelts && validBandageBelts.length > 0 && Orion.FindObject(lastcontainer) && validBandageBelts[0].Serial() === Orion.FindObject(lastcontainer).Serial()) {
		return;
	}
	var itemsInCorpse = Orion.FindType('any', 'any', lastcontainer);
	var lootbag = Orion.FindType(lootBagType, 'any', 'backpack');
	itemsInCorpse.forEach(function(item){
		var itemInstance = Orion.FindObject(item);
		if(itemInstance && itemInstance.Container() !== Orion.GetSerial(backpack) &&  itemInstance.Container() !== lootbag[0]){
			Orion.Print("Evaluate Item");
			var itemGraphic = itemInstance.Graphic();
			if(ShouldKeepItem(item) || lootItems[itemGraphic]){
			
				if( lootItems[itemGraphic]){
					// we need to limit the bandage count here
					var bandageGraphic = '0x0E21';
					if(itemGraphic === bandageGraphic){
						var backpackBandages = Orion.FindTypeEx(bandageGraphic, "any", "backpack");
						var bandageCount = 0;
						
						if(backpackBandages && backpackBandages.length > 0){
							backpackBandages.forEach(function(bandaid){
								bandageCount = bandageCount + bandaid.Count();
							})
						}
						if(bandageCount > 1000) return;
					}					
				}
				
				var movedItem = Orion.FindObject(item);
				if(!movedItem) return;
				if(lootbag && lootbag.length > 0 && 
					itemGraphic !== '0x0EED' && //not gold
					itemGraphic !== '0x0E21' && //not bandages
					itemGraphic !== '0x0F80' && //not grave dust
					itemGraphic !== '0x0F8F' && //not demon bone
					itemGraphic !== '0x9F13' && //not eggs
					itemGraphic !== '0x9F14' && //not eggs
					itemGraphic !== '0x9F15' && //not eggs
					itemGraphic !== '0x9F16' && //not eggs
					itemGraphic !== '0x9F17' && //not eggs
					itemGraphic !== '0x9F18' //not eggs
					){ 
					WaitForObjectTimeout()
					if(!Orion.GumpExists('container', lootbag[0])) {
						Orion.OpenContainer(lootbag[0]);
						RegisterUseObjectTimeout()
						
					}
					WaitForObjectTimeout()
					Orion.MoveItem(item, 5000, lootbag[0]);
					RegisterUseObjectTimeout()
				}
				else {
					WaitForObjectTimeout()
					Orion.MoveItem(item, 5000, 'backpack');
					RegisterUseObjectTimeout()
				}
				var waitForLootbagIndex = 0;
				if(movedItem.Count() > 1){
					Orion.Wait(100);
				} else {
					var object = Orion.FindObject(item)
					while((!object || object.Container() !== lootbag[0]) && waitForLootbagIndex < 15){
						waitForLootbagIndex ++;
						Orion.Wait(100);
					}
				}
				
				RegisterUseObjectTimeout()
				if(useInsureItem && !lootItems[itemGraphic]){
					 InsureItem(item);
				}
			}
			Orion.Ignore(item);
		}				
	});
	Orion.Print("Finish Evaluate Items");
	Orion.Ignore(corpseId);
	BagOfSendingGold(WaitForObjectTimeout, RegisterUseObjectTimeout);
}