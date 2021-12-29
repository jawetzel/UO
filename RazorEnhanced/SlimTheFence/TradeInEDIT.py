################/ 'THIS IS A SCRIPT TO AUTOMATE THE TRADE QUEST TO SLIM THE FENCE' \##########################
###############(                        'WRITTEN BY MOURN'                         )##########################
###############\                     Mourn(8182) discord contact                  /###########################


### THIS IS DESIGNED FOR A NOOB CHAR!!! DO NOT CARRY ANYTHING UNNECESSARY IN YOUR BAG!!!!!!!!!
### IT WILL GET TOSSED!!!!!!!!!!!!

### After all below is set, start near trade minister, in new magincia fel

### start char with 50 tailor, 50 magery, use jewls to get to 80 Magery!!! buy up tinker to 33
### Will AUTO TRAIN TO 54 tailoring at start to make everything necessary

### need a SINGLE RUNIC ATLAS in backpack with near trade minister as FIRST rune
### SECOND rune, JUST SOUTH OF UR HOUSE STEPS, after u run north the PINK BOOK AND GARBAGE within two tiles!

### need to purchase SALVAGE BAG from provisoner
### need to have have a PLAYER MADE TINKER TOOL, no NOOBIE TINKER TOOLS IN BAG!
### need insured SCISSORS
### need LRC SUIT
### always run on in uo settings

### need BUY AGENTS with correct names and ids,
### add them under enhanced agents vendor buy by name
### set ALL at 5, Except cloth and leather at 10, ingots at 50.
### SEARCH AT TOP FOR "BuyAgent" to find their names,
### target that item type to add to agent in app, or use the idtocheck to manually enter
 
Misc.SendMessage('Version 4.2',56)

### REQUIRED!!!
### MAKE FILTERS WORK BY NAME
### Need tokuno boat matching name in filter below, default: "Smuggler"

from System import Byte
from System.Collections.Generic import List
from System import Random
from System.Text import Encoding
import sys
sys.path.append(r'C:\Program Files (x86)\IronPython.StdLib.2.7.9')
import os

boatname = 'Smuggler'          # YOUR BOAT NAME

shard = Misc.ShardName()
Player.HeadMessage(86, "I reckon i'm on " + shard)

if Misc.ShardName() == 'Sonoma':                              #add another for ur shard or send me data
    minister = 'Damien'        # new mag trade minister name  
    tailorname = 'Trisha'      # new mag tailor name
    blacksmithname = 'Ardath'  # new mag blacksmith name
    tannername = 'Goodman'     # occlo tanner name
    weavername = 'Yolie'       # new mag weaver name

if Misc.ShardName() == 'Baja':
    minister = 'Ralph'      
    tailorname = 'Catalina'    
    blacksmithname = 'Daisy'
    tannername = 'Ross'  
    weavername = 'Marsten'
   
if Misc.ShardName() == 'Catskills':
    minister = 'Timothy'      
    tailorname = 'Olin'    
    blacksmithname = 'Elton'
    tannername = 'Sheila'  
    weavername = 'Drew'
   
if Misc.ShardName() == 'Napa Valley':
   minister = 'Patton'
   tailorname = 'Ephraim'
   weavername = 'Franek'
   blacksmithname = 'Lee'
   tannername = 'Allan'

if Misc.ShardName() == 'Arirang':
    minister = 'Blair'      
    tailorname = 'Shelby'    
    blacksmithname = 'Niola'
    tannername = 'Ahara'  
    weavername = 'Harry'
    provisionername = 'Errol'
   
if Misc.ShardName() == 'Chesapeake':
    minister =  'Marcus'
    tailorname = 'Ramsay'
    blacksmithname = 'Lawrence'
    tannername = 'Maddy'
    weavername = 'Oren'
    provisionername = 'Dwayne'
   
salvbag = Items.FindByID(0x0E76, 0x024E,Player.Backpack.Serial)

if BuyAgent.Status() == False:
    BuyAgent.Enable()

ScissorsID = 0x0F9E
BoltClothID = 0x0F96
CutClothID = 0x1766
TinkerToolsID = 0x1EB9

containers = [0x0E3E,0x0E3D,0x0E42,0x0E41,0x0E3C,0x0E43,0x0FAE,0x0E3F,0x0E40]

dontCount = ["wooden chest","large crate","medium crate","metal chest","crate","small crate",
"contents: 0/125 items, 0/1000 stones","lifespan: 23 hours","lifespan: 24 hours","weight reduction: 75%","weight: 10 stones","no-trade",
"destination city: jhelom","destination city: minoc","destination city: yew","destination city: britain",
"destination city: skara brae","destination city: moonglow","destination city: vesper",
"destination city: trinsic", "Weight", "Destination City", "No-Trade", "Contents", "Weight Reduction"]

docount =[]

craftabletailor = ["cap","scissors","jester suit","robe","wide-brim hat","plain dress","tall straw hat","doublet",
"short pants","fancy shirt","long pants","fancy dress","skirt","kilt","half apron","cloak","tunic",
"jester hat","floppy hat","straw hat","wizard's hat","feathered hat","tricorne hat","bandana",
"skullcap","leather cap","sewing kit"]


buyonlytailor = ["spool of thread","flax bundle","dyeing tub","dyes","pile of wool",
"bolt of cloth","cut cloth","bale of cotton","cloth"]

buyonlyprovisioner = ["Cooked Bird","Candle","Scepter","Garlic","Bladed Staff","War Hammer","Backpack","Bread Loaf","Backgammon Game",
"A Checker Board","Mahjong Game","Spear","Oil Flask","Torch","Crook","Salvage Bag","A Jug Of Cider","Bag",
"Skin Tingeing Ticture","Lockpick","Chicken Leg","Ginseng","Pear","Beeswax","Copper Key","Empty Bottle","Pouch",
"Wooden Box","Short Spear","Club","Gnarled Staff","Dice And Cup","Quarter Staff","Maul","Mace","Kindling",
"Black Staff","Arrow","crossbow bolt","Bedroll","Apple","Lantern","Small Ship Deed","War Mace","Bagball",
"Bagball2","A Bottle Of Ale","Leg Of Lamb","A Chessboard","A Bottle Of Liquor","A Plant Bowl","Book","Book1","Hair Dye"]

