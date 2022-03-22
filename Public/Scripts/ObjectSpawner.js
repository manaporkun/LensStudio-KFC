// -----JS CODE-----
//@ui {"widget":"group_start", "label":"Spawn Settings"}
//@input float spawnFrequency{"widget":"slider","min":0.05, "max":0.5, "step":0.0005}
//@input float spawnRange {"widget":"slider","min":0, "max":1, "step":0.1}
//@input float objectCountEachFrequency
//@ui {"widget":"group_end"}


//@ui {"widget":"group_start", "label":"Position Settings"}
//Max object count before increasing Y position
//@input int maxObjectPerLevel
//Y position increment rate
//@input float yLevel
//@ui {"widget":"group_end"}


//@ui {"widget":"group_start", "label":"Object Settings"}
//@input Asset.ObjectPrefab objectPrefab
//@input float fallingSpeedMin
//@input float fallingSpeedMax
//@input float maxFallTime
//@input float hamburgerMaxRotation{"widget":"slider","min":0.1, "max":0.9, "step":0.01}
//@input float sizeMin{"widget":"slider","min":0.1, "max":0.5, "step":0.05}
//@input float sizeMax{"widget":"slider","min":0.55, "max":1, "step":0.05}
//@input float fadeSpeed{"widget":"slider","min":0.0005, "max":0.001, "step":0.00005}
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Effects"}
//@input SceneObject effects
//@ui {"widget":"group_end"}

var spawnTimer = 0;
var spawnObjectCounter = 0;
var screenTransform = script.getSceneObject().getParent().getComponent("Component.ScreenTransform");
var yLimit = screenTransform.anchors.bottom;
var fallTime = 0;
var smiled = false;

script.effects.enabled = false;

var event = script.createEvent("SmileStartedEvent");
event.faceIndex = 0;
event.bind(function (eventData)
{
    if (smiled) return;
    smiled = true;
    script.createEvent("UpdateEvent").bind(function(){
        //print(script.getSceneObject().getChildrenCount());
        if(fallTime >= script.maxFallTime){
            script.effects.enabled = true;
        }else{
            fallTime += getDeltaTime();
            if(spawnTimer < script.spawnFrequency){
                spawnTimer += getDeltaTime();
            }else{
                for(var i=0; i < script.objectCountEachFrequency; i++){
                    spawnObject();
                }         
                spawnTimer = 0;
            }
        }
    });
});

function spawnObject(){
    
    if (spawnObjectCounter > script.maxObjectPerLevel){
        yLimit += script.yLevel;
        spawnObjectCounter = 0;
    }
    else{
         //creating a copy of the prefab   
        var newObj = script.objectPrefab.instantiate(script.getSceneObject());
        
        // increase the counter
        spawnObjectCounter += 1;
        
        //get screen position of this aka ObjectSpawner object
        var screenTransform = script.getSceneObject().getComponent("Component.ScreenTransform");    
        var myScreenPos = screenTransform.anchors.getCenter();        
        
        //randomize position with range
        var randomXpos = myScreenPos.x + Math.random() * (script.spawnRange - (-script.spawnRange)) + (-script.spawnRange);    
        var newObjPosition = new vec2(randomXpos, myScreenPos.y);

        //random rotation on Z axis
        var randomZRotation = Math.random() *
        ((script.hamburgerMaxRotation) - (-script.hamburgerMaxRotation)) + (-script.hamburgerMaxRotation);
            
        //set screen position of newObj aka ObjectPrefab object
        var objScreenTransform = newObj.getComponent("Component.ScreenTransform");
        objScreenTransform.anchors.setCenter(newObjPosition);
        objScreenTransform.rotation = quat.fromEulerAngles( 0.0, 0.0, randomZRotation );
        
        var randomSize = Math.random() * ((script.sizeMax) - (script.sizeMin)) + (script.sizeMin);
        objScreenTransform.scale = new vec3(randomSize, randomSize, randomSize);
    }
   
}


function getFallingSpeed(){
    return Math.random() * (script.fallingSpeedMax - script.fallingSpeedMin) + script.fallingSpeedMin;
}

function getYLimit(){
    return yLimit;
}

function getFallTime(){
    return script.maxFallTime - fallTime;
}

function getFadeSpeed(){
    return script.fadeSpeed;
}

script.api.getYLimit = getYLimit;
script.api.getFallingSpeed = getFallingSpeed;
script.api.getFallTime = getFallTime;
script.api.getFadeSpeed = getFadeSpeed;