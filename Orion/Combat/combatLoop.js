//Orion.Print(Orion.InfoBuff()) //for use in identifying buffs
//Orion.Print(Orion.AbilityStatus('Primary'))

//chiv settings
var useEnemyOfOne = false;
var useDivineFury = false;
var useConsecrateWeapon = false;

//combat settings
var usePrimary = false;
var useSeccondary = true;

//bushido settings
var useMomentumStrike = false;
var useLightningStrike = false;
var useHonor = false;


// probably dont configure below here
var timeBetweenLoops = 250; //time in ms between loop cycle
var enemyTypes = 'gray | criminal | enemy | red'			; // 'gray | criminal | enemy | red'
var maxEnemyDistance =  "8";

//defenately dont configure below here
var timeBetweenBows = 300000; // time in ms between bows (ensure keep logged in)

var lastEnemyHonored = null;

var bowCounter = 0;
while(true){
    if(bowCounter > timeBetweenBows / timeBetweenLoops){
        bowCounter = 0;
        Orion.EmoteAction('bow');
    }
    
    									
    var enemy = Orion.FindType("-1 | !0x0191 | !0x0190 ", -1, "ground", "mobile | near | ignorefriends", maxEnemyDistance, enemyTypes);
    if(enemy && enemy.length > 0){
		if(useHonor && (!lastEnemyHonored || lastEnemyHonored.toString() !== enemy.toString())){
			lastEnemyHonored = enemy;
			Orion.InvokeVirtue("Honor")
			Orion.WaitForTarget();
			Orion.TargetObject(enemy);
		}
    	Orion.Attack(enemy[0]);
    }
	//Orion.KeyPress('')
    if(Player.Mana() > 20) {
    	if(useEnemyOfOne && !Orion.BuffExists('0x754e')){
    		Orion.Cast('Enemy of One');
    		 Orion.Wait(1500);
    	} else if(useDivineFury && !Orion.BuffExists('0x754d')){
    		Orion.Cast('Divine Fury');
    		 Orion.Wait(1250);
    	} else if(useConsecrateWeapon && !Orion.BuffExists('0x75a7')){
    		Orion.Cast('Consecrate Weapon');
    		 Orion.Wait(1000);
    	}
    	if(useMomentumStrike && !Orion.BuffExists('0x75fb')){
	    	Orion.Cast('Momentum Strike');
    	}
    	if(useLightningStrike && !Orion.BuffExists('0x75fa')){
	    	Orion.Cast('Lightning Strike');
    	}
    	if(usePrimary && !Orion.AbilityStatus('Primary')){
	    	Orion.UseAbility('Primary');
    	}
    	if(useSeccondary && !Orion.AbilityStatus('Secondary')){
	    	Orion.UseAbility('Secondary');
    	}
    	
        
    }
    Orion.Wait(timeBetweenLoops);
}
