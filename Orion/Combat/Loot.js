
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

function BagOfSendingGold(WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(Player.Weight() < maxBagOfSendingWeight) return;
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
	BagOfSendingItem(bestGoldStack, WaitForObjectTimeout, RegisterUseObjectTimeout)
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
	if(!corpse.IsCorpse()){
		Orion.Ignore(corpseId);
		return;
	}
	WaitForObjectTimeout();
	
	if(useCutCorpses){
		var backpackCutter = Orion.FindType('0x2D23', 'any', 'backpack');
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
	var itemsInCorpse = Orion.FindType('any', 'any', lastcontainer);
	var lootbag = Orion.FindType(lootBagType, 'any', 'backpack');
	itemsInCorpse.forEach(function(item){
		var itemInstance = Orion.FindObject(item);
		if(itemInstance && itemInstance.Container() !== Player.Container() &&  itemInstance.Container() !== lootbag[0]){
			Orion.Print("Evaluate Item");
			var itemGraphic = itemInstance.Graphic();
			if(ShouldKeepItem(item)){
				WaitForObjectTimeout()
				var movedItem = Orion.FindObject(item);
				if(lootbag && lootbag.length > 0){
					Orion.MoveItem(item, 5000, lootbag[0]);
					RegisterUseObjectTimeout()
				}
				else {
					Orion.MoveItem(item, 5000, 'backpack');
					RegisterUseObjectTimeout()
				}
				var waitForLootbagIndex = 0;
				while(movedItem && movedItem.Container() !== lootbag[0] && waitForLootbagIndex < 15){
					waitForLootbagIndex ++;
					Orion.Wait(100);
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