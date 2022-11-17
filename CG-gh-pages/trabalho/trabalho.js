import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import {
    initRenderer,
    initDefaultBasicLight,
    setDefaultMaterial,
} from "../libs/util/util.js";
import { CSG } from '../libs/other/CSGMesh.js'
import { FontLoader } from '../build/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../build/jsm/geometries/TextGeometry.js';


let colisions = [];

let scene, renderer, material, light;
scene = new THREE.Scene();
renderer = initRenderer();
material = setDefaultMaterial();
light = initDefaultBasicLight(scene);
var keyboard = new KeyboardState();
let clock = new THREE.Clock();

let tileMaterial = setDefaultMaterial('rgb(223,195,156,255)');
let tileMaterialSelected = setDefaultMaterial('rgb(246,2,150)');
let groundMaterial = setDefaultMaterial('rgb(220,195,156,254)');
let groundMaterialDecoration = setDefaultMaterial('rgb(61,18,3)');

let groundMaterialGreen = setDefaultMaterial('#466D1D');
let groundMaterialRed = setDefaultMaterial('#610C04');
let groundMaterialBlue = setDefaultMaterial('#3151E3D');
let groundMaterialGrey = setDefaultMaterial('#2C3E4C');

let invisibleColor = 0xFFFFFF;

let collisionMaterial = new THREE.MeshPhongMaterial({
    color: invisibleColor,
    opacity: 0.0
    ,
    transparent: true,
});
var man = null;
var mixer = new Array();

// create a characterBox
let cubeGeometry = new THREE.BoxGeometry(0.0002, 2, 0.0002);
let characterBox = new THREE.Mesh(cubeGeometry, collisionMaterial);
characterBox.position.set(0.0, 3, 0.0);
scene.add(characterBox);

const loader = new FontLoader();
loader.load('../libs/util/snow_Candy_Regular.json', (font) => {
    const textGeometry = new TextGeometry('Hello World', {
        height: 2,
        size: 10,
        font: font,
    });
    const textMaterial = new THREE.MeshNormalMaterial();
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.x = -36;
    textMesh.position.y = 5;
    scene.add(textMesh);
});



//========================================================================================================//
//=========================================elementos do ambiente==========================================//

// escada 
function createStairs(size) {

    let degrau = new THREE.BoxGeometry(5.2, 0.2, 0.8);
    for (var i = 1; i < 10; i++) {


        let degrau1 = new THREE.Mesh(degrau, groundMaterial);

        degrau1.position.set(0, 0.2 * i, 25.5 + (i * 0.5));
        scene.add(degrau1);
        let deegBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        deegBB.setFromObject(degrau1);
        colisions.push(deegBB);
    }

    for (var i = 1; i < 10; i++) {


        let degrau1 = new THREE.Mesh(degrau, groundMaterial);

        degrau1.position.set(0, -0.2 * i, -(26.5 + (i * 0.5)));
        scene.add(degrau1);
        let deegBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        deegBB.setFromObject(degrau1);
        colisions.push(deegBB);
    }

    for (var i = 1; i < 10; i++) {

        let degrau1 = new THREE.Mesh(degrau, groundMaterial);
        degrau1.rotateY(1.5708);
        degrau1.position.set((25.5 + (i * 0.5)), -0.2 * i, 0);
        scene.add(degrau1);
        let deegBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        deegBB.setFromObject(degrau1);
        colisions.push(deegBB);
    }

    for (var i = 1; i < 10; i++) {

        let degrau1 = new THREE.Mesh(degrau, groundMaterial);
        degrau1.position.set(-(25.5 + (i * 0.5)), 0.2 * i, 0);
        degrau1.rotateY(1.5708);
        scene.add(degrau1);
        let deegBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        deegBB.setFromObject(degrau1);
        colisions.push(deegBB);
    }

}

