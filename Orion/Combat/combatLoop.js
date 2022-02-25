//Orion.Print(Orion.InfoBuff()) //for use in identifying buffs
//Orion.Print(Orion.AbilityStatus('Primary'))


var profiles = {
	pvp: {
		useBandages: true,
		useEnhancementPots: true,
		useRestorePotions: true
	},
	sampyre: {
		useEnhancementPots: false,
		usePrimary: false,
		useAttack: true	
	},
	training2: {
		useAttack: true,
		useEnemyOfOne: false,
		usePrimary: true,
		useSeccondary: false,
		useHonor: true,
		useLightningStrike: false,
		useDivineFury: false,
		useBandages: false,
		useLootCorpses: true,
		useInsureItem: true,
		useEnhancementPots: false,
		useConsecrateWeapon: false
	},
	looter: {
		useLootCorpses: true,
	},
	szevtra: {
		useAttack: true,
		usePrimary: true,
		useHonor: true,
		useLootCorpses: true,
		useInsureItem: true,
		useEnemyOfOne: false,
	},
	training: {
		useAttack: true,
		useLootCorpses: true,
		useInsureItem: true,
		usePrimary: true,
		useHealFriend: true,
		useHonor: true
	},
	event: {
		useAttack: true,
		useBandages: true,
		useEnemyOfOne:false,
		useHonor: true,
		usePrimary: true,
		ignorePlayers: true,
	},
	attack: {
		useAttack: true,
		useLootCorpses: true,
		useInsureItem: true,
		useHonor: true,
		useEnemyOfOne:true,
	}
}


var profile = profiles.training


//if you want to cut corpses get a butchers war cleaver
var useCutCorpses = profile != null ? profile.useCutCorpses : false;

//chiv settings
var useEnemyOfOne = profile != null ? profile.useEnemyOfOne :  false;
var useDivineFury = profile != null ? profile.useDivineFury :  false;
var useConsecrateWeapon = profile != null ? profile.useConsecrateWeapon :  false;

//combat settings
var usePrimary = profile != null ? profile.usePrimary : false;
var useSeccondary = profile != null ? profile.useSeccondary :  false;

//bushido settings
var useMomentumStrike = profile != null ? profile.useMomentumStrike :  false;
var useLightningStrike =profile != null ? profile.useLightningStrike :   false;
var useHonor = profile != null ? profile.useHonor :  false;

var useBandages =  profile != null ? profile.useBandages :  false;
var useEnhancementPots =  profile != null ? profile.useEnhancementPots :  false;
var useRestorePotions =  profile != null ? profile.useRestorePotions :  false;
var healPotionThreshold = 50;
var useHealFriend = profile != null ? profile.useHealFriend :  false;
var healFriendThreshold = 40; // this is a percent
// probably dont configure below here
var timeBetweenLoops = 100; //time in ms between loop cycle
var enemyTypes = 'gray | criminal | enemy | red'			; // 'gray | criminal | enemy | red'
var maxEnemyDistance =  8;
var useAttack = profile != null ? profile.useAttack : false;
var ignorePlayers = profile != null ? profile.ignorePlayers : false;
var minimumManaForSpells = 20;

var useLootCorpses = profile != null ? profile.useLootCorpses :   false;
var useInsureItem = profile != null ? profile.useInsureItem :   false;


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
}
//constants

var timeBetweenBows = 300000; // time in ms between bows (ensure keep logged in)
var bandageBuffIcon = '0x7596';
var agilityPotionBuffIcon = '0x753c';
var strPotionBuffIcon = '0x7567';
var agilityPotionType = '0x0F08';
var strPotionType = '0x0F09';
var poisonBuffIcon = '0x7560';
var curePotionType = '0x0F07';
var healPotionType = '0x0F0C';
var lootBagType = '0x0E79';
var objectUseWaitTime = 1200;

var lastObjectUsedTime = 0;
function WaitForObjectTimeout(){
	var nowTime = new Date().getTime();
	var deltaTime = nowTime - lastObjectUsedTime;
	if(deltaTime < objectUseWaitTime){
		Orion.Wait(objectUseWaitTime - deltaTime);
	}
}

