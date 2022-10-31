//Orion.Print(Orion.InfoBuff()) //for use in identifying buffs
//Orion.Print(Orion.AbilityStatus('Primary'))


function CombatLoop(){

	var profiles = {
		startingProfile: {
			useSpecial: true,
			useAttack: true,
			useLootCorpses: true,
			useInsureItem: true,
			useLootTMaps: true,
			useHonor: true
		},
		Spawn: {
			//useSpecial: true,
			useAttack: true,
			
		},
		JunkoSamp: {
			useSpecial: true,
			useAttack: true,
			useHealFriend: true,
			useBandages: true,
			useChivHeal: true,
			useHealChivFriend: true,
		},
		EventThrower: {
			useSpecial: true,
			useAttack: true,
			useHealFriend: true,
			useBandages: true,
			useChivHeal: true,
			useHealChivFriend: true,
			useSkipTypesToIgnore: true
		},
		
		PvpDexer: {
			useBandages: true,
			useEnhancementPots: true,
			useRestorePotions: true
		},
		Temp: {
			useAttack: true,
			useLightningStrike: true,
			useBandages: true
		},
		Thrower: {
			useSpecial: true,
			useAttack: true,
			useBandages: true
		},
		loot:{
			useLootCorpses: true,
		},
		sampTamer: {
			useSpecial: true,
			useAttack: true,
			//useDivineFury: true,
			//useConsecrateWeapon: true,
			useHealPets: true,
			useChivHeal: true,
			useHealChivFriend: true,
			useLootCorpses: true,
		}
	}
	
	
	var profile = profiles.EventThrower;
	
	
	//if you want to cut corpses get a butchers war cleaver
	var useCutCorpses = profile != null ? profile.useCutCorpses : false;
	
	//chiv settings
	var useEnemyOfOne = profile != null ? profile.useEnemyOfOne :  false;
	var useDivineFury = profile != null ? profile.useDivineFury :  false;
	var useConsecrateWeapon = profile != null ? profile.useConsecrateWeapon :  false;
	var useChivHeal =  profile != null ? profile.useChivHeal :  false;
	var useHealChivFriend =  profile != null ? profile.useHealChivFriend :  false;
	//combat settings
	var useSpecial = profile != null ? profile.useSpecial : false;
	var primaryArmorIgnoreWeapons = [
		'Bladed Staff',
		'Hatchet',
		'Soul Glaive',
		'Composite Bow',
		'Boomerang',
	];
	var secondaryArmorIgnoreWeapons = [
		'Katana',
		'Leafblade',
		'Bokuto',
		'Yumi'
	];
	var primaryWhirlwindWeapon = [
		'Radiant Scimitar',
		'Magical Shortbow'
	];
	var secondaryWhirlwindWeapon = [
		'Double Axe'
	];
				
	//bushido settings
	var useMomentumStrike = profile != null ? profile.useMomentumStrike :  false;
	var useLightningStrike =profile != null ? profile.useLightningStrike :   false;
	var useHonor = profile != null ? profile.useHonor :  false;
	
	
	var useSkipTypesToIgnore =  profile != null ? profile.useSkipTypesToIgnore :  false;
	
	var useBandages =  profile != null ? profile.useBandages :  false;
	var useEnhancementPots =  profile != null ? profile.useEnhancementPots :  false;
	var useRestorePotions =  profile != null ? profile.useRestorePotions :  false;
	var healPotionThreshold = 25;
	var useHealFriend = profile != null ? profile.useHealFriend :  false;
	var useHealPets = profile != null ? profile.useHealPets :  false;
	var healFriendThreshold = 75; // this is a percent
	var healFriendNames = [
		'BabbyShark',
		'MommyShark',
		'DaddyShark',
		'DootDoot',
		'PupperSnoot',
		'Ron',
		'Mozeltof',
		'Ricky',
		'[UWF]',
		'United We Fight',
		'eviathin',
		'Rotodolo'
	]
	// probably dont configure below here
	var timeBetweenLoops = 50; //time in ms between loop cycle
	var enemyTypes = 'gray|criminal|enemy|red'			; // 'gray | criminal | enemy | red'
	var maxEnemyDistance =  11;
	var useAttack = profile != null ? profile.useAttack : false;
	var humanoidNamesToAttack = [
		"Protector"
	];
	var minimumManaForSpells = 20;
	
	var useLootCorpses = profile != null ? profile.useLootCorpses :   false;
	var useInsureItem = profile != null ? profile.useInsureItem :   false;
	var useLootTMaps = profile != null ? profile.useLootTMaps :   false;
	
	var lootItems = {
		'0x400B': true, //shame crystals
		'0x0F87': true, // lucky coin
		'0x226F': true, //wraith form
		'0x2D51': true, //SW spell
		'0x2D52': true, //SW spell
		'0x2D53': true, //immolating weapon SW Spell
		'0x2D54': true, //SW spell
		'0x2D55': true, //SW Spell
		'0x2D56': true, //SW Spell
		'0x2D57': true, //SW Spell
		'0x2D58': true, //SW Spell
		'0x2D59': true, //SW Spell
		'0x2D5A': true, //SW Spell
		'0x2D5B': true, //SW Spell
		'0x2D5C': true, //SW Spell
		'0x2D5D': true, //SW Spell
		'0x2D5E': true, //word of death SW spell
		'0x2D5F': true, //Gift Of Life SW spell
		'0x2D60': true, //Gift Of Life SW spell
		'0x573E': true, //void Orion
		'0x5728': true, //void core
		//'0x0E21': true, //bandages
		'0x0F80': true, // demon bone
	}
	//constants
	
	var timeBetweenBows = 300000; // time in ms between bows (ensure keep logged in)
	var bandageBuffIcon = '0x7596';
	var agilityPotionBuffIcon = '0x753c';
	var strPotionBuffIcon = '0x7567';
	var disarmBuffIcon = '0x754a';
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
	
	var ChivHeal = function(){
		if(useChivHeal){
			if(Player.Poisoned() || Player.Hits() < (Player.MaxHits() - 30)){
				if(Player.Poisoned()){
					Orion.Cast('201'); //cure chiv
				} else {
					Orion.Cast('202'); //heal chiv
				}							
				if (Orion.WaitForTarget(1500))
					Orion.TargetObject(Player.Serial());
				Orion.Wait(200);
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
	
	var recoveredCorpse = false;

	var RecoverCorpse = function(){
		if(!recoveredCorpse){
			recoveredCorpse = true;
			var playerName = Player.Name();
			var corpses = Orion.FindType(any, any, ground, "", 2);
				 if (!corpses.length)
			    {
			        return;
			    }
			
			corpses.forEach(function(corpseId){
				var corpseObject =  Orion.FindObject(corpseId);
				if(!corpseObject) return;
				var props = corpseObject.Properties();
				if(props.indexOf(playerName) > -1 && corpseId !== Player.Serial()){
					Orion.Print("CORPSE FOUND");
					Orion.UseObject(corpseId);
				
				}
			})
		}
		
		  
	}
	var monsterNamesToIgnore = [
		"(summoned)",
		"(tame)",
		"(bonded)",
		"spectral armor",
		"Spectral Armor",
	];
	
	var GetTarget = function(){
		var typesToIgnore = {
			'0x0190': true, //human male
			'0x0191': true, //human female
			'0x025D': true, //elf male
			'0x025E': true, //elf female
			'0x029A': true, //garg male
			'0x029B': true, //garg Female
			'0x02E8': true, //vamp male,
			'0x02E9': true, //vamp female
			'0x02EB': true, //writh female
			'0x02EC': true, //wraith male	
		}
		var playerSerial = Player.Serial();
		var dist = 0;
		while(dist < maxEnemyDistance){
			var enemy = Orion.FindType("any", "any", "ground", "live|ignoreself|inlos", dist, enemyTypes);	
			dist = dist + 1;
			if(dist > 1 && dist !== maxEnemyDistance && dist % 2 === 1) continue;
		
			if(enemy && enemy.length > 0){	
				var firstEnemy = null;
					enemy.forEach(function(enemyId){
						if(firstEnemy) return;
						if(playerSerial === enemyId) return;
						var enemyObject = Orion.FindObject(enemyId);
						if(enemyObject){
							var props = enemyObject.Properties();				
							if(						
								monsterNamesToIgnore.filter(function(name){
										return props.indexOf(name) > -1;
								}).length === 0 
								&& 			
								(
									(!typesToIgnore[enemyObject.Graphic()] || useSkipTypesToIgnore) ||
									
									humanoidNamesToAttack.filter(function(name){
										return props.indexOf(name) > -1;
									}).length > 0
								)
							){
								firstEnemy = enemy;
								return;
							}
						}
						else {
							firstEnemy = enemy;
							return;
						}	
					})
					if(firstEnemy) return firstEnemy;								
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
	    		SetNextSpellTime(2000)
	    		//Orion.Wait(500) //handle fcr
	    	} else if(useDivineFury && !Orion.BuffExists('0x754d')){
	    		Orion.Cast('Divine Fury');
	    		SetNextSpellTime(2000);
	    		//Orion.Wait(500) //handle fcr
	    	} else if(useConsecrateWeapon && !Orion.BuffExists('0x75a7')){
	    		Orion.Cast('Consecrate Weapon');
	    		SetNextSpellTime(1500);
	    		//Orion.Wait(500) //handle fcr
	    	}    
	    }
	}
	
	
	
	
	
	var UseSpecials = function(){
		if(Player.Mana() > 20) {
	    	if(useMomentumStrike && !Orion.BuffExists('0x75fb')){
		    	Orion.Cast('Momentum Strike');
		    	Orion.Wait(250);  //there is a delay between using the skill and seeing the buff
	    	}
	    	if(useLightningStrike && !Orion.BuffExists('0x75fa')){
		    	Orion.Cast('Lightning Strike');
		    	Orion.Wait(250); //there is a delay between using the skill and seeing the buff
	    	}
	    	if(useSpecial){
	    		var weaponObject = Orion.ObjAtLayer('RightHand');
				if(!weaponObject) weaponObject = Orion.ObjAtLayer('LeftHand');
				if(!weaponObject) return;
				var props = weaponObject.Properties();
				
				if(primaryArmorIgnoreWeapons.filter(function(weapon){
						return props.indexOf(weapon) > -1;
					}).length > 0){
					if(!Orion.AbilityStatus('Primary')){
						Orion.UseAbility('Primary');
		    			Orion.Wait(250); //there is a delay between using the skill and seeing the buff
					}
					return;
				}
				
				if(secondaryArmorIgnoreWeapons.filter(function(weapon){
						return props.indexOf(weapon) > -1;
					}).length > 0){
					if(!Orion.AbilityStatus('Secondary')){
						Orion.UseAbility('Secondary');
		    			Orion.Wait(250); //there is a delay between using the skill and seeing the buff
					}
					return;
				}
				
				if(primaryWhirlwindWeapon.filter(function(weapon){
						return props.indexOf(weapon) > -1;
					}).length > 0){
					if(!Orion.AbilityStatus('Primary')){
						Orion.UseAbility('Primary');
		    			Orion.Wait(250); //there is a delay between using the skill and seeing the buff
					}
					return;
				}
				
	    		if(secondaryWhirlwindWeapon.filter(function(weapon){
						return props.indexOf(weapon) > -1;
					}).length > 0){
					if(!Orion.AbilityStatus('Secondary')){
						Orion.UseAbility('Secondary');
		    			Orion.Wait(250); //there is a delay between using the skill and seeing the buff
					}
					return;
				}
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
					
				if((isHitSpell || isLowerD) && isOverCapSplinter){
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
			
			
				if(isAntique || isBrittle){
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
	
				if(imbueSlotsOpen > 0 && (isHitSpell || isLowerD || isBokuto || isOverCapSplinter)){
					return true;
				} 
				else if(imbueSlotsOpen > 1){ //todo: we need to condition is imbueable here 
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
		var item = Orion.FindObject(itemId);
		if(!item) return false;
		
		
		//loot by type
		if(lootItems[item.Graphic()]) return true;
		
		var props = item.Properties();
			
			
		var isJewlery = props.indexOf('Ring') > -1 || props.indexOf('Bracelet') > -1;
		var is2hWeapon = props.indexOf('Two-handed Weapon') > -1;
		var is1hWeapon = props.indexOf('One-handed Weapon') > -1;
		var isArmor = props.indexOf("Physical Resist") > -1 &&  props.indexOf("Fire Resist") > -1 && props.indexOf("Cold Resist") > -1;
		
		
		//handle cursed items
		var cursed = 'Cursed';
		if(props.indexOf(cursed) > -1) return false;
		//exclude archery weapons (never seen a good one)
		var archery = 'Skill Required: Archery';
		if(props.indexOf(archery) > -1) return false;
		
		//I want to exclude weapons that will never be good
		if(is2hWeapon){ // I want to exclude all 2h except spears, ornate axes and hatchets
			if( 
				!(props.indexOf('Hatchet') > -1) && 
				!(props.indexOf( 'Spear') > -1 && props.indexOf('Weapon Speed 2.75') > -1) && 
				!(props.indexOf('Pitchfork') > -1) && 
				!(props.indexOf( 'No-Dachi') > -1) && 
				!(props.indexOf('Double Axe') > -1) && 
				!(props.indexOf('Bladed Staff') > -1 && props.indexOf('Double Bladed Staff') === -1) && 
				!(props.indexOf('Gnarled Staff') > -1)
			){
				return false;
			}
		}
		if(is1hWeapon) { //I want to exclude specific 1h weapons
			if(
				props.indexOf('Elven Machete') > -1 ||
				props.indexOf( 'Radiant Scimitar') > -1 || 
				props.indexOf('Wild Staff') > -1 ||
				props.indexOf( 'Lance') > -1 ||
				props.indexOf('Skinning Knife') > -1 ||
				props.indexOf('Sledge Hammer') > -1 ||
				props.indexOf('Cutlass') > -1
			){
				return false;
			}
		}
		
		//Handle max level Tmaps 
		if(useLootTMaps){
			var cache = " Cache";
			if(props.indexOf(cache) > -1) return true;
		}
		
		
		//Handle Named Jewlery
		if(isJewlery){
			//I do not want arcane Jewl of sorcery.
			if(props.indexOf("Arcane") > -1 && props.indexOf("Sorcery") > -1) return false;
		}
		
		if(ShouldKeepItem_Splinter(props)){
			 return true;
		} else if(is1hWeapon || is2hWeapon){ //if its  weapon and its not splinter I dont want it
			return false;
		}
	
		if(ShouldKeepItem_CheckCleanSsi(props, itemId)) return true;
		
		if(!isArmor && !isJewlery && !is2hWeapon && !is1hWeapon){
			//if(ShouldKeepItem_LuckShield(props)) return true;
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
		}
		
		//Handle Legendary
		if(props.indexOf('Legendary Artifact') > -1) return true;
		
		//Handle Major
		if(props.indexOf('Major Artifact') > -1){
			if(isJewlery){
				return true;
			}
			else {
				//return false; // we cant decide if we want to throw out majjor arti armor
			}
		}
	
		return false;
	}
	
	var insurableText = [
		"Of Fey Wrath",
		"Of The Archlich"
	];
	function CheckBackpackUninsuredItems(){
			var itemsInBag = Orion.FindType('any', 'any', 'backpack');
			itemsInBag.forEach(function(itemId){
				var itemObject = Orion.FindObject(itemId);
				if(!itemObject) return;
				var props = itemObject.Properties();
				if(props.indexOf("Insured") > -1) {
					return;
				}
				if(props.indexOf("Blessed") > -1) {
					return;
				}
				if(insurableText.filter(function(text){
					return props.indexOf(text) > -1;
				}).length > 0){
					InsureItem(itemId);
				}
			})
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
				var itemInstance = Orion.FindObject(item);
				if(itemInstance && itemInstance.Container() !== Player.Container() &&  itemInstance.Container() !== lootbag[0]){
					Orion.Print("Evaluate Item");
					var itemGraphic = itemInstance.Graphic();
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
						if(useInsureItem && !lootItems[itemGraphic]){
							 InsureItem(item);
						}
					}
					Orion.Ignore(item);
				}				
			});
			Orion.Print("Finish Evaluate Items");
			Orion.Ignore(corpseId);
		}
	}
	
	
	function HealPets(){
		if(useHealPets){
			var friendlys = Orion.FindType("any", "any", "ground", "mobile | ignoreself", '2', 'green | blue');		
			if(friendlys && friendlys.length > -1){
				friendlys.forEach(function(friendId){					
					if(Orion.BuffExists('healing skill') || Orion.BuffExists('veterinary')) return;
					var friendObject = Orion.FindObject(friendId);
					if(!friendObject) return;
					var friendProps = friendObject.Properties();
					if(friendProps.indexOf("(bonded)") === -1) return; 
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
							lastObjectUsedTime = new Date().getTime();
							Orion.Wait(100);
						}
					}
				})
			}
		}
	}

	function HealFriend(){
		if(useHealFriend){
			var friendlys = Orion.FindType("any", "any", "ground", "mobile | ignoreself", '2', 'green | blue');		
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
							lastObjectUsedTime = new Date().getTime();
							Orion.Wait(100);
						}
					}
				})
			}
		}
	}
	
	function HealChivFriend(){
		if(useHealChivFriend){
			var friendlys = Orion.FindType("any", "any", "ground", "mobile | ignoreself", '2', 'green | blue');		
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
							if (Orion.WaitForTarget(1500))
								Orion.TargetObject(friendObject.Serial());
							Orion.Wait(200);
						}
					}
				})
			}
		}
	}
	
	
	var Rearm = function(){
	
		var weaponObject = Orion.ObjAtLayer('RightHand');
		if(!weaponObject) weaponObject = Orion.ObjAtLayer('LeftHand');
		if(!weaponObject) {
			if( !Orion.BuffExists(disarmBuffIcon)){
				Orion.CreateClientMacro('EquipLastWeapon').Play(false, 1000);
			}
			
		};
	}

	var checkUninsuredCounter = 0;
	while(!Player.Dead()){
		Rearm();
		RecoverCorpse();
	    Bow();
	   	AttackTarget(GetTarget());
		Bandage();
		ChivHeal();
		HealFriend();
		HealPets();
		HealChivFriend();
		EnhancementPots();
		RestorePotions();
		CastSpells();
		UseSpecials();
	    CutCorpse();
	    LootCorpses();
	    if(checkUninsuredCounter > 200){
		    Orion.Print("CheckingUninsured");
	    	CheckBackpackUninsuredItems();
	    	checkUninsuredCounter = 0;
	    } else{
	    	checkUninsuredCounter = checkUninsuredCounter + 1;
	    }
	    
	    Orion.Wait(timeBetweenLoops);
	}
}

