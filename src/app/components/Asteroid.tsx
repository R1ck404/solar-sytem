"use client"

import { MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Asteroid() {
    const asteroidRef = useRef<any>();

    const texture = new THREE.TextureLoader().load("/images/asteroid.jpg");

    return (
        <mesh ref={asteroidRef} position={[20, 0, 0]}>
            <sphereGeometry args={[3, 32, 32]} />
            <MeshDistortMaterial color="#ffffff" speed={0} distort={.3} roughness={.1} metalness={.2} map={texture} />
        </mesh>
    );
}