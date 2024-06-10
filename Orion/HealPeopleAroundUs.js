
function Run(){
	var lasthealed = null;
	function HealFriend() {
	
		var healThreshold = 75;
	
	    var friendNames = [
	        "ricky",
	        "puppersnoot",
	        "doc murder",
	        "zazu",
	        "zazi",
	        "spaz",
	        "slate",
	        'dgdg',
	        'mvp',
	        'floof',
	        'compu',
	        'zaz',
	        'batgirl',
	        '-GL-',
	        "lil",
	        'spw',
	        'blunt',
	        'jan',
	        'fred',
	        'knuckle',
	        'flip',
	        'flop',
	        'poof',
	        'MvP',
	        '-G-'
	    ];
	    var playerSerial = Player.Serial();
	    var playerObject = Orion.FindObject(playerSerial);
	
	    var FindMeATarget = function () {
	        var friendlys = Orion.FindType("-1", -1, "ground", "mobile|inlos", '8', 'green | blue');
	        if (friendlys && friendlys.length > -1) {
	            var foundFriend = null;
	           
				//checking for non friends 
				
				//todo we need to randomize who gets targetted
				var needsHeals = [];
				var priorities = [];
				
				friendlys.forEach(function (friendId) {
					if (foundFriend !== null) return;
					if (Player.Hits() < (Player.MaxHits() - 20) && Player.Hits() > 0) {
						foundFriend = playerSerial;
						return;
					}
					var friendObject = Orion.FindObject(friendId);
					if (!friendObject) return;
					 var friendProps = friendObject.Properties();
					 if(friendProps.indexOf("summoned") > -1) return;
					  if(friendProps.indexOf("tame") > -1) return;
					var friendHits = friendObject.Hits();
					if (friendId === playerSerial) return;
					//Orion.ShowStatusbar(friendId, 740, 175);
					Orion.GetStatus(friendId);
					Orion.Wait(25);
					friendHits = friendObject.Hits();
					var namesFound = friendNames.filter(function (name) {
	                    return friendProps.toLowerCase().indexOf(name) > -1;
	                });                
	                if (friendHits * 4 < healThreshold && friendHits > 0) {
		                if(namesFound.length > 0){
		                	priorities.push(friendId);
		                } else {
		               		needsHeals.push(friendId);
		                }
	                }					
				});
				
				 if (foundFriend) return foundFriend;
				
				if(!foundFriend && priorities.length > 0){
					var min = 0;
					var max = priorities.length;
					var rando = Orion.Random(min, max);
					Orion.Print("Healing Priority: " + (rando + 1) + "/" + priorities.length)
					foundFriend = priorities[rando];
				}
				
				
				if(!foundFriend && needsHeals.length > 0){
					var min = 0;
					var max = needsHeals.length;
					var rando = Orion.Random(min, max);
					Orion.Print("Healing Random: " + (rando + 1) + "/" + needsHeals.length)
					foundFriend = needsHeals[rando];
				}
				
				
	            if (foundFriend !== null) return foundFriend;
	                            
	            return null;
	        }
	    }
	
	    var target = FindMeATarget();
	    if (target !== null) {
	    	var targetObject = Orion.FindObject(target);
	    	if(!targetObject){
	    		return;
	    	}
	    	if(target !== Player.Serial()){
		    	Orion.GetStatus(target);	    	
		    	Orion.Wait(25);
	    	}
	    	if(targetObject){
	    		if(lasthealed === target) {
	    			Orion.Wait(250);
	    			if(targetObject.Hits() * 4 >= healThreshold && targetObject.Hits() > 0){
	    				if(target !== Player.Serial()){
	    					return;
	    				}
		    			
	    			}
	    		}
	    	}
	    	
	    	lasthealed = target;
	    	
	    	if(targetObject && targetObject.Poisoned()){
	    		Orion.Cast('25');
	    	} else{
	    		Orion.Cast('Greater Heal');
	    	}
	    	
	    	Orion.Print(targetObject.Properties());
			
			if (Orion.WaitForTarget(3000))
				Orion.TargetObject(target);
			Orion.Wait(500);
		}
	}

	while(!Player.Dead()){
		if(Player.Mana() > 50){
			HealFriend();
		}
		
		Orion.Wait(500);
	}
}