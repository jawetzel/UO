function trainMagery() {
    const castSpellDelay = 200;
    const skillValueGoal = 1000;
    var skillValue = Orion.SkillValue('magery', 'base');

    while (skillValue < skillValueGoal) {
    if(Player.Mana() > 40){
    	if(skillValue < 450)
    		var spell = "Bless";
        else if (skillValue < 550)
            var spell = 'Greater Heal';
        else if (skillValue < 700)
            var spell = 'Invisibility';
        else
            var spell = 'Mana Vampire';
            
        Orion.Cast(spell);
        Orion.WaitForTarget(5000);
        Orion.Wait(100);
		Orion.TargetObject(Player.Serial());
        Orion.Wait(castSpellDelay);

        skillValue = Orion.SkillValue('magery', 'base');
    }
    

    }
}

trainMagery();