import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from "cannon-es";

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, .1, 1000);
camera.updateProjectionMatrix();

const orbit = new OrbitControls(camera,renderer.domElement);

camera.position.set(10,10,0);
orbit.update();

const gridHelper = new THREE.GridHelper(20);
scene.add(gridHelper);

//__________Lights_____________

const ambLight = new THREE.AmbientLight({color: 0xFFFFFF});
scene.add(ambLight);

const dirLight = new THREE.DirectionalLight({color: 0xFFFFFF});
scene.add(dirLight);

//___________Gravity_____________

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.8,0)
});

//___________Board_____________


const board = new THREE.Mesh(
    new THREE.BoxGeometry(6,10),
    new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    })
);

//board.rotateX(30);
scene.add(board);

const boardPMat = new CANNON.Material();

const boardBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(3,5,.5)),
    material: boardPMat
});
boardBody.quaternion.setFromEuler(-Math.PI / -1.82,0,0);
world.addBody(boardBody);

const leftSide = new THREE.Mesh(
    new THREE.BoxGeometry(.5,11,1.5),
    new THREE.MeshStandardMaterial({
        color: 0xFFFF00
    })
);
//leftSide.position.set(-3,.25,0);
//leftSide.rotateX(30);
scene.add(leftSide);

const LeftBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(.25,5.5,.75)),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(-3,.25,0)
});
LeftBody.quaternion.setFromEuler(Math.PI/1.82,0,0);
world.addBody(LeftBody);

const rightSide = new THREE.Mesh(
    new THREE.BoxGeometry(.5,11,1.5),
    new THREE.MeshStandardMaterial({
        color: 0xFFFF00
    })
);
//rightSide.position.set(3,.25,0);
//rightSide.rotateX(30);
scene.add(rightSide);

const RightBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(.25,5.5,.75)),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(3,.25,0)
});
RightBody.quaternion.setFromEuler(Math.PI/1.82,0,0);
world.addBody(RightBody);


const topSide = new THREE.Mesh(
    new THREE.BoxGeometry(6,.7,1.5),
    new THREE.MeshStandardMaterial({
        color: 0xFFFF00
    })
);
topSide.position.set(0,1.05,-5.1);
topSide.rotateX(30);
scene.add(topSide);

const TopBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(3,.35,.75)),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(0,1.05,-5.1)
});
TopBody.quaternion.setFromEuler(Math.PI/1.82,0,0);
world.addBody(TopBody);

const bottomSide = new THREE.Mesh(
    new THREE.BoxGeometry(6,.7,1.5),
    new THREE.MeshStandardMaterial({
        color: 0xFFFF00
    })
);
bottomSide.position.set(0,-.55,5.1);
bottomSide.rotateX(30);
scene.add(bottomSide);

const BottomBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(3,.35,.75)),
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(0,-.55,5.1)
});
BottomBody.quaternion.setFromEuler(Math.PI/1.82,0,0);
world.addBody(BottomBody);

//___________Paddles___________

const lPaddle = new THREE.Mesh(
    new THREE.BoxGeometry(1.5,.5,.5),
    new THREE.MeshStandardMaterial({color: 0x00FF00})
);
scene.add(lPaddle);

const PaddleMat = new CANNON.Material();  

const lPaddleBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(.75,.25,.25)),
    material: PaddleMat,
    position: new CANNON.Vec3(-.8,-.002,3)
});
lPaddleBody.quaternion.setFromEuler(Math.PI/1.82,0,.3);
world.addBody(lPaddleBody);

const rPaddle = new THREE.Mesh(
    new THREE.BoxGeometry(1.5,.5,.5),
    new THREE.MeshStandardMaterial({color: 0x00FF00})
);
scene.add(rPaddle);

const rPaddleBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(.75,.25,.25)),
    material: PaddleMat,
    position: new CANNON.Vec3(.8,-.002,3)
});
rPaddleBody.quaternion.setFromEuler(Math.PI/1.82,0,-.3);
world.addBody(rPaddleBody);


//___________Ball______________

const ball = new THREE.Mesh(
    new THREE.SphereGeometry(.25),
    new THREE.MeshStandardMaterial({color: 0xFFFF00})
);
scene.add(ball);

const ballPMat = new CANNON.Material();

const ballBody = new CANNON.Body({
    shape: new CANNON.Sphere(.125),
    mass: .1,
    position: new CANNON.Vec3(0,6,0),
    material: ballPMat
});
world.addBody(ballBody);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
});

//_______________Contact Material______________
const boardBallContact = new CANNON.ContactMaterial(
    boardPMat,
    ballPMat,
    {friction: 0.1}
);
world.addContactMaterial(boardBallContact);

var paddleBallContact = new CANNON.ContactMaterial(
    ballPMat,
    PaddleMat,
    {restitution: 1 }
);
world.addContactMaterial(paddleBallContact);

//__________Events___________
window.addEventListener('keydown', function(e){
    if(e.code === 'ArrowLeft')
    {
        lPaddleBody.quaternion.setFromEuler(Math.PI/1.82,0,-.3);
    }
    if(e.code === 'ArrowRight')
    {
        rPaddleBody.quaternion.setFromEuler(Math.PI/1.82,0,.3);
    }
});
window.addEventListener('keyup', function(e){
    if(e.code === 'ArrowLeft'){
        lPaddleBody.quaternion.setFromEuler(Math.PI/1.82,0,.3);
    }
    if(e.code === 'ArrowRight')
    {
        rPaddleBody.quaternion.setFromEuler(Math.PI/1.82,0,-.3);
    }
});

const timestep = 1/60;

function animate()
{
    world.step(timestep);

    board.position.copy(boardBody.position);
    board.quaternion.copy(boardBody.quaternion);

    lPaddle.position.copy(lPaddleBody.position);
    lPaddle.quaternion.copy(lPaddleBody.quaternion);

    rPaddle.position.copy(rPaddleBody.position);
    rPaddle.quaternion.copy(rPaddleBody.quaternion);

    leftSide.position.copy(LeftBody.position);
    leftSide.quaternion.copy(LeftBody.quaternion);
    rightSide.position.copy(RightBody.position);
    rightSide.quaternion.copy(RightBody.quaternion);
    topSide.position.copy(TopBody.position);
    topSide.quaternion.copy(TopBody.quaternion);
    bottomSide.position.copy(BottomBody.position);
    bottomSide.quaternion.copy(BottomBody.quaternion);
    ball.position.copy(ballBody.position);
    ball.quaternion.copy(ballBody.quaternion);
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate);

renderer.render(scene,camera);
