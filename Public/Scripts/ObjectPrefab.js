//@input Component.ScriptComponent objectSpawner

var screenTransform = script.getSceneObject().getComponent("Component.ScreenTransform");
var objImg = script.getSceneObject().getComponent("Component.Image");
var fallingSpeed = script.objectSpawner.api.getFallingSpeed();
var yLimit = script.objectSpawner.api.getYLimit();
var waitTime = script.objectSpawner.api.getFallTime();
var fadeSpeed = script.objectSpawner.api.getFadeSpeed();
var timeOver = false;


script.createEvent("UpdateEvent").bind(function(){
   
    var currentpos = screenTransform.anchors.getCenter();
    currentpos.y -= fallingSpeed * getDeltaTime();
    
    if (timeOver){
        objImg.mainPass.baseColor = new vec4(1, 1, 1, objImg.mainPass.baseColor.a-
        getDeltaTime()*0.02);
        if (objImg.mainPass.baseColor.a <= 0){
            script.getSceneObject().destroy();
        }
    }
    else{
        if(currentpos.y < yLimit){
            return;        
        }
        else{
            screenTransform.anchors.setCenter(currentpos);
        }
    }
    
});

// Wait for 2 seconds before executing a function
var delayedEvent = script.createEvent("DelayedCallbackEvent");
delayedEvent.bind(function(eventData)
{
    if(!timeOver){
        timeOver = true;
    }
});

delayedEvent.reset(waitTime);