var objectUseWaitTime = 1200;
	
var lastObjectUsedTime = 0;

function WaitForObjectTimeout(){
	var nowTime = new Date().getTime();
	var deltaTime = nowTime - lastObjectUsedTime;
	if(deltaTime < objectUseWaitTime){
		Orion.Wait(objectUseWaitTime - deltaTime);
	}
}

function RegisterUseObjectTimeout(){
	lastObjectUsedTime = new Date().getTime();
}