salv = [0x1715, 0x1F9F, 0x1F03, 0x1714, 0x1F01, 0x1716, 0x1F7B, 0x152E, 0x1EFD, 0x1539, 0x1EFF, 0x1516, 0x1537, 0x153B,
  0x1515, 0x1FA1, 0x171C, 0x1713, 0x1717, 0x1718, 0x171A, 0x171B, 0x1540, 0x1544, 0x1DB9]
 
manualmove = ["spool of thread","flax bundle","pile of wool","bolt of cloth","cut cloth","bale of cotton","cloth","Cooked Bird","Garlic",
"Bread Loaf","Lockpick","Chicken Leg","Ginseng","Pear","Beeswax","Empty Bottle","Kindling","Arrow","crossbow bolt","Apple","Leg Of Lamb"]

stocklist = [0x0FA9, 0x0FAB, 0x1DB9, 0x0DBA]  

keeplist =[TinkerToolsID, CutClothID, 0x14EF, 0x9C16, ScissorsID, 0x0F9D, 0x1BF2, 0x0E76, 0x14F4, 0x279D, 0x0FBE, 0x14ED, 0x139D, 0x139B, 0x139A,
0x139C, 0x277A, 0x22C5, 0x2252, 0x0EFA, 0x225A, 0x2779, 0x1081]

mempos = [0x277A, 0x279D, 0x14ED, 0x139D, 0x139C, 0x139B, 0x139A, 0x139E, 0x0FBE, 0x2779]
 


SFilter = Mobiles.Filter()
SFilter.RangeMax = 13
SFilter.Name = 'Slim the Fence'
SFilter.Enabled = True

BFilter = Mobiles.Filter()
BFilter.RangeMax = 12
BFilter.Name = 'Smugglar'
BFilter.Enabled = True

MFilter = Mobiles.Filter()
MFilter.RangeMax = 12
MFilter.Name = minister  
MFilter.Enabled = True

TFilter = Mobiles.Filter()
TFilter.RangeMax = 12
TFilter.Name = weavername 
TFilter.Enabled = True

FFilter = Mobiles.Filter()
FFilter.RangeMax = 12
FFilter.Name = tailorname  
FFilter.Enabled = True

BSFilter = Mobiles.Filter()
BSFilter.RangeMax = 12
BSFilter.Name = blacksmithname
BSFilter.Enabled = True

LFilter = Mobiles.Filter()
LFilter.RangeMax = 12
LFilter.Name = tannername
LFilter.Enabled = True

PVFilter = Mobiles.Filter()
PVFilter.RangeMax = 12
PVFilter.Name = provisionername
PVFilter.Enabled = True


RFilter = Items.Filter()
RFilter.RangeMax = 12
RFilter.OnGround = True
RFilter.Enabled = True
RFilter.Movable = False
ropeid = List[int]((0x14FA, 0x14FA))  
RFilter.Graphics = ropeid

GFilter = Items.Filter()
GFilter.RangeMax = 5
GFilter.OnGround = True
GFilter.Enabled = True
GFilter.Movable = True
garbagecan = List[int]((0x0E77, 0x0E77))  
GFilter.Graphics = garbagecan

PFilter = Items.Filter()
PFilter.RangeMax = 5
PFilter.OnGround = True
PFilter.Enabled = True
PFilter.Movable = False
pinkbook = List[int]((0x577E, 0x577E))
PFilter.Graphics = pinkbook

CFilter = Items.Filter()
CFilter.RangeMax = 5
CFilter.OnGround = True
CFilter.Enabled = True
CFilter.Movable = False
container = List[int]((0x09AA, 0x09AA))  
CFilter.Graphics = container
   
def gotoLocation(x1, y1):
    Coords = PathFinding.Route()
    Coords.X = x1
    Coords.Y = y1
    Coords.MaxRetry = -1
    PathFinding.Go(Coords)
 
def gotoRandomLoc(x1,y1):
    Coords = PathFinding.Route()
    x1 = x1 + rnd.Next(-1, 1)    
    y1 = y1 + rnd.Next(-1, 1)
    Coords.X = x1
    Coords.Y = y1    
    Coords.MaxRetry = -1
    PathFinding.Go(Coords)
           
railCoords1 = [[3676, 2271],[3676, 2290],[3675, 2296],[3649, 2296]]  
railCoords2 = [[3655, 2413],[3655, 2416]]
railCoords3 = [[3655, 2462],[3656, 2492],[3654, 2527],[3654, 2575],[3654, 2613],[3662, 2651]]

amountInBag = 0
have = 0
need = 0
global idtocheck
idtocheck = 1
Journal.Clear()
trytobuy = 0
amountcomplete = 0
kit = Items.FindByID(0x0F9D, -1,Player.Backpack.Serial)
global runswithoutdump
runswithoutdump = 0
rnd = Random()
trytoplace = 0
ingots = 0x1BF2

def getPropertiesAsString(self, item):
        Items.WaitForProps(item, 1000)
        lines = Items.GetPropStringList(item)
        result = []
       
def recall(runenumber):
    Misc.Pause(1000)
    newrunenumber = 49999 + runenumber  
    Items.UseItemByID(0x9C16)
    Misc.Pause(1000)
    Gumps.WaitForGump(498, 3000)
    Gumps.SendAction(498, newrunenumber)
    Gumps.WaitForGump(498, 3000)
    Gumps.SendAction(498, 4000)
    newrunenumber = 0
    Misc.Pause(4000)
    if Journal.Search('fizzles.') == True or Journal.Search('reagents') == True:
        Journal.Clear()
        Misc.Pause(1000)
        recall(runenumber)
               
def checkIngots():    
    if Items.BackpackCount(0x1BF2, -1) < 12:        
        Player.HeadMessage(45,"Ingots out in Resource Container")
        gototailor()
        blacksmiths = Mobiles.ApplyFilter(BSFilter)        
        BuyAgent.ChangeList('ingots')
        Misc.Pause(1000)
        BS = Mobiles.Select(blacksmiths, 'Nearest')
        Misc.WaitForContext(BS, 10000)
        Misc.ContextReply(BS, 110)
        Misc.Pause(2000)
       
