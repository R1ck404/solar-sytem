"use client";

import { Circle, Effects, Html, MeshDistortMaterial } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import Ecliptic from "./Ecliptic";
import * as THREE from "three";
import { EffectComposer, DepthOfField, Bloom } from "@react-three/postprocessing"; // Import post-processing modules

interface ComponentProps {
    planet: PlanetProps,
    radius: RadiusProps,
    options: OptionsProps,
    setSelectedPlanet: (planet: PlanetProps) => void;
    selectedPlanet: PlanetProps | null;
    ringsEnabled?: boolean;
}

export interface PlanetProps {
    name: string;
    color: string;
    description: string;
}

interface RadiusProps {
    x: number;
    z: number;
    size: number;
}

interface OptionsProps {
    distance: number;
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
    const [isSelected, setIsSelected] = useState(false);
    const { gl, scene, camera } = useThree();

    useEffect(() => {
        if (isHovered) {
            setIsPhysyclyPaused(true);
        } else {
            setIsPhysyclyPaused(false);

            if (!planetRef.current) return;
            if (isSelected) return;

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

    }, [isSelected]);

    const displacementTexture = new THREE.TextureLoader().load(options.displacement.texture);
    const sunTexture = new THREE.TextureLoader().load(options.map.texture);
    const saturnRingsTexture = new THREE.TextureLoader().load("/images/2k_saturn_ring.png");

    return (
        <>
            <mesh
                ref={planetRef}
                onPointerOver={(event) => setIsHovered(true)}
                onPointerOut={(event) => setIsHovered(false)}
                onClick={(event) => {
                    setSelectedPlanet(isSelected ? null : planet);
                }}
            >
                {planet?.name.toLocaleLowerCase() === "saturn" && <>
                    <mesh
                        ref={ringRef}
                        rotation={[0.5 * Math.PI, .2, 0]}
                        position={[0, 0, 0]}
                    >
                        <torusGeometry args={[radius.size * 47, radius.size * 6, 2, 100]} />
                        <meshStandardMaterial color={"#b19c87"} />
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
                    <Html>
                        <div
                            style={{
                                position: "absolute",
                                top: "-50px",
                                color: "white",
                                fontSize: "1.5rem",
                                pointerEvents: "none",
                                width: "100%",
                            }}
                        >
                            {planet.name}
                        </div>
                    </Html>
                )}
            </mesh>

            {selectedPlanet?.name !== planet.name && ringsEnabled && <Ecliptic xRadius={radius.x} zRadius={radius.z} />}
        </>
    );
}

export default Planet;
