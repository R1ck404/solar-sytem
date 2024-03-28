"use client";

import { Html, Outlines } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import Ecliptic from "./Ecliptic";
import * as THREE from "three";
import FakeGlowMaterial from "./glowMaterial";

interface ComponentProps {
    planet: PlanetProps,
    radius: RadiusProps,
    options: OptionsProps,
    setSelectedPlanet: (planet: PlanetProps | null) => void;
    selectedPlanet: PlanetProps | null;
    ringsEnabled?: boolean;
}

export interface PlanetProps {
    name: string;
    color: string;
    description: string;
    details?: any;
}

interface RadiusProps {
    x: number;
    z: number;
    size: number;
}

interface OptionsProps {
    speed: number;
    displacement: DisplacementProps;
    map: MapProps;
    emissive: EmissiveProps;
}

interface DisplacementProps {
    texture: string;
    scale: number;
}

interface MapProps {
    texture: string;
    scale: number;
}

interface EmissiveProps {
    color: string;
    intensity: number;
}

function Planet({ planet, radius, options, setSelectedPlanet, selectedPlanet, ringsEnabled }: ComponentProps) {
    const planetRef = useRef<any>();
    const ringRef = useRef<any>();
    const [isHovered, setIsHovered] = useState(false);
    const [isPhysyclyPaused, setIsPhysyclyPaused] = useState(false);
    const [position, setPosition] = useState({ x: 0, z: 0 });
    const { camera } = useThree();

    useEffect(() => {
        if (isHovered) {
            setIsPhysyclyPaused(true);
        } else {
            setIsPhysyclyPaused(false);

            if (!planetRef.current) return;
            if (selectedPlanet?.name === planet.name) return;

            planetRef.current.position.set(position.x, 0, position.z);
        }
    }, [isHovered]);


    useFrame(({ clock }) => {
        if (!planetRef.current) return;
        if (selectedPlanet?.name === planet.name) {

            const elapsedTime = clock.getElapsedTime();
            const orbitRadius = radius.size * 75;
            const cameraX = planetRef.current.position.x + orbitRadius * Math.cos(elapsedTime * 0.1);
            const cameraZ = planetRef.current.position.z + orbitRadius * Math.sin(elapsedTime * 0.1);
            const cameraY = planetRef.current.position.y + radius.size * 1.5;

            camera.position.set(cameraX, cameraY, cameraZ);

            const lookAtX = planetRef.current.position.x + orbitRadius * Math.cos(elapsedTime * 0.1 + 2);
            const lookAtZ = planetRef.current.position.z + orbitRadius * Math.sin(elapsedTime * 0.1 + 2);
            const lookAtY = planetRef.current.position.y;

            camera.lookAt(lookAtX, lookAtY, lookAtZ);
            return;
        }

        if (ringRef.current) {
            ringRef.current.rotation.z += 0.004;
            ringRef.current.rotation.x += options.speed * 2.4;
        }

        const t = clock.getElapsedTime();
        const rotationSpeed = options.speed * 10;
        const x = radius.x * Math.sin(rotationSpeed * t);
        const z = radius.z * Math.cos(rotationSpeed * t);

        if (!isPhysyclyPaused) {
            planetRef.current.position.set(x, 0, z);
        } else {
            setPosition({ x, z });
        }
    });

    useEffect(() => {
        if (!planetRef.current) return;
        if (selectedPlanet?.name !== planet.name) return;

        camera.position.set(planetRef.current.position.x, planetRef.current.position.y, planetRef.current.position.z + 3);
        camera.lookAt(planetRef.current.position);

    }, [selectedPlanet?.name === planet.name]);

    const displacementTexture = new THREE.TextureLoader().load(options.displacement.texture);
    const sunTexture = new THREE.TextureLoader().load(options.map.texture);

    var vertexShader = [
        'varying vec3 vNormal;',
        'void main() {',
        'vNormal = normalize( normalMatrix * normal );',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
    ].join('\n')

    var fragmentShader = [
        'varying vec3 vNormal;',
        'void main() {',
        'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
        'gl_FragColor = vec4( 1, 1.0, 1.0, 1.0 ) * intensity;',
        '}'
    ].join('\n');
    return (
        <>

            <mesh
                ref={planetRef}
                onPointerOver={(event) => setIsHovered(true)}
                onPointerOut={(event) => setIsHovered(false)}
                onClick={(event) => {
                    setSelectedPlanet(selectedPlanet?.name === planet.name ? null : planet);
                }}
                receiveShadow castShadow
            >
                {planet?.name.toLocaleLowerCase() === "saturn" && <>
                    <mesh
                        ref={ringRef}
                        rotation={[0.5 * Math.PI, .2, 0]}
                        position={[0, 0, 0]}
                        receiveShadow castShadow
                    >
                        <torusGeometry args={[radius.size * 47, radius.size * 6, 2, 100]} />
                        <meshStandardMaterial color={"#b19c87"} opacity={0.7} transparent={true} />
                    </mesh>
                </>}

                {planet?.name.toLocaleLowerCase() === "earth" && <>
                    <mesh
                        ref={ringRef}
                        position={[3 + radius.size, 0, 2 + radius.size]}
                        receiveShadow castShadow
                    >
                        {/* sphere aka moon */}
                        <sphereGeometry args={[0.005 * 30, 32, 32]} />
                        <meshStandardMaterial color={"#ffffff"} />

                    </mesh>
                </>}

                <sphereGeometry args={[radius.size * 30, 32, 32]} />
                <meshStandardMaterial
                    emissiveMap={null}
                    emissive={options.emissive.color}
                    emissiveIntensity={options.emissive.intensity}
                    displacementMap={displacementTexture}
                    displacementScale={options.displacement.scale}
                    map={sunTexture}
                    toneMapped={false}

                />

                {isHovered && (
                    <Outlines visible={true} color="white" />
                )}
            </mesh>

            {selectedPlanet?.name !== planet.name && ringsEnabled && <Ecliptic xRadius={radius.x} zRadius={radius.z} />}
        </>
    );
}

export default Planet;