def checkleather():
    if Items.BackpackCount(0x1081, -1) <= 39:
        Player.HeadMessage(42,'Well shit fire!, Used up my dang leather!')
        gotoLocation(3649, 2622)
        gotoLocation(3625, 2621)
        gotoLocation(3608, 2611)
        if Misc.ShardName() == 'Baja':
                gotoLocation(3608, 2617)
       
        leatherguys = Mobiles.ApplyFilter(LFilter)        
        BuyAgent.ChangeList('leather')
        Misc.Pause(1000)
        while Items.BackpackCount(0x1081, -1) < 40:
            leatherguy = Mobiles.Select(leatherguys, 'Nearest')
            Misc.WaitForContext(leatherguy, 10000)
            Misc.ContextReply(leatherguy, 110)
            Misc.Pause(2000)
       
def checkTinkerTool():
    while Items.BackpackCount(TinkerToolsID, -1) < 2:
        Misc.Pause(600)
        checkIngots()
        Misc.Pause(1100)
        Items.UseItemByID(TinkerToolsID, -1)
        Gumps.WaitForGump(460, 10000)
        Gumps.SendAction(460, 9003)
        Gumps.WaitForGump(460, 10000)
        Gumps.SendAction(460, 11)
        Gumps.WaitForGump(460, 10000)
        Gumps.SendAction(460, 0)
        Misc.Pause(2200)
       
def checkSewingKit():
    checkIngots()
    while Items.BackpackCount(0x0F9D, -1) < 3:
        Player.HeadMessage(45,"Haint got nuff sewin kits")  
        Items.UseItemByID(TinkerToolsID)
        Gumps.WaitForGump(460, 10000)
        Gumps.SendAction(460, 14)
        Misc.Pause(800)

def checkcloth():        
    if Items.BackpackCount(CutClothID, -1) < 100:
        Player.HeadMessage(45,"I'd smoke a bowl if i wasn't out of cloth")
        gototailor()
        weavers = Mobiles.ApplyFilter(TFilter)        
        BuyAgent.ChangeList('cloth')
        Misc.Pause(1000)
        weaver = Mobiles.Select(weavers, 'Nearest')
        Misc.WaitForContext(weaver, 10000)
        Misc.ContextReply(weaver, 110)
        Misc.Pause(2000)
        
        if Items.BackpackCount(ScissorsID, -1) == 0:
            checkIngots()
            checkTinkerTool()
            Misc.SendMessage("need scissors",30)
            Items.UseItemByID(TinkerToolsID) 
            Gumps.WaitForGump(460, 10000)
            Gumps.SendAction(460, 8)
        Items.UseItemByID(ScissorsID)
        Target.WaitForTarget(3000,False) 
        bolts = Items.FindByID(BoltClothID,-1,Player.Backpack.Serial)
        Target.TargetExecute(bolts)
       
def start():
    global propnum
    global alreadygotit
    propnum = 6
    thechest = None
    alreadygotit = 0
    for item in Player.Backpack.Contains:
        Misc.Pause(100)
        if item.ItemID in containers:
            alreadygotit = 1
   
    if alreadygotit == 0:
        gotoRandomLoc(3679, 2252)
   
def gototailor():
    if Player.Position.X < 3700:
        gotoRandomLoc(3706, 2248)
   
def chest():
    global thechest
    global propnum    
    global fillamount
    global chestloop
    global itemstofill
    global myitemlist
    totalorder = 0
    propnum = 6
    itemstofill = 0
    myitemlist = []
    Misc.Pause(1000)
    for item in Player.Backpack.Contains:
        Misc.Pause(100)
        if item.ItemID in containers:
            chestloop = Items.GetPropStringList(item)
            thechest = item
            Misc.Pause(500)
            while propnum < len(chestloop):
                Misc.Pause(100)    
                if "Lifespan" not in chestloop[propnum] and ":" in chestloop[propnum]:                
                    firstsplit = chestloop[propnum].split(':')      
                    amount = firstsplit[1]
                    secondsplit = amount.split('/')
                    amounttocount = secondsplit[1]
                    totalorder += int(amounttocount)                    
                    itemstofill = itemstofill + 1
                propnum = propnum + 1
            Misc.SendMessage("Items To Fill:",30)
            Misc.SendMessage(itemstofill,30)  
            #if totalorder < 65:
                #Misc.WaitForContext(thechest, 1000)
                #Misc.Pause(500)
                #Misc.ContextReply(thechest, 351)
                #Target.WaitForTarget(4000, False)
                #Target.TargetExecute(thechest)
                #Gumps.WaitForGump(9196, 10000)
                #Gumps.SendAction(9196, 1)
                #Misc.SendMessage("Waiting for better order",30)
                #Misc.Pause(125000)
                #main()                    
                           