function createArch(size) {
    let retangleMesh = new THREE.Mesh(new THREE.BoxGeometry(7.5, 10, 0.99));
    let sphereMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.51, 2.5, 10, 32));
    let retangleMesh2 = new THREE.Mesh(new THREE.BoxGeometry(5.02, 10, 1));
    /////////////////////////////////
    sphereMesh.position.set(0, 2, 0);
    sphereMesh.rotateX(1.5708);
    sphereMesh.matrixAutoUpdate = false;
    sphereMesh.updateMatrix();

    let SphereCSG = CSG.fromMesh(sphereMesh);
    let retangleCSG = CSG.fromMesh(retangleMesh);
    let csgObj = retangleCSG.subtract(SphereCSG);

    //////////////////////////////////////////////
    retangleMesh2.position.set(0, -3, 0);
    retangleMesh2.matrixAutoUpdate = false;
    retangleMesh2.updateMatrix();

    retangleCSG = CSG.fromMesh(retangleMesh2);
    csgObj = csgObj.subtract(retangleCSG);

    let arch1 = CSG.toMesh(csgObj, new THREE.Matrix4());
    arch1.material = groundMaterial;
    let arch2 = CSG.toMesh(csgObj, new THREE.Matrix4());
    arch2.material = groundMaterial;
    let arch3 = CSG.toMesh(csgObj, new THREE.Matrix4());
    arch3.material = groundMaterial;
    let arch4 = CSG.toMesh(csgObj, new THREE.Matrix4());
    arch4.material = groundMaterial;

    arch1.position.set(0, 5, (size / 2) - 1);
    arch2.position.set(0, 5, -(size / 2));

    arch3.position.set((size / 2) - 1, 5, 0);
    arch4.position.set(-(size / 2), 5, 0);

    arch3.rotateY(1.5708);
    arch4.rotateY(1.5708);

    scene.add(arch1);
    scene.add(arch2);
    scene.add(arch3);
    scene.add(arch4);
}

//========================================================================================================//
//=========================================CRIAÇÃO DO AMBIENTE============================================//
//criação de tile
let block = new THREE.BoxGeometry(1, 1, 1);
let decoration = new THREE.BoxGeometry(0.9, 1.1, 0.9);

function createTile(x, y, z, c, collor) {
    if (c == 0 || c == 2) {
        let tile = new THREE.Mesh(block, groundMaterialDecoration);
        let decoration1 = new THREE.Mesh(decoration, groundMaterial);
        let decoration2 = new THREE.Mesh(decoration, groundMaterial);
        let decoration3 = new THREE.Mesh(decoration, groundMaterial);


        if (collor == 1) {
            decoration1.material = groundMaterialGreen;
            decoration2.material = groundMaterialGreen;
            decoration3.material = groundMaterialGreen;
        }

        else if (collor == 2) {
            decoration1.material = groundMaterialBlue;
            decoration2.material = groundMaterialBlue;
            decoration3.material = groundMaterialBlue;
        }
        else if (collor == 3) {
            decoration1.material = groundMaterialGrey;
            decoration2.material = groundMaterialGrey;
            decoration3.material = groundMaterialGrey;
        }

        else if (collor == 4) {
            decoration1.material = groundMaterialRed;
            decoration2.material = groundMaterialRed;
            decoration3.material = groundMaterialRed;
        }


        tile.position.set(x, y, z);
        scene.add(tile);

        tile.add(decoration1);
        decoration2.rotateZ(THREE.MathUtils.degToRad(90));
        tile.add(decoration2);
        decoration3.rotateX(THREE.MathUtils.degToRad(90));
        tile.add(decoration3);

        let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        cubeBB.setFromObject(tile);

        return cubeBB;
    }
    else {
        let tile = new THREE.Mesh(block, tileMaterial);
        tile.position.set(x, y, z);
        scene.add(tile);
        let cubeBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        cubeBB.setFromObject(tile);

        return cubeBB;
    }
}
//adiciona os blocos criados a um vetor de colisoes

let max = 52;

createArch(52);
createStairs(52);



//=====================================================nivel 0===============================================================//
for (var i = 0; i < max; i++) {
    for (var j = 0; j < max; j++) {
        colisions.push(createTile(i + ((max / 2) * -1), -0.5, j + ((max / 2) * -1), 0));
    }
}

//wall bounds
for (var i = 0; i < max; i++) {
    if (!(i >= ((max / 2) - 2) && i < ((max / 2) + 3)))//porta
        colisions.push(createTile(i - (max / 2), 0.5, (max / 2) - 1, 0));
}
for (var i = 0; i < max; i++) {
    if (!(i >= ((max / 2) - 2) && i < ((max / 2) + 3)))//porta
        colisions.push(createTile(i - (max / 2), 0.5, -1 * (max / 2), 0));
}
for (var i = 0; i < max; i++) {
    if (!(i >= ((max / 2) - 2) && i < ((max / 2) + 3)))//porta
        colisions.push(createTile(-1 * max / 2, 0.5, i - (max / 2), 0));
}
for (var i = 0; i < max; i++) {
    if (!(i >= ((max / 2) - 2) && i < ((max / 2) + 3)))//porta
        colisions.push(createTile((max / 2) - 1, 0.5, i - (max / 2), 0));
}
//=============================================================================================================================//



