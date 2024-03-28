import { useHelper } from '@react-three/drei';
import { Fragment, useRef } from 'react';
import { DirectionalLight, DirectionalLightHelper, DirectionalLightShadow, PointLightHelper, Object3D } from 'three';
import * as THREE from 'three';

function Lights() {
    const lightRef = useRef<THREE.PointLight>(null);

    return (
        <>
            <pointLight
                ref={lightRef}
                position={[0, 0, 0]} // Consider positioning this based on your sun's position
                intensity={2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={0.5}
                shadow-camera-far={500}
                decay={0.23}
            />
            <ambientLight intensity={0.2} />
        </>
    );
}

export default Lights;
