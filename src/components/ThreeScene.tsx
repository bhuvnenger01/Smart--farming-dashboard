
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  soilN?: number;
  soilP?: number;
  soilK?: number;
}

const ThreeScene = ({ soilN = 50, soilP = 50, soilK = 50 }: ThreeSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create soil cube with colors based on N, P, K values
    const geometry = new THREE.BoxGeometry(3, 0.5, 3);
    
    // Calculate soil color based on nutrient levels
    const nColor = new THREE.Color(0.2, soilN / 100, 0.2);
    const pColor = new THREE.Color(soilP / 200, 0.2, 0);
    const kColor = new THREE.Color(0.2, 0.1, soilK / 100);
    
    // Blend the colors
    const soilColor = new THREE.Color(
      (nColor.r + pColor.r + kColor.r) / 3,
      (nColor.g + pColor.g + kColor.g) / 3,
      (nColor.b + pColor.b + kColor.b) / 3
    );
    
    const material = new THREE.MeshPhongMaterial({ 
      color: soilColor,
      specular: 0x050505,
      shininess: 100
    });
    
    const soil = new THREE.Mesh(geometry, material);
    soil.position.y = -1;
    scene.add(soil);
    
    // Create plant stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.1, 1.5, 32);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x2e7d32 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0;
    scene.add(stem);
    
    // Create leaves
    const leafGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const leafMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4caf50,
      shininess: 10
    });
    
    const leaf1 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf1.position.set(0, 0.8, 0);
    leaf1.scale.set(0.8, 0.7, 0.8);
    scene.add(leaf1);
    
    const leaf2 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf2.position.set(0.3, 0.4, 0);
    leaf2.scale.set(0.6, 0.8, 0.6);
    scene.add(leaf2);
    
    const leaf3 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf3.position.set(-0.3, 0.4, 0);
    leaf3.scale.set(0.6, 0.8, 0.6);
    scene.add(leaf3);
    const leaf4 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf4.position.set(0, 0.4, 0);
    leaf4.scale.set(0.6, 0.4, 0.6);
    leaf4.rotation.z = Math.PI / 4;
    scene.add(leaf4);
    const leaf5 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf5.position.set(0, 0.4, 0);
    leaf5.scale.set(0.6, 0.4, 0.6);
    leaf5.rotation.z = -Math.PI / 4;
    scene.add(leaf5);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Gentle movements to simulate breeze
      leaf1.rotation.y += 0.003;
      leaf2.rotation.y += 0.004;
      leaf3.rotation.y += 0.002;
      
      stem.rotation.y += 0.001;
      
      soil.rotation.y += 0.001;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, [soilN, soilP, soilK]);
  
  return <div ref={mountRef} className="w-full h-full min-h-[300px]" />;
};

export default ThreeScene;
