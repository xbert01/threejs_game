import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();

// Adding light 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(100,-300,400);
scene.add(dirLight);

//Setting up camera 
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2, //left
  cameraWidth / 2, //right
  cameraHeight / 2, //top
  cameraHeight / -2, //bottom
  0, //near plane 
  1000 //far plane
);

camera.position.set(200, -200, 300);
camera.up.set(0,0,1);
camera.lookAt(0,0,0);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene,camera);

document.body.appendChild(renderer.domElement);

// Car model 

const colors = [0x52523, 0xbdb638, 0x78b14b];
function car(){
const car = new THREE.Group();

  const backWheel = wheel();
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = wheel();
    frontWheel.position.x = 18;
    car.add(frontWheel);

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(12,33,12),
    new THREE.MeshLambertMaterial({color: pickRandom(colors)})
  );
    main.position.z = 12;
    car.add(main);

    const cabin = new THREE.Mesh(
      new THREE.BoxBufferGeometry(33,24,12),
      new THREE.MeshLambertMaterial({color: 0xffffff})
    );
      cabin.position.x = -6;
      cabin.position.z = 25.5;
      car.add(cabin);

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

function pickRandom() {
  return array[Math.floor(Math.random() * array.length)];
}

function getCarFrontTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
}