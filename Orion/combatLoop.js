//Author: Jawetzel

//sample profile setup: 
//log on, in game open your characters profile.
//type in junk 
//if you want this character to follow someone 
//type in lead="Jiggily"

// After profile is setup select Autostart from the list of functions and run it

//#include Timeouts.js 
//#include LootEvaluator.js
//#include Survival.js
//#include Loot.js
//#include Utilities.js
//#include Rails.oajs

function Autostart()
{
	Startup();
}
Orion.IgnoreReset();
	
//To change what actions will be performed change these values
//To add options, add a a line from the all features to the profile you wish to change below
//To turn off options, delete the line from the profile you are modifying
//allFeatures: {
//			//chiv
//			useEnemyOfOne: true,			useDivineFury: true,			useConsecrateWeapon: true,
//			useChivHeal: true,					useHealChivFriend: true,
//			//combat
//			useAttack: true,						useSpecial: true,				useBandages: true,
//			useEnhancementPots: true,		useRestorePotions: true,	
//			useRunToTarget: true,
//			//Bushido
//			useLightningStrike: true,			useHonor: true,
//			useConfidence: true,				useEvasion: true,					
//			//Looting
//			useLootCorpses: true,
//			//Utility
//			useCutCorpses: true,			
//		}
var profileOptions = [
	{
		name: 'decsamp',
		options:  {
			useSpecial: true,
			useAttack: true,
			useVampForm: true,
			//useConfidence: true,
			//useEvasion: true,
			//useHonor: true,
			useRunToTarget: true,
			//useConsecrateWeapon: true,
		}
	},
	
	{
		name: 'junk',
		options:  {
			useSpecial: true,
			//useEnemyOfOne: true,
			//useDivineFury: true,
			//useConsecrateWeapon: true,
			//useLightningStrike: true,
			useAttack: true,
			useVampForm: true,
			useLootCorpses: true,
			useBandages: true,
			useSkipTypesToIgnore: true,
			//useIgnoreReset: true,
		}
	},	
	{
		name: 'toss',
		options:  {
			useSpecial: true,
			//useLightningStrike: true,
			//useEnemyOfOne: true,
			useAttack: true,
			useLootCorpses: true,
			useBandages: true,
			useSkipTypesToIgnore: true,
			//useRunToTarget: true,
			//useIgnoreReset: true,
			//useRunToTarget: true,
			useWraithForm: true,
			useLootTMaps: true
		}
	},
	{
		name: 'Archertamer',
		options: {
			useAttack: true,
			useSpecial: true,
			useChivHeal: true,
			//useHealChivFriend: true,
			useBandages: true,
			useLootCorpses: true,
			//useEnemyOfOne: true,
			//useDivineFury: true,
			//useConsecrateWeapon: true,
			useSkipTypesToIgnore: true,
			usePetCommands: true,
			useVampForm: true,
			useHonor: true,
			useIgnoreReset: true
		}
	},
	{
		name: 'ArcherP',
		options: {
			useAttack: true,
			useBandages: true,
			useSpecial: true,
		}
	},
]
	
// Features included that are not optional: 
//	Insures Looted Items
//	If Lightning strike is chosen will also momentum strike based on enemy Count
// If bandages is chosen it will Heal yourself and friends around you (if have healing)
// 	if bandages is chosen it will heal pets (if have vet)
//	Will auto recover corpse if found
//	will auto pick up gold on ground && bag of sending if available
//	Will auto trash items that are specified if by a house trash can
// 	will auto repair worn items if within range of a repair bench
//	will auto dress if the item slot is empty and you have the item in your bag you were wearing when script started (or last started)


