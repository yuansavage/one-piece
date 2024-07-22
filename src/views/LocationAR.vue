<template>
  <div class="locationAR">
    <h3>{{ range }}</h3>
    <h4>Camera Position: {{ cameraPosition }}</h4>
    <h4>Model Position: {{ modelPosition }}</h4>
    <a-scene
      vr-mode-ui="enabled: false"
      embedded
      arjs="sourceType: webcam; locationOnly: true; debugUIEnabled: false;"
    >
      <a-camera id="camera" gps-camera rotation-reader></a-camera>
      <a-entity
        id="model"
        :position="modelPosition"
        gltf-model="./assets/map-pin.glb"
        scale="2 2 2"
        visible="true"
      ></a-entity>
      <!-- :visible="isWithinRange" -->
    </a-scene>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "LocationAR",
  components: {},
  data() {
    return {
      userPosition: { latitude: null, longitude: null },
      threshold: 0.01,
      latitude: 0,
      longitude: 0,
      modelContent: null,
      range: "Hello AR",
      isWithinRange: false,
      modelPosition: "0 0 5",
      cameraPosition: "0 0 0",
      updateInterval: 50,
    };
  },
  mounted() {
    this.extractDatafromUrl();
    this.watchUserPosition();
    this.startCameraPositionUpdate();
  },
  methods: {
    extractDatafromUrl() {
      this.latitude = this.$store.getters.mapLatitude;
      this.longitude = this.$store.getters.mapLongitude;
      this.modelContent = this.$store.getters.placedModelFile;
    },
    watchUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            this.userPosition.latitude = position.coords.latitude;
            this.userPosition.longitude = position.coords.longitude;
            if (this.latitude && this.longitude) this.checkProximity();
          },
          (error) => {
            console.error("Error getting position:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
          }
        );
      }
    },
    checkProximity() {
      const distance = this.calculateDistance(
        this.userPosition.latitude,
        this.userPosition.longitude,
        this.latitude,
        this.longitude
      );
      if (distance <= this.threshold) {
        this.range = "You are within the target range.";
        this.isWithinRange = true;
        this.updateModelPosition();

        // this.startAR();
      } else {
        this.range = "You are outside the target range.";
        this.isWithinRange = false;
      }
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return d;
    },
    updateModelPosition() {
      const camera = document.querySelector("#camera");
      const model = document.querySelector("#model");

      if (camera && model) {
        const cameraPosition = camera.getAttribute("position");
        this.cameraPosition = `${cameraPosition.x.toFixed(
          2
        )} ${cameraPosition.y.toFixed(2)} ${cameraPosition.z.toFixed(2)}`;
        this.modelPosition = `${cameraPosition.x} ${cameraPosition.y} ${
          cameraPosition.z + 5
        }`;
      }
    },
    startCameraPositionUpdate() {
      this.cameraPositionInterval = setInterval(() => {
        this.updateModelPosition();
      }, this.updateInterval);
    },
    stopCameraPositionUpdate() {
      clearInterval(this.cameraPositionInterval);
    },
    // loadPlaces() {
    //   return [
    //     {
    //       name: "map-pin",
    //       location: {
    //         lat: this.latitude,
    //         lng: this.longitude,
    //       },
    //     },
    //   ];
    // },
    // renderPlaces(places) {
    //   let scene = document.querySelector("a-scene");
    //   places.forEach((place) => {
    //     let latitude = place.location.lat;
    //     let longitude = place.location.lng;

    //     let model = document.createElement("a-entity");

    //     model.setAttribute(
    //       "gps-entity-place",
    //       `latitude: ${latitude}; longitude: ${longitude};`
    //     );
    //     model.setAttribute(
    //       "gltf-model",
    //       "https://github.com/Darthviciouz/location-based-ar-tutorial/tree/master/assets/magnemite/scene.gltf"
    //     );
    //     model.setAttribute("rotation", "0 180 0");
    //     model.setAttribute("animation-mixer", "");
    //     model.setAttribute("scale", "2 2 2");

    //     model.addEventListener("loaded", () => {
    //       console.log("Model loaded successfully");
    //       window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
    //     });

    //     scene.appendChild(model);
    //   });
    // },
    // startAR() {
    //   let places = this.loadPlaces();
    //   this.renderPlaces(places);
    // },
  },
  destroy() {
    this.stopCameraPositionUpdate();
  },
});
</script>
