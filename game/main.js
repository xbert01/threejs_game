import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();
const config = {
  showHitZones: false,
  shadows: true, // Use shadow
  trees: true, // Add trees to the map
  curbs: true, // Show texture on the extruded geometry
  grid: false // Show grid helper
};


// Track 
const trackRadius = 225;
const trackWidth  = 45;
const innerTrackRadius = trackRadius - trackWidth; 
const outerTrackRadius = trackRadius + trackWidth;
const scoreElement = document.getElementById("score");
const resultsElement = document.getElementById("results");
const instructionElement = document.getElementById("instruction");

const arcAngle1  = (1/3) * Math.PI; //60 degrees

const deltaY = Math.sin(arcAngle1) * innerTrackRadius;
const arcAngle2 = Math.asin(deltaY/outerTrackRadius);
const arcCenterX =
  (Math.cos(arcAngle1) * innerTrackRadius +
    Math.cos(arcAngle2) * outerTrackRadius) /
  2;

const arcAngle3 = Math.acos(arcCenterX/innerTrackRadius);
const arcAngle4 = Math.acos(arcCenterX/outerTrackRadius);


// Adding light 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(100,-300,400);
scene.add(dirLight);

//Setting up camera 
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 960;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2, //left
  cameraWidth / 2, //right
  cameraHeight / 2, //top
  cameraHeight / -2, //bottom
  0, //near plane 
  1000 //far plane
);

camera.position.set(0, -210, 300);
camera.lookAt(0,0,0);

renderMap(cameraWidth, cameraHeight *2)
// Renderer

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene,camera);
document.body.appendChild(renderer.domElement);

// Car model 

const colors = [0x52523, 0xbdb638, 0x78b14b];

function car() {

  
  const car = new THREE.Group();
  const color = pickRandom(colors);


  const main = new THREE.Mesh(
  new THREE.BoxBufferGeometry(60,30,15),
  new THREE.MeshLambertMaterial({color: pickRandom(colors)})
);
  main.position.z = 12;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();
  carFrontTexture.center = new THREE.Vector2(0.5,0.5);
  carFrontTexture.rotation = Math.PI / 2;

  const carBackTexture = getCarFrontTexture();
  carBackTexture.center = new THREE.Vector2(0.5,0.5);
  carBackTexture.rotation = -Math.PI / 2;

  const carRightSideTexture = getCarSideTexture();
  const carLeftSideTexture = getCarSideTexture();

  carLeftSideTexture.flipY = false;
  const cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry(33,24,12),
    new THREE.MeshLambertMaterial({map: carFrontTexture}),
   new THREE.MeshLambertMaterial({map: carBackTexture}),
   new THREE.MeshLambertMaterial({map: carRightSideTexture}),
    new THREE.MeshLambertMaterial({map: carLeftSideTexture}),
    new THREE.MeshLambertMaterial({color: 0xffffff}),//top
    //new THREE.MeshLambertMaterial({color: 0xffffff}),//bottom 
  );
    cabin.position.x = -6;
    cabin.position.z = 25.5;
    car.add(cabin);

  const backWheel = wheel();
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = wheel();
    frontWheel.position.x = 18;
    car.add(frontWheel);

  return car;
}


function wheel() {
  const wheel = new THREE.Mesh(
    new THREE.BoxBufferGeometry(12,33,12),
    new THREE.MeshLambertMaterial({color: 0x333333})
  );
    wheel.position.z = 6;
    return wheel;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0,0,64,32);

  context.fillStyle = "#666666";
  context.fillRect(8,8,48,24);

  return new THREE.CanvasTexture(canvas);
}

function getCarSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0,0,128,32);

  context.fillStyle = "#666666";
  context.fillRect(10,8,38,24);
  context.fillRect(58,8,60,24);

  return new THREE.CanvasTexture(canvas);
}

const playerCar = car();
scene.add(playerCar);

function getTruckFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 32, 32);

  context.fillStyle = "#666666";
  context.fillRect(0, 5, 32, 10);

  return new THREE.CanvasTexture(canvas);
}

function getTruckSideTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 32, 32);

  context.fillStyle = "#666666";
  context.fillRect(17, 5, 15, 10);

  return new THREE.CanvasTexture(canvas);
}

