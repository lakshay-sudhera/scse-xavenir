'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Head from 'next/head';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- Three.js setup ---
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x03030c, 1);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03030c);
    scene.fog = new THREE.FogExp2(0x03030c, 0.004);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(2, 1.5, 4.2);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0x111122);
    scene.add(ambient);
    const mainLight = new THREE.PointLight(0x88aaff, 0.35);
    mainLight.position.set(2, 2.5, 3);
    scene.add(mainLight);
    const fillLight = new THREE.PointLight(0xaa88ff, 0.2);
    fillLight.position.set(-1.5, 1, -2);
    scene.add(fillLight);

    // Central torus knot
    const knotGeo = new THREE.TorusKnotGeometry(0.8, 0.14, 120, 14, 3, 4);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x88aaff,
      emissive: 0x224466,
      emissiveIntensity: 0.08,
      metalness: 0.5,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    // Stars
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 30;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x88aacc, size: 0.08, transparent: true, opacity: 0.4 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Floating particles
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.4 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      const col = new THREE.Color(0x88aaff);
      particleColors[i * 3] = col.r * 0.5;
      particleColors[i * 3 + 1] = col.g * 0.5;
      particleColors[i * 3 + 2] = col.b * 0.6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Flying car
    const carGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.85, 0.2, 1.5);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x446688, metalness: 0.4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0;
    carGroup.add(body);
    const cockpitGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x88aaff, emissive: 0x2266aa, emissiveIntensity: 0.05 });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.set(0, 0.18, 0.45);
    carGroup.add(cockpit);
    const engineGlow = new THREE.PointLight(0x88aaff, 0.25);
    engineGlow.position.set(0, -0.05, -0.8);
    carGroup.add(engineGlow);
    scene.add(carGroup);
    carGroup.position.set(-7, 0.85, -0.2);

    let carProgress = 0;
    let carAnimId: number | null = null;
    const animateCar = () => {
      carProgress += 0.007;
      if (carProgress >= 1) {
        carProgress = 0;
        carGroup.position.set(-7, 0.85, -0.2);
      }
      const t = carProgress;
      const x = -7 + 15 * t;
      const y = 0.85 + Math.sin(t * Math.PI * 2) * 0.18;
      const z = -0.2 + Math.sin(t * Math.PI * 1.6) * 0.06;
      carGroup.position.set(x, y, z);
      carGroup.rotation.z = Math.sin(t * Math.PI * 2) * 0.1;
      engineGlow.intensity = 0.22 + Math.sin(Date.now() * 0.01) * 0.1;
      carAnimId = requestAnimationFrame(animateCar);
    };
    animateCar();

    // Main animation loop
    let time = 0;
    let animFrameId: number;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      time += 0.008;

      knot.rotation.x = Math.sin(time * 0.3) * 0.15;
      knot.rotation.y = time * 0.2;
      knot.rotation.z = Math.sin(time * 0.4) * 0.1;
      knotMat.emissiveIntensity = 0.08 + Math.sin(time) * 0.03;

      particles.rotation.y = time * 0.03;
      stars.rotation.y += 0.0002;

      camera.position.x += (0 - camera.position.x) * 0.01;
      camera.position.y += (1.4 + Math.sin(time * 0.1) * 0.05 - camera.position.y) * 0.01;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      if (carAnimId) cancelAnimationFrame(carAnimId);
      renderer.dispose();
    };
  }, []);

  // Generate terms text
  const generateLongText = () => {
    const baseText = `By using our website and availing the Services, you agree that you have read and accepted these Terms (including the Privacy Policy). We reserve the right to modify these Terms at any time and without assigning any reason. It is your responsibility to periodically review these Terms to stay informed of updates

The use of this website or availing of our Services is subject to the following terms of use:

To access and use the Services, you agree to provide true, accurate and complete information to us during and after registration, and you shall be responsible for all acts done through the use of your registered account.
Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials offered on this website or through the Services, for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
Your use of our Services and the website is solely at your own risk and discretion. You are required to independently assess and ensure that the Services meet your requirements.
The contents of the Website and the Services are proprietary to Us and you will not have any authority to claim any intellectual property rights, title, or interest in its contents.
You acknowledge that unauthorized use of the Website or the Services may lead to action against you as per these Terms or applicable laws.
You agree to pay us the charges associated with availing the Services.
You agree not to use the website and/ or Services for any purpose that is unlawful, illegal or forbidden by these Terms, or Indian or local laws that might apply to you.
You agree and acknowledge that the website and the Services may contain links to other third party websites. On accessing these links, you will be governed by the terms of use, privacy policy and such other policies of such third party websites.
You understand that upon initiating a transaction for availing the Services you are entering into a legally binding and enforceable contract with us for the Services.
You shall be entitled to claim a refund of the payment made by you in case we are not able to provide the Service. The timelines for such return and refund will be according to the specific Service you have availed or within the time period provided in our policies (as applicable). In case you do not raise a refund claim within the stipulated time, then this would make you ineligible for a refund.
Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure to perform an obligation under these Terms if performance is prevented or delayed by a force majeure event.
These Terms and any dispute or claim relating to it, or its enforceability, shall be governed by and construed in accordance with the laws of India.
All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Jamshedpur, Jharkhand.
All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website.`;

    let fullText = '';
   
      fullText += baseText + ' ';
    
    return fullText;
  };

  const termsText = generateLongText();

  const handleAccept = () => {
    alert('Terms accepted (demo)');
    // Add your accept logic here
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Head>
      <canvas ref={canvasRef} className="bg-canvas" />
      <div className="content">
        <div className="card">
          <h1>TERMS AND CONDITIONS</h1>
          <div className="sub">TERMS OF USE</div>
          <div className="text-container">
            <div className="desc">{termsText}</div>
          </div>
          <button onClick={handleAccept}>
            <i className="fas fa-check-circle"></i> ACCEPT TERMS
          </button>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Orbitron', monospace;
          background: #03030c;
          overflow: hidden;
          height: 100vh;
          color: #99aaff;
        }
        .bg-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 0;
        }
        .content {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 1rem;
        }
        .card {
          background: rgba(8, 12, 25, 0.55);
          backdrop-filter: blur(6px);
          border-radius: 20px;
          padding: 1.4rem 1.6rem;
          text-align: center;
          width: 100%;
          max-width: 520px;
          border: 1px solid rgba(100, 120, 200, 0.2);
          transition: all 0.2s;
        }
        h1 {
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 0.2rem;
          color: #bbccff;
        }
        .sub {
          font-size: 0.7rem;
          color: #99aaff;
          margin-bottom: 1rem;
          letter-spacing: 1px;
          opacity: 0.7;
        }
        .text-container {
          max-height: 360px;
          overflow-y: auto;
          margin: 0.8rem 0 1rem;
          padding-right: 0.5rem;
          scrollbar-width: thin;
        }
        .desc {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem;
          line-height: 1.5;
          color: #aaccff;
          text-align: justify;
          opacity: 0.85;
        }
        .text-container::-webkit-scrollbar {
          width: 3px;
        }
        .text-container::-webkit-scrollbar-track {
          background: #111122;
        }
        .text-container::-webkit-scrollbar-thumb {
          background: #88aaff;
        }
        button {
          background: transparent;
          border: 1px solid #88aaff;
          color: #88aaff;
          padding: 5px 16px;
          font-family: inherit;
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 30px;
          transition: all 0.2s;
        }
        button i {
          margin-right: 6px;
        }
        button:hover {
          background: rgba(136, 170, 255, 0.1);
          border-color: #aa88ff;
          color: #ccbbff;
        }
        @media (max-width: 480px) {
          .card {
            padding: 1rem;
          }
          h1 {
            font-size: 1.3rem;
          }
          .text-container {
            max-height: 300px;
          }
        }
      `}</style>
    </>
  );
}