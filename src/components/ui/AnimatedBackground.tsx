import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  speed: number;
  color1: string;
  color2: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ speed, color1, color2 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    const width = window.innerWidth;
    const height = window.innerHeight * 0.7;
    renderer.setSize(width, height * 1.2);

    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2() },
        u_color1: { value: new THREE.Color(color1) },
        u_color2: { value: new THREE.Color(color2) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        varying vec2 vUv;

        // Function to create a wave
        float wave(vec2 st, float freq, float amplitude, float speed, float offset) {
          return sin((st.x * freq + u_time * speed + offset) * 6.28318) * amplitude;
        }

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          st.x *= u_resolution.x / u_resolution.y;

          // Create multiple overlapping waves
          float wave1 = wave(st, 5.0, 0.05, 0.5, 0.0);
          float wave2 = wave(st, 7.0, 0.03, 0.7, 1.57);
          float wave3 = wave(st, 9.0, 0.02, 0.9, 3.14);

          // Combine waves
          float finalWave = wave1 + wave2 + wave3;

          // Create color based on wave height
          vec3 color = mix(u_color1, u_color2, finalWave + 0.5);

          // Add subtle gradient
          color = mix(color, u_color2, st.y * 0.2);

          // Subtle vignette
          float vignette = smoothstep(0.5, 0.2, length(vUv - 0.5));
          color = mix(color, color * 0.9, vignette);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = (time: number) => {
      material.uniforms.u_time.value = time * speed * 0.001;
      material.uniforms.u_resolution.value.set(width, height);
      material.uniforms.u_color1.value.set(color1);
      material.uniforms.u_color2.value.set(color2);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate(0);

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight * 0.7;
      renderer.setSize(newWidth, newHeight * 1.2);
      material.uniforms.u_resolution.value.set(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [speed, color1, color2]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0,
        height: '60vh',
        transform: 'skewY(-10deg)',
        transformOrigin: 'top left',
        overflow: 'hidden',
        zIndex: -1,
        filter: 'blur(5px)', // Reduced blur for more definition
      }} 
    />
  );
};

export default AnimatedBackground;