function Truck() {
  const truck = new THREE.Group();
  const color = pickRandom(colors);

  const base = new THREE.Mesh(
    new THREE.BoxBufferGeometry(100, 25, 5),
    new THREE.MeshLambertMaterial({ color: 0xb4c6fc })
  );
  base.position.z = 10;
  truck.add(base);

  const cargo = new THREE.Mesh(
    new THREE.BoxBufferGeometry(75, 35, 40),
    new THREE.MeshLambertMaterial({ color: 0xffffff }) // 0xb4c6fc
  );
  cargo.position.x = -15;
  cargo.position.z = 30;
  cargo.castShadow = true;
  cargo.receiveShadow = true;
  truck.add(cargo);

  const truckFrontTexture = getTruckFrontTexture();
  truckFrontTexture.center = new THREE.Vector2(0.5, 0.5);
  truckFrontTexture.rotation = Math.PI / 2;

  const truckLeftTexture = getTruckSideTexture();
  truckLeftTexture.flipY = false;

  const truckRightTexture = getTruckSideTexture();

  const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(25, 30, 30), [
    new THREE.MeshLambertMaterial({ color, map: truckFrontTexture }),
    new THREE.MeshLambertMaterial({ color }), // back
    new THREE.MeshLambertMaterial({ color, map: truckLeftTexture }),
    new THREE.MeshLambertMaterial({ color, map: truckRightTexture }),
    new THREE.MeshLambertMaterial({ color }), // top
    new THREE.MeshLambertMaterial({ color }) // bottom
  ]);
  cabin.position.x = 40;
  cabin.position.z = 20;
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  truck.add(cabin);

  const backWheel = wheel();
  backWheel.position.x = -30;
  truck.add(backWheel);

  const middleWheel = wheel();
  middleWheel.position.x = 10;
  truck.add(middleWheel);

  const frontWheel = wheel();
  frontWheel.position.x = 38;
  truck.add(frontWheel);

  if (config.showHitZones) {
    truck.userData.hitZone1 = HitZone();
    truck.userData.hitZone2 = HitZone();
    truck.userData.hitZone3 = HitZone();
  }

  return truck;
}



function getLineMarkings(mapWidth, mapHeight) {
  const canvas = document.createElement("canvas");
  canvas.width = mapWidth;
  canvas.height = mapHeight;
  const context = canvas.getContext("2d");

  context.fillStyle = '#303030';
  context.fillRect(0, 0, mapWidth, mapHeight);

  context.lineWidth = 2;
  context.strokeStyle = "#FFDA33";
  context.setLineDash([10, 14]);

  // Left circle
  context.beginPath();
  context.arc(
    mapWidth / 2 - arcCenterX,
    mapHeight / 2,
    trackRadius,
    0,
    Math.PI * 2
  );
  context.stroke();

  // Right circle
  context.beginPath();
  context.arc(
    mapWidth / 2 + arcCenterX,
    mapHeight / 2,
    trackRadius,
    0,
    Math.PI * 2
  );
  context.stroke();

  return new THREE.CanvasTexture(canvas);
}

function positionScoreElement() {
  const arcCenterXinPixels = (arcCenterX / cameraWidth) * window.innerWidth;
  scoreElement.style.cssText = `
    left: ${window.innerWidth / 2 - arcCenterXinPixels * 1.3}px;
    top: ${window.innerHeight / 2}px
  `;
}

function positionInstructionElement() {
  
  const arcCenterXinPixels = (arcCenterX / cameraWidth) * window.innerWidth;
  instructionElement.style.cssText = `
    left: ${window.innerWidth/6 - arcCenterXinPixels}px;
    top: ${window.innerHeight/10}px
  `;
}

