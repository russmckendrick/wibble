import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SimpleParticleSystemProps {
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  className?: string;
}

export const SimpleParticleSystem: React.FC<SimpleParticleSystemProps> = ({
  latitude = 0,
  longitude = 0,
  city = 'Unknown',
  country = 'Unknown',
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) {
      console.log('Mount ref not available');
      return;
    }

    const container = mountRef.current;
    console.log('Initializing Simple Particle System...');

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: false
    });
    
    try {
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      console.log('WebGL renderer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WebGL renderer:', error);
      return;
    }

    // Create a simple glowing sphere at the location
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x268bd2,
      transparent: true,
      opacity: 0.8
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
    // Position sphere based on lat/lng
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);
    const radius = 2;
    
    sphere.position.x = radius * Math.sin(phi) * Math.cos(theta);
    sphere.position.y = radius * Math.cos(phi);
    sphere.position.z = radius * Math.sin(phi) * Math.sin(theta);
    
    scene.add(sphere);

    // Create simple particle system
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions around origin
      const radius = 1 + Math.random() * 3;
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(angle2) * Math.cos(angle1);
      positions[i3 + 1] = radius * Math.cos(angle2);
      positions[i3 + 2] = radius * Math.sin(angle2) * Math.sin(angle1);

      // Cyan color
      colors[i3] = 0x2a / 255;
      colors[i3 + 1] = 0xa1 / 255;
      colors[i3 + 2] = 0x98 / 255;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) * 0.001;
      
      // Rotate scene
      scene.rotation.y = elapsed * 0.1;
      
      // Pulse sphere
      const scale = 1 + Math.sin(elapsed * 2) * 0.2;
      sphere.scale.setScalar(scale);
      
      // Rotate particles
      particles.rotation.x = elapsed * 0.05;
      particles.rotation.y = elapsed * 0.1;

      try {
        renderer.render(scene, camera);
        animationIdRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Render error:', error);
      }
    };

    console.log('Starting animation...');
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('Cleaning up Simple Particle System...');
      
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      scene.clear();
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [latitude, longitude]);

  return (
    <div className={`${className} relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5`}>
      <div ref={mountRef} className="w-full h-full min-h-[300px]" />
      
      {/* Location info overlay */}
      <div className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-md rounded-lg px-4 py-2">
        <div className="text-sm font-semibold" style={{ color: 'var(--color-cyan)' }}>
          {city}, {country}
        </div>
        <div className="text-xs opacity-70" style={{ color: 'var(--color-base0)' }}>
          {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
        </div>
      </div>
      
      {/* Interactive hint */}
      <div className="absolute top-4 right-4 text-xs opacity-50" style={{ color: 'var(--color-base0)' }}>
        3D Particle System
      </div>
    </div>
  );
};