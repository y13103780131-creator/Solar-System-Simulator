import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { demoMotion, motionAt } from '../simulation/demoMotion';

/** WebGL 是当前实现；渲染细节集中于此，供未来替换后端。 */
export class SolarScene {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 250);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly controls: OrbitControls;
  private readonly earth = new THREE.Group();
  private readonly moon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 24), new THREE.MeshStandardMaterial({ color: 0xb5bcc9, roughness: 1 }));

  constructor(container: HTMLElement) {
    this.scene.background = new THREE.Color(0x040813);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);
    this.camera.position.set(11, 7, 15);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(3, 0, 0);
    this.controls.enableDamping = true;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 45;
    this.controls.update();
    this.scene.add(new THREE.AmbientLight(0x9aaecf, 0.18));
    this.scene.add(new THREE.PointLight(0xffe1ad, 160, 0, 2));
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 32), new THREE.MeshBasicMaterial({ color: 0xffbb55 }));
    this.scene.add(sun);
    // 半透明光晕只是视觉效果，不是物理大气。
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1.85, 32, 24), new THREE.MeshBasicMaterial({ color: 0xff9b32, transparent: true, opacity: 0.09, depthWrite: false }));
    this.scene.add(glow);
    this.earth.position.set(demoMotion.earthPosition.x, demoMotion.earthPosition.y, demoMotion.earthPosition.z);
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.85, 48, 32), new THREE.MeshStandardMaterial({ color: 0x276ba7, roughness: 0.85 }));
    this.earth.add(globe);
    // 简单的示意陆地，不使用外部纹理或真实地理数据。
    const landMaterial = new THREE.MeshStandardMaterial({ color: 0x6ca07c, roughness: 1 });
    for (const [lat, lon, scale] of [[0.35, 0.4, 0.22], [-0.25, 2.2, 0.18], [0.55, 4.1, 0.16], [-0.55, 5.1, 0.13]]) {
      const patch = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), landMaterial);
      patch.position.set(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)).multiplyScalar(0.82);
      patch.scale.set(scale, scale * 0.75, scale);
      this.earth.add(patch);
    }
    this.scene.add(this.earth, this.moon);
    const stars: number[] = [];
    // 固定种子保证每次运行的背景一致。
    let seed = 42;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < 500; i++) {
      const y = random() * 2 - 1, a = random() * Math.PI * 2, r = 80 + random() * 30;
      const ring = Math.sqrt(1 - y * y);
      stars.push(r * ring * Math.cos(a), r * y, r * ring * Math.sin(a));
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
    this.scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xc7d8f4, size: 0.15, sizeAttenuation: true })));
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  private readonly resize = () => {
    const width = this.renderer.domElement.parentElement?.clientWidth || 1;
    const height = this.renderer.domElement.parentElement?.clientHeight || 1;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  render(seconds: number): void {
    const motion = motionAt(seconds);
    this.earth.rotation.y = motion.earthRotation;
    this.moon.position.set(demoMotion.earthPosition.x + motion.moonX, 0, demoMotion.earthPosition.z + motion.moonZ);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
