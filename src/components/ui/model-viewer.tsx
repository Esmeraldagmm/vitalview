"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  useGLTF,
  useProgress,
  Html,
  Bounds,
  useBounds,
  type BoundsApi,
} from "@react-three/drei";
import { Button } from "@/components/ui/button";

import { Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

// Loader component to show progress
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {progress.toFixed(0)}% loaded
        </p>
      </div>
    </Html>
  );
}

// Model component that loads and displays the 3D model
function Model({
  url,
  position = [0, 0, 0],
  onSizeChange,
}: {
  url: string;
  position?: [number, number, number];
  onSizeChange: (size: number) => void;
}) {
  const { scene } = useGLTF(url);
  const bounds = useBounds(); // Hook for managing bounds

  useEffect(() => {
    bounds.refresh(scene).fit();
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3()).length();
    onSizeChange(size); // Send size to parent
  }, [scene, bounds, onSizeChange]);

  useEffect(() => {
    scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        if (node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = 0.5;
            });
          } else {
            node.material.transparent = true;
            node.material.opacity = 0.5;
          }
        }
      }
    });
  }, [scene]);

  return (
    <group position={position}>
      <primitive object={scene} />
    </group>
  );
}

// Main 3D viewer component
export default function ModelViewer({
  modelUrls = ["./bmw.glb", "./scene.gltf"],
  backgroundColor = "#f5f5f5",
  environmentPreset = "studio",
  height = "100%",
}: {
  modelUrls?: [string, string];
  backgroundColor?: string;
  environmentPreset?:
    | "apartment"
    | "city"
    | "dawn"
    | "forest"
    | "lobby"
    | "night"
    | "park"
    | "studio"
    | "sunset"
    | "warehouse";
  height?: string;
}) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoom, setZoom] = useState(1);
  const boundsRef = useRef<BoundsApi>(null);
  const [initialFitComplete, setInitialFitComplete] = useState(false);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(10);

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Controls overlay */}
      <div className="absolute top-2 left-0 right-0 z-10 flex justify-left gap-2 px-4">
        <div className="flex items-center gap-2 rounded-lg bg-background/80 p-2 backdrop-blur-sm">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setAutoRotate(!autoRotate)}
            className={autoRotate ? "bg-primary text-primary-foreground" : ""}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Toggle auto-rotate</span>
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        style={{ background: backgroundColor, width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />

        <Suspense fallback={<Loader />}>
          <Bounds
            fit
            clip
            observe={!initialFitComplete} // Only observe before initial fit
            onFit={() => setInitialFitComplete(true)}
          >
            <Model
              url={modelUrls[0]}
              position={[50, 50, 5]}
              onSizeChange={(size) => {
                setMinZoom(size * 0.1);
                setMaxZoom(size * 2);
              }}
            />
            <Model
              url={modelUrls[1]}
              position={[0, 0, 0]}
              onSizeChange={(size) => {
                setMinZoom(size * 0.1);
                setMaxZoom(size * 2);
              }}
            />
          </Bounds>

          <Environment preset={environmentPreset} />
        </Suspense>

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={minZoom}
          maxDistance={maxZoom}
        />
      </Canvas>
    </div>
  );
}

// Preload the default model
useGLTF.preload("./bmw.glb");