def buyitem():
    idtocheck = 1
    checkIngots()
    global twotypecloth
    global trytobuy
    global theprop
    global propnum
    global have
    global need
    
    global itemstart
    if int(have) <= int(need):
         Misc.Pause(100)
         x = theprop.split(":")
         Misc.Pause(100)
         y = x[0]
         Misc.Pause(100)

         if y == "cloth":
             Misc.SendMessage("cloth",30)                            
             BuyAgent.ChangeList('cloths')
             idtocheck = 0x1767
             twotypecloth = 2
         if y =="cut cloth":                                
             Misc.SendMessage("cut cloth",30) 
             move = Items.FindByID(CutClothID,-1,Player.Backpack.Serial)
             Misc.Pause(400)
             Items.Move(move,thechest,5)
             Misc.Pause(1800)
             Items.Move(move,thechest,5)
             Misc.Pause(1800)
             Items.Move(move,thechest,5)
             Misc.Pause(1800)
             Items.Move(move,thechest,5)
             idtocheck = CutClothID                        
         if y == "spool of thread":                                    
             Misc.SendMessage("spool of thread",30)
             BuyAgent.ChangeList('thread')
             idtocheck = 0x0FA0
         if y == "flax bundle":
             Misc.SendMessage("flax bundle",30)
             BuyAgent.ChangeList('flax')
             idtocheck = 0x1A9C                            
         if y == "dyeing tub":
             Misc.SendMessage("dyeing tub",30)
             BuyAgent.ChangeList('tub')
             idtocheck = 0x0FAB
             trytobuy = trytobuy + 1
             Misc.SendMessage('buy attempts',90)
             Misc.SendMessage(trytobuy,90)
         if y == "Cooked Bird":
             Misc.SendMessage("Cooked Bird",30)
             BuyAgent.ChangeList('CookedBird')
             idtocheck = 0x09B7    
         if y == "Candle":
             Misc.SendMessage("Candle",30)
             BuyAgent.ChangeList('Candle')
             idtocheck = 0x0A0F                  
         if y == "Scepter":
             Misc.SendMessage("Scepter",30)
             BuyAgent.ChangeList('Scepter')
             idtocheck = 0x26BC            
         if y == "Garlic":
             Misc.SendMessage("Garlic",30)
             BuyAgent.ChangeList('Garlic')
             idtocheck = 0x0F84    
         if y == "Bladed Staff":
             Misc.SendMessage("Balded Staff",30)
             BuyAgent.ChangeList('BladedStaff')
             idtocheck = 0x26BD                 
         if y == "War Hammer":
             Misc.SendMessage("War Hammer",30)
             BuyAgent.ChangeList('WarHammer')
             idtocheck = 0x1439   
         if y == "Backpack":
             Misc.SendMessage("Backpack",30)
             BuyAgent.ChangeList('Backpack')
             idtocheck = 0x0E75                  
         if y == "Bread Loaf":
             Misc.SendMessage("Bread Load",30)
             BuyAgent.ChangeList('BreadLoaf')
             idtocheck = 0x103B    
         if y == "Backgammon Game":
             Misc.SendMessage("Backgammon Game",30)
             BuyAgent.ChangeList('BackgammonGame')
             idtocheck = 0x0FAD
         if y == "A Checker Board":
             Misc.SendMessage("A Checker Board",30)
             BuyAgent.ChangeList('ACheckerBoard')
             idtocheck = 0x0FA6   
         if y == "Mahjong Game":
             Misc.SendMessage("Mahjong Game",30)
             BuyAgent.ChangeList('MahjongGame')
             idtocheck = 0x0FAA                 
         if y == "Spear":
             Misc.SendMessage("Spear",30)
             BuyAgent.ChangeList('Spear')
             idtocheck = 0x0F62           
         if y == "Oil Flask":
             Misc.SendMessage("Oil Flask",30)
             BuyAgent.ChangeList('OilFlask')
             idtocheck = 0x1C18   
         if y == "Torch":
             Misc.SendMessage("Torch",30)
             BuyAgent.ChangeList('Torch')
             idtocheck = 0x0F64                
         if y == "Crook":
             Misc.SendMessage("Crook",30)
             BuyAgent.ChangeList('Crook')
             idtocheck = 0x13F5  
         if y == "Salvage Bag":
             Misc.SendMessage("Salvage Bag",30)
             BuyAgent.ChangeList('SalvageBag')
             idtocheck = 0x0E76                  
         if y == "A Jug Of Cider":
             Misc.SendMessage("A Jug Of Cider",30)
             BuyAgent.ChangeList('AJugOfCider')
             idtocheck = 0x09C8   
         if y == "Bag":
             Misc.SendMessage("Bag",30)
             BuyAgent.ChangeList('Bag')
             idtocheck = 0x0E76 
         if y == "Skin Tingeing Tincture":
             Misc.SendMessage("Skin Tingeing Tincture",30)
             BuyAgent.ChangeList('Skin')
             idtocheck = 0x0EFF   
         if y == "Lockpick":
             Misc.SendMessage("Lockpick",30)
             BuyAgent.ChangeList('Lockpick')
             idtocheck = 0x14FB                 
         if y == "Chicken Leg":
             Misc.SendMessage("Chicken Leg",30)
             BuyAgent.ChangeList('ChickenLeg')
             idtocheck = 0x1608           
         if y == "Ginseng":
             Misc.SendMessage("Ginseng",30)
             BuyAgent.ChangeList('Ginseng')
             idtocheck = 0x0F85    
         if y == "Pear":
             Misc.SendMessage("Pear",30)
             BuyAgent.ChangeList('Pear')
             idtocheck = 0x172D                 
         if y == "Beeswax":
             Misc.SendMessage("Beeswax",30)
             BuyAgent.ChangeList('Beeswax')
             idtocheck = 0x1422  
         if y == "Copper Key":
             Misc.SendMessage("Copper Key",30)
             BuyAgent.ChangeList('CopperKey')
             idtocheck = 0x100E                 
         if y == "Empty Bottle":
             Misc.SendMessage("Empty Bottle",30)
             BuyAgent.ChangeList('EmptyBottle')
             idtocheck = 0x0F0E    
         if y == "Pouch":
             Misc.SendMessage("Pouch",30)
             BuyAgent.ChangeList('Pouch')
             idtocheck = 0x0E79
         if y == "Wooden Box":
             Misc.SendMessage("Wooden Box",30)
             BuyAgent.ChangeList('WoodenBox')
             idtocheck = 0x0E7D   
         if y == "Short Spear":
             Misc.SendMessage("Short Spear",30)
             BuyAgent.ChangeList('ShortSpear')
             idtocheck = 0x1403               
         if y == "Club":
             Misc.SendMessage("Club",30)
             BuyAgent.ChangeList('Club')
             idtocheck = 0x13B4            
         if y == "Gnarled Staff":
             Misc.SendMessage("Gnarled Staff",30)
             BuyAgent.ChangeList('GnarledStaff')
             idtocheck = 0x13F8   
         if y == "Dice And Cup":
             Misc.SendMessage("Dice And Cup",30)
             BuyAgent.ChangeList('Dice')
             idtocheck = 0x0FA7                 
         if y == "Quarter Staff":
             Misc.SendMessage("Quarter Staff",30)
             BuyAgent.ChangeList('QuarterStaff')
             idtocheck = 0x0E89   
         if y == "Maul":
             Misc.SendMessage("Maul",30)
             BuyAgent.ChangeList('Maul')
             idtocheck = 0x143B                 
         if y == "Mace":
             Misc.SendMessage("Mace",30)
             BuyAgent.ChangeList('Mace')
             idtocheck = 0x0F5C   
         if y == "Kindling":
             Misc.SendMessage("Kindling",30)
             BuyAgent.ChangeList('Kindling')
             idtocheck = 0x0DE1   
         if y == "Black Staff":
             Misc.SendMessage("Black Staff",30)
             BuyAgent.ChangeList('BlackStaff')
             idtocheck = 0x0DF0    
         if y == "Arrrow":
             Misc.SendMessage("Arrrow",30)
             BuyAgent.ChangeList('Arrrow')
             idtocheck = 0x0F3F
         if y == "crossbow bolt":
             Misc.SendMessage("Crossbow Bolt",30)
             BuyAgent.ChangeList('crossbowbolt')
             idtocheck = 0x1BFB   
         if y == "Bedroll":
             Misc.SendMessage("Bedroll",30)
             BuyAgent.ChangeList('Bedroll')
             idtocheck = 0x0A59                 
         if y == "Apple":
             Misc.SendMessage("Apple",30)
             BuyAgent.ChangeList('Apple')
             idtocheck = 0x09D0           
         if y == "Lantern":
             Misc.SendMessage("Lantern",30)
             BuyAgent.ChangeList('Lantern')
             idtocheck = 0x0A25   
         if y == "Small Ship Deed":
             Misc.SendMessage("Small Ship Deed",30)
             BuyAgent.ChangeList('SmallShipDeed')
             idtocheck = 0x14F2                 
         if y == "War Mace":
             Misc.SendMessage("War Mace",30)
             BuyAgent.ChangeList('WarMace')
             idtocheck = 0x1407  
         if y == "Bagball":
             Misc.SendMessage("Bagball",30)
             BuyAgent.ChangeList('Bagball')
             idtocheck = 0x2256                 
         if y == "Bagball2":
             Misc.SendMessage("Bagball2",30)
             BuyAgent.ChangeList('Bagball2')
             idtocheck = 0x2257   
         if y == "A Bottle of Ale":
             Misc.SendMessage("A Bottle of Ale",30)
             BuyAgent.ChangeList('Ale')
             idtocheck = 0x099F
         if y == "Leg of Lamb":
             Misc.SendMessage("Leg Of Lamb",30)
             BuyAgent.ChangeList('LegOfLamb')
             idtocheck = 0x160A                
         if y == "A Chessboard":
             Misc.SendMessage("A Chessboard",30)
             BuyAgent.ChangeList('AChessboard')
             idtocheck = 0x0FA6            
         if y == "A Bottle Of Liquor":
             Misc.SendMessage("A Bottle Of Liquor",30)
             BuyAgent.ChangeList('Liquor')
             idtocheck = 0x099B    
         if y == "A Plant Bowl":
             Misc.SendMessage("A Plant Bowl",30)
             BuyAgent.ChangeList('Bowl')
             idtocheck = 0x15FD                
         if y == "A Bottle Of Wine":
             Misc.SendMessage("A Bottle Of Wine",30)
             BuyAgent.ChangeList('Wine')
             idtocheck = 0x09C7   
         if y == "Book":
             Misc.SendMessage("Book",30)
             BuyAgent.ChangeList('Book')
             idtocheck = 0x0FF1                
         if y == "Book1":
             Misc.SendMessage("Book1",30)
             BuyAgent.ChangeList('Book1')
             idtocheck = 0x0FF2    
         if y == "Hair Dye":
             Misc.SendMessage("Hair Dye",30)
             BuyAgent.ChangeList('HairDye')
             idtocheck = 0x0EFF             
         if y == "dyes" in y:
             Misc.SendMessage("dyes",30)
             BuyAgent.ChangeList('dye')
             idtocheck = 0x0FA9
             trytobuy = trytobuy + 1
             Misc.SendMessage('buy attempts',90)
             Misc.SendMessage(trytobuy,90)
         if y == "pile of wool":
             Misc.SendMessage("pile of wool",30)
             BuyAgent.ChangeList('wool')
             idtocheck = 0x0DF8
         if y == "bolt of cloth":
             Misc.SendMessage("bolt of cloth",30)                                                                    
             BuyAgent.ChangeList('bolt')
             idtocheck = 0x0F95            
         if y =="bale of cotton":
             Misc.SendMessage("bale of cotton",30)                              
             BuyAgent.ChangeList('cotton')
             idtocheck = 0x0DF9
         have = Items.BackpackCount(idtocheck, -1)
         Misc.SendMessage("Currently holding",30)
         Misc.SendMessage(have,30)
         Misc.Pause(1000)
         if int(have) < int(need):
             Misc.Pause(100)
             tailors = Mobiles.ApplyFilter(FFilter)
             Misc.Pause(1000)
             tailor = Mobiles.Select(tailors, 'Nearest')
             if methods == 'buyprovisioner':
                Misc.Pause(100)
                tailors = Mobiles.ApplyFilter(PVFilter)
                Misc.Pause(1000)
                tailor = Mobiles.Select(tailors, 'Nearest')
             Misc.WaitForContext(tailor, 2000)
             Misc.ContextReply(tailor, 110)
             Misc.Pause(1400)
             have = Items.BackpackCount(idtocheck, -1)
         if int(have) >= int(need):
             Misc.Pause(100)
             
             itemstart = itemstart + 1
             have = 0
             need = 0
             trytobuy = 0
             move = Items.FindByID(idtocheck,-1,Player.Backpack.Serial)
             Misc.Pause(100)
             if move != None:
                Items.Move(move,thechest,0)
                Misc.Pause(2000)
         if trytobuy >= 6 and int(have) < int(need):
             Misc.Pause(100)
             weavers = Mobiles.ApplyFilter(TFilter)
             Player.HeadMessage(45,'Out of Stock Using Weaver')
             Misc.Pause(1200)
             weaver = Mobiles.Select(weavers, 'Nearest')
             Misc.WaitForContext(weaver, 10000)
             Misc.ContextReply(weaver, 110)
             Misc.Pause(2000)                
               
