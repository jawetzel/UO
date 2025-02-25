var bandageGraphic = '0x0E21';
var bandageBuffIcon = '0x7596';
var poisonBuffIcon = '0x7560';

var lastApplyingBandages = 0;
var IsApplyingBandages = function(){
	var applying = (Orion.BuffExists('healing skill') && Orion.BuffTimeRemaining('healing skill') > 0) || 
		(Orion.BuffExists('veterinary') && Orion.BuffTimeRemaining('veterinary') > 0);
		
	if(applying){
		lastApplyingBandages = new Date().getTime();
	}
	if((lastApplyingBandages + 1000) > new Date().getTime()){
		return true;
	}
	return	applying
}

var HasVet = function(){
	return Orion.SkillValue('Veterinary') > 250;
}

var HasHealing = function(){
	return Orion.SkillValue('Healing') > 250;
}

function UseBandages(WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(!HasHealing()) return;
	if(IsApplyingBandages()){
		 return;
	}
	
	
	var bandageBelt = Orion.FindTypeEx("0xA1F6", 'any', 'backpack');
	var validBandageBelts = bandageBelt ? bandageBelt.filter(function(belt){
		return belt.Properties().indexOf('First Aid Belt') > -1;
	}) : bandageBelt;		
	if(validBandageBelts && validBandageBelts.length > 0) {
		if(!Orion.GumpExists('container', validBandageBelts[0].Serial())) {
			WaitForObjectTimeout();
			Orion.UseObject(validBandageBelts[0].Serial());
			Orion.Wait(1500);
		}
	}
	
	
	var bandages = Orion.FindType('0x0E21', 'any', backpack, ' ', 'finddistance', ' ', ' ', true);
	if(bandages && bandages.length > 0){
		if(Player.Hits() < Player.MaxHits() || Orion.BuffExists(poisonBuffIcon)){
			
			WaitForObjectTimeout();
			if( !IsApplyingBandages()){		
				Orion.UseObject(bandages[0]);
				Orion.WaitForTarget(1000);
				Orion.TargetObject(Player.Serial());
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
var healFriendNames = [
		
	];
function SetHealFriendNames(value){
	healFriendNames = value;
}
var knownPetTypes = {
	'0x00CE': true, // lava lizzard
	'0x0115': true, // cu sidhe
	'0x0074': true, // nightmare
	'0x02D0': true, // triton
	'0x031F': true, // swampy armored
	'0x003B': true, // ice dragon
}
var isFriend = {};
var ignoreAfkDead = {}
function FriendToHeal(dist, isChiv){
	var friendsAroundUs = [];
	var friendlys = Orion.FindTypeEx("any", "any", "ground", "mobile|ignoreself|inlos", dist, 'green|blue');

	if(friendlys && friendlys.length > -1){
		friendlys.forEach(function(friendObject){
			var friendId = friendObject.Serial();
			
			if(isFriend[friendId] === false){
				//Orion.Print("1");
				 return;
			}
			
			var friendProps = friendObject.Properties();
			if(!friendProps || friendProps.length === 0){
				//Orion.Print("2");
				return;
			}
			var friendlyIsPet = knownPetTypes[friendObject.Graphic()] || friendProps.indexOf("(bonded)") > -1 || friendProps.indexOf("(tame)") > -1;
			if(friendProps.indexOf("(summoned)") > -1){
				//Orion.Print("3");
				 return;
			}
			
			if(!HasVet() && !isChiv){
				if(friendlyIsPet){ 
					//Orion.Print("4");
					isFriend[friendId] = false;
					return;
				}
			}
			if(!HasHealing() && !isChiv){
				if(!friendlyIsPet) {
					//Orion.Print("5");
					isFriend[friendId] = false;
					return;
				}
			}
			Orion.GetStatus(friendId);
			if(isChiv && friendObject.Dead()) {
				//Orion.Print("6");
				return;
			}
			
			if(isFriend[friendId] === false){
				//Orion.Print("7");
				return;
			} else if(isFriend[friendId] === true){
				friendsAroundUs.push(friendId);
			} else { 
				var namesFound = healFriendNames.filter(function(name){
					return friendProps.indexOf(name) > -1;
				});
				if(namesFound.length > 0) {
					//Orion.Print("8");
					isFriend[friendId] = true;
					friendsAroundUs.push(friendId);
					return;
				} else {
					Orion.GetProfile(friendId, 3000);
					var profileRead = friendObject.ProfileReceived();
					var friendProfile = '';
					var profileNamesFound = [];
					if(profileRead){
						friendProfile = friendObject.Profile();
						if(friendProfile && friendProfile.length > 0){
							profileNamesFound = healFriendNames.filter(function(name){
								return friendProfile.indexOf(name) > -1;
							});
						}
					}
					if(profileNamesFound.length > 0){
						//Orion.Print("9");	
						isFriend[friendId] = true;
						friendsAroundUs.push(friendId);
						return;
					} else {
						if(profileRead){
							//Orion.Print("10");
							isFriend[friendId] = false;
						} else {
							if(friendlyIsPet){
								//Orion.Print("11");
								isFriend[friendId] = false;
							}
						}					
					}
				} 
			}
		});
		var friendsToHealAroundUs = [];
		if(friendsAroundUs && friendsAroundUs.length > -1){
			friendsAroundUs.forEach(function(friendId){
				var friendObject = Orion.FindObject(friendId);
				if(!friendObject) {
					//Orion.Print("12");
					return;
				}
				
				
				if(ignoreAfkDead[friendId] && ignoreAfkDead[friendId].deadBandages > 5) {
					if(!friendObject.Dead()){
						delete ignoreAfkDead[friendId];
					} else {
						return;
					}
				}
				if(
					friendObject.Distance() <= dist && 
					((friendObject.Hits() * 4) < healFriendThreshold && 
					(friendObject.Hits() > 0 || friendObject.Dead())
					)){
					friendsToHealAroundUs.push(friendId);
					return;
				}
			});
		}
		if(friendsToHealAroundUs.length > 0){
			var randomFriendIndex = 0;
			if(friendsToHealAroundUs.length > 1){
				randomFriendIndex = Math.floor(Math.random() * friendsToHealAroundUs.length)
			}
			//Orion.Print("15");
			return friendsToHealAroundUs[randomFriendIndex];
		} else {
			//Orion.Print("16");
			return null;
		}
	} else {
		//Orion.Print("17");
		return null;
	}
	
}


function HealChivFriend(){
	var friendId = 	FriendToHeal(2, true);
	var friendObject = Orion.FindObject(friendId);
	if(!friendObject) return;
	Orion.GetStatus(friendId);
	if( !friendObject.Dead() && ((friendObject.Hits() * 4) < healFriendThreshold)){
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

var lastHealedPersonDead = false;

function HealPets(WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(!HasVet()) return;
	if(IsApplyingBandages()) return;
	var friendId = 	FriendToHeal(2, false);
	if(!friendId) return;
	var friendObject = Orion.FindObject(friendId);
	if(!friendObject) return;
	Orion.GetStatus(friendId);
	
	if(((friendObject.Hits() * 4) < healFriendThreshold)){
		if(lastHealedPersonDead){
			Orion.Wait(2000);
		}
		if(friendObject.Dead()) {
			lastHealedPersonDead = true;
		} else {
			lastHealedPersonDead = false;
		}
		WaitForObjectTimeout();
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
		Orion.BandageTarget(friendObject.Serial());
		RegisterUseObjectTimeout()
		Orion.Wait(100);
	}
}


function HealFriend(WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(!HasHealing()) return;
	if(IsApplyingBandages()) return;
	var friendId = 	FriendToHeal(2, false);
	if(!friendId) return;
	var friendObject = Orion.FindObject(friendId);
	if(!friendObject) return;
	Orion.GetStatus(friendId);
	if(friendObject.Dead()) {
		if( !ignoreAfkDead[friendId] ) {
			ignoreAfkDead[friendId] = { deadBandages: 1 };
		} else {
			ignoreAfkDead[friendId].deadBandages = ignoreAfkDead[friendId].deadBandages + 1;
		}
	}
	var friendProps = friendObject.Properties();
	if(((friendObject.Hits() * 4) < healFriendThreshold)){
		if(lastHealedPersonDead){
			Orion.Wait(2000);
		}
		if(friendObject.Dead()) {
			lastHealedPersonDead = true;
		} else {
			lastHealedPersonDead = false;
		}
		WaitForObjectTimeout();
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
		
		Orion.BandageTarget(friendObject.Serial());
		RegisterUseObjectTimeout()
		Orion.Wait(100);
	}
}

var disarmBuffIcon = '0x754a';

function Rearm(){
	var weaponObject = Orion.ObjAtLayer('RightHand');
	if(weaponObject && weaponObject.Properties().toLowerCase().indexOf("skill requ") === -1) weaponObject = null;
	if(!weaponObject) weaponObject = Orion.ObjAtLayer('LeftHand');
	if(weaponObject && weaponObject.Properties().toLowerCase().indexOf("skill requ") === -1) weaponObject = null;
	if(!weaponObject) {
		if( !Orion.BuffExists(disarmBuffIcon)){
			Orion.CreateClientMacro('EquipLastWeapon').Play(false, 1000);
		}
	};
}


var agilityPotionBuffIcon = '0x753c';
var strPotionBuffIcon = '0x7567';
var agilityPotionType = '0x0F08';
var strPotionType = '0x0F09';
var poisonBuffIcon = '0x7560';
var curePotionType = '0x0F07';
var healPotionType = '0x0F0C';


var useEnhancementPots = false;
function SetUseEnhancementPots(value){
	useEnhancementPots = value;
}

function EnhancementPots(RegisterUseObjectTimeout, WaitForObjectTimeout){
	if(useEnhancementPots){
		if(Orion.FindType(agilityPotionType).length > 0 && !Orion.BuffExists(agilityPotionBuffIcon)){
			WaitForObjectTimeout();
			if(Orion.FindType(agilityPotionType).length > 0 && !Orion.BuffExists(agilityPotionBuffIcon)){
				Orion.UseType(agilityPotionType);
			}
			RegisterUseObjectTimeout()
		}
		if(Orion.FindType(strPotionType).length > 0 && !Orion.BuffExists(strPotionBuffIcon)){
			WaitForObjectTimeout();
			if(Orion.FindType(strPotionType).length > 0 && !Orion.BuffExists(strPotionBuffIcon)){
				Orion.UseType(strPotionType);
				RegisterUseObjectTimeout()
			}
		}
	}
}


var useRestorePotions = false;
function SetUseRestorePotions(value){
	useRestorePotions = value;
}

var healPotionThreshold = 40;
function UseHealPotionThreshold(value){
	healPotionThreshold = value;
}

function RestorePotions(RegisterUseObjectTimeout, WaitForObjectTimeout){
	if(useRestorePotions){
		if(Orion.FindType(curePotionType).length > 0 && Orion.BuffExists(poisonBuffIcon)){
			WaitForObjectTimeout();
			if(Orion.FindType(curePotionType).length > 0 && Orion.BuffExists(poisonBuffIcon)){
				Orion.UseType(curePotionType);
				RegisterUseObjectTimeout()
			}
		}
		if(Orion.FindType(healPotionType).length > 0 && Player.Hits() < healPotionThreshold && !Orion.BuffExists(poisonBuffIcon)){
			WaitForObjectTimeout();
			if(Orion.FindType(healPotionType).length > 0 && Player.Hits() < healPotionThreshold && !Orion.BuffExists(poisonBuffIcon)){
				Orion.UseType(healPotionType);
				RegisterUseObjectTimeout()
			}
		}
		if(Orion.FindType(curePotionType).length > 0 && Orion.BuffExists(poisonBuffIcon)){
			 RestorePotions();
		}
	}
}