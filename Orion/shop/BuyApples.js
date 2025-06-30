
var resources = [
	 '0x09D0',
]

var FindItems = function(){
	var BagOfSendingItem = function(item){
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
		Orion.UseObject(firstValidBag);
		Orion.WaitForTarget(1000);
		Orion.TargetObject(item);
		Orion.Wait(1200);
	}

	var foundItem = false;
	resources.forEach(function(resource){
		if(foundItem) return;
		item = Orion.FindType(resource, 'any','backpack');
		if(item && item.length > 0){
			var itemObject = Orion.FindObject(item[0]);
			var count = itemObject.Count();
			if(count > 400){
				BagOfSendingItem(item[0]);
				
			}
		}
	});
	return foundItem;
}

function FindVendors () {
	var vendorTitles = [
		'Provisioner', 'Farmer'
	];
	var yellows = Orion.FindType("any", "any", "ground", 'mobile|near', '3', 'yellow' );
	
	var nonGuild = yellows.filter(function(vendorId){
		var object = Orion.FindObject(vendorId);
		var title = object.Properties();
		if(title.indexOf("Guild") > -1){
			 return false;
		}
		return true;
	});
	
	var vendors = nonGuild.filter(function(vendorId){
		var object = Orion.FindObject(vendorId);
		var title = object.Properties();
		if(
			vendorTitles.filter(function(vendorTitle){ 
				if(title.indexOf(vendorTitle) > -1) return true 
			}).length === 0
		) {
			return false;
		}
		return true;
	});
	return vendors;
}
function Run (){
	var vendorIndex = 0;
	var skipIndex = 0;
	while(true){
		if(!Player.Hidden()) {
			Orion.UseSkill("Hiding");
		}
		var vendors = FindVendors();			
		Orion.RequestContextMenu(vendors[vendorIndex]);
		Orion.WaitContextMenuID(vendors[vendorIndex], 110);
		if(vendorIndex >= vendors.length - 1){
			vendorIndex = 0;
		} else {
			vendorIndex++;
		}
		
		while(FindItems()){}
		Orion.EmoteAction('bow');
		Orion.Wait(1200);
	}
}

function BuyDirtStartup(){
	Orion.Wait(10000);

	Orion.Print("Starting");
		Orion.UseObject(backpack);
		Orion.Wait(2000);
		Run();
}

function Autostart()
{
	Orion.Wait(10000);
	Orion.Print("Starting");
		Orion.UseObject(backpack);
		Orion.Wait(2000);
		Run();
}

