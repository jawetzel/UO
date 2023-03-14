var bandageGraphic = '0x0E21';
var bandageBuffIcon = '0x7596';
var poisonBuffIcon = '0x7560';

function UseBandages(WaitForObjectTimeout, RegisterUseObjectTimeout){
	var bandages = Orion.FindType('0x0E21', 'any', backpack, ' ', 'finddistance', ' ', ' ', true);
	if(bandages && bandages.length > 0){
		if( !Orion.BuffExists(bandageBuffIcon) &&  (Player.Hits() < Player.MaxHits() || Orion.BuffExists(poisonBuffIcon))){
			
			WaitForObjectTimeout();
			if( !Orion.BuffExists(bandageBuffIcon)){		
				Orion.BandageSelf();
				RegisterUseObjectTimeout();
			}
		}
	}
}


var ChivHeal = function(){
	if(Player.Poisoned() || Player.Hits() < (Player.MaxHits() - 30)){
		if(Player.Poisoned()){
			Orion.Cast('201'); //cure chiv
		} else {
			Orion.Cast('202'); //heal chiv
		}							
		if (Orion.WaitForTarget(2500))
			Orion.TargetObject(Player.Serial());
		Orion.Wait(200);
	}
}

var lastConfidence = 0;
var UseConfidence = function(){
	if(Player.Hits() < (Player.MaxHits() - 30)){
		if((lastConfidence + 6000) < new Date().getTime()){
			Orion.Cast('402');
			lastConfidence = new Date().getTime();
			Orion.Wait(1000);
		}
	}
}

var lastEvasion = 0;
var UseEvasion = function(){
	if(Player.Hits() < (Player.MaxHits() - 50)){
		if((lastEvasion + 25000) < new Date().getTime()){
			Orion.Print("time for evasion");
			Orion.Cast('403');
			lastEvasion = new Date().getTime();
			Orion.Wait(1000);
		}
	}
}


var healFriendThreshold = 75;
function SetHealFriendThreshold(value){
	healFriendThreshold = value;
}
var healFriendNames = [];
function SetHealFriendNames(value){
	healFriendNames = value;
}
function HealChivFriend(){
	var friendlys = Orion.FindType("any", "any", "ground", "mobile|ignoreself|inlos", '2', 'green|blue');		
	if(friendlys && friendlys.length > -1){
		friendlys.forEach(function(friendId){
			var friendObject = Orion.FindObject(friendId);
			if(!friendObject) return;
			var friendProps = friendObject.Properties();
			if(friendProps.indexOf("(summoned)") > -1) return; 
			if(friendProps.indexOf("(tame)") > -1) return; 
			if(friendProps.indexOf("(bonded)") > -1) return; 
			var namesFound = healFriendNames.filter(function(name){
				return friendProps.indexOf(name) > -1;
			});
			if(namesFound.length === 0) return;
			Orion.ShowStatusbar(friendId, 740, 25);
			Orion.GetStatus(friendId);
			if(friendObject.Distance() <= 2 && ((friendObject.Hits() * 4) < healFriendThreshold)){
				WaitForObjectTimeout();
				if(((friendObject.Hits() * 4) < healFriendThreshold)){
					if(friendObject.Poisoned()){
						Orion.Cast('201'); //cure chiv
					} else {
						Orion.Cast('202'); //heal chiv
					}							
					if (Orion.WaitForTarget(2500))
						Orion.TargetObject(friendObject.Serial());
					Orion.Wait(200);
				}
			}
		})
	}
}


function HealPets(WaitForObjectTimeout, RegisterUseObjectTimeout){
	var friendlys = Orion.FindType("any", "any", "ground", "mobile|ignoreself|inlos", '2', 'green|blue');		
	if(friendlys && friendlys.length > -1){
		friendlys.forEach(function(friendId){
			if(Orion.BuffExists('healing skill') || Orion.BuffExists('veterinary')) return;
			var friendObject = Orion.FindObject(friendId);
			if(!friendObject) return;
			var friendProps = friendObject.Properties();
			if(friendProps.indexOf("(bonded)") === -1 && friendProps.indexOf("(tame)") === -1) return; 
			var namesFound = healFriendNames.filter(function(name){
				return friendProps.indexOf(name) > -1;
			});
			if(namesFound.length === 0) return;
			Orion.ShowStatusbar(friendId, 740, 75);
			Orion.GetStatus(friendId);
			if(friendObject.Distance() <= 2 && ((friendObject.Hits() * 4) < healFriendThreshold)){
				WaitForObjectTimeout();
				if(!Orion.BuffExists('healing skill') && ((friendObject.Hits() * 4) < healFriendThreshold)){
					Orion.BandageTarget(friendObject.Serial());
					RegisterUseObjectTimeout()
					Orion.Wait(100);
				}
			}
		})
	}
}

function HealFriend(WaitForObjectTimeout, RegisterUseObjectTimeout){
	var friendlys = Orion.FindType("any", "any", "ground", "mobile|ignoreself|inlos", '2', 'green|blue');		
	if(friendlys && friendlys.length > -1){
		friendlys.forEach(function(friendId){					
			if(Orion.BuffExists('healing skill') || Orion.BuffExists('veterinary')) return;
			var friendObject = Orion.FindObject(friendId);
			if(!friendObject) return;
			var friendProps = friendObject.Properties();
			if(friendProps.indexOf("(summoned)") > -1) return; 
			if(friendProps.indexOf("(tame)") > -1) return; 
			if(friendProps.indexOf("(bonded)") > -1) return; 
			var namesFound = healFriendNames.filter(function(name){
				return friendProps.indexOf(name) > -1;
			});
			if(namesFound.length === 0) return;
			Orion.ShowStatusbar(friendId, 740, 25);
			Orion.GetStatus(friendId);
			if(friendObject.Distance() <= 2 && ((friendObject.Hits() * 4) < healFriendThreshold)){
				WaitForObjectTimeout();
				if(!Orion.BuffExists('healing skill') && ((friendObject.Hits() * 4) < healFriendThreshold)){
					Orion.BandageTarget(friendObject.Serial());
					RegisterUseObjectTimeout()
					Orion.Wait(100);
				}
			}
		})
	}
}