var lootItemSets = {
	defaultItemSet: {
		'0x5747': true, //raptor teeth
		'0x400B': true, //shame crystals
		'0x0F87': true, // lucky coin
		'0x5748': true, //ichor
		'0x573E': true, //void Orion
		'0x5728': true, //void core
		'0x0E21': true, //bandages
		//'0x0EED': true, // gold
		
		'0x0F3F': true, //arrows
		'0x1BD1': true, // feathers
		
		'0x571C': true, // essence achivement
		'0x5744': true, //SS skin 
		'0x5731': true, //Undying Flesh
		'0x571C': true, //Essence Of Control
		'0x572C': true, //Goblin Blood
		'0x571C': true, //Essence Of Passion
		'0x572D': true, //Lava Serpent Crust
		
		'0x1844': true, //compassion sage
		
	}
}

// default profile - this will be overwritten in autostart
var profile = {};

function Startup(){
	
	Orion.Wait(5000);
	Orion.Print("Starting");
	var playerSerial = Player.Serial();
	var friendObject = Orion.FindObject(playerSerial);
	Orion.GetProfile(playerSerial, 3000);
	var profileRead = friendObject.ProfileReceived();
	Orion.GetProfile(playerSerial);
	var friendProfile = friendObject.Profile();
	SetLootItems(lootItemSets.defaultItemSet);
	
	if(friendProfile.length === 0){
		friendProfile = LastSuccessfullProfileRead();		
		Orion.Print("Failed To Read Profile, Last Successful Profile: ", friendProfile);
	} else {
		SaveSuccessfullProfileRead(friendProfile);
	}	
	
	var railDestOptions = {
		voidpool: 'voidpool',
		lurg: 'lurg',
		deceit: 'deceit'
	}
	
	if(friendProfile.indexOf('decsamp') > -1){
		Orion.Print("We are running deceit rail");
		Orion.Exec('ManageRails', false, ['deceit', false, true] );
	}
	
	// autostart setup rails
	if(friendProfile.indexOf('lurg') > -1){
		Orion.Print("We are running lurg rail");
		Orion.Exec('ManageRails', false, [railDestOptions.lurg, false] );
	}
	
	//Orion.Print("We are running voidpool rail");
	//Orion.Exec('ManageRails', false, [railDestOptions.voidpool, true] );

	var validProfiles = profileOptions.filter(function(profileName){
		if(friendProfile.indexOf(profileName.name) > -1){
			Orion.Print("Running Profile: " + profileName.name);
			profile = profileName.options;
		}
	})
	
	var profileLeadership = [];
	if(friendProfile != null && friendProfile.indexOf("lead=") > -1){
		var matches = /lead="([^"]*)"/.exec(friendProfile);
		Orion.Print("Person to follow: " + matches[1]);
		if(!matches || matches.length >= 2){
			profileLeadership.push(matches[1]);
		}
	}
	profile.leadership = profileLeadership;
	
	if(friendProfile.indexOf('ej') > -1){
		profile.isEj = true;
	}
	
	CombatLoop();
}

// Editing below is for advanced configuration only