def makeitem():
    checkcloth()
    checkTinkerTool()
    checkSewingKit()
    kit = Items.FindByID(0x0F9D, -1,Player.Backpack.Serial).ItemID
    global twotypecloth
    global propnum
    global theprop
    global have
    global need
    global idtocheck
    global trytobuy
    global itemstart
 
    if theprop == "sewing kit":
        idtocheck = 0x0F9D
        have = Items.BackpackCount(idtocheck, -1)-3  ## sewing kits
        if int(have) < int(need):
            checkIngots()
            checkTinkerTool()
            Misc.SendMessage("sewing kit",30)
            Items.UseItemByID(TinkerToolsID)
            Gumps.WaitForGump(460, 10000)
            Gumps.SendAction(460, 14)
    if theprop == "scissors":
        idtocheck = ScissorsID
        have = Items.BackpackCount(idtocheck, -1)-2 ## scissors
        if int(have) < int(need):
            checkIngots()
            checkTinkerTool()
            Misc.SendMessage("scissors",30)
            Items.UseItemByID(TinkerToolsID)
            Gumps.WaitForGump(460, 10000)
            Gumps.SendAction(460, 8)
    if theprop == "cap":  
        makeme(0x1715, "210", "cap", kit, 460, 6)    
    if theprop =="leather cap":
        idtocheck = 0x1DB9
        have = Items.BackpackCount(idtocheck, -1)/145 ## leather cap
        if int(have) < int(need):
            Misc.SendMessage("leather cap",30)                              
            BuyAgent.ChangeList('lcap')
            gototailor()
            tailors = Mobiles.ApplyFilter(FFilter)
            Misc.Pause(1000)
            tailor = Mobiles.Select(tailors, 'Nearest')
            Misc.WaitForContext(tailor, 2000)
            Misc.ContextReply(tailor, 110)
            Misc.Pause(1000)
            trytobuy = trytobuy + 1
            Misc.SendMessage('buy attempts',90)
            Misc.SendMessage(trytobuy,90)
            if trytobuy == 6:
                Misc.SendMessage("Leather Caps out of stock",30)
            if trytobuy >= 6:                
                Items.UseItemByID(kit, -1)
                Gumps.WaitForGump(460, 10000)
                Gumps.SendAction(460, 609)
    if theprop == "jester suit":      
        makeme(0x1F9F, "190", "jester suit", kit, 460, 27)      
    if theprop == "robe":
        makeme(0x1F03, "193", "robe", kit, 460, 26)  
    if theprop == "wide-brim hat":
        makeme(0x1714, "210", "wide-brim hat", kit, 460, 7)      
    if theprop == "plain dress":      
        makeme(0x1F01, "190", "plain dress", kit, 460, 23)      
    if theprop == "tall straw hat":
        makeme(0x1716, "210", "tall straw hat", kit, 460, 9)      
    if theprop == "doublet":
        makeme(0x1F7B, "178", "doublet", kit, 460, 18)      
    if theprop == "short pants":
        makeme(0x152E, "186", "short pants", kit, 460, 37)
    if theprop == "fancy shirt":
        makeme(0x1EFD, "176", "fancy shirt", kit, 460, 20)    
    if theprop == "long pants":
        makeme(0x1539, "185", "long pants", kit, 460, 38)
    if theprop == "fancy dress":
        makeme(0x1EFF, "191", "fancy dress", kit, 460, 24)    
    if theprop == "skirt":
        makeme(0x1516, "183", "skirt", kit, 460, 40)
    if theprop == "kilt":
        makeme(0x1537, "184", "kilt", kit, 460, 39)
    if theprop == "half apron":
        makeme(0x153B, "225", "half apron", kit, 460, 45)
    if theprop == "cloak":
        makeme(0x1515, "225", "cloak", kit, 460, 25)
    if theprop == "tunic":
        makeme(0x1FA1, "177", "tunic", kit, 460, 21)
    if theprop == "jester hat":
        makeme(0x171C, "210", "jester hat", kit, 460, 14)
    if theprop == "floppy hat":
        makeme(0x1713, "210", "floppy hat", kit, 460, 5)
    if theprop == "straw hat":
        makeme(0x1717, "210", "straw hat", kit, 460, 8)
    if theprop == "wizard's hat":
        makeme(0x1718, "210", "wizard's hat", kit, 460, 10)
    if theprop == "feathered hat":
        makeme(0x171A, "210", "feathered hat", kit, 460, 12)
    if theprop == "tricorne hat":
        makeme(0x171B, "210", "tricorne hat", kit, 460, 13)
    if theprop == "bandana":
        makeme(0x1540, "210", "bandana", kit, 460, 4)
    if theprop == "skullcap":
        makeme(0x1544, "216", "skullcap", kit, 460, 3)  
    global twotypecloth    
    if twotypecloth == 2:                
        goodcloth = Items.FindByID(CutClothID, -1, Player.Backpack.Serial)
        Misc.Pause(500)
        Misc.SendMessage('Using correct cloth...',40)
        Target.WaitForTarget(1000,False)
        Target.TargetExecute(goodcloth)    
     
         
    Misc.SendMessage(have,90)
    Misc.SendMessage('/',95)
    Misc.SendMessage(need,90)
    if int(have) >= int(need):  
        test = Items.BackpackCount(idtocheck, -1)
                 
    if int(have) >= int(need):
        have = 0
        trytobuy = 0      
        itemstart = itemstart + 1
        Items.UseItem(thechest)
        Misc.WaitForContext(thechest, 10000)
        Misc.ContextReply(thechest, 354)
        Gumps.WaitForGump(460, 2000)
        Gumps.SendAction(460, 0)          
       
                         
