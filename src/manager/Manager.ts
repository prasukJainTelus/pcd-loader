import Scene from "../view/Scene";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";

const PCD_URLS = {
  frame1: "assets/pcd/ism_test_lioness.pcd",
  frame2: "assets/pcd/Zaghetto.pcd",
};

class Manager {
  private scene: Scene;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private container: HTMLDivElement;
  private raycaster: THREE.Raycaster;
  private pickableObjects: THREE.Object3D[] = [];
  private mouse: THREE.Vector2;
  private pointsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(0xffffff),
    size: 0.1,
  });
  private selectedMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });
  private pcd_counts: Record<string, number> = {};
  public frames: Record<string, THREE.Group> = {};
  private activeFrame: "frame1" | "frame2" = "frame1";
  onLoaderUpdated = (loaderCount: number) => {};

  constructor(component: HTMLDivElement) {
    this.container = component;
    this.scene = new Scene(component);

    this.renderer = this.initailizeRenderer();
    this.controls = new OrbitControls(
      this.scene.camera,
      this.renderer.domElement
    );

    this.raycaster = this.initializeRaycaster();
    this.mouse = new THREE.Vector2();
    this.activeFrame = this.configureFrame() as "frame1" | "frame2";
  }
  private initailizeRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.innerHTML = "";

    this.container.appendChild(renderer.domElement);
    renderer.render(this.scene.scene, this.scene.camera);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);

    return renderer;
  }

  private initializeRaycaster() {
    const raycaster = new THREE.Raycaster();
    this.pickableObjects = [];
    this.renderer.domElement.addEventListener(
      "mousemove",
      this.onDocumentMouseMove.bind(this)
    );
    raycaster.params.Points.threshold = 0.00003;

    return raycaster;
  }

  private configureFrame() {
    this.frames = {
      frame1: new THREE.Group(),
      frame2: new THREE.Group(),
    };
    Object.entries(this.frames).forEach(([key, frame]) => (frame.name = key));
    const activeFrame = "frame1";
    this.scene.add(this.frames[activeFrame]);
    return activeFrame;
  }

  animate() {
    new Promise(() => {
      this.controls.update();
      this.renderer.render(this.scene.scene, this.scene.camera);
    }).then(this.animate.bind(this));
  }

  async loadPCDFile() {
    if (!(this.activeFrame in this.pcd_counts)) {
      this.pcd_counts[this.activeFrame] = 0;
    }
    const pcdLoader = new PCDLoader();
    pcdLoader.load(
      process.env.PUBLIC_URL + `${PCD_URLS[this.activeFrame]}`,
      (points: THREE.Points) => {
        this.onLoaderUpdated(0);
        points.geometry.center();
        points.position.set(this.pcd_counts[this.activeFrame] / 4, 0, 0);
        points.name = `pcd${this.pcd_counts[this.activeFrame]}`;
        if (this.activeFrame === "frame2") {
          points.geometry.rotateX(Math.PI);
          points.geometry.scale(0.3, 0.3, 0.3);
        } else {
          points.geometry.rotateY(Math.PI / 2);
          points.geometry.rotateZ(Math.PI / 2);
          points.scale.set(0.001, 0.001, 0.001);
        }
        this.pcd_counts[this.activeFrame] += 1;
        this.frames[this.activeFrame].add(points);
        this.pickableObjects = [...this.pickableObjects, points];
      },
      (xhr) => {
        this.onLoaderUpdated(Math.round((xhr.loaded / xhr.total) * 100));
      },
      (error) => {
        console.error(error);
      }
    );
  }
  private onDocumentMouseMove(event: MouseEvent) {
    this.mouse.set(
      (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
    );

    this.scene.scene.children.forEach((child) => {
      if (child.name === "pointer") {
        this.scene.scene.remove(child);
      }
    });

    this.raycaster.setFromCamera(this.mouse, this.scene.camera);
    const intersects = this.raycaster.intersectObjects(
      this.pickableObjects,
      false
    );

    let intersectedObject: THREE.Object3D | null;
    if (intersects.length > 0) {
      intersectedObject = intersects[0].object;
    } else {
      intersectedObject = null;
    }

    if (intersectedObject) {
      const geometry = new THREE.BoxGeometry(0.0001, 0.0001, 0.0001);

      geometry.translate(
        intersects[0].point.x,
        intersects[0].point.y,
        intersects[0].point.z
      );

      const mesh = new THREE.Mesh(geometry, this.selectedMaterial);
      mesh.name = "pointer";
      this.scene.add(mesh);
    }
  }

  private onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public switchFrame() {
    this.scene.scene.children.forEach((child) => {
      if (child.name === this.activeFrame) {
        this.scene.scene.remove(child);
      }
    });
    this.activeFrame = this.activeFrame === "frame1" ? "frame2" : "frame1";
    this.scene.add(this.frames[this.activeFrame]);
  }
}

export default Manager;
