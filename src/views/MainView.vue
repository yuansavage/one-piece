<template>
  <div id="mainView" @click="playVideo">
    <div id="model-container"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default defineComponent({
  name: "MainView",
  components: {},
  data() {
    return { video: null };
  },
  mounted() {
    this.initThreeJS();
  },
  methods: {
    playVideo() {
      if (this.video) {
        this.video.play();
      }
    },
    initThreeJS() {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document
        .getElementById("model-container")
        .appendChild(renderer.domElement);

      // Create video element
      this.video = document.createElement("video");
      this.video.src = "./assets/video/bg.mp4";
      this.video.crossOrigin = "anonymous";
      this.video.loop = true;
      this.video.muted = true;
      this.video.autoplay = true;
      this.video.preload = true;
      this.video.controls = true;
      this.video.playsinline = true;
      this.video.setAttribute("playsinline", "playsinline");

      // Create video texture
      const videoTexture = new THREE.VideoTexture(this.video);

      // Create background plane
      const backgroundGeometry = new THREE.PlaneGeometry(18, 20, 1);
      const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        depthTest: false,
      });
      const backgroundMesh = new THREE.Mesh(
        backgroundGeometry,
        backgroundMaterial
      );
      backgroundMesh.material.depthWrite = false;
      scene.add(backgroundMesh);

      const light = new THREE.AmbientLight(0xffffff, 50);
      scene.add(light);

      const loader = new GLTFLoader();
      loader.load(
        "./assets/model/map-pin.glb",
        (gltf) => {
          const model = gltf.scene;
          scene.add(model);

          model.position.y = -1.5;
          model.position.x = 0;
          model.position.z = 0;

          let direction = 1;
          let speed = 0.001;
          let limit = 0.05;

          function animate() {
            requestAnimationFrame(animate);

            model.position.y += direction * speed;
            model.rotation.y += 0.01;

            if (model.position.y > limit || model.position.y < -limit) {
              direction *= -1;
            }

            renderer.render(scene, camera);
          }
          animate();
        },
        undefined,
        (error) => {
          console.error("An error happened", error);
        }
      );

      camera.position.z = 5;
    },
  },
});
</script>
<style scoped>
#mainView {
  flex: 1;
  height: calc(100vh - 50px);
  position: relative;
}
</style>
