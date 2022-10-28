function HealFriend() {
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
        'batgirl'
    ];
    var playerSerial = Player.Serial();
    var playerObject = Orion.FindObject(playerSerial);

    var FindMeATarget = function () {
        var friendlys = Orion.FindType("-1", -1, "ground", "mobile|inlos", '8', 'green | blue');
        if (friendlys && friendlys.length > -1) {
            var foundFriend = null;
            
            //checking for friends
            friendlys.forEach(function (friendId) {
                if (foundFriend !== null) return;
                if (Player.Hits() < (Player.MaxHits() - 20) && Player.Hits() > 0) {
                    foundFriend = playerSerial;
                    return;
                }
                var friendObject = Orion.FindObject(friendId);
                if (!friendObject)
                    return;
                var friendProps = friendObject.Properties();
                var namesFound = friendNames.filter(function (name) {
                    return friendProps.toLowerCase().indexOf(name) > -1;
                });                
                if (namesFound.length === 0) return;
                var friendHits = friendObject.Hits();
                if (friendId === playerSerial) return;
                Orion.ShowStatusbar(friendId, 740, 175);
                Orion.GetStatus(friendId);
                friendHits = friendObject.Hits();
                Orion.CloseStatusbar(friendId);
                if (friendHits * 4 < 80 && friendHits > 0) {
                	Orion.Print("Healing Friend: " + friendProps)
                    foundFriend = friendId;
                }
            });
           
            if (foundFriend) return foundFriend;
			
			
			//checking for non friends 
			
			//todo we need to randomize who gets targetted
			var needsHeals = [];
			
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
				friendHits = friendObject.Hits();
				//Orion.CloseStatusbar(friendId);
				if (friendHits * 4 < 80 && friendHits > 0) needsHeals.push(friendId);
			});
			
			if(needsHeals.length > 0){
				var min = 0;
				var max = needsHeals.length - 1;
				Orion.Print(needsHeals)
				var rando = Orion.Random(min, max);
				Orion.Print(rando);
				foundFriend = needsHeals[rando];
			}
			
			
            if (foundFriend !== null) return foundFriend;
                            
            return null;
        }
    }

    var target = FindMeATarget();
    if (target !== null) {
    	var targetObject = Orion.FindObject(target);
    	if(target !== playerSerial){	    
	    	Orion.GetStatus(target);	    	
	    	Orion.ShowStatusbar(target, 740, 175);
    	}
    	
    	if(targetObject.Poisoned()){
    		Orion.Cast('25');
    	} else {
    		Orion.Cast('29');
    	}
    	
    	
		
		if (Orion.WaitForTarget(3000))
			Orion.TargetObject(target);
		Orion.Wait(400);
		if(playerSerial !== target)
			Orion.CloseStatusbar(target);
	}
}
		
function Run(){
	while(!Player.Dead()){
		HealFriend();
		Orion.Wait(500);
	}
}