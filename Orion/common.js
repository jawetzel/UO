// Paste your code here :)


function GeneratedScript_113655()
{
	var groundObjects = Orion.FindType('any', 'any', "ground", "", 5);
	if(!groundObjects || groundObjects.length === 0) return;
	var vendors = groundObjects.filter(function(groundId){
		var groundObject = Orion.FindObject(groundId);
		var props = groundObject.Properties();
		return props.indexOf('Shop Name:') > -1;
	});
	vendors.forEach(function(vendorId){
		Orion.Wait(1200);
		Orion.UseObject(vendorId);
		Orion.Wait(1200);
			var gump0 = Orion.GetGump('last');
			if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000002AB'))
			{
				gump0.Select(Orion.CreateGumpHook(3));
				Orion.Wait(200);
			}
		
		Orion.Wait(1200);
			Orion.SendPrompt(',');
		Orion.Wait(1200);
			var gump1 = Orion.GetGump('last');
			if ((gump1 !== null) && (!gump1.Replayed()) && (gump1.ID() === '0x000002AB'))
			{
				gump1.Select(Orion.CreateGumpHook(5));
				Orion.Wait(200);
			}
		
		Orion.Wait(1200);
			Orion.SendPrompt(',');
		Orion.Wait(1200);
			var gump2 = Orion.GetGump('last');
			if ((gump2 !== null) && (!gump2.Replayed()) && (gump2.ID() === '0x000002AB'))
			{
				gump2.Select(Orion.CreateGumpHook(2));
				Orion.Wait(200);
			}
		
		Orion.Wait(1200);
			var gump3 = Orion.GetGump('last');
			if ((gump3 !== null) && (!gump3.Replayed()) && (gump3.ID() === '0x000F3E66'))
			{
				gump3.Select(Orion.CreateGumpHook(0));
				Orion.Wait(200);
			}
		
	});
	
}

function train(){
	if(Player.Hits() > 10){
		Orion.Cast('last');
	}
	
	Orion.Wait(3000);
	train();
}

function move(){
	var origX = Player.X();
    var origY = Player.Y();
	var timeBetweenSteps = 60000;
	var dist = 4;
	function MoveToSpot(x, y){
		Orion.WalkTo(x, y, 0, 0, 0, 0, 1, 50);
		return Player.X() === x && Player.Y() === y;
	}
	
	while(true){
		while(!MoveToSpot(origX, origY)){
			Orion.Wait(timeBetweenSteps);
		}
		while(!MoveToSpot(origX - dist, origY)){
			Orion.Wait(timeBetweenSteps);
		}
		while(!MoveToSpot(origX - dist, origY - dist)){
			Orion.Wait(timeBetweenSteps);
		}
		while(!MoveToSpot(origX, origY - dist)){
			Orion.Wait(timeBetweenSteps);
		}
	}
}

function trainNinja(){
	if(Orion.SpellStatus('Death Strike') === false){
		Orion.Cast('Death Strike');
	}
	Orion.Wait(500);
	trainNinja();
}

function readProfiles(){
	var friendlys = Orion.FindType("any", "any", "ground", "mobile|inlos", '2', 'green|blue');	
	Orion.Print(friendlys);	
	if(friendlys && friendlys.length > -1){
		friendlys.forEach(function(friendId){
			var friendObject = Orion.FindObject(friendId);
			if(!friendObject) return;
			Orion.Print(friendObject.Properties());
			Orion.Print(friendObject.Profile());
		})
	}
}