var Bandage = function(){
	if(useBandages){
		if( !Orion.BuffExists(bandageBuffIcon) &&  (Player.Hits() < Player.MaxHits() || Orion.BuffExists(poisonBuffIcon))){
			WaitForObjectTimeout();
			if( !Orion.BuffExists(bandageBuffIcon)){
				Orion.BandageSelf();
				lastObjectUsedTime = new Date().getTime();
			}
		}
	}
}

var EnhancementPots = function(){
	if(useEnhancementPots){
		if(Orion.FindType(agilityPotionType).length > 0 && !Orion.BuffExists(agilityPotionBuffIcon)){
			WaitForObjectTimeout();
			if(Orion.FindType(agilityPotionType).length > 0 && !Orion.BuffExists(agilityPotionBuffIcon)){
				Orion.UseType(agilityPotionType);
			}
			lastObjectUsedTime = new Date().getTime();
		}
		if(Orion.FindType(strPotionType).length > 0 && !Orion.BuffExists(strPotionBuffIcon)){
			WaitForObjectTimeout();
			if(Orion.FindType(strPotionType).length > 0 && !Orion.BuffExists(strPotionBuffIcon)){
				Orion.UseType(strPotionType);
				lastObjectUsedTime = new Date().getTime();
			}
		}
	}
}

var RestorePotions = function(){
	if(useRestorePotions){
		if(Orion.FindType(curePotionType).length > 0 && Orion.BuffExists(poisonBuffIcon)){
			WaitForObjectTimeout();
			if(Orion.FindType(curePotionType).length > 0 && Orion.BuffExists(poisonBuffIcon)){
				Orion.UseType(curePotionType);
				lastObjectUsedTime = new Date().getTime();
			}
		}
		if(Orion.FindType(healPotionType).length > 0 && Player.Hits() < healPotionThreshold && !Orion.BuffExists(poisonBuffIcon)){
			WaitForObjectTimeout();
			if(Orion.FindType(healPotionType).length > 0 && Player.Hits() < healPotionThreshold && !Orion.BuffExists(poisonBuffIcon)){
				Orion.UseType(healPotionType);
				lastObjectUsedTime = new Date().getTime();
			}
		}
		if(Orion.FindType(curePotionType).length > 0 && Orion.BuffExists(poisonBuffIcon)){
			 RestorePotions();
		}
	}
}

var GetTarget = function(){
	var dist = 0;
	while(dist < maxEnemyDistance){
		var enemy = Orion.FindType("-1 | !0x0191 | !0x0190 ", -1, "ground", "mobile | near | ignorefriends", dist.toString(), enemyTypes);
		dist = dist + 1;
		if(enemy && enemy.length > 0){
			if(enemy.length > 1){
				var firstEnemy = null;
				enemy.forEach(function(enemyId){
					if(ignorePlayers && enemyObject){
						var enemyObject = Orion.FindObject(enemy[0]);
						var props = Orion.FindObject(enemy[0]).Properties();
						if(enemyObject.IsPlayer() === false && props.indexOf("(summoned)") === -1){
							firstEnemy = enemy;
							break;
						}
					}
					else {
						firstEnemy = enemy;
						break;
					}	
				})
				if(firstEnemy) return firstEnemy;
			} else{
				if(ignorePlayers && enemyObject){
					var enemyObject = Orion.FindObject(enemy[0]);
					var props = Orion.FindObject(enemy[0]).Properties();
					if(enemyObject.IsPlayer() === false && props.indexOf("(summoned)") === -1){
						return enemy;
					}
				}
				else {
					return enemy;
				}	
			}
			
		}
	}
	return null;
}

var lastEnemyHonored = null;
var AttackTarget = function(enemy){
	 if(useAttack && enemy && enemy.length > 0){
		if(useHonor && (!lastEnemyHonored || lastEnemyHonored.toString() !== enemy.toString())){
			lastEnemyHonored = enemy;
			Orion.InvokeVirtue("Honor")
			Orion.WaitForTarget();
			Orion.TargetObject(enemy);
		}
    	Orion.Attack(enemy[0]);
    }
}