//=====================================================nivel 1===============================================================//

// plataform
for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 38; j++) {
        colisions.push(createTile(i - 11, -2.5, j - 68, 0, 1));
    }
}

//wals

for (var i = 0; i < 26; i++) {
    if (!(i >= 9 && i <= 13))
        colisions.push(createTile(i - 11, -1.5, -68, 0, 1));
}
for (var i = 0; i < 26; i++) {
    if (!(i >= 9 && i <= 13))
        colisions.push(createTile(i - 11, -1.5, -31, 0, 1));
}
for (var i = 0; i < 38; i++) {
    colisions.push(createTile(-11, -1.5, i - 68, 0, 1));
}
for (var i = 0; i < 38; i++) {
    colisions.push(createTile(14, -1.5, i - 68, 0, 1));
}

//obj

for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 14; j++) {
        colisions.push(createTile(i - 5, -2.5, -87 + j, 0, 1));
    }
}


//=============================================================================================================================//



//=====================================================nivel 2===============================================================//

//plataform
for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 38; j++) {
        colisions.push(createTile(i - 11, 1.5, j + 31, 0, 2));
    }
}

//walls
for (var i = 0; i < 26; i++) {
    if (!(i >= 9 && i <= 13))
        colisions.push(createTile(i - 11, 2.5, 31, 0, 2));
}
for (var i = 0; i < 26; i++) {
    if (!(i >= 9 && i <= 13))
        colisions.push(createTile(i - 11, 2.5, 68, 0, 2));
}
for (var i = 0; i < 38; i++) {
    colisions.push(createTile(-11, 2.5, i + 31, 0, 2));
}
for (var i = 0; i < 38; i++) {
    colisions.push(createTile(14, 2.5, i + 31, 0, 2));
}

//objs

for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 14; j++) {
        colisions.push(createTile(i - 5, 1.5, 69 + j, 0, 1));
    }
}


//=============================================================================================================================//





//=====================================================nivel 3===============================================================//
//plataform

for (var i = 0; i < 50; i++) {
    for (var j = 0; j < 25; j++) {
        colisions.push(createTile(i + 30, -2.5, j - 11, 0, 3));
    }
}
//walls 

for (var i = 0; i < 50; i++) {
    colisions.push(createTile(30 + i, -1.5, -11, 0, 3));
}
for (var i = 0; i < 50; i++) {
    colisions.push(createTile(30 + i, -1.5, 13, 0, 3));
}
for (var i = 0; i < 25; i++) {
    if (!(i >= 9 && i <= 13))
        colisions.push(createTile(30, -1.5, i - 11, 0, 3));
}
for (var i = 0; i < 25; i++) {
    if (!(i >= 9 && i <= 13))
        colisions.push(createTile(79, -1.5, i - 11, 0, 3));
}


//objs
for (var i = 0; i < 14; i++) {
    for (var j = 0; j < 11; j++) {
        colisions.push(createTile(i + 80, -2.5, j - 5, 0, 3));
    }
}

//walls


//=============================================================================================================================//


//=======================================================nivel final===========================================================//

for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 11; j++) {
        colisions.push(createTile(i - 40, 1.5, j - 5, 0, 4));
    }
}

//============================================================================================================================//




//========================================================================================================//
//===========================================CRIAÇÃO DAS CAMERAS==========================================//
// variavel para a troca de camera
let cameraControl = true;

let camParam = 90;
let camera1 = new THREE.OrthographicCamera(-window.innerWidth / camParam, window.innerWidth / camParam, window.innerHeight / camParam, window.innerHeight / -camParam, -camParam, camParam);
let camera2 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

let cameraHolder1 = new THREE.Object3D();
cameraHolder1.add(camera1);
characterBox.add(cameraHolder1);

let cameraHolder2 = new THREE.Object3D();
cameraHolder2.add(camera2);
characterBox.add(cameraHolder2);

var camera = camera1;
//posicionamento das cameras
cameraHolder1.translateX(6);
cameraHolder1.translateY(3);
cameraHolder1.translateZ(6);
cameraHolder1.rotateY(0.79);
cameraHolder1.rotateX(-0.5);