function renderMap(mapWidth, mapHeight) {
  const lineMarkingsTexture = getLineMarkings(mapWidth, mapHeight);

  const planeGeometry = new THREE.PlaneBufferGeometry(mapWidth, mapHeight);
  const planeMaterial = new THREE.MeshLambertMaterial({
    map: lineMarkingsTexture
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  
  scene.add(plane);
  //extruded geometry 
  const isLandLeft = getLeftIsland();
  const isLandRight = getRightIsland();
  const isLandMiddle = getMiddleIsland();
  const outerField = getOuterField(mapWidth, mapHeight);

  const fieldGeometry = new THREE.ExtrudeBufferGeometry(
    [isLandLeft, isLandMiddle, isLandRight, outerField],
    {depth: 6, bevelEnabled: false}
  );

  const fieldMesh = new THREE.Mesh(fieldGeometry, [
    new THREE.MeshLambertMaterial({color: 0xECA058}),
    new THREE.MeshLambertMaterial({color: 0xF89436}),
  ]);

  positionScoreElement();
  positionInstructionElement();
  scene.add(fieldMesh);

}

function getLeftIsland() {
  const isLandLeft = new THREE.Shape();
  isLandLeft.absarc (
    -arcCenterX,
    0,
    innerTrackRadius,
    arcAngle1,
    -arcAngle1,
    false
  );

  isLandLeft.absarc (
    arcCenterX,
    0,
    outerTrackRadius,
    Math.PI + arcAngle2,
    Math.PI - arcAngle2,
    true
  );

  return isLandLeft;
}


function getMiddleIsland() {
  const isLandMiddle = new THREE.Shape();
  isLandMiddle.absarc (
    -arcCenterX,
    0,
    innerTrackRadius,
    arcAngle3,
    -arcAngle3,
    true
  );

  isLandMiddle.absarc (
    arcCenterX,
    0,
    innerTrackRadius,
    Math.PI + arcAngle3,
    Math.PI - arcAngle3,
    true
  );

  return isLandMiddle;
}


function getRightIsland() {
  const isLandRight = new THREE.Shape();
  isLandRight.absarc (
    arcCenterX,
    0,
    innerTrackRadius,
    Math.PI - arcAngle1,
    Math.PI + arcAngle1,
    true
  );

  isLandRight.absarc (
    -arcCenterX,
    0,
    outerTrackRadius,
    -arcAngle2,
    arcAngle2,
    false
  );

  return isLandRight;
}

function getOuterField(mapWidth,mapHeight) {
  const field = new THREE.Shape();

  field.moveTo(-mapWidth/2, -mapHeight/2);
  field.lineTo(0, -mapHeight/2);

  field.absarc (
    -arcCenterX,
    0,
    outerTrackRadius,
    -arcAngle4,
    arcAngle4,
    true
  );
  field.absarc(
    arcCenterX,
    0,
    outerTrackRadius,
    Math.PI - arcAngle4,
    Math.PI + arcAngle4,
    true
  )

  field.lineTo(0, -mapHeight/2 );
  field.lineTo(mapWidth/2, -mapHeight/2);
  field.lineTo(mapWidth/2, mapHeight/2);
  field.lineTo(-mapWidth/2,mapHeight/2 );

  return field;
}

let accelerate = false;
let decelerate = false;

function movePlayerCar(timeDelta) {
  const playerSpeed = getPlayerSpeed();
  playerAngleMoved -= playerSpeed * timeDelta;

  const totalPlayerAngle = playerAngleInitial + playerAngleMoved;

  const playerX = Math.cos(totalPlayerAngle) * trackRadius - arcCenterX;
  const playerY = Math.sin(totalPlayerAngle) * trackRadius;

  playerCar.position.x = playerX;
  playerCar.position.y = playerY;

  playerCar.rotation.z = totalPlayerAngle - Math.PI / 2;
}

function getPlayerSpeed() {
  if(accelerate) return speed * 2;
  if(decelerate) return speed * 0.5;
  return speed;
}
//reset function 
const playerAngleInitial = Math.PI;
let ready;
let playerAngleMoved;
let score;

let otherVehicles = [];
const speed = 0.0017;
let lastTimestamp;

function moveOtherVehicles(timeDelta) {
  otherVehicles.forEach((vehicle) => {
    if (vehicle.clockwise) {
      vehicle.angle -= speed * timeDelta * vehicle.speed;
    } else {
      vehicle.angle += speed * timeDelta * vehicle.speed;
    }
    const vehicleX = Math.cos(vehicle.angle) * trackRadius + arcCenterX;
    const vehicleY = Math.sin(vehicle.angle) * trackRadius;
    const rotation = vehicle.angle + (vehicle.clockwise ? -Math.PI / 2 : Math.PI / 2);

    vehicle.mesh.position.x = vehicleX;
    vehicle.mesh.position.y = vehicleY;
    vehicle.mesh.rotation.z = rotation;
  });
}

function animation(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    return;
  }
  const timeDelta = timestamp - lastTimestamp;
  
  movePlayerCar(timeDelta);

  const laps = Math.floor(Math.abs(playerAngleMoved)/(Math.PI * 2));

  if(laps !== score) {
    score = laps;
    scoreElement.innerText =score;
  }
  lastTimestamp = timestamp;

  if (otherVehicles.length < (laps+1)/5) addVehicle();
  moveOtherVehicles(timeDelta);
  hitDetection();
  instructionElement.innerText = 'Press ⬆️ to accelerate Press ⬇️ to decelerate';

  renderer.render(scene, camera);
  lastTimestamp = timestamp;
  
}

function addVehicle() {
  const vehicleTypes = ["car", "truck"];
  const type = pickRandom(vehicleTypes);
  const mesh = type === "car" ? car() : Truck();
  scene.add(mesh);

  const clockwise = Math.random() >= 0.5;
  const angle = clockwise ? Math.PI / 2 : -Math.PI / 2;

  const  speed = getVehicleSpeed(type);

  otherVehicles.push({mesh, type, clockwise, angle, speed});
}


function getVehicleSpeed(type) {
  if (type === "car") {
    const minimumSpeed = 1;
    const maximumSpeed = 2;
    return minimumSpeed + Math.random() * (maximumSpeed - minimumSpeed);
  }
  if (type === "truck") {
    const minimumSpeed = 0.6;
    const maximumSpeed = 1.5;
    return minimumSpeed + Math.random() * (maximumSpeed - minimumSpeed);
  }
}

function getHitZonePosition(center, angle, clockwise, distance) {
  const directionAngle = angle + clockwise ? -Math.PI / 2 : +Math.PI / 2;
  return {
    x: center.x + Math.cos(directionAngle) * distance,
    y: center.y + Math.sin(directionAngle) * distance
  };
}


function hitDetection() {
  const playerHitZone1 = getHitZonePosition(
    playerCar.position,
    playerAngleInitial + playerAngleMoved,
    true,
    15
  );

  const playerHitZone2 = getHitZonePosition(
    playerCar.position,
    playerAngleInitial + playerAngleMoved,
    true,
    -15
  );

  if (config.showHitZones) {
    playerCar.userData.hitZone1.position.x = playerHitZone1.x;
    playerCar.userData.hitZone1.position.y = playerHitZone1.y;

    playerCar.userData.hitZone2.position.x = playerHitZone2.x;
    playerCar.userData.hitZone2.position.y = playerHitZone2.y;
  }

  const hit = otherVehicles.some((vehicle) => {
    if (vehicle.type === "car") {
      const vehicleHitZone1 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        15
      );

      const vehicleHitZone2 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        -15
      );

      if (config.showHitZones) {
        vehicle.mesh.userData.hitZone1.position.x = vehicleHitZone1.x;
        vehicle.mesh.userData.hitZone1.position.y = vehicleHitZone1.y;

        vehicle.mesh.userData.hitZone2.position.x = vehicleHitZone2.x;
        vehicle.mesh.userData.hitZone2.position.y = vehicleHitZone2.y;
      }

      if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
      if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;

      if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
    }
    if (vehicle.type === "truck") {
      const vehicleHitZone1 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        35
      );

      const vehicleHitZone2 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        0
      );

      const vehicleHitZone3 = getHitZonePosition(
        vehicle.mesh.position,
        vehicle.angle,
        vehicle.clockwise,
        -35
      );

      if (getDistance(playerHitZone1, vehicleHitZone1) < 40) return true;
      if (getDistance(playerHitZone1, vehicleHitZone2) < 40) return true;
      if (getDistance(playerHitZone1, vehicleHitZone3) < 40) return true;

      if (getDistance(playerHitZone2, vehicleHitZone1) < 40) return true;
    }
  });

  if (hit) {
    if (resultsElement) resultsElement.style.display = "flex";
    renderer.setAnimationLoop(null); // Stop animation loop
  }
}

