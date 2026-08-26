import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Wireframe, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function BrainModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create stylized "brain" shape using a modified sphere
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 4);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      // Elongate along Z axis to look more brain-like
      v.z *= 1.4;
      // Flatten the bottom slightly
      if (v.y < 0) v.y *= 0.8;
      // Add some noise for folds
      const noise = Math.sin(v.x * 3) * Math.cos(v.y * 3) * Math.sin(v.z * 3) * 0.15;
      v.addScalar(noise);
      geo.attributes.position.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Parallax to mouse
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 4 + Math.PI / 2, // Default rotation so it faces side/front
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (-state.pointer.y * Math.PI) / 8,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh geometry={geometry}>
          <meshStandardMaterial 
            color="#0a0a0a" 
            transparent 
            opacity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
          <Wireframe
            stroke="#3f3f46"
            thickness={0.02}
            dash
            dashRepeats={4}
            dashLength={0.5}
            dashOutlines={true}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function AmbientParticles() {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#0d9488"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}
