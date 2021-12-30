var useEnemyOfOne = true;
var useMomentumStrike = true;


// probably dont configure below here
var timeBetweenLoops = 250; //time in ms between loop cycle
var enemyTypes = 'gray | enemy'; // 'gray | criminal | enemy | red'
var maxEnemyDistance =  "15";

//defenately dont configure below here
var timeBetweenBows = 300000; // time in ms between bows (ensure keep logged in)


var bowCounter = 0;
while(true){
    if(bowCounter > timeBetweenBows / timeBetweenLoops){
        bowCounter = 0;
        Orion.EmoteAction('bow');
    }
    var enemy = Orion.FindType("-1 | !0x0191 | !0x0190 ", -1, "ground", "mobile | near | ignorefriends", maxEnemyDistance, enemyTypes);
	Orion.Attack(enemy[0]);
    if(Player.Mana() > 20) {
    	if(useEnemyOfOne && !Orion.BuffExists('0x754e')){
    		Orion.Cast('Enemy of One');
    		 Orion.Wait(1500);
    	}
    	if(useMomentumStrike && !Orion.BuffExists('0x75fb')){
	    	Orion.Cast('Momentum Strike');
    	}
        
    }
    Orion.Wait(timeBetweenLoops);
}
