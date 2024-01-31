import * as THREE from "three";

class Scene {
  // canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  container: HTMLDivElement;
  constructor(container: HTMLDivElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(1));

    this.addLightToScene();
    this.camera = this.initialiseCamera();
  }

  private addLightToScene() {
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(light);
  }

  private initialiseCamera() {
    const camera = new THREE.PerspectiveCamera(
      1,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    this.scene.add(camera);
    window.addEventListener("resize", this.onWindowResize.bind(this));
    return camera;
  }

  add(...objects: THREE.Object3D[]) {
    this.scene.add(...objects);
  }
  private onWindowResize() {
    this.container.style.width = window.innerWidth + "px";
    this.container.style.height = window.innerHeight + "px";
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}

export default Scene;
