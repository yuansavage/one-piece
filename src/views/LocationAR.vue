<template>
  <div class="locationAR">
    <div class="range-text">{{ range }}</div>

    <a-scene ar vr-mode-ui="enabled: false">
      <a-entity
        id="model"
        :gltf-model="`./assets/model/${modelName}`"
        position="0 0 -4"
        scale="0.5 0.5 0.5"
        :visible="isWithinRange"
      ></a-entity>
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
      modelName: "",
      range: "Hello! Are you ready to hunt?",
      isWithinRange: false,
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
      this.modelName = this.$store.getters.placedModelName;
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
  },
});
</script>
<style scoped>
.range-text {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  z-index: 10;
}
a-scene {
  height: 100vh;
  width: 100vw;
}
</style>
