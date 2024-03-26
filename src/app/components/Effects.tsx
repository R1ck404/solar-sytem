"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";


function Effects() {
    return (
        <EffectComposer>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={2} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
    );
}

export default Effects;