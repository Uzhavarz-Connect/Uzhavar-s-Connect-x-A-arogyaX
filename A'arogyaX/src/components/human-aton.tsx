"use client";
import React, { useRef, useState, useEffect, useMemo, JSX } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Html,
  Text,
  Sphere,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
export type Organ = "heart" | "liver" | "lungs" | "kidneys" | "brain";

// Custom hook for creating an organ mesh
const useOrganMesh = (
  geometry: JSX.Element,
  color: string,
  position: THREE.Vector3,
  scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1)
) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing animation
      const time = state.clock.getElapsedTime();
      meshRef.current.scale.x = scale.x * (1 + Math.sin(time * 0.5) * 0.02);
      meshRef.current.scale.y = scale.y * (1 + Math.sin(time * 0.5) * 0.02);
      meshRef.current.scale.z = scale.z * (1 + Math.sin(time * 0.5) * 0.02);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshPhysicalMaterial
        color={color}
        roughness={0.3}
        metalness={0.1}
        clearcoat={0.4}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
};

// Organ Indicator with Arrow pointing to organ
const OrganIndicator = ({
  position,
  status,
  organ,
  onSelectOrgan,
  isHovered,
  onHover,
  direction = "top-right",
}: {
  position: THREE.Vector3;
  status: "normal" | "warning" | "critical";
  organ: Organ;
  onSelectOrgan: (organ: Organ) => void;
  isHovered: boolean;
  onHover: (organ: Organ | null) => void;
  direction?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}) => {
  const arrowOffset = useMemo(() => {
    switch (direction) {
      case "top-right":
        return { x: 30, y: -30 };
      case "top-left":
        return { x: -30, y: -30 };
      case "bottom-right":
        return { x: 30, y: 30 };
      case "bottom-left":
        return { x: -30, y: 30 };
      default:
        return { x: 30, y: -30 };
    }
  }, [direction]);

  // Get status colors
  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  // Get organ icon
  const getOrganIcon = () => {
    switch (organ) {
      case "heart":
        return "❤️";
      case "brain":
        return "🧠";
      case "lungs":
        return "🫁";
      case "liver":
        return "🫀";
      case "kidneys":
        return "🟤";
      default:
        return "";
    }
  };

  return (
    <Html position={position} distanceFactor={15} zIndexRange={[100, 0]}>
      <div className="relative">
        {/* Arrow line connecting indicator to organ */}
        <div
          className={`absolute w-8 h-0.5 ${
            status === "normal"
              ? "bg-green-500"
              : status === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{
            transform: `rotate(${
              Math.atan2(arrowOffset.y, arrowOffset.x) * (180 / Math.PI)
            }deg)`,
            width: `${Math.sqrt(
              Math.pow(arrowOffset.x, 2) + Math.pow(arrowOffset.y, 2)
            )}px`,
            left: arrowOffset.x < 0 ? arrowOffset.x : 0,
            top: arrowOffset.y < 0 ? arrowOffset.y : 0,
          }}
        ></div>

        {/* Indicator dot */}
        <div
          className={`absolute w-2 h-2 rounded-full ${
            status === "normal"
              ? "bg-green-500"
              : status === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          } 
            animate-pulse`}
          style={{
            left: 0,
            top: 0,
          }}
        ></div>

        {/* Organ indicator button */}
        <div
          className={`absolute rounded-full cursor-pointer flex items-center justify-center 
            transition-all duration-300 transform ${
              isHovered ? "scale-125" : "scale-100"
            } ${getStatusColor()}
            shadow-lg`}
          style={{
            width: "20px",
            height: "20px",
            left: arrowOffset.x,
            top: arrowOffset.y,
          }}
          onClick={() => onSelectOrgan(organ)}
          onMouseEnter={() => onHover(organ)}
          onMouseLeave={() => onHover(null)}
        >
          <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center text-[6px]">
            <span>{getOrganIcon()}</span>
          </div>
        </div>
      </div>
    </Html>
  );
};

// Baymax model with visible internal organs
const BaymaxModel = ({
  onSelectOrgan,
}: {
  onSelectOrgan: (organ: Organ) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredOrgan, setHoveredOrgan] = useState<Organ | null>(null);

  // Define organ positions relative to the body
  const organPositions = {
    heart: new THREE.Vector3(0.2, 0.5, 0.3),
    brain: new THREE.Vector3(0, 1.6, 0),
    lungs: new THREE.Vector3(0, 0.5, 0.2),
    liver: new THREE.Vector3(-0.3, 0.2, 0.3),
    kidneys: new THREE.Vector3(0, -0.2, 0.2),
  };

  // Define indicator directions
  const indicatorDirections = {
    heart: "top-right",
    brain: "top-right",
    lungs: "bottom-right",
    liver: "top-left",
    kidneys: "bottom-left",
  } as const;

  // Define status colors for different health states
  //   const getStatusColor = (organStatus: string) => {
  //     switch (healthData.organs[organ].status) {
  //       case "normal":
  //         return "#22c55e"; // green
  //       case "warning":
  //         return "#eab308"; // yellow
  //       case "critical":
  //         return "#ef4444"; // red
  //       default:
  //         return "#22c55e";
  //     }
  //   };

  // Gentle floating animation for the whole body
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      groupRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  // Handle hover effects
  const handleOrganHover = (organ: Organ | null) => {
    setHoveredOrgan(organ);
    document.body.style.cursor = organ ? "pointer" : "auto";
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Baymax body */}
      <group>
        {/* Main body - balloon-like upper torso */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[1.1, 32, 32]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            roughness={0.1}
            clearcoat={0.5}
          />
        </mesh>

        {/* Lower body - slightly larger balloon */}
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            roughness={0.1}
            clearcoat={0.5}
          />
        </mesh>

        {/* Head - perfect sphere */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            roughness={0.1}
            clearcoat={0.5}
          />
        </mesh>

        {/* Eyes - Two black ovals */}
        <mesh position={[-0.18, 1.55, 0.53]} rotation={[0, 0, -0.1]}>
          <sphereGeometry args={[0.07, 32, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0.18, 1.55, 0.53]} rotation={[0, 0, 0.1]}>
          <sphereGeometry args={[0.07, 32, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Line connecting eyes */}
        <mesh position={[0, 1.55, 0.53]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.33, 0.01, 0.01]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Arms - puffy and rounded */}
        <mesh position={[-1.3, 0.2, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.3, 1, 8, 16]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            roughness={0.1}
            clearcoat={0.5}
          />
        </mesh>
        <mesh position={[1.3, 0.2, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.3, 1, 8, 16]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            roughness={0.1}
            clearcoat={0.5}
          />
        </mesh>

        {/* Legs - short and stubby */}
        <mesh position={[-0.5, -1.9, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            roughness={0.1}
            clearcoat={0.5}
          />
        </mesh>
        <mesh position={[0.5, -1.9, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            roughness={0.1}
            clearcoat={0.5}
          />
        </mesh>

        {/* Healthcare chip/port */}
        <mesh position={[0, 0.5, 1]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.1, 32]} />
          <meshBasicMaterial color="#f1f1f1" />
        </mesh>
        <mesh position={[0, 0.5, 1.01]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.07, 0.1, 32]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
      </group>

      {/* Semi-transparent effect to see inside */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          roughness={0.1}
          clearcoat={0.8}
        />
      </mesh>

      {/* Brain */}
      {useOrganMesh(
        <sphereGeometry args={[0.25, 32, 32]} />,
        hoveredOrgan === "brain" ? "#d8b4fe" : "#9333ea",
        organPositions.brain
      )}

      {/* Heart */}
      {useOrganMesh(
        <sphereGeometry args={[0.2, 32, 32]} />,
        hoveredOrgan === "heart" ? "#fca5a5" : "#dc2626",
        organPositions.heart,
        new THREE.Vector3(1, 1.2, 0.8)
      )}

      {/* Lungs - Right and Left */}
      {useOrganMesh(
        <sphereGeometry args={[0.2, 32, 16]} />,
        hoveredOrgan === "lungs" ? "#bae6fd" : "#0ea5e9",
        new THREE.Vector3(0.3, 0.5, 0.2)
      )}
      {useOrganMesh(
        <sphereGeometry args={[0.2, 32, 16]} />,
        hoveredOrgan === "lungs" ? "#bae6fd" : "#0ea5e9",
        new THREE.Vector3(-0.3, 0.5, 0.2)
      )}

      {/* Liver */}
      {useOrganMesh(
        <sphereGeometry args={[0.25, 32, 16]} />,
        hoveredOrgan === "liver" ? "#f3b592" : "#c2410c",
        organPositions.liver
      )}

      {/* Kidneys - Left and Right */}
      {useOrganMesh(
        <sphereGeometry args={[0.08, 32, 16]} />,
        hoveredOrgan === "kidneys" ? "#fed7aa" : "#b45309",
        new THREE.Vector3(0.2, -0.2, 0.2)
      )}
      {useOrganMesh(
        <sphereGeometry args={[0.08, 32, 16]} />,
        hoveredOrgan === "kidneys" ? "#fed7aa" : "#b45309",
        new THREE.Vector3(-0.2, -0.2, 0.2)
      )}

      {/* Clickable indicators for each organ with arrows */}
      {Object.entries(organPositions).map(([organ, position]) => (
        <OrganIndicator
          key={organ}
          position={position as THREE.Vector3}
          status={"normal"}
          organ={organ as Organ}
          onSelectOrgan={onSelectOrgan}
          isHovered={hoveredOrgan === organ}
          onHover={handleOrganHover}
          direction={indicatorDirections[organ as Organ]}
        />
      ))}
    </group>
  );
};

// Advanced Holographic Organ Model
const EnhancedOrganModel = ({
  organId,
  zoomLevel = 1,
  showDetails = false,
}: {
  organId: Organ;
  zoomLevel?: number;
  showDetails?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the organ model
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;

      // Add subtle floating motion
      groupRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  // Holographic effect with subtle distortion
  const HolographicEffect = () => (
    <Sphere args={[1.3 * zoomLevel, 32, 32]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#3b82f6"
        attach="material"
        distort={0.1}
        speed={1}
        transparent
        opacity={0.05}
      />
    </Sphere>
  );

  // Dynamic detail rendering based on zoom level
  const OrganDetails = () => {
    if (!showDetails) return null;

    // Position details text around the organ
    return (
      <>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {organId.toUpperCase()}
        </Text>
        {organId === "brain" && zoomLevel > 1.5 && (
          <>
            <Text
              position={[0.8, 0.3, 0]}
              fontSize={0.08}
              color="#d8b4fe"
              anchorX="center"
              anchorY="middle"
            >
              Cerebral Cortex
            </Text>
            <Text
              position={[-0.8, 0.3, 0]}
              fontSize={0.08}
              color="#d8b4fe"
              anchorX="center"
              anchorY="middle"
            >
              Cerebellum
            </Text>
            <Text
              position={[0, -0.8, 0]}
              fontSize={0.08}
              color="#d8b4fe"
              anchorX="center"
              anchorY="middle"
            >
              Brain Stem
            </Text>
          </>
        )}
        {organId === "heart" && zoomLevel > 1.5 && (
          <>
            <Text
              position={[0.6, 0.3, 0]}
              fontSize={0.08}
              color="#fca5a5"
              anchorX="center"
              anchorY="middle"
            >
              Right Atrium
            </Text>
            <Text
              position={[-0.6, 0.3, 0]}
              fontSize={0.08}
              color="#fca5a5"
              anchorX="center"
              anchorY="middle"
            >
              Left Atrium
            </Text>
            <Text
              position={[0, -0.6, 0]}
              fontSize={0.08}
              color="#fca5a5"
              anchorX="center"
              anchorY="middle"
            >
              Ventricles
            </Text>
          </>
        )}
      </>
    );
  };

  return (
    <group ref={groupRef}>
      <HolographicEffect />
      {/* Generic organ model rendering based on organ ID */}
      {organId === "heart" && <HeartModel />}
      {organId === "brain" && <BrainModel zoomLevel={zoomLevel} />}
      {organId === "lungs" && <LungsModel />}
      {organId === "liver" && <LiverModel />}
      {organId === "kidneys" && <KidneysModel />}
      <OrganDetails />
    </group>
  );
};

// Enhanced Brain model with internal structures
const BrainModel = ({ zoomLevel = 1 }: { zoomLevel?: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Show detailed brain structures when zoomed in
  const showDetails = zoomLevel > 1.5;

  return (
    <group ref={groupRef}>
      {/* Brain main body */}
      <mesh>
        <sphereGeometry args={[1 * zoomLevel, 32, 32]} />
        <meshStandardMaterial color="#9333ea" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Brain texture/wrinkles */}
      <mesh>
        <sphereGeometry args={[1.02 * zoomLevel, 32, 32]} />
        <meshStandardMaterial
          color="#d8b4fe"
          wireframe={true}
          transparent={true}
          opacity={0.5}
        />
      </mesh>

      {/* Cerebellum */}
      <mesh position={[0, -0.7 * zoomLevel, 0]}>
        <sphereGeometry args={[0.8 * zoomLevel, 16, 16]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Brain stem */}
      <mesh position={[0, -1.1 * zoomLevel, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry
          args={[0.2 * zoomLevel, 0.15 * zoomLevel, 0.6 * zoomLevel, 16]}
        />
        <meshStandardMaterial color="#a78bfa" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Detailed internal structures when zoomed in */}
      {showDetails && (
        <>
          {/* Cerebral cortex detailed folds */}
          <mesh>
            <sphereGeometry args={[0.9 * zoomLevel, 32, 32]} />
            <meshStandardMaterial
              color="#c4b5fd"
              wireframe={true}
              transparent={true}
              opacity={0.7}
            />
          </mesh>

          {/* Left and right hemispheres dividing line */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[2 * zoomLevel, 2 * zoomLevel]} />
            <meshStandardMaterial
              color="#8b5cf6"
              transparent={true}
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Hippocampus representation */}
          <mesh position={[0.4 * zoomLevel, -0.2 * zoomLevel, 0]}>
            <capsuleGeometry args={[0.1 * zoomLevel, 0.3 * zoomLevel, 8, 8]} />
            <meshStandardMaterial
              color="#c084fc"
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
          <mesh position={[-0.4 * zoomLevel, -0.2 * zoomLevel, 0]}>
            <capsuleGeometry args={[0.1 * zoomLevel, 0.3 * zoomLevel, 8, 8]} />
            <meshStandardMaterial
              color="#c084fc"
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

// Detailed heart model with animations
const HeartModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Beating heart animation
      const time = state.clock.getElapsedTime();
      const beatScale = 1 + Math.sin(time * 5) * 0.05;
      groupRef.current.scale.set(beatScale, beatScale, beatScale);
      groupRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main heart shape */}
      <mesh>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.85]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Heart top/arteries */}
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI * 0.15]}>
        <cylinderGeometry args={[0.4, 0.6, 1, 32]} />
        <meshStandardMaterial color="#c0392b" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Heart ventricles */}
      <mesh position={[0.3, 0.2, 0.6]}>
        <sphereGeometry args={[0.4, 32, 16]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[-0.3, 0.2, 0.6]}>
        <sphereGeometry args={[0.4, 32, 16]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Heart vessels */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#c0392b" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
};

// Enhanced lung models with breathing animation
const LungsModel = () => {
  const leftLungRef = useRef<THREE.Group>(null);
  const rightLungRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const breathScale = 1 + Math.sin(time * 1.5) * 0.1;

    if (leftLungRef.current && rightLungRef.current) {
      leftLungRef.current.scale.set(breathScale, breathScale, breathScale);
      rightLungRef.current.scale.set(breathScale, breathScale, breathScale);
    }
  });

  return (
    <group>
      {/* Right lung */}
      <group ref={rightLungRef} position={[0.8, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 16]} />
          <meshStandardMaterial
            color="#0ea5e9"
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <sphereGeometry args={[0.4, 32, 16]} />
          <meshStandardMaterial
            color="#0ea5e9"
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Left lung */}
      <group ref={leftLungRef} position={[-0.8, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 16]} />
          <meshStandardMaterial
            color="#0ea5e9"
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.4, 32, 16]} />
          <meshStandardMaterial
            color="#0ea5e9"
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Trachea */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial color="#7dd3fc" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Bronchi */}
      <mesh position={[0.3, 0.7, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#7dd3fc" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[-0.3, 0.7, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#7dd3fc" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
};

// Enhanced liver model
const LiverModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main liver lobe */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 12]} />
        <meshStandardMaterial color="#c2410c" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Secondary liver lobe */}
      <mesh position={[-0.8, 0.1, 0.5]}>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshStandardMaterial color="#c2410c" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Blood vessels texture */}
      <mesh>
        <sphereGeometry args={[1.22, 16, 12]} />
        <meshStandardMaterial
          color="#f97316"
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

// Enhanced kidneys model
const KidneysModel = () => {
  const leftKidneyRef = useRef<THREE.Group>(null);
  const rightKidneyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (leftKidneyRef.current && rightKidneyRef.current) {
      leftKidneyRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      rightKidneyRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  const KidneyShape = ({
    position,
  }: {
    position: [number, number, number];
  }) => (
    <group position={position}>
      {/* Kidney bean shape */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshStandardMaterial color="#b45309" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Kidney indent */}
      <mesh position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.4, 32, 16]} />
        <meshStandardMaterial color="#000" transparent opacity={0} />
      </mesh>

      {/* Ureter */}
      <mesh position={[0, -0.4, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );

  return (
    <group>
      <group ref={leftKidneyRef}>
        <KidneyShape position={[-1, 0, 0]} />
      </group>
      <group ref={rightKidneyRef}>
        <KidneyShape position={[1, 0, 0]} />
      </group>
    </group>
  );
};

// Weather Effects Component (Rain & Waves)
const WeatherEffects = () => {
  const [raindrops, setRaindrops] = useState<
    Array<{ id: number; left: number; size: number; duration: number }>
  >([]);

  useEffect(() => {
    // Create initial raindrops
    const drops = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 1 + 0.5,
    }));

    setRaindrops(drops);

    // Periodically refresh raindrops
    const interval = setInterval(() => {
      setRaindrops((prevDrops) =>
        prevDrops.map((drop) => ({
          ...drop,
          left: Math.random() * 100,
          duration: Math.random() * 1 + 0.5,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="rain-container">
        {raindrops.map((drop) => (
          <div
            key={drop.id}
            className="raindrop"
            style={{
              left: `${drop.left}%`,
              width: `${drop.size}px`,
              height: `${drop.size * 5}px`,
              animationDuration: `${drop.duration}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </>
  );
};

export type HumanAtonProps = {
  organType?: Organ;
  onSelect?: (organ: Organ) => void;
};

export default function HumanAton({ onSelect }: HumanAtonProps) {
  const handleSelectOrgan = (organ: Organ) => {
    onSelect!(organ);
  };

  return (
    <div className="relative w-[40dvw] h-[40dvw] bg-white/20 backdrop-blur-md rounded-2xl border border-zinc-400/40 shandow-md">
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, -10, -10]} intensity={0.5} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          rotateSpeed={0.5}
        />
        <BaymaxModel onSelectOrgan={handleSelectOrgan} />
      </Canvas>
    </div>
  );
}

