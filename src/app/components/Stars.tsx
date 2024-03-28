"use client";

import * as THREE from "three";

function StarsBackground() {
    // const starsTexture = "/images/2k_stars.jpg";
    const starsTexture = "/images/2k_stars_milky_way.jpg";
    const texture = new THREE.TextureLoader().load(starsTexture);
    return (
        <mesh>
            <sphereGeometry args={[499, 60, 40]} />
            <meshBasicMaterial map={texture} side={1} />
        </mesh>
    );
}

export default StarsBackground;