<template>
  <div id="editScene">
    <MenuBar @submit="handleSubmit" @add="handleAdd" />
    <MapView ref="mapComponent" :shouldAddLayer="shouldAddLayer" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import MapView from "../components/MapView.vue";
import MenuBar from "../components/MenuBar.vue";

export default defineComponent({
  name: "EditScene",
  components: { MapView, MenuBar },
  data() {
    return {
      uploadedFileContent: "",
      addressCoordinates: { longitude: 0, latitude: 0 },
      shouldAddLayer: false,
    };
  },
  methods: {
    async handleSubmit({ fileContent, address }) {
      this.uploadedFileContent = fileContent;

      const coordinates = await this.geocodeAddress(address);
      this.addressCoordinates = coordinates;

      this.$refs.mapComponent.markLocation(
        coordinates.longitude,
        coordinates.latitude
      );
      this.$refs.mapComponent.updateFileContent(fileContent);
    },
    async handleAdd({ addModel }) {
      this.shouldAddLayer = addModel;
      const { longitude, latitude } = this.addressCoordinates;
      this.$store.dispatch("fetchLongitude", longitude);
      this.$store.dispatch("fetchLatitude", latitude);
      this.$store.dispatch("fetchModelFile", this.uploadedFileContent);
    },
    async geocodeAddress(address) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=pk.eyJ1IjoieXVhbnNhdmFnZSIsImEiOiJjbHluZDd3aTMwNGY1MmtzOWFpdjJzcm9zIn0._vR4i-_bHsJkC1FvTAuYGA`
      );
      const data = await response.json();
      const [longitude, latitude] = data.features[0].center;
      return { longitude, latitude };
    },
  },
});
</script>
<style>
#editScene {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
