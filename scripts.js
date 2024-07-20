// Scene, Camera, and Renderer Setup
const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

let model;

// Define a single material with a texture
const textureLoader = new THREE.TextureLoader();
const textureGrey = textureLoader.load("Tex_01.jpg");
const materialGrey = new THREE.MeshStandardMaterial({ map: textureGrey });

const textureRed = textureLoader.load("Tex_02.jpg"); // Example red texture
const materialRed = new THREE.MeshStandardMaterial({ map: textureRed });

const textureBlue = textureLoader.load("Tex_03.jpg"); // Example blue texture
const materialBlue = new THREE.MeshStandardMaterial({ map: textureBlue });



// Load the 3D Model
const loader = new THREE.GLTFLoader();
loader.load('Preview.glb', function(gltf) {
    model = gltf.scene;
    scene.add(model);

    const bbox = new THREE.Box3().setFromObject(model);
    const center = bbox.getCenter(new THREE.Vector3());
    model.position.sub(center);

    // Reduce the model scale
    model.scale.set(6, 6, 6);

    // Set initial rotation to ensure the model starts from the front view
    model.rotation.y = 5;
    
    camera.position.set(3, 0, 45);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, -1, -1);
    light.intensity = 1;
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    renderer.render(scene, camera);
}, undefined, function(error) {
    console.error('An error happened while loading the model:', error);
});

/// Function to change model material
function changeMaterial(material) {
    if (model) {
        model.traverse((o) => {
            if (o.isMesh) {
                o.material = material;
            }
        });
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}
animate();

// DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    const marker = document.getElementById('marker');
    const rightArrow = document.getElementById('right-arrow');
    const leftArrow = document.getElementById('left-arrow');

    const isMobile = window.innerWidth <= 768; // Adjust the width as per your requirement
    const desktopPositions = ['25.3rem', '27rem', '23.8rem'];
    const mobilePositions = ['-6.2rem', '-4.5rem', '-7.8rem'];
    const positions = isMobile ? mobilePositions : desktopPositions;
    let currentPositionIndex = 0;

    rightArrow.addEventListener('click', () => {
        if (positions[currentPositionIndex] === positions[1] || 
            (positions[currentPositionIndex] === positions[2] && currentPositionIndex !== 2)) {
            return;
        }

        currentPositionIndex = (currentPositionIndex + 1) % positions.length;
        moveMarker(positions[currentPositionIndex]);
        zoomEffect(marker);
        updateMaterial();  // Update material based on the new position
    });

    leftArrow.addEventListener('click', () => {
        if (positions[currentPositionIndex] === positions[2] || 
            (positions[currentPositionIndex] === positions[1] && currentPositionIndex !== 1)) {
            return;
        }

        currentPositionIndex = (currentPositionIndex - 1 + positions.length) % positions.length;
        moveMarker(positions[currentPositionIndex]);
        zoomEffect(marker);
        updateMaterial();  // Update material based on the new position
    });

    function moveMarker(position) {
        marker.style.transition = 'margin-left 0.2s';
        marker.style.marginLeft = position;
    }

    function zoomEffect(element) {
        element.style.transition = 'transform 0.2s';
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    function updateMaterial() {
        switch (positions[currentPositionIndex]) {
            case '25.3rem':
            case '-6.2rem':
                changeMaterial(materialGrey);
                break;
            case '27rem':
            case '-4.5rem':
                changeMaterial(materialRed);
                break;
            case '23.8rem':
            case '-7.8rem':
                changeMaterial(materialBlue);
                break;
        }
    }

    // Initial material setting
    updateMaterial();
});
