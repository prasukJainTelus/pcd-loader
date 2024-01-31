import {
  BufferGeometry,
  NormalBufferAttributes,
  Points,
  PointsMaterial,
} from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";

function loadPCD(
  url: string
): Promise<Points<BufferGeometry<NormalBufferAttributes>, PointsMaterial>> {
  const pcdLoader = new PCDLoader();
  return new Promise((resolve, reject) => {
    pcdLoader.load(
      url,
      (data) => {
        resolve(data);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        reject(error);
      }
    );
  });
}
export default loadPCD;
