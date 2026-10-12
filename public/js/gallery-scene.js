import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const gallery = document.querySelector('.gallery');
const sceneElement = document.querySelector('.gallery-art-scene');
const galleryContent = document.querySelector('.gallery-content');


    // Floating logo images
    const logoCount = 50;

    for (let i = 0; i < logoCount; i++) {
        const logo = document.createElement('img');

        logo.src = '/img/logo.png';
        logo.alt = '';
        logo.className = 'floating-logo';
        logo.draggable = false;

        const random = (min, max) =>
            Math.random() * (max - min) + min;

        logo.style.left = `${random(0, 98)}%`;
        logo.style.top = `${random(0, 98)}%`;

        // logo.style.setProperty('--logo-size', `${random(8, 24)}px`);
        logo.style.setProperty('--logo-size', `${random(48, 78)}px`);
        logo.style.setProperty('--duration', `${random(7, 22)}s`);
        logo.style.setProperty('--delay', `${random(-20, 0)}s`);

        logo.style.setProperty('--move-x', `${random(-100, 100)}px`);
        logo.style.setProperty('--move-y', `${random(-90, 90)}px`);
        logo.style.setProperty('--move-x2', `${random(-140, 140)}px`);
        logo.style.setProperty('--move-y2', `${random(-110, 110)}px`);
        logo.style.setProperty('--move-x3', `${random(-80, 80)}px`);
        logo.style.setProperty('--move-y3', `${random(-120, 120)}px`);

        sceneElement.appendChild(logo);
    }


if (gallery && sceneElement && galleryContent) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  sceneElement.appendChild(renderer.domElement);

  // Floating artistic particles
  const particleCount = 260;
  const positions = new Float32Array(particleCount * 3);
  const originalPositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

    originalPositions.set(positions.slice(i * 3, i * 3 + 3), i * 3);
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: '#fae4e4',
    size: 0.045,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);

  scene.add(particles);

  // Fine 3D art rings
  const rings = [];

  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.TorusGeometry(1.1 + i * 0.3, 0.009, 6, 90);

    const material = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? '#fae4e4' : '#837f81',
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });

    const ring = new THREE.Mesh(geometry, material);

    ring.position.set(Math.sin(i * 2) * 3, Math.cos(i * 1.5) * 2, -2 - i * 0.3);

    ring.rotation.set(i * 0.4, i * 0.3, i * 0.5);

    scene.add(ring);
    rings.push(ring);
  }

  function resizeScene() {
    const width = gallery.clientWidth;
    const height = gallery.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.position.z = Math.max(10, height / 90);
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  const resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(gallery);
  resizeScene();

  // Reveal the paintings when the gallery enters the viewport
  const boxes = [...galleryContent.querySelectorAll('.box')];

  boxes.forEach((box, index) => {
    box.style.setProperty('--card-delay', `${index * 0.13}s`);
  });

//   let started = false;
//   let startTime = 0;

//   const observer = new IntersectionObserver(
//     entries => {
//       if (entries[0].isIntersecting && !started) {
//         started = true;
//         startTime = performance.now();

//         galleryContent.classList.add('is-visible');
//         observer.disconnect();

        
//       }
//     },
//     {
//       threshold: 0.12
//     }
//   );

//   observer.observe(galleryContent);


let started = false;
let startTime = 0;

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Restart the painting entrance animation
        galleryContent.classList.remove('is-visible');

        // Force the browser to reset the animation
        void galleryContent.offsetWidth;

        galleryContent.classList.add('is-visible');

        started = true;
        startTime = performance.now();
      } else {
        galleryContent.classList.remove('is-visible');
        started = false;
      }
    });
  },
  {
    threshold: 0.12
  }
);

observer.observe(galleryContent);

  renderer.setAnimationLoop(time => {
    if (!started) return;

    const elapsed = (time - startTime) * 0.001;
    const attribute = particleGeometry.attributes.position;

    // Gentle floating motion
    for (let i = 0; i < particleCount; i++) {
      const index = i * 3;

      attribute.array[index + 1] =
        originalPositions[index + 1] + Math.sin(elapsed * 0.65 + i) * 0.09;
    }

    attribute.needsUpdate = true;

    particles.rotation.y = Math.sin(elapsed * 0.12) * 0.08;
    particles.rotation.x = Math.cos(elapsed * 0.1) * 0.04;

    rings.forEach((ring, index) => {
      ring.rotation.z += 0.0007 * (index + 1);
      ring.rotation.y = Math.sin(elapsed * 0.3 + index) * 0.18;
    });

    renderer.render(scene, camera);
  });
}