def fillchest():
    global propnum  
    if propnum >= itemstofill:
        Items.UseItem(thechest)
        Misc.WaitForContext(thechest, 10000)
        Misc.ContextReply(thechest, 354)
                                       
def gotomagdock():              
    for coords in railCoords1:
        gotoLocation(coords[0],coords[1])
       
def getorder():
    if alreadygotit == 0:
        trader = Mobiles.ApplyFilter(MFilter)
        Misc.Pause(500)
        minister = Mobiles.Select(trader, 'Nearest')
        Misc.Pause(100)
        Misc.WaitForContext(minister, 2000)
        Misc.ContextReply(minister, 350)
        Gumps.WaitForGump(9195, 1000)
        Gumps.SendAction(9195, 1)
   
def turnin():    
    slim = Mobiles.ApplyFilter(SFilter)
    Misc.Pause(500)
    slimshady = Mobiles.Select(slim, 'Nearest')
    Misc.WaitForContext(slimshady, 10000)
    Misc.Pause(500)
    Misc.ContextReply(slimshady, 352)
    Target.WaitForTarget(4000, False)
    Target.TargetExecute(thechest)
    Misc.Pause(2000)
    insuremempo()
    Misc.Pause(1500)
    checkleather()
    dumpshit()
    recall(4)
       
