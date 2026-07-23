import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./LogoScrollReveal.css";

import outlineSVG from "../public/logo2.png";
import filledSVG from "../public/full1.png"; // your filled svg

export default function LogoScrollReveal() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    /* ================= SCENE ================= */
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -1, 1, 1, -1, 0.1, 10
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    /* ================= TEXTURES ================= */
    const loader = new THREE.TextureLoader();
    const outlineTex = loader.load(outlineSVG);
    const fillTex = loader.load(filledSVG);

    outlineTex.minFilter = fillTex.minFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(1.2, 1.2);

    /* ================= OUTLINE ================= */
    const outlineMat = new THREE.MeshBasicMaterial({
      map: outlineTex,
      transparent: true,
    });

    const outlineMesh = new THREE.Mesh(geometry, outlineMat);
    scene.add(outlineMesh);

    /* ================= FILL SHADER ================= */
    const fillMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTexture: { value: fillTex },
        uProgress: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uProgress;
        varying vec2 vUv;

        void main() {
          if (vUv.y > uProgress) discard;
          gl_FragColor = texture2D(uTexture, vUv);
        }
      `,
    });

    const fillMesh = new THREE.Mesh(geometry, fillMat);
    scene.add(fillMesh);

    /* ================= SCROLL LOGIC ================= */
    const section = mount.closest(".logo-scroll-section");

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;

      let progress = -rect.top / total;
      progress = Math.min(Math.max(progress, 0), 1);

      // non-linear easing
      fillMat.uniforms.uProgress.value = Math.pow(progress, 1.25);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ================= RENDER LOOP ================= */
    const render = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    render();

    /* ================= RESIZE ================= */
    const onResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="logo-scroll-section">
      <div className="logo-sticky">
        <div ref={mountRef} className="logo-canvas-wrapper" />
      </div>
    </section>
  );
}