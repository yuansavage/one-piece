<template>
  <div class="locationAR">
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
import "aframe";
export default defineComponent({
  name: "LocationAR",
  components: {},
  data() {
    return {
      latitude: 0,
      longitude: 0,
      modelContent: null,
    };
  },
  mounted() {
    this.extractDatafromUrl();
  },
  methods: {
    extractDatafromUrl() {
      this.latitude = this.$store.getters.mapLatitude;
      this.longitude = this.$store.getters.mapLongitude;
      this.modelContent = this.$store.getters.placedModelFile;
    },
  },
});
</script>
