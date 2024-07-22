<template>
  <div class="locationAR">
    <!-- <button @click="startAR">StartAR</button> -->
    <a-scene
      vr-mode-ui="enabled: false"
      embedded
      arjs="sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false;"
    >
      <a-camera gps-camera="minDistance: 40;" rotation-reader></a-camera>
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
    };
  },
  mounted() {
    this.extractDatafromUrl();
    this.watchUserPosition();
  },
  methods: {
    extractDatafromUrl() {
      this.latitude = this.$store.getters.mapLatitude;
      this.longitude = this.$store.getters.mapLongitude;
      this.modelContent = this.$store.getters.placedModelFile;
    },
    watchUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
          this.userPosition.latitude = position.coords.latitude;
          this.userPosition.longitude = position.coords.longitude;
          this.checkProximity();
        });
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
        alert("You are within the target range.");
        this.startAR();
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
    loadPlaces() {
      return [
        {
          name: "map-pin",
          location: {
            lat: this.latitude,
            lng: this.longitude,
          },
        },
      ];
    },
    renderPlaces(places) {
      let scene = document.querySelector("a-scene");
      places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement("a-entity");

        model.setAttribute(
          "gps-entity-place",
          `latitude: ${latitude}; longitude: ${longitude};`
        );
        model.setAttribute("gltf-model", "./assets/map-pin.glb");
        model.setAttribute("rotation", "0 180 0");
        model.setAttribute("animation-mixer", "");
        model.setAttribute("scale", "2 2 2");

        model.addEventListener("loaded", () => {
          window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
        });

        scene.appendChild(model);
      });
    },
    startAR() {
      let places = this.loadPlaces();
      this.renderPlaces(places);
    },
  },
});
</script>
