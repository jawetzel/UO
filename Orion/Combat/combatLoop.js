//Orion.Print(Orion.InfoBuff()) //for use in identifying buffs
//Orion.Print(Orion.AbilityStatus('Primary'))

//chiv settings
var useEnemyOfOne = true;
var useDivineFury = false;
var useConsecrateWeapon = false;

//combat settings
var usePrimary = false;
var useSeccondary = false;

//bushido settings
var useMomentumStrike = false;
var useLightningStrike = false;
var useHonor = true;


// probably dont configure below here
var timeBetweenLoops = 250; //time in ms between loop cycle
var enemyTypes = 'gray | criminal | enemy | red'			; // 'gray | criminal | enemy | red'
var maxEnemyDistance =  8;

//defenately dont configure below here
var timeBetweenBows = 300000; // time in ms between bows (ensure keep logged in)

var lastEnemyHonored = null;

var useTrainTaming = true;

function TrainTaming()
{
	Orion.Cast('744');
	if (Orion.WaitForTarget(2000))
		Orion.TargetObject('0x02B90880');
	if (Orion.WaitForGump(2000))
	{
		var gump0 = Orion.GetGump('last');
		if ((gump0 !== null) && (!gump0.Replayed()) && (gump0.ID() === '0x00112333'))
		{
			gump0.Select(Orion.CreateGumpHook(0));
			Orion.Wait(100);
		}
	}
	Orion.Wait(1500);
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

var bowCounter = 0;
while(true){
    if(bowCounter > timeBetweenBows / timeBetweenLoops){
        bowCounter = 0;
        Orion.EmoteAction('bow');
    }
    
    									
    var enemy = GetTarget();
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
    	if(useTrainTaming){
    		TrainTaming();
    	}
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
