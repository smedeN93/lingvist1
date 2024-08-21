import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  speed: number;
  color1: string;
  color2: string;
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ speed, color1, color2, children }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    const setSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
    };

    setSize();
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

        float curveShape(vec2 st) {
          // Create a more pronounced inverted U-shape
          float x = st.x * 2.0 - 1.0; // Map x from 0-1 to -1 to 1
          float y = abs(x); // Create V-shape
          y = pow(y, 0.5); // Curve the V into a U
          
          // Add some variation to the bottom edges
          float bottomEdge = pow(abs(x), 2.0) * 0.3;
          y = mix(y, y - bottomEdge, 1.0 - st.y);
          
          // Scale and position the curve
          y = 1.0 - (y * 0.8 + 0.1); // Invert, scale vertically and move up
          
          return y;
        }

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          
          float shape = curveShape(st);
          float distFromCurve = abs(st.y - shape);
          
          // Create a soft edge
          float edge = smoothstep(0.0, 0.15, distFromCurve);
          
          // Mix colors based on the curve
          vec3 color = mix(u_color2, u_color1, edge);
          
          // Add subtle wave animation
          float wave = sin(st.x * 8.0 + u_time) * 0.5 + 0.5;
          color = mix(color, u_color2, wave * 0.1);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = (time: number) => {
      material.uniforms.u_time.value = time * speed * 0.001;
      material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
      material.uniforms.u_color1.value.set(color1);
      material.uniforms.u_color2.value.set(color2);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate(0);

    const handleResize = () => {
      setSize();
      material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [speed, color1, color2]);

  return (
    <div className="relative">
      <div 
        ref={mountRef} 
        className="absolute top-0 left-0 w-full h-full"
        style={{ 
          zIndex: -1,
          filter: 'blur(5px)',
        }} 
      />
      {children}
    </div>
  );
};

export default AnimatedBackground;