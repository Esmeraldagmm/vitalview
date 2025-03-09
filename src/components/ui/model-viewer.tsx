"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  useGLTF,
  useProgress,
  Html,
  Center,
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

// Model component that loads glTF models or JSON-based BufferGeometry
function Model({
  url,
  tumorData,
  position = [0, 0, 0],
  onSizeChange,
}: {
  url?: string;
  tumorData?: any;
  position?: [number, number, number];
  onSizeChange: (size: number) => void;
}) {
  const { scene } = useGLTF(url); // Load the glTF model
  const bounds = useBounds(); // Hook for managing bounds
  const mainSceneRef = useRef(new THREE.Group());
  const tumorRef = useRef<THREE.Mesh | null>(null);

  // Set up bounds and size calculation
  useEffect(() => {
    if (!scene) return;

    // Clone the scene to avoid modifying the cached original
    const clonedScene = scene.clone();

    // Clear previous contents and add the cloned scene
    while (mainSceneRef.current.children.length > 0) {
      mainSceneRef.current.remove(mainSceneRef.current.children[0]);
    }
    mainSceneRef.current.add(clonedScene);

    // Calculate bounds for camera positioning
    bounds.refresh(mainSceneRef.current).fit();
    const box = new THREE.Box3().setFromObject(mainSceneRef.current);
    const size = box.getSize(new THREE.Vector3()).length();
    onSizeChange(size);
  }, [scene, bounds, onSizeChange]);

  // Apply transparency to the outer model (brain/skull)
  useEffect(() => {
    if (!scene) return;

    scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        if (node.material) {
          // Process all materials (either array or single)
          const materials = Array.isArray(node.material)
            ? node.material
            : [node.material];

          materials.forEach((mat) => {
            // Apply transparency to all outer model materials
            mat.transparent = true;
            mat.opacity = 0.3; // More transparent than before
            mat.depthWrite = false; // Important for better transparency rendering
            mat.side = THREE.DoubleSide; // Render both sides
            mat.needsUpdate = true; // Important to apply changes
          });
        }
      }
    });
  }, [scene]);

  // Add tumor model if data is provided
  useEffect(() => {
    if (!tumorData || !mainSceneRef.current) return;

    // Remove previous tumor if it exists
    if (tumorRef.current) {
      mainSceneRef.current.remove(tumorRef.current);
      tumorRef.current = null;
    }

    try {
      // Create the tumor geometry from JSON data
      const loader = new THREE.BufferGeometryLoader();
      const geometry = loader.parse(tumorData);

      // Create a material that stands out against the outer model
      const material = new THREE.MeshStandardMaterial({
        color: 0xff0000, // Bright red to catch attention
        emissive: 0xff4444, // Light emission for glowing effect
        emissiveIntensity: 0.5, // Adjust intensity for better visibility
        side: THREE.DoubleSide,
        transparent: false, // Ensure it's fully visible
        opacity: 1.0, // Make it solid
      });

      // Create and position the tumor mesh
      const tumorMesh = new THREE.Mesh(geometry, material);
      tumorMesh.position.set(...position);
      tumorRef.current = tumorMesh;

      // Add to the scene
      mainSceneRef.current.add(tumorMesh);

      // Update bounds after adding tumor
      bounds.refresh(mainSceneRef.current);
    } catch (error) {
      console.error("Error creating tumor model:", error);
    }
  }, [tumorData, bounds, position]);

  return <primitive object={mainSceneRef.current} />;
}

// Main 3D viewer component
export default function ModelViewer({
  modelUrls = ["./scene.gltf"],
  tumorData,
  backgroundColor = "#f5f5f5",
  environmentPreset = "studio",
  height = "100vh",
}: {
  modelUrls?: string[];
  tumorData?: any;
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
  const [initialFitComplete, setInitialFitComplete] = useState(false);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(10);
  const boundsRef = useRef<BoundsApi>(null);

  // Reset view function
  const resetView = () => {
    if (boundsRef.current) {
      setZoom(1); // Reset zoom state
      boundsRef.current.refresh().fit();
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev * 0.8, minZoom));
  };

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2 px-4">
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

          <Button variant="outline" size="icon" onClick={resetView}>
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Reset view</span>
          </Button>

          {/* Add functional zoom buttons */}
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom out</span>
          </Button>

          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom in</span>
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        style={{ background: backgroundColor }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          preserveDrawingBuffer: true,
          alpha: true, // Enable alpha for better transparency
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />

        <Suspense fallback={<Loader />}>
          <Bounds
            ref={boundsRef}
            fit
            clip
            observe={!initialFitComplete} // Only observe before initial fit
            onFit={() => setInitialFitComplete(true)}
          >
            <Center scale={zoom}>
              {/* Render the glTF scene and inject the tumor model */}
              <Model
                url={modelUrls[0]}
                tumorData={tumorData} // Pass tumorData here
                position={[80, -30, -20]}
                onSizeChange={(size) => {
                  setMinZoom(size * 0.1);
                  setMaxZoom(size * 2);
                }}
              />
            </Center>
          </Bounds>

          {/* Add stronger lighting to make tumor more visible */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />

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
useGLTF.preload("./scene.gltf");
