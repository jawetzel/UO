var weaponNamesToIgnore = [
		'Elven Machete',
		'Radiant Scimitar',
		'Wild Staff',
		'Lance',
		'Skinning Knife',
		'Hammer',
		'Cutlass',
		'Diamond Mace',
		'Dagger',
		'Longsword',
		'Scimitar',
	];

var useLootTMaps = false;
function SetUseLootTMaps(value){
	useLootTMaps = value;
}

var useLootForFrags = false;
function SetUseLootForFrags(value){
	useLootForFrags = value;
}

var useLootEjGear = false;
function SetuseLootEjGear(value){
	useLootEjGear = value;
}

var GetPropValue = function(regex, props){
	var matches = regex.exec(props);
	if(!matches || matches.length < 2) return 0;
	
	return parseInt(matches[1]);
}

var shouldKeepItemEjGear = function(props){
	var isJewlery = (props.indexOf('Ring') > -1 && props.indexOf("Ringmail") === -1) || props.indexOf('Bracelet') > -1;
	var isArmor = props.indexOf("Physical Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1;

	var lmc = GetPropValue(/Lower Mana Cost (\d+)/, props);
	var hci = GetPropValue(/Hit Chance Increase (\d+)/, props);
	var di = GetPropValue(/Damage Increase (\d+)/, props);
	var luck = GetPropValue(/Luck (\d+)/, props);
	var phys = GetPropValue(/Physical Resist (\d+)/, props);
	var fire = GetPropValue(/Fire Resist (\d+)/, props);
	var poison = GetPropValue(/Poison Resist (\d+)/, props);
	var brittle = props.indexOf('Brittle') > -1;
	var antique =  props.indexOf('Antique') > -1;
	var isWeapon = props.indexOf('Skill Required: ') > -1;
	var isSsi = props.indexOf("Swing Speed Increase 10") > -1;
	var isArtifact = props.indexOf("Artifact") > -1;
	var isHpi  = props.indexOf("Hit Point Increase 5") > -1 || props.indexOf("Hit Point Increase 7") > -1;
	if(isJewlery) {
		return !antique && hci > 14 && di > 15 && luck > 80 && isSsi;
	}
	else if (isArmor){
		return luck > 80 && phys > 10 && lmc > 4 && brittle && isArtifact;
	} 
	else if (isWeapon) {
		return false;
	} 
	else {
		return brittle && luck > 80 && isSsi && (isHpi || hci > 14 || luck > 140);
	}
}

	
var ShouldKeepItem_Splinter = function (props){
		//handle splinter
		var antique = 'Antique';
		var isAntique = props.indexOf(antique) > -1;
		var brittle = 'Brittle';
		var isBrittle =  props.indexOf(brittle) > -1;
		if(isAntique || isBrittle){
				return false;
		}	
		var isSc = props.indexOf('Spell Channeling') > -1;
		
		//todo handle clean splinter weapons (can be imbued)
		var splinter = "Splintering Weapon";
		
		var isOverCapSplinter = props.indexOf(splinter + " 25") > -1 || props.indexOf(splinter + " 30") > -1;
		var isSplinter =  props.indexOf(splinter + " 20") > -1 || isOverCapSplinter;
		
		var fireball = "Hit Fireball";
		var isCappedFireball = props.indexOf(fireball + " 50") > -1
		var isOverCapFireball = props.indexOf(fireball + " 60") > -1 || props.indexOf(fireball + " 70") > -1;
		var isFireball = isCappedFireball || isOverCapFireball;
		var lightning = "Hit Lightning";
		var isCappedLightning = props.indexOf(lightning + " 50") > -1
		var isOverCapLightning = props.indexOf(lightning + " 60") > -1 || props.indexOf(lightning + " 70") > -1;
		var isLightning = isCappedLightning || isOverCapLightning;
		var harm = "Hit Harm";
		var isOverCapHarm = props.indexOf(harm + " 60") > -1 || props.indexOf(harm + " 70") > -1;
		var isHarm = isOverCapHarm;
		
		var hitLowerD = 'Hit Lower Defense';
		var isLowerD = props.indexOf(hitLowerD) > -1;
		
		var weight = "Weight:";
		var bokuto = "Bokuto";
		var isBokuto = props.indexOf(bokuto) > -1;
		
		if(isSplinter){
				var isHitSpell = isFireball || isLightning || isHarm;				
				
				if(isBokuto && isHitSpell && (isOverCapSplinter || isSc || isLowerD)) {
					return true;
				}
									
				if(isHitSpell &&  (isOverCapSplinter || isSc || isLowerD)){
					return true;
				}
			
				if(isOverCapLightning || isOverCapFireball || isOverCapHarm){
					return true;
				}							
		}
		return false;
	}
	
	
function CheckItem(){
	Orion.Print(ShouldKeepItem(0x48F97250));
}

function FilterLastObjectJunkIntoLastTarget(){
	var soirceBag = Orion.FindObject(lastobject).Serial();
	var targetBag = Orion.ClientLastTarget();
	
	Orion.UseObject(soirceBag);
	Orion.Wait(1200);
	var destItems = Orion.FindType('any', 'any', soirceBag, ' ', 'finddistance', ' ', true);
	var counter = 0;
	destItems.forEach(function(item){
		counter++;
		Orion.Print("Working item " + counter + "/" + destItems.length);
		if(ShouldKeepItem(item)){
			Orion.MoveItem(item, 1000, targetBag);
			Orion.Wait(1500);
		}
			
	})
}

	
function ShouldKeepItem(itemId){
		var item = Orion.FindObject(itemId);
		if(!item) return false;
		
		var props = item.Properties();
		var lowerCaseProps = props.toLowerCase();
			
		var isJewlery = (props.indexOf('Ring') > -1 && props.indexOf("Ringmail") === -1) || props.indexOf('Bracelet') > -1;
		var is2hWeapon = props.indexOf('Two-handed Weapon') > -1;
		var is1hWeapon = props.indexOf('One-handed Weapon') > -1;
		var isArmor = props.indexOf("Physical Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1;
		if(props.indexOf("50 Stone") > -1) return false;
		if(useLootForFrags){
			if(props.indexOf('Legendary Artifact') > -1 || props.indexOf('Major Artifact') > -1) {
				return true;
			}
		}
		
		//handle cursed items
		var cursed = 'Cursed';
		if(props.indexOf(cursed) > -1) return false;
		
		//exclude archery weapons (never seen a good one)
		var archery = 'Skill Required: Archery';
		if(props.indexOf(archery) > -1) return false;
		
		//I want to exclude weapons that will never be good
		if(is2hWeapon){ // I want to exclude all 2h except spears, ornate axes and hatchets
			if( 
				!(lowerCaseProps.indexOf('hatchet') > -1) && 
				!(lowerCaseProps.indexOf( 'no-dachi') > -1) && 
				!(lowerCaseProps.indexOf( 'Double Axe') > -1) && 
				!(lowerCaseProps.indexOf( 'Gnarled Staff') > -1) && 
				!(lowerCaseProps.indexOf( 'Lajatang') > -1)
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
		if(shouldKeepItemEjGear(props)) return true;
		//Handle max level Tmaps 
		if(useLootTMaps){
			var cache = " Cache";
			if(props.indexOf(cache) > -1) return true;
			if(props.indexOf("Tattered Treasure Map") > -1) return true;
		}
		
		//Handle Named Jewlery
		if(isJewlery){
				//I do not want arcane Jewl of sorcery.
				if(props.indexOf("Arcane") > -1 && props.indexOf("Sorcery") > -1) return false;
		}
		
		if(isJewlery){
				var worthlessMods = [
					'Luck', 'Night Sight', 
					'Fire Resist', 'Physical Resist', 
					'Cold Resist', 'Poison Resist', 'Energy Resist', 
					'Peacemaking', 'Musicianship', 'Discordance', 'Provocation', 
					'Veterinary', 
					'Stealing', 'Stealth',
					'Meditation',
					'Stamina Regeneration',
					'Stamina Increase 1', 'Stamina Increase 2', 'Stamina Increase 3'
				]
				//up to 8 mods with 3 bad mods
				var containsWorthlessMods = worthlessMods.filter(function(mod){
					return props.indexOf(mod) > -1
				});
				var worthlessCountBonus = 0;
				
				var isWrestle = props.indexOf("Wrestling") > -1;
				var isArchery = props.indexOf("Archery") > -1;
				var isCombatSkill = props.indexOf("Swordsmanship") > -1 || 
					props.indexOf("Fencing") > -1 || 
					props.indexOf("Mace Fighting") > -1;
				var isHealing = props.indexOf("Healing") > -1;
				
				if(isWrestle && isArchery) worthlessCountBonus++;
				if(isWrestle && isCombatSkill) worthlessCountBonus++;
				if(isWrestle && props.indexOf("Bushido") > -1) worthlessCountBonus++;
				if(isArchery && props.indexOf("Parrying") > -1) worthlessCountBonus++;
				
				if(isHealing && props.indexOf("Magery") > -1) worthlessCountBonus++;
				if(isHealing && props.indexOf("Mysticism") > -1) worthlessCountBonus++;
				
				
				var skills = [	"Anatomy",		"Animal Lore",		"Animal Taming",
									"Archery",			"Bushido",				"Chivalry",
									"Evaluating Inteligence",					"Fencing",
									"Focus",				"Healing",				"Macing",
									"Magery",			"Resisting Spells",	"Meditation",
									"Mysticism",		"Necromancy",		"Ninjitsu",		
									"Parrying",			"Spirit Speak",		"Stealth",		
									"Swordsmanship",							"Tactics",	
									"Throwing",		"Wrestling"]
				var usefullSkills = skills.filter(function(mod){
					return props.indexOf(mod) > -1
				});
				
				if(usefullSkills.length < 2) return false;
					
				if((containsWorthlessMods.length + worthlessCountBonus) > 1) return false;
				//exclude 7 mod 2 junk mod jewls
				var nonModLines = ['Brittle', 'Antique', 'Prized', 'Gargoyles Only', 'Price: '];
				var jewlLineBonus = nonModLines.filter(function(mod){
						return props.indexOf(mod) > -1
					}).length
				var weight = 'Weight';
				var weightIndex = props.indexOf(weight);	
				var durabilityIndex = props.indexOf('Durability');			
				var propsSubstring = props.substring(weightIndex + weight.length, durabilityIndex);
				var newLinesCount = propsSubstring.split('\n').length;
				var is7Mod = (newLinesCount + jewlLineBonus) === 13;
				if(is7Mod && (containsWorthlessMods.length + worthlessCountBonus) > 1) return false;
				//this is where we could build out logic for junk combos on jewls
		}
		
		
		if(ShouldKeepItem_Splinter(props)){
			 return true;
		} else if(is1hWeapon || is2hWeapon){ //if its  weapon and its not splinter I dont want it
			return false;
		}
			
		//fuck sheilds
		if(!isArmor && !isJewlery && !is2hWeapon && !is1hWeapon){
			return false;
		}
		
		if(isArmor){
			if(props.indexOf("Fortified") > -1 || props.indexOf("Of Defense") > -1){
				return false;
			}			
			if(
					(props.indexOf("Mystic") > -1 || props.indexOf("Arcane") > -1) && 
					(props.indexOf("Of Wizardry") > -1 || props.indexOf("Of Sorcery") > -1)){
					return false;
			}	
			
			var lrc = GetPropValue(/Lower Reagent Cost (\d+)/, props);
			var lmc = GetPropValue(/Lower Mana Cost (\d+)/, props);

			var intel = GetPropValue(/Intelligence Bonus (\d+)/, props);
			var mana = GetPropValue(/Mana Increase (\d+)/, props);
			
			var str =  GetPropValue(/Strength Bonus (\d+)/, props);
			var hp = GetPropValue(/Hit Point Increase (\d+)/, props);
			
			var dex = GetPropValue(/Dexterity Bonus (\d+)/, props);
			var stam = GetPropValue(/Stamina Increase (\d+)/, props);
			
			var eater =  GetPropValue(/Eater  (\d+)/, props);
			
			if(lrc === 0 && lmc === 0) return false;
			if(lrc > 0 && lrc < 15) return false;
			if(lmc > 0 && lmc < 6) return false;
			
			var totalStats = intel + mana + str + hp + dex + stam; 
			if(totalStats < 20) {
				if(totalStats < 5 && lrc > 0 && eater > 5) return false;
				if(totalStats < 10 && lrc > 0 && eater === 0) return false;
				if(totalStats < 15 && lrc === 0 &&  eater > 5) return false;
				if(totalStats < 20 && lrc === 0 && eater === 0) return false;
				if(hp > 0 && hp < 5) return false;
				if(stam > 0 && stam < 8) return false;
				
				var statPropCount = 0;
				if(intel > 0) statPropCount++;
				if(mana > 0) statPropCount++;
				if(str > 0) statPropCount++;
				if(hp > 0) statPropCount++;
				if(dex > 0) statPropCount++;
				if(stam > 0) statPropCount++;
				
				if(statPropCount < 2){
					if(statPropCount === 1){
						if(	
							stam < 10 && 
							hp < 7 
							){
							return false;
						}
					} else {
						return false;
					}	 
				}
			}
		}
		
		//Handle Legendary
		if(props.indexOf('Legendary Artifact') > -1) return true;
		
		return false;
}