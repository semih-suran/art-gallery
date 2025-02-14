import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useCursor,
  MeshReflectorMaterial,
  Image,
  Text,
  Environment,
} from "@react-three/drei";
import {
  fetchExhibitionById,
  fetchArtInstituteArtworkById,
  fetchHarvardArtworkById,
} from "../services/api";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import getUuid from "uuid-by-string";
import { useParams } from "react-router-dom";

const GOLDENRATIO = 1.61803398875;

export const ExhibitionViewV2 = () => {
  const { id: exhibitionId } = useParams();
  const [fetchedData, setFetchedData] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadExhibitionData = async () => {
      try {
        const data = await fetchExhibitionById(exhibitionId);
        setFetchedData(data);
        const artworks = await Promise.all(
          data.exhibitions.map(async (artwork) => {
            return await fetchArtwork(artwork);
          })
        );
        setImages(artworks.filter(Boolean));
      } catch (error) {
        console.error("Error loading exhibition:", error);
      }
    };

    loadExhibitionData();
  }, [exhibitionId]);

  const fetchArtwork = async (artwork) => {
    if (!artwork) return null;
    const type = artwork.charAt(0);
    const id = artwork.slice(1);
    try {
      if (type === "h") {
        return await fetchHarvardArtworkById(id);
      } else if (type === "c") {
        return await fetchArtInstituteArtworkById(id);
      }
    } catch (error) {
      console.error(`Error fetching artwork with ID ${artwork}:`, error);
    }
    return null;
  };

  return (
    fetchedData && (
      <Canvas dpr={[1, 1.5]} camera={{ fov: 90, position: [0, 0, 10] }}>
        <color attach="background" args={["#191920"]} />
        <fog attach="fog" args={["#191920", 0, 15]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <group position={[0, -0.5, 0]}>
          <Frames images={images} />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[200, 60]} // Adjust blur
              resolution={1024} // Reduce resolution
              mixBlur={0.75} // Adjust mixBlur
              mixStrength={60} // Adjust mixStrength
              roughness={1}
              depthScale={0.9} // Adjust depthScale
              minDepthThreshold={0.4}
              maxDepthThreshold={1.2}
              color="#101010" // Darker floor color
              metalness={0.6}
            />
          </mesh>
        </group>
        <Environment preset="city" />
      </Canvas>
    )
  );
};

function Frames({
  images,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) {
  const ref = useRef();
  const clicked = useRef();
  const [, params] = useRoute("/item/:id");
  const [, setLocation] = useLocation();

  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id);
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 5.5);
      q.identity();
    }
  });

  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt);
    easing.dampQ(state.camera.quaternion, q, 0.4, dt);
  });

  return (
    <group
      ref={ref}
      onClick={(e) => (
        e.stopPropagation(),
        setLocation(
          clicked.current === e.object ? "/" : "/item/" + e.object.name
        )
      )}
      onPointerMissed={() => setLocation("/")}
    >
      {images.map(({ image, ...rest }, index) => (
        <Frame
          key={image}
          url={image}
          position={[index * 1.5, 0.5, 0]}
          {...rest}
        />
      ))}
    </group>
  );
}

function Frame({ id, url, c = new THREE.Color(), position, ...props }) {
  const image = useRef();
  const frame = useRef();
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(String(id));
  const isActive = params?.id === name;
  useCursor(hovered);

  useFrame((state, dt) => {
    image.current.material.zoom =
      2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
    easing.damp3(
      image.current.scale,
      [
        0.85 * (!isActive && hovered ? 0.85 : 1),
        0.9 * (!isActive && hovered ? 0.905 : 1),
        1,
      ],
      0.1,
      dt
    );
    easing.dampC(
      frame.current.material.color,
      hovered ? "orange" : "white",
      0.1,
      dt
    );
  });

  return (
    <group {...props} position={position}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1.2, GOLDENRATIO * 1.2, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial
          color="#151515"
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh
          ref={frame}
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.2]}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        {url ? (
          <Image
            raycast={() => null}
            ref={image}
            position={[0, 0, 0.7]}
            url={url}
          />
        ) : (
          <meshStandardMaterial color="gray" />
        )}
      </mesh>
      <Text
        maxWidth={0.1}
        anchorX="left"
        anchorY="top"
        position={[0.55, GOLDENRATIO, 0]}
        fontSize={0.025}
      >
        {name.split("-").join(" ")}
      </Text>
    </group>
  );
}

export default ExhibitionViewV2;
