"use client"

import { MeshDistortMaterial, useTrail } from "@react-three/drei";
import { useRef } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type AsteroidProps = {
    xRadius: number;
    zRadius: number;
    speed: number;
    color: string;
}

export default function Asteroid({ xRadius, zRadius, speed, color }: AsteroidProps) {
    const asteroidRef = useRef<any>() as React.MutableRefObject<THREE.Mesh>;


    useFrame(({ clock }) => {
        asteroidRef.current.rotation.x += 0.001;
        asteroidRef.current.rotation.y += 0.001;

        // deze shit 
        const t = clock.getElapsedTime();
        const rotationSpeed = speed * 10;
        const x = xRadius * Math.sin(rotationSpeed * t);
        const z = zRadius * Math.cos(rotationSpeed * t);

        const xOffset = 0;
        const yOffset = 525;
        asteroidRef.current.position.set(x + xOffset, 0, z + yOffset);
    });

    const texture = new THREE.TextureLoader().load("/images/2k_asteroid.jpg");

    return (
        <mesh ref={asteroidRef}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <MeshDistortMaterial color="#ffffff" speed={0} distort={.3} map={texture} />
        </mesh>
    );
}