// Digital twin for organ monitoring - enhanced detail view
// export const OrganDetailScene = ({ organId }: { organData: Organ }) => {
//   const organData = healthData.organs[organId];
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [showDetails, setShowDetails] = useState(false);

//   // Handle zoom level changes
//   const handleZoom = (newLevel: number) => {
//     setZoomLevel(newLevel);
//     if (newLevel > 1.5 && !showDetails) {
//       setShowDetails(true);
//     } else if (newLevel <= 1.5 && showDetails) {
//       setShowDetails(false);
//     }
//   };

//   return (
//     <div className="w-full h-full relative digital-twin-container hologram-effect">
//       <Canvas shadows>
//         <color attach="background" args={["#020617"]} />
//         <ambientLight intensity={0.8} />
//         <spotLight
//           position={[5, 5, 5]}
//           angle={0.3}
//           penumbra={1}
//           intensity={2}
//           castShadow
//         />
//         <pointLight position={[-5, -5, -5]} intensity={0.5} />
//         <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
//         <OrbitControls
//           enablePan={false}
//           autoRotate={true}
//           autoRotateSpeed={2}
//           enableZoom={true}
//           minDistance={2}
//           maxDistance={8}
//           onChange={(e) => {
//             // Update zoom level based on camera distance
//             const distance = e.target.getDistance();
//             const newZoom = 5 / Math.max(distance, 1);
//             handleZoom(newZoom);
//           }}
//         />
//         <EnhancedOrganModel
//           organId={organId}
//           zoomLevel={zoomLevel}
//           showDetails={showDetails}
//         />
//       </Canvas>

