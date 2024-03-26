"use client";

import * as THREE from "three";

function StarsBackground() {
    const starsTexture = "/images/2k_stars.jpg";
    const texture = new THREE.TextureLoader().load(starsTexture);
    return (
        <mesh>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

export default StarsBackground;