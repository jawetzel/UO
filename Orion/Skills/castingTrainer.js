var InitialSkill = "Chivalry";


var spellName = '';
var timeout = 2000;
var minMana = 20;


var chivSpells = [
    {
        name: "Concecrate Weapon",
        minSkill: 150,
        mana: 15,
        timeout: 750
    },
    {
        name: "Divine Fury",
        minSkill: 275,
        mana: 20,
        timeout: 1000
    },
    {
        name: "Enemy of One",
        minSkill: 475,
        mana: 25,
        timeout: 1250
    },
    {
        name: "Holy Light",
        minSkill: 650,
        mana: 15,
        timeout: 1750
    },
    {
        name: "Noble Sacrifice",
        minSkill: 750,
        mana: 25,
        timeout: 2000
    }
]

var necroSpells  = [{
    name: "Wraith Form",
    minSkill: 200,
    mana: 20,
    timeout: 2000
},
    {
        name: "Horrific Beast",
        minSkill: 450,
        mana: 15,
        timeout: 2500
    },
    {
        name: "Lich Form",
        minSkill: 725,
        mana: 30,
        timeout: 3000
    }
];

var spells = chivSpells;

function  SetSpellAndTimeout(){
    var skill = Orion.SkillValue(InitialSkill);
    if(skill === 1000) {
        return false;
    }
    var canCast = spells.filter(function(x){
        return x.minSkill <= skill;
    })
    var spellToUse = canCast[canCast.length -1]
    spellName = spellToUse.name;
    timeout = spellToUse.timeout;
    minMana = spellToUse.mana;
    return true;
}


var counter = 0;

while(SetSpellAndTimeout()){
    if(counter > 20){
        counter = 0;
        Orion.EmoteAction('bow');
    }
    if(Player.Mana() > minMana) {
        Orion.Cast(spellName);
    }
    counter++;
    Orion.Wait(timeout);
}