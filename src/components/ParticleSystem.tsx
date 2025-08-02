import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ParticleSystemProps {
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  className?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  latitude = 0,
  longitude = 0,
  city = 'Unknown',
  country = 'Unknown',
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Check WebGL support with more robust detection
    let webglSupported = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl && gl instanceof WebGLRenderingContext) {
        webglSupported = true;
      }
    } catch (e) {
      console.warn('WebGL detection failed:', e);
    }

    if (!webglSupported) {
      console.warn('WebGL not supported, falling back to static visualization');
      setIsWebGLSupported(false);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup with error handling
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0); // Transparent background
      rendererRef.current = renderer;
      mountRef.current.appendChild(renderer.domElement);
    } catch (e) {
      console.error('Failed to initialize WebGL renderer:', e);
      setIsWebGLSupported(false);
      return;
    }

    // Convert lat/lng to 3D coordinates on sphere
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);

    // Main location sphere (country level)
    const countryGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const countryMaterial = new THREE.MeshBasicMaterial({
      color: 0x268bd2,
      transparent: true,
      opacity: 0.8
    });
    const countrySphere = new THREE.Mesh(countryGeometry, countryMaterial);
    const countryRadius = 2;
    countrySphere.position.x = countryRadius * Math.sin(phi) * Math.cos(theta);
    countrySphere.position.y = countryRadius * Math.cos(phi);
    countrySphere.position.z = countryRadius * Math.sin(phi) * Math.sin(theta);
    scene.add(countrySphere);

    // City particle (smaller, orbiting)
    const cityGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const cityMaterial = new THREE.MeshBasicMaterial({
      color: 0x2aa198,
      transparent: true,
      opacity: 0.9
    });
    const cityParticle = new THREE.Mesh(cityGeometry, cityMaterial);
    scene.add(cityParticle);

    // Create particle system for network connections
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Generate particles in orbital pattern
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random orbital position
      const radius = 1.5 + Math.random() * 2;
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(angle2) * Math.cos(angle1);
      positions[i3 + 1] = radius * Math.cos(angle2);
      positions[i3 + 2] = radius * Math.sin(angle2) * Math.sin(angle1);

      // Solarized color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i3] = 0x26 / 255;      // Blue
        colors[i3 + 1] = 0x8b / 255;
        colors[i3 + 2] = 0xd2 / 255;
      } else if (colorChoice < 0.7) {
        colors[i3] = 0x2a / 255;      // Cyan
        colors[i3 + 1] = 0xa1 / 255;
        colors[i3 + 2] = 0x98 / 255;
      } else {
        colors[i3] = 0x6c / 255;      // Violet
        colors[i3 + 1] = 0x71 / 255;
        colors[i3 + 2] = 0xc4 / 255;
      }

      sizes[i] = Math.random() * 3 + 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Animation loop with error handling
    let time = 0;
    const animate = () => {
      try {
        time += 0.01;

        // Rotate main scene slowly
        scene.rotation.y = time * 0.1;

        // Country sphere pulsing
        const scale = 1 + Math.sin(time * 2) * 0.1;
        countrySphere.scale.setScalar(scale);

        // City particle orbital motion
        const cityOrbitRadius = 0.8;
        cityParticle.position.x = countrySphere.position.x + cityOrbitRadius * Math.cos(time * 3);
        cityParticle.position.y = countrySphere.position.y + cityOrbitRadius * Math.sin(time * 2);
        cityParticle.position.z = countrySphere.position.z + cityOrbitRadius * Math.sin(time * 3);

        // Particle system rotation
        particleSystem.rotation.x = time * 0.05;
        particleSystem.rotation.y = time * 0.1;

        // Update particle positions for orbital motion
        const particlePositions = particles.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const originalX = particlePositions[i3];
          const originalZ = particlePositions[i3 + 2];
          
          // Add slight orbital motion
          particlePositions[i3] = originalX + Math.sin(time + i * 0.1) * 0.02;
          particlePositions[i3 + 2] = originalZ + Math.cos(time + i * 0.1) * 0.02;
        }
        particles.attributes.position.needsUpdate = true;

        // Render the scene
        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation loop error:', error);
        setIsWebGLSupported(false);
      }
    };

    // Start animation with a small delay to ensure everything is ready
    setTimeout(() => {
      animate();
    }, 100);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      scene.clear();
      renderer.dispose();
      countryGeometry.dispose();
      countryMaterial.dispose();
      cityGeometry.dispose();
      cityMaterial.dispose();
      particles.dispose();
      particleMaterial.dispose();
    };
  }, [latitude, longitude]);

  if (!isWebGLSupported) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl`}>
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-blue)' }}>
            {city}, {country}
          </h3>
          <p className="text-sm opacity-70">
            Coordinates: {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
          </p>
          <p className="text-xs mt-2 opacity-50">
            3D visualization not supported
          </p>
        </div>
      </div>
    );
  }

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
        Interactive 3D visualization
      </div>
    </div>
  );
};