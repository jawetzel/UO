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
		usePrimary: true,
		useAttack: true	
	},
	training: {
		useAttack: true,
		useEnemyOfOne: false,
		usePrimary: false,
		useSeccondary: true,
		useHonor: false,
		useLightningStrike: false,
		useDivineFury: false,
		useBandages: false,
		useLootCorpses: true,
		useEnhancementPots: false,
		useConsecrateWeapon: false
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

// probably dont configure below here
var timeBetweenLoops = 100; //time in ms between loop cycle
var enemyTypes = 'gray | criminal | enemy | red'			; // 'gray | criminal | enemy | red'
var maxEnemyDistance =  8;
var useAttack = profile != null ? profile.useAttack : false;

var minimumManaForSpells = 20;

var useLootCorpses = profile != null ? profile.useLootCorpses :   false;
//shame crystals
var lootItems = {
	'0x400B': true,
	'0x0F87': true
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
var objectUseWaitTime = 1100;

var Bandage = function(){
	if(useBandages){
		if( !Orion.BuffExists(bandageBuffIcon) &&  (Player.Hits() < Player.MaxHits() || Orion.BuffExists(poisonBuffIcon))){
		Orion.BandageSelf();
		 Orion.Wait(objectUseWaitTime);
		}
	}
}

var EnhancementPots = function(){
	if(useEnhancementPots){
		if(Orion.FindType(agilityPotionType).length > 0 && !Orion.BuffExists(agilityPotionBuffIcon)){
			Orion.UseType(agilityPotionType);
			Orion.Wait(objectUseWaitTime);
		}
		if(Orion.FindType(strPotionType).length > 0 && !Orion.BuffExists(strPotionBuffIcon)){
			Orion.UseType(strPotionType);
			Orion.Wait(objectUseWaitTime);
		}
	}
}

var RestorePotions = function(){
	if(useRestorePotions){
		if(Orion.FindType(curePotionType).length > 0 && Orion.BuffExists(poisonBuffIcon)){
			Orion.UseType(curePotionType);
			Orion.Wait(objectUseWaitTime);
		}
		if(Orion.FindType(healPotionType).length > 0 && Player.Hits() < healPotionThreshold && !Orion.BuffExists(poisonBuffIcon)){
			Orion.UseType(healPotionType);
			Orion.Wait(objectUseWaitTime);
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
			return enemy;
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
	    if (!Orion.UseType(knifeType))
	    {
	        Orion.CancelWaitTarget();
	        Orion.CharPrint(self, 0x0021, "No Knife");
	        return;
	    }
	
	    Orion.Wait(objectUseWaitTime);
	    //todo we need to handle some kind of bag of sending for the leather depending on weight vs maxweight
    }
}

function ShouldKeepItem(itemId){
	
	var cursed = 'Cursed';
	

	var item = Orion.FindObject(itemId);
	if(!item) return false;
	
	//loot by type
	if(lootItems[item.Graphic()]) return true;
	
	var props = item.Properties();
	
	//handle cursed items
	if(props.indexOf(cursed) > -1) return false;
	
	//Handle Legendary
	var legendary = 'Legendary Artifact';
	if(props.indexOf(legendary) > -1) return true;
	
	//Handle Major
	var major = 'Major Artifact';
	if(props.indexOf(major) > -1) return true;
	
	//handle splinter
	var splinter = "Splintering Weapon";
	var splinter20 = "Splintering Weapon 20%";
	var splinter25 = "Splintering Weapon 25%";
	var splinter30 = "Splintering Weapon 30%";
	var antique = 'Antique';
	var brittle = 'Brittle';
	if(props.indexOf(splinter) > -1){
		if(props.indexOf(splinter20) > -1 || props.indexOf(splinter25) > -1 || props.indexOf(splinter30) > -1){
			if(props.indexOf(antique) > -1 || props.indexOf(brittle) > -1){
				return false;
			}
			return true;
		}
	}
	
	
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
	if(props.indexOf(ring) > -1 || props.indexOf(bracelet) > -1){
		Orion.Print("in ring");
		if(props.indexOf(ssi) > -1){
			Orion.Print("Has SSI");
			var weightIndex = props.indexOf(weight);
			var durabilityIndex = props.indexOf(durability);
			var propsSubstring = props.substring(weightIndex + weight.length, durabilityIndex);
			var newLinesCount = propsSubstring.split('\n').length;
			if(newLinesCount === 3) return true;
			if(newLinesCount === 4){
				if(
					propsSubstring.indexOf(dex) > -1
					|| propsSubstring.indexOf(int) > -1
					|| propsSubstring.indexOf(str) > -1
					|| propsSubstring.indexOf(hci) > -1
					|| propsSubstring.indexOf(di) > -1
					|| propsSubstring.indexOf(dci) > -1
					|| propsSubstring.indexOf(ep) > -1
				) return true;
			}
			if(newLinesCount === 5 && propsSubstring.indexOf(prized) > -1){
				if(
					propsSubstring.indexOf(dex) > -1
					|| propsSubstring.indexOf(int) > -1
					|| propsSubstring.indexOf(str) > -1
					|| propsSubstring.indexOf(hci) > -1
					|| propsSubstring.indexOf(di) > -1
					|| propsSubstring.indexOf(dci) > -1
					|| propsSubstring.indexOf(ep) > -1
				) return true;
			}
			
			//we should have 2 new lines, one for after weight, and one before durability
			//a clean ring will have 1 additional new line
			//a almost clean ring will have 2 additional new line
		}
	}
	
	return false;
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
		var containerId = Orion.OpenContainer(corpseId);
		var openCorpseTime = new Date().getTime();
		Orion.Wait(500);
		Orion.Print("Start Evaluate Item")
		var itemsInCorpse = Orion.FindType('any', 'any', lastcontainer);
		itemsInCorpse.forEach(function(item){
			Orion.Print("Evaluate Item");
			if(ShouldKeepItem(item)){
				var nowTime = new Date().getTime();
				var deltaTime = nowTime - openCorpseTime;
				if(deltaTime < 1200){
					Orion.Wait(1200 - deltaTime);
				}
				Orion.DragItem(item);
				openCorpseTime = new Date().getTime();
				Orion.Wait(250);
				Orion.DropDraggedItem();
				Orion.Wait(250);
			}
			Orion.Ignore(item);				
		});
		var currentTime = new Date().getTime();
		var delta = currentTime - openCorpseTime;
			if(delta < 1200){
				Orion.Wait(1200 - delta);
			}
		Orion.Print("Finish Evaluate Items");
		Orion.Ignore(corpseId);
	}
}


while(true){
    Bow();
   	AttackTarget(GetTarget());
	Bandage();
	EnhancementPots();
	RestorePotions();
	CastSpells();
	UseSpecials();
    CutCorpse();
    LootCorpses()
    Orion.Wait(timeBetweenLoops);
}