function getDistance(coordinate1, coordinate2) {
  return Math.sqrt(
    (coordinate2.x - coordinate1.x) ** 2 + (coordinate2.y - coordinate1.y) ** 2
    );
  
}

reset ();
function reset() {
  playerAngleMoved = 0;
  score = 0;
  movePlayerCar(0);
  //scene = 0;
  lastTimestamp = undefined;
  scoreElement.innerText = score;

  otherVehicles.forEach((vehicle) => {
    scene.remove(vehicle.mesh);
  });
  scoreElement.innerText = "Press UP";
  resultsElement.style.display = "none";

  otherVehicles = [];
  renderer.render(scene,camera);
  ready = true;
}

function startGame() {
  if (ready) {
    ready = false;
    scoreElement.innerText = 0;
    renderer.setAnimationLoop(animation);
  }
}

window.addEventListener('resize', function ()
{
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width/height;
  camera.updateProjectionMatrix();
  positionScoreElement();
  positionInstructionElement();
});




window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") {
    startGame();
    accelerate = true;
    return;
  }

  if (event.key === "ArrowDown") {
    decelerate = true;
    return;
  }

  if (event.key === "R" || event.key === "r" ) {
    reset();
    return;
  }
});

window.addEventListener("keyup", function(event) {
  if (event.key === "ArrowUp") {
    accelerate = false;
    return;
  }
  if (event.key === "ArrowDown") {
    decelerate = false;
    return;
  }
});


// function animate() {
// 	requestAnimationFrame( animate );
// 	renderer.render( scene, camera );
// }
// animate();