var nextSpellTime = 0;
var SetNextSpellTime = function(delay){
	nextSpellTime = new Date().getTime() + delay;
}
var CanUseAnotherSpell = function(){
	var now = new Date().getTime();
	return now > nextSpellTime;
}
var CastSpells = function(){
	if(CanUseAnotherSpell() && Player.Mana() > minimumManaForSpells) {
    	if(useEnemyOfOne && !Orion.BuffExists('0x754e')){
    		Orion.Cast('Enemy of One');
    		SetNextSpellTime(1500)
    		Orion.Wait(500) //handle fcr
    	} else if(useDivineFury && !Orion.BuffExists('0x754d')){
    		Orion.Cast('Divine Fury');
    		SetNextSpellTime(1250);
    		Orion.Wait(500) //handle fcr
    	} else if(useConsecrateWeapon && !Orion.BuffExists('0x75a7')){
    		Orion.Cast('Consecrate Weapon');
    		SetNextSpellTime(1000);
    		Orion.Wait(500) //handle fcr
    	}    
    }
}

var UseSpecials = function(){
	if(Player.Mana() > 20) {
    	if(useMomentumStrike && !Orion.BuffExists('0x75fb')){
	    	Orion.Cast('Momentum Strike');
	    	Orion.Wait(250);
    	}
    	if(useLightningStrike && !Orion.BuffExists('0x75fa')){
	    	Orion.Cast('Lightning Strike');
	    	Orion.Wait(250);
    	}
    	if(usePrimary && !Orion.AbilityStatus('Primary')){
	    	Orion.UseAbility('Primary');
	    	Orion.Wait(250);
    	}
    	if(useSeccondary && !Orion.AbilityStatus('Secondary')){
	    	Orion.UseAbility('Secondary');
	    	Orion.Wait(250);
    	}
    
    }
}

var bowCounter = 0;

var Bow = function(){
	if(bowCounter > timeBetweenBows / timeBetweenLoops){
        bowCounter = 0;
        Orion.EmoteAction('bow');
    }
}

function CutCorpse()
{
	if(useCutCorpses){
    	Orion.UseIgnoreList('ignore');
	    var corpses = Orion.FindType(0x2006, any, ground, "", 2);
	    if (!corpses.length)
	    {
	        return;
	    }
	    var knifeType = "0x2D23"; // Knife Graphic 
	    var corpse = corpses[corpses.length - 1];
	    Orion.WaitTargetObject(corpse);
		Orion.Ignore(corpse);
		WaitForObjectTimeout();
	    if (!Orion.UseType(knifeType))
	    {
	        Orion.CancelWaitTarget();
	        Orion.CharPrint(self, 0x0021, "No Knife");
	        return;
	    }
	    lastObjectUsedTime = new Date().getTime();
    }
}

function ShouldKeepItem_CheckCleanSsi(props, itemId){
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
		Orion.Print("in ring");
		if(props.indexOf(ssi) > -1){
			Orion.Print("Has SSI");
			var weightIndex = props.indexOf(weight);	
			var durabilityIndex = props.indexOf(durability);			
			var propsSubstring = props.substring(weightIndex + weight.length, durabilityIndex);
			if(propsSubstring.indexOf(ssi) === -1){
				Orion.Print("could not read ring props right, retrying");
				Orion.Wait(100);
				return ShouldKeepItem(itemId);
			}
			var newLinesCount = propsSubstring.split('\n').length;
			Orion.Print("New Line Count: " + newLinesCount)
			Orion.Print(propsSubstring)

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
					Orion.Print("Keeper Almost Pure Ring");
					return true;
				}
			}
			
			if(newLinesCount === 5 && (propsSubstring.indexOf(prized) > -1 || propsSubstring.indexOf(antique) > -1 )){
				if(
					propsSubstring.indexOf(dex) > -1
					|| propsSubstring.indexOf(int) > -1
					|| propsSubstring.indexOf(str) > -1
					|| propsSubstring.indexOf(hci) > -1
					|| propsSubstring.indexOf(di) > -1
					|| propsSubstring.indexOf(dci) > -1
					|| propsSubstring.indexOf(ep) > -1
				) {
					Orion.Print("Keeper Almost Pure Ring");
					return true;
				}
			}
		}
	}
	return false;
}

