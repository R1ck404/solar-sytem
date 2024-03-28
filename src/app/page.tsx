"use client"

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import planetData from "./planetdata";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import StarsBackground from "./components/Stars";
import Lights from "./components/Lighting";
import Planet, { PlanetProps } from "./components/Planet";
import { ToneMappingMode } from 'postprocessing';
import { Orbit, CircleArrowLeft, PlusIcon, MinusIcon, Earth, CircleArrowRight } from 'lucide-react';
import Asteroid from "./components/Asteroid";

export default function Home() {
    const [selectedPlanet, setSelectedPlanet] = useState<PlanetProps | null>(null);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [ringEnabled, setRingEnabled] = useState(false);
    const [realScaling, setRealScaling] = useState(false);

    return (
        <main className="min-h-screen">
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] px-2 py-1 rounded-full bg-stone-900 border-stone-700 border flex space-x-2 items-center">
                <button aria-label="Use real scaling" onClick={() => setRealScaling(!realScaling)} className="text-white p-2 rounded-lg">
                    <Earth size={24} />
                </button>
                <div className="bg-stone-700 h-8 w-[1px]" />
                <button onClick={() => setSpeedMultiplier(speedMultiplier / 2)} className="text-white p-2 rounded-lg">
                    <MinusIcon size={24} />
                </button>
                <p className="text-white text-lg">{speedMultiplier}x</p>
                <button onClick={() => setSpeedMultiplier(speedMultiplier * 2)} className="text-white p-2 rounded-lg">
                    <PlusIcon size={24} />
                </button>
                <div className="bg-stone-700 h-8 w-[1px]" />
                <button onClick={() => setRingEnabled(!ringEnabled)} className="text-white p-2 rounded-lg">
                    <Orbit size={24} />
                </button>
            </div>
            <Canvas shadows camera={{ position: [0, 20, 25], fov: 50 }} scene={{}} className="h-screen" style={{ height: "100vh" }}>
                <StarsBackground />
                <Sun />
                <Asteroid xRadius={17.52} zRadius={535} speed={9.012256710526316e-4 * speedMultiplier} color="#ffffff" />

                {planetData.map((planet) => (
                    <Planet key={planet.name}
                        planet={{
                            name: planet.name,
                            color: planet.color as unknown as string || "#ffffff",
                            description: planet.description,
                            details: planet.details,
                        }}
                        radius={
                            realScaling ? {
                                x: planet.real_data.xRadius,
                                z: planet.real_data.zRadius,
                                size: planet.real_data.size,
                            } : {
                                x: planet.xRadius,
                                z: planet.zRadius,
                                size: planet.size,
                            }
                        }
                        options={{
                            speed: planet.speed * speedMultiplier,
                            displacement: {
                                texture: planet.displacementTexture,
                                scale: planet.displacementScale,
                            },
                            map: {
                                texture: planet.mapTexture,
                                scale: planet.mapScale,
                            },
                            emissive: {
                                color: planet.emissiveColor,
                                intensity: planet.emissiveIntensity,
                            },
                        }}
                        setSelectedPlanet={setSelectedPlanet}
                        selectedPlanet={selectedPlanet}
                        ringsEnabled={ringEnabled}
                    />
                ))}

                <Lights />
                <OrbitControls minZoom={0.01} maxZoom={100} maxDistance={475} />

                <EffectComposer>
                    <Bloom mipmapBlur luminanceThreshold={1} levels={8} intensity={7} />
                    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>

            {selectedPlanet &&
                <>
                    <div className="bg-gradient-to-r from-[#0c171e] to-transparent absolute top-0 left-0 w-full h-full flex justify-center flex-col items-center">
                        <div className="absolute top-6 left-6 md:top-6 md:left-[3.75rem] text-white cursor-pointer" onClick={() => setSelectedPlanet(null)}>
                            <CircleArrowLeft />
                        </div>
                        <div className="ml-8 mr-auto flex flex-col md:flex-row h-full md:items-center">
                            <div className="h-fit w-full md:w-20 flex justify-center md:block">
                                {planetData.map((planet) => (
                                    <div key={planet.name} className="flex flex-row md:space-x-0 md:flex-col items-center" onClick={() => setSelectedPlanet(planet)}>
                                        <img src={`/images/icons/${planet.name.toLocaleLowerCase()}.png`} alt={planet.name} className={`h-8 w-8 rounded-full cursor-pointer ${selectedPlanet.name === planet.name ? `outline outline-violet-500` : ""} my-2`} />
                                        {planetData.indexOf(planet) !== planetData.length - 1 && <div className="w-4 sm:w-8 h-1 md:h-8 lg:h-12 xl:h-16 md:w-1 bg-gray-500"></div>}
                                    </div>
                                ))}
                            </div>
                            <div className="relative h-4/5 w-1/2 flex flex-col space-y-4 ml-8">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl m-4 font-bold" style={{ color: selectedPlanet.color }}>{selectedPlanet.name}</h1>
                                <div className="space-y-16 ml-4 justify-center flex flex-col h-full text-white">
                                    <div className="space-y-4">
                                        <p className="text-xl md:text-2xl lg:text-4xl" style={{ color: selectedPlanet.color }}>Diameter</p>
                                    <h1 className="text-2xl md:text-4xl lg:text-6xl" id="diameter">
                                        {selectedPlanet?.details?.diameter}
                                    </h1>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xl md:text-2xl lg:text-4xl" style={{ color: selectedPlanet.color }}>Distance from sun</p>
                                    <h1 className="text-2xl md:text-4xl lg:text-6xl" id="distance">
                                        {selectedPlanet?.details?.distance}
                                    </h1>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xl md:text-2xl lg:text-4xl" style={{ color: selectedPlanet.color }}>Length of year</p>
                                    <h1 className="text-2xl md:text-4xl lg:text-6xl" id="yeaLength">
                                        {selectedPlanet?.details?.year}
                                    </h1>
                                    </div>
                                    <p className="text-lg md:text-xl lg:text-2xl">{selectedPlanet.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </main>
    );
}

function Sun() {
    const displacementTexture = new THREE.TextureLoader().load("/images/2k_sun_displacement.png");
    const sunTexture = new THREE.TextureLoader().load("/images/2k_sun.jpg");
    return (
        <mesh>
            <sphereGeometry args={[1.4, 32, 32]} />
            <MeshDistortMaterial distort={.2} emissive="#ffbb00" emissiveIntensity={4} displacementMap={displacementTexture} displacementScale={.3} map={sunTexture} toneMapped={false} />
        </mesh>
    );
}