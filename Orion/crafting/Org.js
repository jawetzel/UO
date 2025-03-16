function StackFromLastObjectToLastTarget(){
	var soirceBag = Orion.FindObject(lastobject).Serial();
	var targetBag = Orion.ClientLastTarget();
	
	Orion.UseObject(soirceBag);
	Orion.Wait(2000);
	Orion.UseObject(targetBag);
	Orion.Wait(2000);
	
	var locationLookup = {};
	
	var targetBagItems = Orion.FindTypeEx("any", "any", targetBag);
	targetBagItems.forEach(function(item){
		if(!locationLookup[item.Name()]){
			locationLookup[item.Name()] = {
				x: item.X(),
				y: item.Y()
			};
		}
	});
	
	var sourceBagItems = Orion.FindTypeEx("any", "any", soirceBag);
	sourceBagItems.forEach(function(item){
		if(locationLookup[item.Name()]){
			Orion.MoveItem(item.Serial(), 1000, targetBag, locationLookup[item.Name()].x, locationLookup[item.Name()].y)
			Orion.Wait(1500);
		}
	});
}

function OrganizeLastObjectToLookLikeLastTarget(){
	var soirceBag = Orion.FindObject(lastobject).Serial();
	var targetBag = Orion.ClientLastTarget();
	
	Orion.UseObject(soirceBag);
	Orion.Wait(2000);
	Orion.UseObject(targetBag);
	Orion.Wait(2000);
	
	var locationLookup = {};
	
	var targetBagItems = Orion.FindTypeEx("any", "any", targetBag);
	targetBagItems.forEach(function(item){
		if(!locationLookup[item.Name()]){
			locationLookup[item.Name()] = {
				x: item.X(),
				y: item.Y()
			};
		}
	});
	
	var sourceBagItems = Orion.FindTypeEx("any", "any", soirceBag);
	sourceBagItems.forEach(function(item){
		if(locationLookup[item.Name()]){
			Orion.MoveItem(item.Serial(), 1000, soirceBag, locationLookup[item.Name()].x, locationLookup[item.Name()].y)
			Orion.Wait(1500);
		}
	});
}