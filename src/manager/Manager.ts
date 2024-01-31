import Scene from "../view/Scene";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import loadPCD from "../utils/loadPCD";

class Manager {
  scene: Scene;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  container: HTMLDivElement;

  constructor(component: HTMLDivElement) {
    this.container = component;
    this.scene = new Scene(component);

    this.renderer = this.initailizeRenderer();
    this.controls = new OrbitControls(
      this.scene.camera,
      this.renderer.domElement
    );
  }
  initailizeRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.innerHTML = "";

    this.container.appendChild(renderer.domElement);
    renderer.render(this.scene.scene, this.scene.camera);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);

    return renderer;
  }

  animate() {
    new Promise(() => {
      this.controls.update();
      this.renderer.render(this.scene.scene, this.scene.camera);
    }).then(this.animate.bind(this));
  }

  async loadPCDFile() {
    const points = await loadPCD(
      process.env.PUBLIC_URL + "assets/pcd/Zaghetto.pcd"
    );
    points.geometry.center();
    points.geometry.rotateX(Math.PI);
    points.name = "Zaghetto.pcd";
    points.material.size = 0.1;
    this.scene.add(points);
  }

  onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default Manager;
