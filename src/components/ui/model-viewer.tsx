"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
} from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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

  // // Add tumor model if data is provided
  // useEffect(() => {
  //   if (!tumorData || !mainSceneRef.current) return;

  //   // Remove previous tumor if it exists
  //   if (tumorRef.current) {
  //     mainSceneRef.current.remove(tumorRef.current);
  //     tumorRef.current = null;
  //   }

  //   try {
  //     // Create the tumor geometry from JSON data
  //     const loader = new THREE.BufferGeometryLoader();
  //     const geometry = loader.parse(tumorData);

  //     // Create a material that stands out against the outer model
  //     const material = new THREE.MeshStandardMaterial({
  //       color: 0xff0000, // Bright red to catch attention
  //       emissive: 0xff4444, // Light emission for glowing effect
  //       emissiveIntensity: 0.5, // Adjust intensity for better visibility
  //       side: THREE.DoubleSide,
  //       transparent: false, // Ensure it's fully visible
  //       opacity: 1.0, // Make it solid
  //     });

  //     // Create and position the tumor mesh
  //     const tumorMesh = new THREE.Mesh(geometry, material);
  //     tumorMesh.position.set(...position);
  //     tumorRef.current = tumorMesh;

  //     // Add to the scene
  //     mainSceneRef.current.add(tumorMesh);

  //     // Update bounds after adding tumor
  //     bounds.refresh(mainSceneRef.current);
  //   } catch (error) {
  //     console.error("Error creating tumor model:", error);
  //   }
  // }, [tumorData, bounds, position]);

  return <primitive object={mainSceneRef.current} />;
}

// Function to generate tumor stages without changing transparency
const generateTumorStages = (mockData) => {
  const stages = 5; // 5 stages for tumor shrinkage
  const baseTumor = mockData.data.attributes.position.array; // Get base positions

  return Array.from({ length: stages }, (_, i) => {
    const scale = 1 - i * 0.2; // Reduce tumor size per stage
    const scaledVertices = baseTumor.map((val) => val * scale); // Scale positions

    return {
      metadata: mockData.metadata,
      data: {
        attributes: {
          position: {
            ...mockData.data.attributes.position,
            array: scaledVertices,
          },
          normal: mockData.data.attributes.normal,
        },
        index: mockData.data.index,
      },
    };
  });
};

// Loader component
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

// New Tumor Model Component to Handle Progression
function TumorModel({ tumorData, position }) {
  const tumorRef = useRef<THREE.Mesh | null>(null);
  const bounds = useBounds();
  const mainSceneRef = useRef(new THREE.Group());

  useEffect(() => {
    if (!tumorData || !mainSceneRef.current) return;

    // Remove previous tumor if it exists
    if (tumorRef.current) {
      mainSceneRef.current.remove(tumorRef.current);
      tumorRef.current = null;
    }

    try {
      const loader = new THREE.BufferGeometryLoader();
      const geometry = loader.parse(tumorData);

      const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff4444,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1.0, // Keep it solid
      });

      const tumorMesh = new THREE.Mesh(geometry, material);
      tumorMesh.position.set(...position);
      tumorRef.current = tumorMesh;
      mainSceneRef.current.add(tumorMesh);
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
}) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [modelSize, setModelSize] = useState(5);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [tumorStage, setTumorStage] = useState(0); // Tumor progression stage

  const tumorStages = generateTumorStages(tumorData); // Generate tumor shrinkage data

  // Use refs to access Three.js objects
  const controlsRef = useRef(null);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.multiplyScalar(0.8);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.multiplyScalar(1.25);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex flex-col items-center gap-2 px-4">
        <div className="flex items-center gap-2 rounded-lg bg-background/80 p-2 backdrop-blur-sm">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setAutoRotate(!autoRotate)}
            className={autoRotate ? "bg-primary text-primary-foreground" : ""}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Tumor Stage Slider */}
        <div className="flex items-center gap-2 bg-background/80 p-2 rounded-lg backdrop-blur-sm w-full max-w-md">
          <span className="text-xs text-muted-foreground">
            Tumor Progression:
          </span>
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={tumorStage}
            onChange={(e) => setTumorStage(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-muted-foreground">
            Stage {tumorStage + 1}
          </span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        style={{ background: backgroundColor, width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />

        <Suspense fallback={<Loader />}>
          <Bounds fit clip observe>
            <Center>
              {/* Existing Model (Brain/Skull with Transparency) */}
              <Model
                url={modelUrls[0]}
                tumorData={tumorData} // Keep your existing transparent model
                position={[-60, 70, 20]}
                onSizeChange={(size) => setModelSize(size)}
              />

              {/* New Tumor Model (Shrinkage Effect) */}
              <TumorModel
                tumorData={tumorStages[tumorStage]}
                position={[-60, 70, 20]}
              />
            </Center>
          </Bounds>

          {/* Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />

          <Environment preset={environmentPreset} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          enablePan
          enableZoom
          enableRotate
        />
      </Canvas>
    </div>
  );
}

// Preload Model
useGLTF.preload("./scene.gltf");
