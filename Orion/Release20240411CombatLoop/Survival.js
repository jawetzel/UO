var bandageGraphic = '0x0E21';
var bandageBuffIcon = '0x7596';
var poisonBuffIcon = '0x7560';

var IsApplyingBandages = function(){
	return	(Orion.BuffExists('healing skill') && Orion.BuffTimeRemaining('healing skill') > 0) || 
		(Orion.BuffExists('veterinary') && Orion.BuffTimeRemaining('veterinary') > 0);
}

var HasVet = function(){
	return Orion.SkillValue('Veterinary') > 250;
}

var HasHealing = function(){
	return Orion.SkillValue('Healing') > 250;
}

function UseBandages(WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(!HasHealing()) return;
	if(IsApplyingBandages()) return;
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
var healFriendNames = [];
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
function FriendToHeal(dist){
	var friendsAroundUs = [];
	var friendlys = Orion.FindTypeEx("any", "any", "ground", "mobile|ignoreself|inlos", dist, 'green|blue');
	if(friendlys && friendlys.length > -1){
		friendlys.forEach(function(friendObject){
			var friendId = friendObject.Serial();
			
			if(isFriend[friendId] === false) return;
			
			var friendProps = friendObject.Properties();
			if(!friendProps || friendProps.length === 0){
				return;
			}
			var friendlyIsPet = knownPetTypes[friendObject.Graphic()] || friendProps.indexOf("(bonded)") > -1 || friendProps.indexOf("(tame)") > -1;
			if(friendProps.indexOf("(summoned)") > -1) return; 
			
			if(!HasVet()){
				if(friendlyIsPet){ 
					isFriend[friendId] = false;
					return;
				}
			}
			if(!HasHealing()){
				if(!friendlyIsPet) {
					isFriend[friendId] = false;
					return;
				}
			}
			
			
			if(isFriend[friendId] === false){
				return;
			} else if(isFriend[friendId] === true){
				friendsAroundUs.push(friendId);
			} else { 
				var namesFound = healFriendNames.filter(function(name){
					return friendProps.indexOf(name) > -1;
				});
				if(namesFound.length > 0) {
					isFriend[friendId] = true;
					friendsAroundUs.push(friendId);
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
						isFriend[friendId] = true;
						friendsAroundUs.push(friendId);
					} else {
						if(profileRead){
							isFriend[friendId] = false;
						} else {
							if(friendlyIsPet){
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
					return;
				}
				
				Orion.GetStatus(friendId);
				if(ignoreAfkDead[friendId] && ignoreAfkDead[friendId].deadBandages > 5) {
					if(!friendObject.Dead()){
						delete ignoreAfkDead[friendId];
					} else {
						return;
					}
				}
				if(friendObject.Distance() <= dist && ((friendObject.Hits() * 4) < healFriendThreshold)){
					if(friendObject.Hits() === 0 && !friendObject.Dead()){
						return;
					}
					friendsToHealAroundUs.push(friendId);
				}
			});
		}
		if(friendsToHealAroundUs.length > 0){
			var randomFriendIndex = 0;
			if(friendsToHealAroundUs.length > 1){
				randomFriendIndex = Math.floor(Math.random() * (friendsToHealAroundUs.length - 1))
			}
			return friendsToHealAroundUs[randomFriendIndex];
		} else {
			return null;
		}
	} else {
		return null;
	}
	
}


function HealChivFriend(){
	var friendId = 	FriendToHeal(2);
	var friendObject = Orion.FindObject(friendId);
	if(!friendObject) return;
	Orion.GetStatus(friendId);
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


function HealPets(WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(!HasVet()) return;
	if(IsApplyingBandages()) return;
	var friendId = 	FriendToHeal(2);
	if(!friendId) return;
	var friendObject = Orion.FindObject(friendId);
	if(!friendObject) return;
	Orion.GetStatus(friendId);
	WaitForObjectTimeout();
	if(((friendObject.Hits() * 4) < healFriendThreshold)){
		Orion.BandageTarget(friendObject.Serial());
		RegisterUseObjectTimeout()
		Orion.Wait(100);
	}
}


function HealFriend(WaitForObjectTimeout, RegisterUseObjectTimeout){
	if(!HasHealing()) return;
	if(IsApplyingBandages()) return;
	var friendId = 	FriendToHeal(2);
	if(!friendId) return;
	var friendObject = Orion.FindObject(friendId);
	if(!friendObject) return;
	Orion.Print("Friend Found");
	Orion.GetStatus(friendId);
	if(friendObject.Dead()) {
		if( !ignoreAfkDead[friendId] ) {
			ignoreAfkDead[friendId] = { deadBandages: 1 };
		} else {
			ignoreAfkDead[friendId].deadBandages = ignoreAfkDead[friendId].deadBandages + 1;
		}
	}
	var friendProps = friendObject.Properties();
	WaitForObjectTimeout();
	if(((friendObject.Hits() * 4) < healFriendThreshold)){
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