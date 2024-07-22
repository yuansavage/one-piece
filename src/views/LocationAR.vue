<template>
  <div class="locationAR">
    <button @click="startAR">StartAR</button>
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
