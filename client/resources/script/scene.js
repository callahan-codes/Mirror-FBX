// IMPORTS
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.js'
import { Reflector } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/objects/Reflector.js'
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/FBXLoader.js'

// INITIALIZE VARIABLES
let renderer, scene, camera, mirror, mixer

// RENDERER
renderer = new THREE.WebGLRenderer({canvas: document.querySelector(".scene #canvas"), antialias: true, alpha: true})   
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap    

// CAMERA
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 )
camera.position.set( 15, 1.5, 0 )

// SCENE
scene = new THREE.Scene()

// Lights
const light1 = new THREE.DirectionalLight(0xffffff)
light1.position.set(0, 0, 20)
scene.add(light1)

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)

// LOADING MANAGER
const loadingManager = new THREE.LoadingManager( () => {
	
    const loadingScreen = document.getElementById( 'loading-screen' );
    loadingScreen.classList.add( 'fade-out' );
});


// MIRROR
let geometry
geometry = new THREE.CircleGeometry( 5, 64 )
mirror = new Reflector( geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0xb5b5b5
} );
mirror.position.y = -2
mirror.rotateX( - Math.PI / 2 )
scene.add( mirror )

// MODEL
const loader = new FBXLoader(loadingManager)
loader.load('resources/script/model/goblin_d_shareyko.fbx', (fbx) => {
    
    fbx.scale.setScalar(0.02)
    fbx.position.y = -2
    
    // animation
    const anim = new FBXLoader()
    anim.load('resources/script/model/hip_hop_dance.fbx', (anim) => {
        mixer = new THREE.AnimationMixer(fbx)
        const idle = mixer.clipAction(anim.animations[0])
        idle.play()
    })
    scene.add(fbx)
})

// REZISE
function resizeCanvasToDisplaySize() {

    // get canvas, hieght/width
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // if new width != old width or same w/ height
    if (canvas.width !== width ||canvas.height !== height) {

        // reset render size
        renderer.setSize(width, height, false)
        // reset camera
        camera.aspect = width / height
        camera.updateProjectionMatrix()

        mirror.getRenderTarget().setSize(
            window.innerWidth * window.devicePixelRatio,
            window.innerHeight * window.devicePixelRatio
        );
    }
}

// ANIMATION
function animate() {

    // animate frame
    requestAnimationFrame(animate)

    // resize check
    resizeCanvasToDisplaySize()

    // controls
    controls.update()

    // update animation
    mixer.update(0.01)

    // render ittttt
    renderer.render(scene, camera)
}
requestAnimationFrame(animate)