function CombatLoop(){
	var healFriendNames = [
		'save me tom cruise', //a message can be put in player journal to identify a friend
		//'TWT'
		//'a', 'A', 'e', 'E', 'i', 'I', 'o', 'O', 'u', 'U' // this will mark everyone as a friend
	];
	profileOptions.forEach(function(option){
		healFriendNames.push(option.name);
	});
	Orion.Print("Friend Names We Are Looking for: " + healFriendNames);
	
	
	var humanoidNamesToAttack = [
		"Protector",
		"Exodus",
		"Champion",
		'Controller',
		'Squire',
		'Knight',
		'Master Of',
		'Black Order',
		'elite ninja',
		'Corsair', //Pirate event
		'Seawitch', //Pirate event
		'Marauder', //Pirate event
		'Scallywag', //Pirate event
		'Pillager', //Pirate event
		'Neira'
	];
	// will insurte items dropped in bag as artifacts
	SetItemsCheckBackpackUninsuredItems([
		"Of Fey Wrath",
		"Of The Archlich",
		'Exodus Summoning Rite',
		'Exodus Sacrificial Dagger',
		'Exodus Summoning Altar',
		'Robe Of Rite',
		'Plunderin', //Pirate event
		'Of The Shattered Sanctum',
		'Bearing The Crest Of Minax',
		"Defiler's Grasp",
		'Paladin Shield Of',
		'Paladin Hammer Of',
		'Paladin Cloak Of',
		'Paladin Fork Of',
		'Shadowblight Blooms',
		'Quiver Of The Elements',
		'Skull Of'
	]);
	
	UseHealPotionThreshold(25);
	SetHealFriendThreshold(60);
	var maxEnemyDistance =  8;
	SetDropOffItems([
		'Plunderin', 
		'Of The Shattered Sanctum',
		'Bearing The Crest Of Minax',
		'Paladin Shield Of',
		'Paladin Hammer Of',
		'Paladin Cloak Of',
		'Paladin Fork Of',
		'Shadowblight Blooms'
		]);
	
	// There isnt anything below this point you should need to change

	//if you want to cut corpses get a butchers war cleaver
	SetUseCutCorpses( profile != null ? profile.useCutCorpses :  false);
	
	//necro settings
	var useWraithForm = profile != null ? profile.useWraithForm :  false;
	var useVampForm = profile != null ? profile.useVampForm :  false;
	
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
		'Soul Glaive',
		"Shadow's Fury", //soul glaive
		'Composite Bow',
		'Boomerang',
		'Longsword',
		
	];
	var secondaryArmorIgnoreWeapons = [
		
		'Leafblade', 
		'Bokuto',
		'Katana',
		'Broadsword'
	];
	var primaryWhirlwindWeapon = [
		'Radiant Scimitar',
		'Magical Shortbow'
	];
	var secondaryWhirlwindWeapon = [
		'Double Axe'
	];
				
				
	//ninja
	var useDeathStrike = profile != null ? profile.useDeathStrike :  false;
	//bushido settings
	var useLightningStrike =profile != null ? profile.useLightningStrike :   false;
	var useHonor = profile != null ? profile.useHonor :  false;
	
	
	var useSkipTypesToIgnore =  profile != null ? profile.useSkipTypesToIgnore :  false;
	
	var useBandages =  profile != null ? profile.useBandages :  false;
	SetUseEnhancementPots(profile != null ? profile.useEnhancementPots :  false);
	SetUseRestorePotions(profile != null ? profile.useRestorePotions :  false);
	
	var usePetCommands = profile != null ? profile.usePetCommands :  false;
	var useConfidence =  profile != null ? profile.useConfidence :  false;
	var useEvasion = profile != null ? profile.useEvasion :  false;
	
	SetHealFriendNames(healFriendNames);
		
	// probably dont configure below here
	var timeBetweenLoops = 100; //time in ms between loop cycle
	var enemyTypes = 'gray|criminal|enemy|red|orange'			; // 'gray | criminal | enemy | red'
	
	var useAttack = profile != null ? profile.useAttack : false;
	var useRearm =  profile != null ? profile.useRearm : false;
	var useRunToTarget = profile != null ? profile.useRunToTarget : false;
	var MinDistToTarget = 5;
	var moveToBoundry = {
			//miny: 3580,
			//maxy: 3600,
			//minx: 475,
			//maxx: 500
		}
	
	var minimumManaForSpells = 20;
	var useLootCorpses = profile != null ? profile.useLootCorpses :   false;
	var useIgnoreReset= profile != null ? profile.useIgnoreReset :   false;
	SetUseInsureItem(true);
	SetUseLootTMaps(profile != null ? profile.useLootTMaps :   false);
	SetUseLootForFrags(profile != null ? profile.useLootForFrags :   false)
	SetuseLootEjGear(profile != null ? profile.ejGear :   false)
	
	// will trash items in house trash barrel
	SetAutoTrashItems({
		//Myrmidon Armor
		'0x13D4': 'Armor Set',					'0x13DB': 'Armor Set',
		'0x13D6': 'Armor Set',					'0x13DA': 'Armor Set',
		//Elven Leafweave
		'0x2B75': 'Armor Set',					'0x2B78': 'Armor Set',
		//Greymist Armor
		'0x13CB': 'Armor Set',					'0x13CC': 'Armor Set',	
		//'0x13C6': 'Armor Set'
		//Assassin Armor
		'0x13C6': 'Armor Set',					'0x13CC': 'Armor Set',
		'0x13CB': 'Armor Set',					'0x13C5': 'Armor Set',
		//Plate Of Honor
		'0x1411': 'Armor Set',					'0x1415': 'Armor Set',	
		//Death's Essence
		'0x13C6': "Armor Set",				'0x13CB': "Armor Set",
		//Hunter's Garb
		'0x2FC9': "Armor Set",				'0x2FC8': "Armor Set",
		
		'0x2D32': 'Blade Dance',				'0x2D33': 'Soul Seeker',
		'0x268A': 'Helm Of Swiftness',		'0x2FB7': 'Quiver Of Rage',
		'0x2D34': 'Talon Bite',					'0x2D23': 'Raed',
		'0x2D21': 'Flesh Ripper',				'0x2D2B': 'Windsong',
		'0x2D35': 'Righteous Anger',		'0x13BE': 'Fey Leggings',	
		'0x2FB8': 'Brightsight Lenses',		'0x1F04': 'Robe Of The Equinox',	
		'0x2D2A': 'Wildfire Bow',				'0x2D30': 'Bonesmasher',
		'0x2B6E': 'Aegis Of Grace',			'0x1F03': 'Robe Of The Eclipse',	
		'0x2D31': 'Boomstick',					'0x2F5A': 'Bloodwood Spirit',	
		'0x2307': 'Pads Of The Cu Sidhe','0x2F5B': 'Totem Of The Void',
		
		//voidpool drops
		'0x2B08': 'Breastplate Of Justice', 			'0x2B0A': 'Arms Of Compassion',
		'0x2B12': 'Sollerets Of Sacrifice', 				'0x13F5': 'Katrina',
		'0x3BB3': '10th Anniversary Sculpture', 	'0x1BC4': 'Sentinel',
		'0x2B0C': 'Gauntlets Of Valor', 					'0x13F8': 'Jaana',
		'0x2B10': 'Helm Of Spirituality',				'0x3BB5': 'Ankh Pendant',
		'0x0F61': "Dragon's End", 						'0x2B06': 'Legs Of Honor',
		'0x1BC3': "Lord Blackthorn's Exemplar", 	'0x3BB6': 'Map Of The Known World',
		'0x2B0E': 'Gorget Of Honesty',
		
		//air water earth fire
		//'0xAEA6': 'Paladin Shield Of ', '0xAEB5': 'Paladin Shield Of ', '0xAEC4': 'Paladin Shield Of ', '0xAED3': 'Paladin Shield Of ',			
		//'0xAEA4': 'Paladin Hammer Of ', '0xAEB3': 'Paladin Hammer Of ', '0xAEC2': 'Paladin Hammer Of ', '0xAED1': 'Paladin Hammer Of ',		
		//'0xAEA3': 'Paladin Cloak Of ', '0xAEB2': 'Paladin Cloak Of ', '0xAEC1': 'Paladin Cloak Of ', '0xAED0': 'Paladin Cloak Of ',
		//'0xAEA5': 'Paladin Fork Of ', '0xAEB4': 'Paladin Fork Of ', '0xAEC3': 'Paladin Fork Of ', '0xAED2': 'Paladin Fork Of ', 
		
		'0x46B3': 'Page Of Lore',
		
		//plant types
		//'0xA0DF': 'Shadowblight Blooms',
		
	});
	// will drop off items into secure bagball 
	
	SetRepairDurabilityMin(90);
	var leadership = profile != null ? profile.leadership :   null;
	//constants
	
	var isEj = profile != null ? profile.isEj :   null;
	
	var timeBetweenBows = 300000; // time in ms between bows (ensure keep logged in)
	SetLootBagType('0x0E79');
	
	
	var monsterNamesToIgnore = [
		"(summoned)",
		"(tame)",
		"(bonded)",
		"spectral armor",
		"Spectral Armor",
	];
	var redNamesToIgnore = [
		
		'skeletal dragon',
		'a lich lord',
		'a flesh golem',
		'a revenant',
		'TWT',
		'-OSG',
		'H+G',
		'*DPS',
		'CMC',
		'GRL.',
		'GLOW',
		'NOVA',
		'R^M',
		"(summoned)",
		"(tame)",
		"(bonded)",
	];	
	
	var ValidEnemysWithinTiles = function(dist, firstOnly){
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
			
			'0x09C4': true, //tiger form
			'0x00CD': true, //bunny
			'0x00EE': true, //rat
			'0x00C9': true, //cat
			//'0x0015': true, //snake
			'0x00DB': true, //ostard
			'0x0019': true, //wolf
			'0x007A': true, //unicorn
			'0x00D9': true, //dog
			'0x00DC': true, //llama
			//'0x00F6': true, //bake kitsune
			'0x0084': true, //ki-rin
		}
		var playerSerial = Player.Serial();
		var enemyIds = [];
		var enemy = Orion.FindType("any", "any", "ground", "live|ignoreself|inlos", dist, enemyTypes);	
		if(enemy && enemy.length > 0){	
			enemy.forEach(function(enemyId){
				if(firstOnly && enemyIds.length > 0) return;
				if(playerSerial === enemyId) return;
				var enemyObject = Orion.FindObject(enemyId);
				if(enemyObject){
					
					var props = enemyObject.Properties().toLowerCase();
					if(!props || props.length === 0) return;
					if(	enemyObject.Notoriety() === 6 &&
							redNamesToIgnore.filter(function(name){
								return props.indexOf(name.toLowerCase()) > -1;
							}).length > 0 
						){
							 return;
						}
					
					if(	monsterNamesToIgnore.filter(function(name){
								return props.indexOf(name.toLowerCase()) > -1;
							}).length > 0 
						) {
							 return;
						}
					if(!useSkipTypesToIgnore && 
					typesToIgnore[enemyObject.Graphic()] && 
					humanoidNamesToAttack.filter(function(name){
								return props.indexOf(name.toLowerCase()) > -1;
							}).length === 0
					)  {
							 return;
						}
					//Orion.Print(props);
					enemyIds.push(enemyId);
				}
				else {
					enemyIds.push(enemyId);
					return;
				}	
			})						
		}
		
		return enemyIds;
	}
	
	var LeaderToFollow = function() {
		if(  profile.leadership != null &&  profile.leadership.filter(function(name){
			if(Player.Properties().indexOf(name) > -1) return true;
			}).length > 0) return null;
		var friendlys = Orion.FindTypeEx("any", "any", "ground", "mobile|ignoreself|inlos", 10, 'green|blue');
		if(!friendlys || friendlys.length === 0) return null;
		friendlys = friendlys.filter(function(friend){
			if(!friend) return false;
			if(profile.leadership != null &&  profile.leadership.filter(function(name){
				var friendProps = friend.Properties();
				if(friendProps.indexOf(name) > -1) return true;
			}).length > 0) return true;
		});
		if(!friendlys || friendlys.length === 0) return null;
		if(Player.Serial() === friendlys[0].Serial())  return null;
		return friendlys[0].Serial();
	}
	
	var GetTarget = function(){
		var dist = 0;
		var enemies = [];
		var lastDist = 0;
		while(dist < maxEnemyDistance){
			if(enemies.length > 0){
				dist = dist + 1;
				continue;
			} 
			dist = dist + 1;
			if(dist > 1 && dist !== maxEnemyDistance && dist % 2 === 1) continue;
			enemies = ValidEnemysWithinTiles(dist, true);		
			lastDist = dist;
		}
		return enemies.length > 0 ? enemies[0] : null;
	}
	
	
	var lastEnemyHonored = null;
	var lastAttackTimestamp = 0;
	var AttackTarget = function(enemy){
		if(!enemy) return;
		 if(enemy){
		 	var enemyObject = Orion.FindObject(enemy);
			if(useHonor && (!lastEnemyHonored || lastEnemyHonored.toString() !== enemy.toString())){
				var enemyObject = Orion.FindObject(enemy);
				if(enemyObject){
					Orion.GetStatus(enemy);
					Orion.Wait(100);
					if(enemyObject.Hits() === 25){
						lastEnemyHonored = enemy;
						Orion.InvokeVirtue("Honor")
						Orion.WaitForTarget();
						Orion.TargetObject(enemy);
					}
				}
			}
			lastAttackTimestamp = new Date().getTime();
	    	Orion.Attack(enemy);
	    	if(useRunToTarget){
	    		var imLeadership = profile.leadership != null && profile.leadership.length > 0  && profile.leadership.filter(function(name){
						if(Player.Properties().indexOf(name) > -1) return true;
					}).length > 0;
	    		if(imLeadership || !LeaderToFollow()){
	    			var enemyObject = Orion.FindObject(enemy);
		    		if(enemyObject && !Orion.GetGlobal('moving')){
		    			var destX = enemyObject.X();
		    			var destY = enemyObject.Y();
		    			if(moveToBoundry.miny && destY < moveToBoundry.miny) destY = moveToBoundry.miny;
		    			if(moveToBoundry.maxy && destY > moveToBoundry.maxy) destY = moveToBoundry.maxy;
		    			if(moveToBoundry.minx && destX < moveToBoundry.minx) destX = moveToBoundry.minx;
		    			if(moveToBoundry.maxx && destX > moveToBoundry.maxx) destX = moveToBoundry.maxx;
		    			Orion.WalkTo(destX, destY, 1, MinDistToTarget, 255, 1, 1,  500);
		    		}
	    		}
	    		
		    	
	    	}
	    	
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
		if(Orion.FindObject(Orion.ClientLastAttack()) !== null && CanUseAnotherSpell() && Player.Mana() > minimumManaForSpells) {
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
	
	
	var lastMonsterCheck = null;
	var lastMonsterCheckMultiple = false;
	var UseSpecials = function(){
		if(Player.Mana() > 20) {
			if(useDeathStrike && !Orion.BuffExists('0x75fb')){
		    	Orion.Cast('Death Strike');
		    	Orion.Wait(2250);  //there is a delay between using the skill and seeing the buff
	    	}
	    	if(useLightningStrike){
	    		var enemies = [];
					var shouldCheckMonsters = true;
					if((Orion.BuffExists('0x75fb') || Orion.BuffExists('0x75fb'))){
						if(!(lastMonsterCheck == null || lastMonsterCheck + 1000 <  new Date().getTime())){
							shouldCheckMonsters = false;
							if(lastMonsterCheckMultiple !== null){
								enemies.push({});
								if(lastMonsterCheckMultiple){
									enemies.push({});
								}
							}
						}
					} else {
						if(!(lastMonsterCheck == null || lastMonsterCheck + 500 <  new Date().getTime())){
							shouldCheckMonsters = false;
							if(lastMonsterCheckMultiple !== null){
								enemies.push({});
								if(lastMonsterCheckMultiple){
									enemies.push({});
								}
							}
						}
					}
					
					if(shouldCheckMonsters){
						enemies = ValidEnemysWithinTiles(1);
						lastMonsterCheck = new Date().getTime();
						lastMonsterCheckMultiple = enemies.length === 0 ? null : enemies.length === 1 ? false : true;
					}
					
					if(enemies.length > 1){
						if(!Orion.BuffExists('0x75fb')){
							Orion.Cast('Momentum Strike');
			    			Orion.Wait(250);  //there is a delay between using the skill and seeing the buff
						}
						return;
					} else {
						if(!Orion.BuffExists('0x75fa')){
							Orion.Cast('Lightning Strike');
			    			Orion.Wait(250); //there is a delay between using the skill and seeing the buff
						}
						return;
					}
	    	}
	    	
	    	if(useSpecial){
	    		var weaponObject = Orion.ObjAtLayer('RightHand');
				if(!weaponObject) weaponObject = Orion.ObjAtLayer('LeftHand');
				if(!weaponObject) return;
				var props = weaponObject.Properties();
				
				if(props.indexOf('Double Axe') > -1){
								
					
					var enemies = [];
					var shouldCheckMonsters = true;
					if((Orion.AbilityStatus('Secondary') || Orion.AbilityStatus('Primary'))){
						if(!(lastMonsterCheck == null || lastMonsterCheck + 1000 <  new Date().getTime())){
							shouldCheckMonsters = false;
							if(lastMonsterCheckMultiple !== null){
								enemies.push({});
								if(lastMonsterCheckMultiple){
									enemies.push({});
								}
							}
						}
					} else {
						if(!(lastMonsterCheck == null || lastMonsterCheck + 500 <  new Date().getTime())){
							shouldCheckMonsters = false;
							if(lastMonsterCheckMultiple !== null){
								enemies.push({});
								if(lastMonsterCheckMultiple){
									enemies.push({});
								}
							}
						}
					}
					
					if(shouldCheckMonsters){
						enemies = ValidEnemysWithinTiles(2);
						lastMonsterCheck = new Date().getTime();
						lastMonsterCheckMultiple = enemies.length === 0 ? null : enemies.length === 1 ? false : true;
					}
					
					if(enemies.length > 1){
						if(!Orion.AbilityStatus('Secondary')){
							Orion.UseAbility('Secondary');
			    			Orion.Wait(250); //there is a delay between using the skill and seeing the buff
						}
						return;
					} else {
						if(!Orion.AbilityStatus('Primary')){
							Orion.UseAbility('Primary');
			    			Orion.Wait(250); //there is a delay between using the skill and seeing the buff
						}
						return;
					}
				}
				
				
				
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
		bowCounter++;
		if(bowCounter > (timeBetweenBows / timeBetweenLoops)){
	        bowCounter = 0;	     
	        Orion.EmoteAction('bow');
	    }
	}
	
	var lastPetCommand = 0;
	var PetCommands = function(){
		lastPetCommand++;
		if(lastPetCommand > (timeBetweenBows / timeBetweenLoops)){
	        Orion.Say('All follow me');
			Orion.Say('All guard me');
			lastPetCommand = 0;	     
	    }	
	}	
	
	var NecroForm = function() {
		if(useWraithForm || useVampForm) {
			var skill = Orion.SkillValue('necromancy');
			if(skill < 400) return;
			if(Player.LRC() < 5) return;
			if(Player.Mana() < 12) return;
			if(useWraithForm){
				if(!Orion.BuffExists('wraith form')) {
					Orion.Cast('wraith form');
					Orion.Wait(500);
				}
			}
			if(skill < 990) return;
			if(useVampForm){
				if(!Orion.BuffExists('vampiric embrace')) {
					Orion.Cast('vampiric embrace');
					Orion.Wait(500);
				}
			}
		}
	}
	
	
	var timeBetweenFollowChecks = 5000;
	var lastFollowCheck = 0;	
	var FollowTheLeader = function (){
		if(!leadership || leadership.length === 0) return;
		var nowTime = new Date().getTime();
		var deltaTime = nowTime - lastFollowCheck;
		if(deltaTime < timeBetweenFollowChecks){
			return;
		}
		lastFollowCheck = nowTime;
		
		if( leadership.filter(function(name){
			if(Player.Properties().indexOf(name) > -1) return true;
			}).length > 0) return;
			
		var noFriends = false;
		var foundLeader = LeaderToFollow();
		if(!foundLeader){
			var holes = Orion.FindTypeEx("0x1775", "any", "ground", "mobile|ignoreself|inlos", 2, 'green|blue');
			if(holes && holes.length > 0){
				var validHoles = holes.filter(function(hole){
					if(hole.Properties().indexof('A Hole') > -1){
						return true;					
					}
				})
				if(validHoles && validHoles.length > 0){
					Orion.UseObject(validHoles[0].Serial);
					Orion.Wait(3000);
					return;
				}
			}
		}
		
		foundLeader = LeaderToFollow();
		if(noFriends){
			return;
		}
		
		Orion.Follow(foundLeader);
	}
	
	
	
	var autoAcceptRez = function(){
		var gump0 = Orion.GetGump('last');
       if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x000008AF')) {
           gump0.Select(Orion.CreateGumpHook(2));
           Orion.Wait(5000); // Wait for resurrection process
           Orion.Print("Resurrection complete or attempted.");
           return; // Exit after successful interaction
       }
	}
	
	
	

	var HideWhenIdle = function(){
		var deltaTime = new Date().getTime() - lastAttackTimestamp;
		if(deltaTime < 45000) return;
		if(Player.Hidden()) return;
		var skill = Orion.SkillValue('hiding');
		if(skill < 250) return;
		Orion.Print("Attempting Hide");
		Orion.UseSkill('hiding');
		Orion.Wait(2000);
	}
	

	var checkUninsuredCounter = 0;
	var lastIgnoreResetTime = null;
	var firstRunSaveDress = false;
	while(true){
		if(Player.Dead()){
			autoAcceptRez();
			Orion.Wait(200);
			continue;
		}
		if(firstRunSaveDress === false){
			firstRunSaveDress = true;
			SaveDressSet();		
		}
		//Rearm();
	    Bow();
	   	if(useAttack) AttackTarget(GetTarget());
	   	if(useBandages) HealFriend(WaitForObjectTimeout, RegisterUseObjectTimeout);
		if(useBandages) UseBandages(WaitForObjectTimeout, RegisterUseObjectTimeout);
		if(useChivHeal) ChivHeal();
		
		if(useBandages) HealPets(WaitForObjectTimeout, RegisterUseObjectTimeout);
		if(usePetCommands) PetCommands();
		if(useHealChivFriend) HealChivFriend();
		if(useConfidence) UseConfidence();
		if(useEvasion) UseEvasion();
		EnhancementPots(RegisterUseObjectTimeout, WaitForObjectTimeout);
		RestorePotions(RegisterUseObjectTimeout, WaitForObjectTimeout);
		CastSpells();
		UseSpecials();
	    if(useLootCorpses) {
	    	 LootCorpses(WaitForObjectTimeout, RegisterUseObjectTimeout, ShouldKeepItem);
	    	 
	    }
	    if(checkUninsuredCounter > (2 * 60 * 1000) / timeBetweenLoops){
	    	if(useIgnoreReset && (!lastIgnoreResetTime || lastIgnoreResetTime + 150000 <  new Date().getTime())){
				Orion.IgnoreReset();
				Orion.Print("Resetting Ignore");
				lastIgnoreResetTime = new Date().getTime();	
			}
	    	CheckBackpackUninsuredItems();
	    	checkUninsuredCounter = 0;
	    } else{
	    	checkUninsuredCounter = checkUninsuredCounter + 1;
	    }
	    LootGoldGround(WaitForObjectTimeout, RegisterUseObjectTimeout);	    
	    AutoTrashItems();
	    if(!isEj) ItemDropOff();
	     if(!isEj) RestockArrows();
	    AutoRepair();
	    RecoverCorpse();
	    WhyAreWeNaked();
	    NecroForm();
 	    if(useBandages && !isEj) ResockBandages();
	    FollowTheLeader();
	    HideWhenIdle();
	    Orion.Wait(timeBetweenLoops);
	}
}