//       {/* Digital Twin Monitoring Overlay */}
//       <div className="digital-twin-monitor">
//         <div className="flex items-center space-x-2">
//           <div
//             className={`w-3 h-3 rounded-full ${
//               organData.status === "normal"
//                 ? "bg-green-500"
//                 : organData.status === "warning"
//                 ? "bg-yellow-500"
//                 : "bg-red-500"
//             }`}
//           ></div>
//           <span className="uppercase text-xs font-bold">Live Monitoring</span>
//         </div>
//         <div className="mt-1 text-xs opacity-80">
//           {showDetails ? "Detail View" : "Standard View"}• Zoom:{" "}
//           {Math.round(zoomLevel * 100)}%
//         </div>
//       </div>

//       {/* Digital Twin Stats */}
//       <div className="digital-twin-stats">
//         <div className="grid grid-cols-2 gap-3">
//           {Object.entries(organData.metrics).map(([key, metric]) => (
//             <div key={key} className="flex flex-col">
//               <span className="uppercase text-xs text-gray-300">
//                 {key
//                   .replace(/([A-Z])/g, " $1")
//                   .replace(/^./, (str) => str.toUpperCase())}
//               </span>
//               <div className="flex items-baseline mt-1">
//                 <span className="text-xl font-bold">{metric.value}</span>
//                 <span className="ml-1 text-gray-300">{metric.unit}</span>
//               </div>
//               <div
//                 className={`stat-bar ${
//                   metric.status === "normal"
//                     ? "bg-green-500"
//                     : metric.status === "warning"
//                     ? "bg-yellow-500"
//                     : "bg-red-500"
//                 }`}
//               ></div>
//             </div>
//           ))}
//         </div>

//         {/* Enhanced instruction for users */}
//         <div className="mt-3 text-xs text-gray-400">
//           Zoom in to explore internal anatomy • Rotate for 360° view
//         </div>
//       </div>

//       {/* Hologram scan lines effect */}
//       <div className="absolute inset-0 pointer-events-none z-10 opacity-10">
//         <div
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(transparent, transparent 2px, rgba(59, 130, 246, 0.5) 2px, rgba(59, 130, 246, 0.5) 4px)",
//             backgroundSize: "100% 4px",
//             width: "100%",
//             height: "100%",
//             animation: "scanlines 1s linear infinite",
//           }}
//         ></div>
//       </div>
//     </div>
//   );
// };
