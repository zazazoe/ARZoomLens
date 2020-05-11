// -----JS CODE-----
// @input Component.ObjectTracking objectTracking
// @input Component.Image Clap
// @input Component.Image thumbLeft
// @input Component.Image thumbRight
// @input Component.Image background
// @input float alpha = 0.5 {"widget":"slider", "min":0.0, "max":1.0, "step":0.01}

var currAlpha = 0;
var targetAlpha = 0;
var currColor = script.background.mainPass.baseColor;

var offset = 7;
var fadeSpeed = 0.90;
var fast = 0.90;
var slow = 0.97;

var event = script.createEvent("UpdateEvent");
event.bind( update );

var mouthOpened = false;

///// UPDATE //////

function update(eventData){
    //update hand animations
    if(script.objectTracking.isTracking()){
        checkWhichHand();
    } else { 
        stopHandAnimations();       
    }
   
    //update opacity of colored overlay
    currAlpha = currAlpha*fadeSpeed + targetAlpha*(1-fadeSpeed);
    script.background.mainPass.baseColor = new vec4( currColor.r, currColor.g, currColor.b, currAlpha );
};


////HAND TRACKING//////

script.objectTracking.onObjectFound = function() {
    print("Object has been found!");
    print("R: " + currColor.r + "G: " + currColor.g + "B: " + currColor.b )
    targetAlpha = script.alpha;
    fadeSpeed = fast;
};

script.objectTracking.onObjectLost = function() {
    print("Object has been lost! Yay Zaza");
    stopHandAnimations();
    
    if(!mouthOpened){
        targetAlpha = 0;
        fadeSpeed = fast;
    } 
};   


//// MOUTH TRACKING /////
var mouthOpen = script.createEvent("MouthOpenedEvent");
mouthOpen.faceIndex = 0;
mouthOpen.bind(function (eventData)
{
    targetAlpha = script.alpha;
    fadeSpeed = fast;
    print("Mouth was opened on face 0");
    mouthOpened = true;
});

var mouthClose = script.createEvent("MouthClosedEvent");
mouthClose.faceIndex = 0;
mouthClose.bind(function (eventData)
{
    if(!script.objectTracking.isTracking()){
        targetAlpha = 0;
        fadeSpeed = slow;
    }
    print("Mouth was closed on face 0");
    mouthOpened = false;
});


////// FUNCTIONS ///////
function checkWhichHand(){
    if(script.objectTracking.getTransform().getLocalPosition().x < offset && script.objectTracking.getTransform().getLocalPosition().x >-offset) {
        script.Clap.enabled = true;
        script.thumbLeft.enabled = false;
        script.thumbRight.enabled = false;
    } else if(script.objectTracking.getTransform().getLocalPosition().x > offset) {
        script.Clap.enabled = false;
        script.thumbLeft.enabled = false;
        script.thumbRight.enabled = true;
    } else if(script.objectTracking.getTransform().getLocalPosition().x < -offset) {
        script.Clap.enabled = false;
        script.thumbLeft.enabled = true;
        script.thumbRight.enabled = false;
    }
}

function stopHandAnimations(){
    script.Clap.enabled = false;
    script.thumbLeft.enabled = false;
    script.thumbRight.enabled = false;
}