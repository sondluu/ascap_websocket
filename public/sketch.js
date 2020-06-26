let detector;
let detections;
let meow, kitty;
let ringtone, phone;
let personlocalstate = 0;
let personstate = 0;
let phonelocalstate = 0;
let phonestate = 0;
let persontime1 = 0;
let phonetime1 = 0;
let persontime2 = 0;
let phonetime2 = 0;
let time = 0;
let objects = [];
let socket;
let button; 
let font1_shadow;
let camera_1;
var camButton;
var camState = false;
let cam_y =-220;

function preload() {
  //load meow sound:
  meow = loadSound("meow.wav");
  ringtone = loadSound("ringtone.wav");
}

function setup() {

  createCanvas(800,800);
  camera_1 = createCapture(VIDEO);
  camera_1.size(200,100);

  camera_1.hide()
  camButton = document.getElementById("camera1");

  detector = ml5.objectDetector('yolo', modelReady)  //activate the ml5 Object Detection machine learning model
  
  kitty = loadImage("kitty.jpeg");
  phone = loadImage("phone.png");
 // objects[id] = new ObjectDetected(id, x, y, state, localstate, ontime, offtime);
  socket = io.connect('https://cocreativetest.herokuapp.com/');
  socket.on('mouse', newDrawing);

}

function newDrawing(data){
  noStroke();
  fill(200,0,100);
  image(kitty, 800 - data.x*4, data.y*4, data.w/4, data.h/4);
}


function modelReady() {
  console.log('model loaded')  
  detect(); //function modelReady to load the modeal and initiate the detect objects by calling the "detect" funtion
}

function detect() {
  detector.detect(camera_1, gotResults); 
}

function gotResults(err, results) {
  if (err) {
    console.log(err);
    return
  }

  detections = results;

  detect();    

}
  
  
function showCam(){
camState=!camState;
}


function draw() {
//  if(time%10==0){
  background(240,210,210);
//  }
  noStroke();
  fill(255)
  rect(0,0,800,160);
  push();
  translate(800, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);

  cam = image(camera_1,width/2-100,cam_y);
  camButton.onclick = showCam; 
  
  if (camState){
    cam_y = 5;}
  else{
      cam_y = -220;
   }
  pop();
  
  time++;
  
  if (detections) {
    detections.forEach(detection => {
      fill(0);
      stroke(0);
      strokeWeight(1);
      textSize(18);
      text(detection.label, 800-detection.x*4 + 10, detection.y*4-10);
      
      noFill();
      strokeWeight(3);
      stroke(0, 255, 0);
      if (detection.label == 'person') {
        personstate = 1;
        personlocalstate += 1;
        console.log('Sending:' + detection.x + ',' + detection.y+ ',' + detection.width+ ',' + detection.height);
        var data = {
         x: detection.x,
         y: detection.y,
         w: detection.width,
         h: detection.height
        }
        socket.emit('mouse', data); 
      
        image(kitty, 800-detection.x*4, detection.y*4, detection.width/4, detection.height/4);    
        
      }
        persontime1++;
        persontime2 = 0;
//        meow.rate(1-(detection.x-width/2)/1000);
//      } 
          if (detection.label === 'cell phone') {
        if(phonestate ==0 && phonelocalstate ==0&& !ringtone.isPlaying()){
          ringtone.play();
          ringtone.loop();
        }
        phonestate = 1;
        phonelocalstate = 1;
        image(phone, 800-detection.x*4, detection.y*4, detection.width/2, detection.height/2);    
            phonetime1++;
            phonetime2 = 0;
      }     
    
    })
  }

    if(phonelocalstate == 0){
          phonetime2++;
        if(phonetime2 > 3){
        phonestate = 0;
        ringtone.stop();
        }
          phonetime1=0;
    }
  personlocalstate = 0;
  phonelocalstate = 0;
}

  	class ObjectDetected {
		constructor(id, x, y, state, localstate, ontime, offtime) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.state = state;
			this.localstate = localstate;
			this.ontime = ontime;
			this.offtime = offtime;
		}

		move() {
		}

		show() {
			push();
			translate(this.x,this.y);
			pop();
		}

	}

