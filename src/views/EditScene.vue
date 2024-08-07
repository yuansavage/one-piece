<template>
    <div id="editScene">
        <div id="view">
            <MenuBar id="menuBar" @submit="handleSubmit" @add="handleAdd" />
            <CesiumView id="mapView3d" ref="map3dComponent" />
        </div>
        <div id="place">
            <MapView
                id="mapView"
                ref="mapComponent"
                :shouldAddLayer="shouldAddLayer"
            />
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import MapView from "../components/MapView.vue";
import MenuBar from "../components/MenuBar.vue";
import CesiumView from "../components/MapView3D.vue";

export default defineComponent({
    name: "EditScene",
    components: { MapView, CesiumView, MenuBar },
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
#view {
    display: flex;
    flex-direction: row;
    height: 30vh;
}
#menuBar {
    width: 40%;
    padding: 20px;
}
</style>
