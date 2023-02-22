var weaponNamesToIgnore = [
		'Elven Machete',
		'Radiant Scimitar',
		'Wild Staff',
		'Lance',
		'Skinning Knife',
		'Hammer',
		'Cutlass',
		'Diamond Mace',
	];

var lootEvaluatorEnabled = false;
	
function UseLootEvalPassword(password){
	var webhook = "https://passwordsecurity.herokuapp.com/api/password/loot?pw=" + password;
	var result = Orion.HttpGet(webhook);
	lootEvaluatorEnabled = result === "true";
}
	
var useLootTMaps = false;
function SetUseLootTMaps(value){
	useLootTMaps = value;
}

var ShouldKeepItem_CheckCleanSsi = function (props, itemId){
		//handle clean SSI Jewls
		var ring = 'Ring';
		var bracelet = 'Bracelet';
		var dex = 'Dexterity Bonus';
		var int = 'Intelligence Bonus';
		var str = 'Strength Bonus';
		var hci = 'Hit Chance Increase';
		var di = 'Damage Increase';
		var dci = 'Defense Chance Increase';
		var ep = 'Enhance Potions';
		var ssi = 'Swing Speed Increase 10%';
		var weight = 'Weight';
		var durability = 'Durability';
		var prized = 'Prized';
		var antique = 'Antique';
		var sdi = 'Spell Damage Increase';
		if(props.indexOf(ring) > -1 || props.indexOf(bracelet) > -1){
			if(props.indexOf(ssi) > -1){
				var weightIndex = props.indexOf(weight);	
				var durabilityIndex = props.indexOf(durability);			
				var propsSubstring = props.substring(weightIndex + weight.length, durabilityIndex);
				if(propsSubstring.indexOf(ssi) === -1){
					Orion.Wait(100);
					return ShouldKeepItem(itemId);
				}
				var newLinesCount = propsSubstring.split('\n').length;
				
				if(newLinesCount === 2) return true;
				if(newLinesCount === 3) return true;
				if(newLinesCount === 4){
					if(
						propsSubstring.indexOf(dex) > -1
						|| propsSubstring.indexOf(int) > -1
						|| propsSubstring.indexOf(str) > -1
						|| propsSubstring.indexOf(hci) > -1
						|| (propsSubstring.indexOf(di) > -1 && propsSubstring.indexOf(sdi) === -1)
						|| propsSubstring.indexOf(dci) > -1
						|| propsSubstring.indexOf(ep) > -1
						|| propsSubstring.indexOf(antique) > -1
						|| propsSubstring.indexOf(prized) > -1	
					) {
						return true;
					}
				}
				
				if(newLinesCount === 5 && propsSubstring.indexOf(prized) > -1){
					if(
						propsSubstring.indexOf(dex) > -1
						|| propsSubstring.indexOf(int) > -1
						|| propsSubstring.indexOf(str) > -1
						|| propsSubstring.indexOf(hci) > -1
						|| (propsSubstring.indexOf(di) > -1 && propsSubstring.indexOf(sdi) === -1)
						|| propsSubstring.indexOf(dci) > -1
						|| propsSubstring.indexOf(ep) > -1
					) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
var ShouldKeepItem_Splinter = function (props){
		//handle splinter
		
		//todo handle clean splinter weapons (can be imbued)
		var splinter = "Splintering Weapon";
		var isOverCapSplinter = props.indexOf(splinter + " 25") > -1 || props.indexOf(splinter + " 30") > -1;
		var isSplinter =  props.indexOf(splinter + " 20") > -1 || isOverCapSplinter;
		
		var antique = 'Antique';
		var isAntique = props.indexOf(antique) > -1;
		var brittle = 'Brittle';
		var isBrittle =  props.indexOf(brittle) > -1;
		
		var fireball = "Hit Fireball";
		var isFireball = props.indexOf(fireball) > -1;
		var isCappedFireball = props.indexOf(fireball + " 50") > -1
		var isOverCapFireball = props.indexOf(fireball + " 60") > -1 || props.indexOf(fireball + " 70") > -1;
		var lightning = "Hit Lightning";
		var isLightning = props.indexOf(lightning) > -1;
		var isCappedLightning = props.indexOf(lightning + " 50") > -1
		var isOverCapLightning = props.indexOf(lightning + " 60") > -1 || props.indexOf(lightning + " 70") > -1;
		var overCapLightning
		var harm = "Hit Harm";
		var isHarm = props.indexOf(harm) > -1;
		var isOverCapHarm = props.indexOf(harm + " 60") > -1 || props.indexOf(harm + " 70") > -1;
		var magicArrow = "Hit Magic Arrow";
		var isMagicArrow = props.indexOf(magicArrow) > -1;
		var isOverCapMagicArrow = props.indexOf(magicArrow + " 60") > -1 || props.indexOf(magicArrow + " 70") > -1;
		
		var hitLowerD = 'Hit Lower Defense';
		var isLowerD = props.indexOf(hitLowerD) > -1;
		
		var weight = "Weight:";
		var bokuto = "Bokuto";
		var isBokuto = props.indexOf(bokuto) > -1;
		
		if(isSplinter){
				var isHitSpell = isFireball || isLightning || isHarm || isMagicArrow;
					
				if(isAntique || isBrittle){
					return false;
				}	
									
				if(isHitSpell && isOverCapSplinter){
					return true;
				}
			
				if(isOverCapLightning || isOverCapFireball || isOverCapHarm || isCappedFireball || isCappedLightning){
					return true;
				}
			
				//we will keep antique or brittle if HLD hit spell and splinter
				if(isHitSpell && isLowerD){
					return true;
				} 
				
				//Keep hit spell bokutos
				if (isBokuto && isHitSpell) {
					return true;
				}	

				//Lets Figure out how many imbue slots are open;
				var modCount = 0;
				var physDamageType = '\nPhysical Damage';
				var fireDamageType = '\nFire Damage';
				var coldDamageType = '\nCold Damage';
				var poisonDamageType = '\nPoison Damage';
				var energyDamageType = '\nEnergy Damage';
				var endIndex = 0;
				if(props.indexOf(physDamageType) > -1 && (endIndex == 0 || props.indexOf(physDamageType) < endIndex)) endIndex = props.indexOf(physDamageType);
				if(props.indexOf(fireDamageType) > -1 && (endIndex == 0 || props.indexOf(fireDamageType) < endIndex)) endIndex = props.indexOf(fireDamageType);
				if(props.indexOf(coldDamageType) > -1 && (endIndex == 0 || props.indexOf(coldDamageType) < endIndex)) endIndex = props.indexOf(coldDamageType);
				if(props.indexOf(poisonDamageType) > -1 && (endIndex == 0 || props.indexOf(poisonDamageType) < endIndex)) endIndex = props.indexOf(poisonDamageType);
				if(props.indexOf(energyDamageType) > -1 && (endIndex == 0 || props.indexOf(energyDamageType) < endIndex)) endIndex = props.indexOf(energyDamageType);
				if(endIndex == 0){
					Orion.Print("END INDEX IS 0, SOMETHING WENT WRONG");
					Orion.Print(props);
					return false;
				}
				var propsStart = " Stones\n";
				var startIndex = props.indexOf(propsStart);
				if(startIndex === -1){
					var propsStartOneStone = " Stone\n";
					 startIndex = props.indexOf(propsStartOneStone);
					 if(startIndex === -1){
					 	Orion.Print("startIndex IS -1, SOMETHING WENT WRONG");
						Orion.Print(props);
						return false;
					 }
				}
				var modsSubstring = props.substring(startIndex + propsStart.length, endIndex);
				modCount = modCount + modsSubstring.split('\n').length;
				var prized = "Prized";
				var fcMinusOne = "Faster Casting -1";
				if(props.indexOf(prized) > -1)  modCount--;
				if(props.indexOf(fcMinusOne) > -1) modCount--;
				
				var imbueSlotsOpen = 5 - modCount;
				Orion.Print("IMBUE SLOTS OPEN");
				Orion.Print(imbueSlotsOpen);
				Orion.Print(modsSubstring);
	
				if(imbueSlotsOpen > 0 && (isBokuto)){
					return true;
				} 
				else {
					return false;
				}
				
		}
		return false;
	}
	
	function ShouldKeepItem_LuckShield(props){
		if(props.indexOf("Luck 150") > -1 ){
			return true;
		}
		return false;
	}
	
	
	
	
function ShouldKeepItem(itemId){
		if(!lootEvaluatorEnabled){
			Orion.Print("Looting Disabled, reach out to jawetzel for updated password")
			return false;
		}
		var item = Orion.FindObject(itemId);
		if(!item) return false;
		
		
		//loot by type
		if(lootItems[item.Graphic()]){
			if(item.Graphic() === bandageGraphic){ //dont keep too many bandages
				var totalCount = 0;
				var found = Orion.FindType(bandageGraphic, 'any', 'backpack', ' ', 'finddistance', ' ', true);
				if(found.length > 0){
					found.forEach(function(bandageId){
						var bandageInstance = Orion.FindObject(bandageId);
						totalCount += bandageInstance.Count();
					})
					if(totalCount > 3000) return false
				}
			}
			 return true;
		}
		
		var props = item.Properties();
		var lowerCaseProps = props.toLowerCase();
			
		
		
			
		var isJewlery = props.indexOf('Ring') > -1 || props.indexOf('Bracelet') > -1;
		var is2hWeapon = props.indexOf('Two-handed Weapon') > -1;
		var is1hWeapon = props.indexOf('One-handed Weapon') > -1;
		var isArmor = props.indexOf("Physical Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1;
		
		if(Orion.ShardName() === 'Siege Perilous'){
			if(props.indexOf("50 Stone") > -1) return false;
			if(
				props.indexOf('Legendary Artifact') > -1 || 
				props.indexOf('Major Artifact') > -1 || 
				props.indexOf('Greater Artifact') > -1
			) return true;
			
			if((isJewlery || is1hWeapon || is2hWeapon ) && props.indexOf('Major Magic') > -1) return true;
		}
		
		
		//handle cursed items
		var cursed = 'Cursed';
		if(Orion.ShardName() !== 'Siege Perilous'){
			if(props.indexOf(cursed) > -1) return false;
		}
		
		//exclude archery weapons (never seen a good one)
		var archery = 'Skill Required: Archery';
		if(props.indexOf(archery) > -1) return false;
		
		//I want to exclude weapons that will never be good
		if(is2hWeapon){ // I want to exclude all 2h except spears, ornate axes and hatchets
			if( 
				!(lowerCaseProps.indexOf('hatchet') > -1) && 
				!(lowerCaseProps.indexOf( 'no-dachi') > -1)
			){
				return false;
			}
		}
		if(is1hWeapon) { //I want to exclude specific 1h weapons
			if(
				weaponNamesToIgnore.filter(function(name){
					return props.indexOf(name) > -1
				}).length > 0
			){
				return false;
			}
		}
		
		//Handle max level Tmaps 
		if(useLootTMaps){
			var cache = " Cache";
			if(props.indexOf(cache) > -1) return true;
			if(props.indexOf("Tattered Treasure Map") > -1) return true;
		}
		
		
		//Handle Named Jewlery
		if(Orion.ShardName() !== 'Siege Perilous'){
			if(isJewlery){
				//I do not want arcane Jewl of sorcery.
				if(props.indexOf("Arcane") > -1 && props.indexOf("Sorcery") > -1) return false;
			}
		}
		
		
		if(ShouldKeepItem_Splinter(props)){
			 return true;
		} else if(is1hWeapon || is2hWeapon){ //if its  weapon and its not splinter I dont want it
			return false;
		}
	
		if(ShouldKeepItem_CheckCleanSsi(props, itemId)) return true;
		
		//fuck sheilds
		if(!isArmor && !isJewlery && !is2hWeapon && !is1hWeapon){
			if(
				props.indexOf("Spell Channeling") > -1 && 
				props.indexOf("Faster Casting") === -1 && 
				props.indexOf("Reactive") > -1
			){
				return true;
			}
			return false;
		}
		
		
		if(isArmor){
			if(props.indexOf("Fortified") > -1 || props.indexOf("Of Defense") > -1){
				return false;
			}
			
			if((
				props.indexOf('Legendary Artifact') > -1 || 
				props.indexOf('Major Artifact') > -1
			) && props.indexOf('Luck') > -1)  return true;
			if(Orion.ShardName() !== 'Siege Perilous'){
				if(
					(props.indexOf("Mystic") > -1 || props.indexOf("Arcane") > -1) && 
					(props.indexOf("Of Wizardry") > -1 || props.indexOf("Of Sorcery") > -1)){
					return false;
				}
			}
			
			
			var hasMr2 = props.indexOf("Mana Regeneration 2") > -1;
			var hasMr3 = props.indexOf("Mana Regeneration 3") > -1;
			var hasMr4 = props.indexOf("Mana Regeneration 4") > -1;
			var hasHpr2 = props.indexOf("Hit Point Regeneration 2") > -1;
			var hasHpr3 = props.indexOf("Hit Point Regeneration 3") > -1;
			var hasHpr4 = props.indexOf("Hit Point Regeneration 4") > -1;
			
			if(!(hasMr2 || hasMr3 || hasMr4 || hasHpr2 || hasHpr3 || hasHpr4)){
				 return false;
			}
		}
		
		//Handle Legendary
		if(props.indexOf('Legendary Artifact') > -1) return true;
		
		//Handle Major
		if(props.indexOf('Major Artifact') > -1){
			if(isJewlery){
				return true;
			}
			else {
				if(isArmor && props.indexOf('Luck') > -1) return true;
				
				return false;
			}
		}	
		return false;
}