function ShouldKeepItem_Splinter(props){
	//handle splinter
	
	//todo handle clean splinter weapons (can be imbued)
	var splinter = "Splintering Weapon";
	var splinter20 = "Splintering Weapon 20%";
	var splinter25 = "Splintering Weapon 25%";
	var splinter30 = "Splintering Weapon 30%";
	var antique = 'Antique';
	var brittle = 'Brittle';
	var fireball = "Hit Fireball";
	var lightning = "Hit Lightning";
	var harm = "Hit Harm";
	var magicArrow = "Hit Magic Arrow";
	var hitLowerD = 'Hit Lower Defense';
	var weight = "Weight:";
	var bokuto = "Bokuto";
	if(props.indexOf(splinter) > -1){
		if(props.indexOf(splinter20) > -1 || props.indexOf(splinter25) > -1 || props.indexOf(splinter30) > -1){
			var isHitSpell = props.indexOf(fireball) > -1 || 
				props.indexOf(lightning) > -1 || 
				props.indexOf(harm) > -1 || 
				props.indexOf(magicArrow) > -1	;
				
			var isLowerD = props.indexOf(hitLowerD) > -1;
			
			var isBokuto = props.indexOf(bokuto) > -1;
			
			var isCappedSplinter = props.indexOf(splinter30) > -1;
		
			if(isHitSpell && isCappedSplinter){
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
		
		
			if(props.indexOf(antique) > -1 || props.indexOf(brittle) > -1){
				return false;
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
				Orion.Print("startIndex IS -1, SOMETHING WENT WRONG");
				Orion.Print(props);
				return false;
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

			if(imbueSlotsOpen > 0 && (isHitSpell || isLowerD)){
				return true;
			} 
			else if(imbueSlotsOpen > 1){ //todo: we need to condition is imbueable here 
				return true;
			}
			 else {
				return false;
			}
			
		}
	}
	return false;
}

function ShouldKeepItem_LuckShield(props){
	var physicalResist = "Physical Resist";
	var fireResist = "Fire Resist";
	var coldResist = "Cold Resist";
	var lcuk = "Luck 150";
	var skillReq = "Skill Required";
	var ring = "Ring";
	var bracelet = "Bracelet";
	if(props.indexOf(lcuk) > -1 ){
		if(props.indexOf(ring) > -1 || props.indexOf(bracelet) > -1) return false;
		if(props.indexOf(skillReq) > -1) return false;
		if(props.indexOf(physicalResist) > -1 && props.indexOf(fireResist) > -1 && props.indexOf(coldResist) > -1) return false;
		return true;
	}
	return false;
}


function ShouldKeepItem(itemId){
	var item = Orion.FindObject(itemId);
	if(!item) return false;
	
	//loot by type
	if(lootItems[item.Graphic()]) return true;
	
	var props = item.Properties();
		
	//handle cursed items
	var cursed = 'Cursed';
	if(props.indexOf(cursed) > -1) return false;
	//exclude archery weapons (never seen a good one)
	var archery = 'Skill Required: Archery';
	if(props.indexOf(archery) > -1) return false;
	
	//I want to exclude weapons that will never be good
	var twoHanded = 'Two-handed Weapon';
	if(props.indexOf(twoHanded) > -1){ // I want to exclude all 2h except spears, ornate axes and hatchets
		var hatchet = 'Hatchet';
		var spear = 'Spear';
		var spearSpeed = 'Weapon Speed 2.75';
		var pitchfork = 'Pitchfork';
		var noDachi = 'No-Dachi';
		var doubleAxe = 'Double Axe';
		var bladedStaff = 'Bladed Staff';
		var doubleBladedStaff = 'Double Bladed Staff';
		var gnarledStaff = 'Gnarled Staff';
		if( 
			!(props.indexOf(hatchet) > -1) && 
			!(props.indexOf(spear) > -1 && props.indexOf(spearSpeed) > -1) && 
			!(props.indexOf(pitchfork) > -1) && 
			!(props.indexOf(noDachi) > -1) && 
			!(props.indexOf(doubleAxe) > -1) && 
			!(props.indexOf(bladedStaff) > -1 && props.indexOf(doubleBladedStaff) === -1) && 
			!(props.indexOf(gnarledStaff) > -1)
		){
			return false;
		}
	}
	var oneHanded = 'One-handed Weapon';
	if(props.indexOf(oneHanded) > -1) { //I want to exclude specific 1h weapons
		var elvenMachete = 'Elven Machete';
		var radiantScim = 'Radiant Scimitar';
		var wildStaff = 'Wild Staff';
		var lance = 'Lance';
		var skinningKnife = 'Skinning Knife';
		if(
			props.indexOf(elvenMachete) > -1 ||
			props.indexOf(wildStaff) > -1 || 
			props.indexOf(radiantScim) > -1 ||
			props.indexOf(skinningKnife) > -1 ||
			props.indexOf(lance) > -1 
		){
			return false;
		}
	}
	
	//Handle max level Tmaps 
	//var cache = " Cache";
	//if(props.indexOf(cache) > -1) return true;
	
	var ring = 'Ring';
	var bracelet = 'Bracelet';
	//Handle Named Jewlery
	if(props.indexOf(ring) > -1 || props.indexOf(bracelet) > -1){
		//I do not want arcane Jewl of sorcery.
		var arcane = "Arcane";
		var sorcerery = "Sorcery";
		if(props.indexOf(arcane) > -1 && props.indexOf(sorcerery) > -1) return false;
	}
	
	
	//Handle Legendary
	var legendary = 'Legendary Artifact';
	if(props.indexOf(legendary) > -1) return true;
	
	//Handle Major
	var major = 'Major Artifact';

	if(props.indexOf(major) > -1){
		var skillReq = 'Skill Required';
		if(props.indexOf(ring) > -1 || props.indexOf(bracelet) > -1){
			return true;
		}
		else {
			//return false; // we cant decide if we want to throw out majjor arti armor
		}
	}
	
	
	
	var skillReq = 'Skill Required';
	if(ShouldKeepItem_Splinter(props)){
		 return true;
	} else if(props.indexOf(skillReq) > -1){ //if its  weapon and its not splinter I dont want it
		return false;
	}

	if(ShouldKeepItem_CheckCleanSsi(props, itemId)) return true;
	if(ShouldKeepItem_LuckShield(props)) return true;
	return false;
}
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
function LootCorpses(){
	var corpseGraphic = '0x2006'

	if(useLootCorpses){
		var corpses = Orion.FindType(0x2006, any, ground, "", 2);
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
		var containerId = Orion.OpenContainer(corpseId);
		lastObjectUsedTime = new Date().getTime();
		Orion.Wait(900);
		Orion.Print("Start Evaluate Item")
		var itemsInCorpse = Orion.FindType('any', 'any', lastcontainer);
		var lootbag = Orion.FindType(lootBagType, 'any', 'backpack');
		itemsInCorpse.forEach(function(item){
			Orion.Print("Evaluate Item");
			if(ShouldKeepItem(item)){
				WaitForObjectTimeout()
				var movedItem = Orion.FindObject(item);
				if(lootbag && lootbag.length > 0){
					Orion.MoveItem(item, 1000, lootbag[0]);
					lastObjectUsedTime = new Date().getTime();
				}
				else {
					Orion.MoveItem(item, 1000, 'backpack');
					lastObjectUsedTime = new Date().getTime();
				}
				var waitForLootbagIndex = 0;
				while(movedItem.Container() !== lootbag[0] && waitForLootbagIndex < 15){
					waitForLootbagIndex ++;
					Orion.Wait(100);
				}
				lastObjectUsedTime = new Date().getTime();
				if(useInsureItem) InsureItem(item);
			}
			Orion.Ignore(item);				
		});
		Orion.Print("Finish Evaluate Items");
		Orion.Ignore(corpseId);
	}
}

var useHealFriend = profile != null ? profile.useHealFriend :  false;
var healFriendThreshold = 80; // this is a percent
var friendToHeal = null;
if(useHealFriend){
	Orion.Print("Target the friend you'd like to heal");
    Orion.WaitForAddObject('myTarget');
     friendToHeal = Orion.FindObject('myTarget');
}

function HealFriend(){
	if(useHealFriend){
		if(friendToHeal && !Orion.BuffExists('healing skill') && friendToHeal.Distance() <= 2 && ((friendToHeal.Hits() * 4) < healFriendThreshold)){
			WaitForObjectTimeout();
			if(!Orion.BuffExists('healing skill') && ((friendToHeal.Hits() * 4) < healFriendThreshold)){
				Orion.BandageTarget(friendToHeal.Serial());
				lastObjectUsedTime = new Date().getTime();
			}
		}
	}
}

while(true){
    Bow();
   	AttackTarget(GetTarget());
	Bandage();
	HealFriend();
	EnhancementPots();
	RestorePotions();
	CastSpells();
	UseSpecials();
    CutCorpse();
    LootCorpses()
    Orion.Wait(timeBetweenLoops);
}