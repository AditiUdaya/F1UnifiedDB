import { useEffect } from "react";
import { useFBX } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export const F1Car3D = () => {
  const fbx = useFBX("/models/uploads_files_4252681_RED+BULL+2022+F1+CAR.fbx");

  // Load texture maps
  const colorMap = useLoader(THREE.TextureLoader, "/models/textures/TEXTURES/Body_baseColor.jpg");
  const metalMap = useLoader(THREE.TextureLoader, "/models/textures/TEXTURES/Body_metallic.jpg");
  const roughMap = useLoader(THREE.TextureLoader, "/models/textures/TEXTURES/Body_roughness.jpg");
  const normalMap = useLoader(THREE.TextureLoader, "/models/textures/TEXTURES/Body_normal.png");

  useEffect(() => {
    // Apply sRGB encoding if available
    if ("sRGBEncoding" in THREE && colorMap) {
      // @ts-ignore
      colorMap.encoding = THREE.sRGBEncoding;
    }

    // ✅ Increase color saturation manually
    const saturateTexture = (texture: THREE.Texture, amount: number) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = texture.image;
      if (!img) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, img.width, img.height);
      if (!imageData) return;

      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;

        // Convert RGB → HSL
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        let s = 0;
        if (max !== min) {
          s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
        }

        // Apply saturation boost
        s *= amount;

        // Convert back to RGB (approximation)
        const newR = Math.min(255, r * (1 + (s - 1)));
        const newG = Math.min(255, g * (1 + (s - 1)));
        const newB = Math.min(255, b * (1 + (s - 1)));

        data[i] = newR * 255;
        data[i + 1] = newG * 255;
        data[i + 2] = newB * 255;
      }

      ctx?.putImageData(imageData, 0, 0);
      texture.image = canvas;
      texture.needsUpdate = true;
    };

    saturateTexture(colorMap, 1.4); // 🔥 boost saturation by 40%

    fbx.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: colorMap,
          metalnessMap: metalMap,
          roughnessMap: roughMap,
          normalMap: normalMap,
          metalness: 0.9,
          roughness: 0.4,
        });
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [fbx, colorMap, metalMap, roughMap, normalMap]);

  return <primitive object={fbx} scale={0.01} position={[0, -1, 0]} />;
};
