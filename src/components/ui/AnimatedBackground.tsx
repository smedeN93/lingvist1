import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  speed: number;
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  speed,
  children
}) => {
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
varying vec2 vUv;

// Colors
vec3 color1 = vec3(0.231, 0.51, 0.965);   // #3B82F6 (blå)
vec3 color2 = vec3(0.506, 0.549, 0.973);  // #818CF8 (indigo)
vec3 color3 = vec3(0.576, 0.773, 0.992);  // #93C5FD (lysere blå)
vec3 color4 = vec3(0.867, 0.839, 0.996);  // #DDD6FE (lys violet)
vec3 color5 = vec3(0.376, 0.647, 0.98);   // #60A5FA (medium blå)

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec3 getBeamColor(float t) {
    t = fract(t * 2.0); // Faster color transitions
    vec3 color = mix(color1, color2, smoothstep(0.0, 0.25, t));
    color = mix(color, color3, smoothstep(0.25, 0.5, t));
    color = mix(color, color4, smoothstep(0.5, 0.75, t));
    color = mix(color, color5, smoothstep(0.75, 1.0, t));
    return color;
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 finalColor = vec3(0.98);  // Start with an almost white background
    
    float numBeams = 25.0;
    
    for (float i = 0.0; i < numBeams; i++) {
        float beamCenter = (i + 0.5) / numBeams;
        
        // Organic movement
        float timeOffset = u_time * (0.03 + 0.02 * noise(vec2(i, 0.0)));
        float movement = timeOffset - noise(vec2(uv.y * 0.2 + timeOffset * 0.1, i)) * 0.2;
        
        // Slanted beams
        float angle = noise(vec2(i, u_time * 0.005)) * 0.15 - 0.075;
        float skew = uv.y * angle;
        float x = fract(uv.x + movement + beamCenter + skew);
        
        // Variable beam width
        float beamWidth = 0.06 + 0.04 * noise(vec2(u_time * 0.05 + i, i * 0.2));
        float beam = smoothstep(beamWidth, 0.0, abs(x - 0.5));
        
        // Variation in intensity along the beam
        beam *= 0.7 + 0.3 * noise(vec2(uv.y * 2.0 + u_time * 0.05, i));
        
        // Fade out towards the left side and the beginning
        float fadeOut = smoothstep(0.0, 0.8, uv.x) * smoothstep(0.0, 0.2, uv.x);
        beam *= fadeOut;
        
        vec3 beamColor = getBeamColor(noise(vec2(u_time * 0.02 + i, i * 0.05)));
        finalColor = mix(finalColor, beamColor, beam * 0.3);
    }
    
    // Add a subtle glitter effect
    float glitter = random(uv + u_time * 0.01) * 0.03 * smoothstep(0.2, 0.8, uv.x);
    finalColor += vec3(glitter);
    
    // Ensure that the left side fades to white
    finalColor = mix(vec3(1.0), finalColor, smoothstep(0.0, 0.5, uv.x));
    
    // Fade to white at the bottom
    finalColor = mix(finalColor, vec3(1.0), smoothstep(0.7, 1.0, uv.y));
    
    gl_FragColor = vec4(finalColor, 1.0);
}
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = (time: number) => {
      material.uniforms.u_time.value = time * 0.001 * speed;
      material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
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
  }, [speed]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        ref={mountRef} 
        className="absolute top-0 left-0 w-full h-full"
        style={{ 
          zIndex: -1,
          filter: 'blur(3px)',  // Slight blur to soften the edges
          opacity: 1,
          transform: 'scale(1.03)',
          transformOrigin: 'center',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
        }} 
      />
      {children}
    </div>
  );
};

export default AnimatedBackground;