def insuremempo():      
    for item in Items.FindBySerial(Player.Backpack.Serial).Contains:        
        Items.WaitForProps(item, 1000)
        if item.ItemID in mempos:
            if not (Items.GetPropValue(item, '<b>Insured</b>')):                
                Target.Cancel()    
                Misc.WaitForContext(Player.Serial, 3000)
                Misc.ContextReply(Player.Serial, "Toggle Item Insurance")
                Target.WaitForTarget(2000, True)
                Target.TargetExecute(item)
                Misc.Pause(600)    
                Target.Cancel()                
def salvage():
    for leftovers in Items.FindBySerial(Player.Backpack.Serial).Contains:
        Items.WaitForProps(leftovers, 1000)
        if leftovers.ItemID in salv:
            move = Items.FindByID(leftovers.ItemID,-1,Player.Backpack.Serial)
            Items.Move(move,salvbag,0)
            Misc.Pause(1500)
    Misc.WaitForContext(salvbag, 1000)
    Misc.ContextReply(salvbag, 912)
                         
def gotoslim():
    global trytoplace
    trytoplace = 0
    Misc.Pause(1000)
    Misc.Resync()
    Misc.Pause(1000)
    for coords in railCoords2:
        gotoLocation(coords[0],coords[1])
    Misc.Resync()
    for coords in railCoords3:
        gotoLocation(coords[0],coords[1])

def makeme(theid, divider, craftname, tool, numa, numb):
    global idtocheck
    global have
    idtocheck = theid
    have = Items.BackpackCount(theid, -1)
    if int(have) < int(need):  
        Misc.SendMessage(craftname,30)
        Items.UseItemByID(tool, -1)
        Gumps.WaitForGump(numa, 1000)
        Gumps.SendAction(numa, numb)
        Misc.Pause(100)
    if int(have) == int(need):
        dblcheck = Items.BackpackCount(theid, -1)
        dblcheck = int(dblcheck) / int(divider)        
        if dblcheck != have:
            Items.UseItemByID(tool, -1)
            Gumps.WaitForGump(numa, 1000)
            Gumps.SendAction(numa, numb)
            Misc.Pause(100)
       
       
def placenewboat():
    global trytoplace    
    global nearestrope
    Misc.Pause(1500)
    Items.UseItemByID(0x14F4)
    Gumps.WaitForGump(999076, 2000)
    Gumps.SendAction(999076, 3)
    Target.WaitForTarget(2000, False)
    Target.TargetExecute(3639, 2300 ,-5)
    Misc.Pause(1000)
    Misc.Resync()
    Misc.Pause(500)
    if Journal.Search('blocking') == False:    
        ropes = Items.ApplyFilter(RFilter)
        Misc.Pause(500)
        nearestrope = Items.Select(ropes, 'Nearest')
        Misc.Pause(500)    
        Misc.SendMessage(nearestrope,40)
        Items.UseItem(nearestrope)
        Misc.Pause(500)
        sail()
    if trytoplace >= 6:
        secondlaunch()    
    if Journal.Search('blocking') == True:
        Misc.SendMessage('Some asshole scriptor is blocking your boat!!!',30)
        Player.HeadMessage(74,"You guys are dicks!")
        Misc.Pause(1000)
        Journal.Clear()
        trytoplace += 1
        placenewboat()
           
def secondlaunch():
    Player.HeadMessage(30,'The hell with this')
    Journal.Clear()
    gotoLocation(3649, 2308)
    global nearestrope
    global trytoplace
    Misc.Pause(1500)
    Items.UseItemByID(0x14F4)
    Gumps.WaitForGump(999076, 2000)
    Gumps.SendAction(999076, 3)
    Target.WaitForTarget(2000, False)
    Target.TargetExecute(3658, 2312 ,-5)
    Misc.Pause(1000)
    gotoLocation(3652, 2311)
    Misc.Resync()
    Misc.Pause(500)
    if Journal.Search('blocking') == False:    
        ropes = Items.ApplyFilter(RFilter)
        Misc.Pause(500)
        nearestrope = Items.Select(ropes, 'Nearest')
        Misc.Pause(500)    
        Misc.SendMessage(nearestrope,40)
        Items.UseItem(nearestrope)
        Misc.Pause(500)
        sail2()
    if Journal.Search('blocking') == True:
        Player.HeadMessage(74,"Holy Shit Double Log Jam!!!")
        Misc.Pause(3000)
        Journal.Clear()
        secondlaunch()
       
def sail():
    global amountcomplete
    global nearestrope
    Player.ChatSay(52, "forward")
    Misc.Pause(2000)
    bowlnum = amountcomplete + 1
    Player.HeadMessage(75,'*smokes bowl*')
    Player.HeadMessage(75, str(bowlnum) + " bowls and no Mempo!")
    while Player.Position.Y < 2363:
        Misc.Pause(16000)
        Player.ChatSay(52, "forward")
    Player.ChatSay(52, "turn right")
    Misc.Pause(1000)
    Player.ChatSay(52, "forward")
    Misc.Pause(2500)    
    Items.UseItem(nearestrope)
    Misc.Pause(1000)
    boatdriver = Mobiles.ApplyFilter(BFilter)
    drydock = Mobiles.Select(boatdriver, 'Nearest')
    while Items.FindByID(0x14F4,-1,Player.Backpack.Serial) == None:
        Misc.WaitForContext(drydock, 10000)
        Misc.ContextReply(drydock, 937)
        Gumps.WaitForGump(999007, 10000)
        Gumps.SendAction(999007, 2)
        Misc.Pause(2000)
       
def sail2():      
    Player.ChatSay(52, "forward")
    Misc.Pause(2000)    
    while Player.Position.Y < 2390:
        Misc.Pause(12000)
        Player.ChatSay(52, "forward")
    Player.ChatSay(52, "turn left")
    Misc.Pause(1000)
    Player.ChatSay(52, "right")
    Misc.Pause(5000)    
    Items.UseItem(nearestrope)
    Misc.Pause(2000)
    boatdriver = Mobiles.ApplyFilter(BFilter)
    drydock = Mobiles.Select(boatdriver, 'Nearest')
    while Items.FindByID(0x14F4,-1,Player.Backpack.Serial) == None:
        Misc.WaitForContext(drydock, 10000)
        Misc.ContextReply(drydock, 937)
        Gumps.WaitForGump(999007, 10000)
        Gumps.SendAction(999007, 2)    
        Misc.Pause(2000)
       