cameraHolder2.translateX(10);
cameraHolder2.translateY(12);
cameraHolder2.translateZ(10);
cameraHolder2.rotateY(0.79);
cameraHolder2.rotateX(-0.79);
//========================================================================================================//
//========================================================================================================//






//========================================================================================================//
//*******************************Sistema de Colisão e Seleção de Objetsos******************************** */
let collisionGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.5);
let collisionGeometryGravity = new THREE.BoxGeometry(0.001, 3, 0.001);


let collision1 = new THREE.Mesh(collisionGeometry, collisionMaterial);
let collision2 = new THREE.Mesh(collisionGeometry, collisionMaterial);
let collision3 = new THREE.Mesh(collisionGeometry, collisionMaterial);
let collision4 = new THREE.Mesh(collisionGeometry, collisionMaterial);

let collisionGround = new THREE.Mesh(collisionGeometryGravity, collisionMaterial);

collision3.rotateY(1.5708);
collision4.rotateY(1.5708);

collision1.position.set(0.3, -0.5, 0);
collision2.position.set(-0.3, -0.5, 0);
collision3.position.set(0, -0.5, -0.3);
collision4.position.set(0, -0.5, 0.3);

characterBox.add(collision1); //D
characterBox.add(collision2); //A
characterBox.add(collision3); //W
characterBox.add(collision4); //S

characterBox.add(collisionGround);


// colisão cube
let cube1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube1BB.setFromObject(characterBox);

let D1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube1BB.setFromObject(collision1);

let A1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube1BB.setFromObject(collision2);

let W1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube1BB.setFromObject(collision3);

let S1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube1BB.setFromObject(collision4);


let G1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cube1BB.setFromObject(collisionGround);



function checkCollisions() {
    var fall = 0
    var jump = false;

    for (var i = 0; i < colisions.length; i++) {
        if (colisions[i].intersectsBox(cube1BB)) { jump = true; }
        if (colisions[i].intersectsBox(D1BB)) { offD = false; }
        if (colisions[i].intersectsBox(S1BB)) { offS = false; }
        if (colisions[i].intersectsBox(A1BB)) { offA = false; }
        if (colisions[i].intersectsBox(W1BB)) { offW = false; }
        if (colisions[i].intersectsBox(G1BB)) { fall = fall + 1; }
    }
    console.log(fall);

    if (jump) {
        characterBox.translateY(0.1);
    }

    if (fall < 1) {
        cair();
    }

}

function cair() {
    characterBox.translateY(-0.1);
}



//Detecta clicks nos blocos clicáveis
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();

window.addEventListener('click', Event => {
    clickMouse.x = (Event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(Event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(clickMouse, camera);
    const found = raycaster.intersectObject(scene);

    if (found[0] != null && (found[0].object.material == tileMaterial || found[0].object.material == tileMaterialSelected)) {
        if (found[0].object.material == tileMaterial)
            found[0].object.material = tileMaterialSelected;
        else
            found[0].object.material = tileMaterial;
    }
});
//*********************************************************************************************************/
//========================================================================================================//







//==========================================CARREGA O MODELO================================================//
// Load animated files
loadGLTFFile('../assets/objects/walkingMan.glb', false);

function loadGLTFFile(modelName) {
    var loader = new GLTFLoader();
    loader.load(modelName, function (gltf) {
        var obj = gltf.scene;
        obj.traverse(function (child) {
            if (child) {
                child.castShadow = true;
            }
        });
        obj.traverse(function (node) {
            if (node.material) node.material.side = THREE.DoubleSide;
        });
        // The man around will have a different geometric transformation

        man = obj;
        characterBox.add(man);

        man.position.set(0, -1.1, 0);

        // Create animationMixer and push it in the array of mixers
        var mixerLocal = new THREE.AnimationMixer(obj);
        mixerLocal.clipAction(gltf.animations[0]).play();
        mixer.push(mixerLocal);
    }, onProgress, onError);
}

function onError() { };

function onProgress(xhr, model) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
    }
}
//==========================================================================================================//
//==========================================================================================================//








//========================================================================================================//
//==============================================MOVIMENTAÇÃO==============================================//
// variavel controle de movimento
var offA = true;
var offS = true;
var offW = true;
var offD = true;

var degreeAtt = 0;
var target = 0;

