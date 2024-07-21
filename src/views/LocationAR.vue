<template>
  <div class="locationAR"></div>
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
  },
});
</script>