def dumpshit():
    global runswithoutdump
    if Items.BackpackCount(0x14EF, 0x0490) >= 1 or runswithoutdump >= 5 or Items.BackpackCount(ingots,-1) < 100:
        recall(3)
        Player.Run('North')
        Player.Run('North')
        Player.Run('North')
        Misc.Resync()
        Misc.Pause(500)
        Player.Run('North')
        Player.Run('North')
        Misc.Resync()
        Misc.Pause(1000)
        Player.Run('North')
        Player.Run('North')
        Player.Run('North')
        Player.Run('North')
        Player.Run('North')
        resConts = Items.ApplyFilter(CFilter)
        Misc.Pause(1500)
        resCont = Items.Select(resConts, 'Nearest')
        if resCont != None:
            Items.UseItem(resCont)
            Misc.Pause(2000)            
            if Items.BackpackCount(ingots,-1) < 150:
                for item in resCont.Contains:              
                    if item.ItemID == ingots:
                        Items.Move(item,Player.Backpack.Serial,300)
                        Misc.Pause(2000)
        pinkbooks = Items.ApplyFilter(PFilter)
        Misc.Pause(1500)
        pinkbook = Items.Select(pinkbooks, 'Nearest')
        Misc.Pause(500)
        garbagecans = Items.ApplyFilter(GFilter)
        Misc.Pause(500)
        garbagecan = Items.Select(garbagecans, 'Nearest')
        Misc.Pause(500)
        for pinks in Items.FindBySerial(Player.Backpack.Serial).Contains:          
            if pinks.ItemID == 0x14EF:
                Misc.Pause(300)
                Items.WaitForProps(pinks, 500)
                props = Items.GetPropStringList(pinks)
                prop = props[3]
                Player.HeadMessage(90,prop)                
                move = Items.FindByID(pinks.ItemID,-1,Player.Backpack.Serial)
                Misc.Pause(100)
                Items.Move(move,pinkbook,0)
                Misc.Pause(1500)                    
            if not pinks.ItemID in keeplist:
                Misc.Pause(300)
                Items.WaitForProps(pinks, 500)
                props = Items.GetPropStringList(pinks)
                prop = props[0]
                Misc.SendMessage(prop,90)
                move = Items.FindByID(pinks.ItemID,-1,Player.Backpack.Serial)
                Misc.Pause(100)
                Items.Move(move,garbagecan,0)
                Misc.Pause(1500)
        runswithoutdump = 0

def bump_amount_smuggled():
    smuggled_file = os.path.join(os.environ.get('userprofile', 'c:'), 'Documents', 'smuggled_count.txt')

    if not os.path.exists(smuggled_file):
        file = open(smuggled_file, 'w+')
        file.write('0')
        file.close()

    with open(smuggled_file) as file:
        current_count = file.read()

    with open(smuggled_file, 'w') as file:
        new_count = int(current_count) + 1
        file.write(str(new_count))
       
def craftmethod():
    global methods
    global need
    global propnum
    global theprop    
    ignoreprops = 5
    currentprop = ignoreprops + itemstart  
    Misc.Pause(100)
    prop = chestloop[currentprop]
    Misc.Pause(100)
    if not prop in dontCount:
        Misc.Pause(100)
        prop = prop.lower()
        Misc.Pause(100)
        y = prop.split(":")
        Misc.Pause(100)
        theprop = y[0]
        Misc.Pause(100)          
        if theprop in craftabletailor:
            methods = 'tailor'
            Misc.Pause(100)                  
        if theprop in buyonlytailor:
            methods = 'buytailor'
            Misc.Pause(100)
            gototailor()
        if theprop in buyonlyprovisioner:
            methods = 'buyprovisioner'
            Misc.Pause(100)
            gototailor()
        getrightnum = prop.split("/")                    
        for correctnumber in getrightnum:
            Misc.Pause(50)
            if correctnumber != 0 and correctnumber.isdigit():                                              
                Misc.Pause(400)                        
                need = correctnumber                                                      
                Misc.Pause(400)          
       
def main():
    global trytoplace
    global runswithoutdump
    global twotypecloth
    global itemstart
    twotypecloth = 1
    tailorskill = Player.GetSkillValue('Tailoring')
    if tailorskill < 54:
        Player.HeadMessage(90,'I think ill get high...   and learn to sew....')
        gototailor()
        while Player.GetSkillValue('Tailoring') < 54:
            checkcloth()
            checkSewingKit()
            kit = Items.FindByID(0x0F9D,-1,Player.Backpack.Serial)
            Items.UseItemByID(0x0F9D, -1)
            Gumps.WaitForGump(460, 1000)
            if Player.GetSkillValue('Tailoring') < 41.5:
                Gumps.SendAction(460, 37)
                Misc.Pause(1500)
                have = Items.BackpackCount(0x152E, -1)/225 ## short pants
            else:
                Gumps.SendAction(460, 25)
                Misc.Pause(1500)
                have = Items.BackpackCount(0x1515, -1)/225 ## cloak
            if have > 30:
                salvage()
                Player.HeadMessage(90,'Im good enough to finance my habit')
    trytobuy = 0
    global amountcomplete
    Misc.SendMessage('Shipments Smuggled:',90)
    Misc.SendMessage(amountcomplete, 95)
    bump_amount_smuggled()
    amountcomplete = amountcomplete + 1
    start()
    getorder()
    Misc.Pause(100)
    chest()
   
    itemstart = 1
    while itemstart <= itemstofill:  
        craftmethod()    
        if methods == 'tailor':
            makeitem()
        if methods == 'buytailor':
            buyitem()            
            Misc.Pause(400)
        if methods == 'buyprovisioner':
            buyitem()            
            Misc.Pause(400)
    Misc.Pause(1000)    
    fillchest()
    gotomagdock()
    salvage()
    placenewboat()
    gotoslim()
    turnin()
    runswithoutdump = runswithoutdump + 1
    trytoplace = 0
   
while not Player.IsGhost:    
    main()