//controles teclado 
function keyboardUpdate() {

    keyboard.update();
    var speed = 7;
    var moveDistance = speed * clock.getDelta();
    var partialDegree = 0;
    var pressedKeys = 0;


    if (keyboard.down("C")) {
        if (cameraControl) {
            camera = camera2;
            cameraControl = false;
        }
        else {
            camera = camera1;
            cameraControl = true;
        }
    }



    if ((keyboard.pressed("A") || keyboard.pressed("left")) && offA && (keyboard.pressed("W") || keyboard.pressed("up")) && offW) {
        characterBox.translateX(-moveDistance);
        partialDegree = partialDegree + 270;
        pressedKeys++;

    } else if ((keyboard.pressed("D") || keyboard.pressed("right")) && offD && (keyboard.pressed("W") || keyboard.pressed("up")) && offW) {
        characterBox.translateZ(-moveDistance);
        partialDegree = partialDegree + 180;
        pressedKeys++;

    } else if ((keyboard.pressed("D") || keyboard.pressed("right")) && offD && (keyboard.pressed("S") || keyboard.pressed("down")) && offS) {
        characterBox.translateX(moveDistance);
        partialDegree = partialDegree + 90;
        pressedKeys++;

    } else if ((keyboard.pressed("A") || keyboard.pressed("left")) && offA && (keyboard.pressed("S") || keyboard.pressed("down")) && offS) {
        characterBox.translateZ(moveDistance);
        partialDegree = 0;
        pressedKeys++;

    } else {
        var axisA = new THREE.Vector3(-0.75, 0, 0.75);
        var axisS = new THREE.Vector3(0.75, 0, 0.75);
        var axisD = new THREE.Vector3(0.75, 0, -0.75);
        var axisW = new THREE.Vector3(-0.75, 0, -0.75);

        if ((keyboard.pressed("A") || keyboard.pressed("left")) && offA) {
            characterBox.translateOnAxis(axisA, moveDistance);

            partialDegree = partialDegree + 315;
            pressedKeys++;
        }

        if ((keyboard.pressed("S") || keyboard.pressed("down")) && offS) {
            characterBox.translateOnAxis(axisS, moveDistance);
            partialDegree = partialDegree + 45;
            pressedKeys++;
        }

        if ((keyboard.pressed("D") || keyboard.pressed("right")) && offD) {
            characterBox.translateOnAxis(axisD, moveDistance);
            partialDegree = partialDegree + 135;
            pressedKeys++;
        }

        if ((keyboard.pressed("W") || keyboard.pressed("up")) && offW) {
            characterBox.translateOnAxis(axisW, moveDistance);
            partialDegree = partialDegree + 225;
            pressedKeys++;
        }

    }


    if (pressedKeys) {
        for (var i = 0; i < mixer.length; i++)
            mixer[i].update(moveDistance / 5);
        target = partialDegree;
    }
    if (target != degreeAtt) {
        ratationAnimation();
    }

    offD = true;
    offS = true;
    offA = true;
    offW = true;
}

//Rotation Handler
function ratationAnimation() {
    var velocity = 0;
    var a = target - degreeAtt;
    var b = target - degreeAtt + 360;
    var y = target - degreeAtt - 360;

    var shortest = a;
    if ((b * b) < (shortest * shortest))
        shortest = b;
    if ((y * y) < (shortest * shortest))
        shortest = y;

    if (shortest < 0) {
        velocity = -5;
    }
    else
        velocity = 5;

    man.rotateY(THREE.MathUtils.degToRad(velocity));
    if (velocity < 0 && degreeAtt == 0)
        degreeAtt = 360;

    degreeAtt = degreeAtt + velocity;
    degreeAtt = degreeAtt % 360;
}
//========================================================================================================//
//========================================================================================================//

render();
function render() {

    cube1BB.copy(characterBox.geometry.boundingBox).applyMatrix4(characterBox.matrixWorld);
    D1BB.copy(collision1.geometry.boundingBox).applyMatrix4(collision1.matrixWorld);
    S1BB.copy(collision4.geometry.boundingBox).applyMatrix4(collision4.matrixWorld);
    A1BB.copy(collision2.geometry.boundingBox).applyMatrix4(collision2.matrixWorld);
    W1BB.copy(collision3.geometry.boundingBox).applyMatrix4(collision3.matrixWorld);
    G1BB.copy(collisionGround.geometry.boundingBox).applyMatrix4(collisionGround.matrixWorld);

    checkCollisions();
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera);
}