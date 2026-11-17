import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const wrapper = document.querySelector('.shuffle-wrapper');
const sceneElement = document.querySelector('.shuffle-scene');
const shuffle = document.querySelector('.gallery .shuffle');

if (wrapper && sceneElement && shuffle) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  sceneElement.appendChild(renderer.domElement);

  // Floating particles
  const count = 180;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 13;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: '#fae4e4',
    size: 0.045,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, particleMaterial);
  scene.add(particles);

  // Artistic 3D rings
  const rings = [];

  for (let i = 0; i < 3; i++) {
    const ringGeometry = new THREE.TorusGeometry(1.1 + i * 0.35, 0.008, 8, 100);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: i === 1 ? '#837f81' : '#fae4e4',
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = -1.5 - i * 0.2;
    ring.rotation.set(0.5 + i * 0.3, 0.3, i * 0.4);

    scene.add(ring);
    rings.push(ring);
  }

  function resizeScene() {
    const width = sceneElement.clientWidth;
    const height = sceneElement.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  const resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(sceneElement);
  resizeScene();

  // let started = false;
  // let startTime = 0;

  // const observer = new IntersectionObserver(
  //   entries => {
  //     if (entries[0].isIntersecting && !started) {
  //       started = true;
  //       startTime = performance.now();

  //       shuffle.classList.add('show');
  //       observer.disconnect();
  //     }
  //   },
  //   {
  //     threshold: 0.3
  //   }
  // );

  // observer.observe(wrapper);

  
let started = false;
let startTime = 0;

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Restart the shuffle entrance animation
        shuffle.classList.remove('show');
        void shuffle.offsetWidth;
        shuffle.classList.add('show');

        started = true;
        startTime = performance.now();
      } else {
        started = false;
        shuffle.classList.remove('show');
      }
    });
  },
  {
    threshold: 0.3
  }
);

observer.observe(wrapper);


  renderer.setAnimationLoop(time => {
    if (!started) return;

    const elapsed = (time - startTime) * 0.001;

    particles.rotation.y = elapsed * 0.06;
    particles.rotation.x = Math.sin(elapsed * 0.5) * 0.08;

    rings.forEach((ring, i) => {
      ring.rotation.z += 0.0015 * (i + 1);
      ring.rotation.x = 0.5 + Math.sin(elapsed * 0.4 + i) * 0.15;
    });

    renderer.render(scene, camera);
  });
}


