<template>
    <div class="cesium-container" ref="cesiumContainer"></div>
</template>

<script>
/* global Cesium */
export default {
    name: "MapView3D",

    data() {
        return { cesiumViewer: null };
    },
    watch: {},
    mounted() {
        this.initializeCesium();
    },
    methods: {
        async initializeCesium() {
            Cesium.Ion.defaultAccessToken =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNGU0ZDFjMS05ZGM1LTQxZjgtYmQ0NC0wZTIzZDRjNDZjYjAiLCJpZCI6MjMzMzg1LCJpYXQiOjE3MjMwNjA0MzN9.vlr9YtloKMqZYBfxy06c6mAiBKEnm5eLbOuNlHMHSWc";
            this.cesiumViewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
                terrain: Cesium.Terrain.fromWorldTerrain(),
            });
            try {
                const osmBuildingsTileset =
                    await Cesium.createOsmBuildingsAsync();
                this.cesiumViewer.scene.primitives.add(osmBuildingsTileset);
            } catch (error) {
                console.error("Failed to load OSM Buildings Tileset:", error);
            }
        },
        markLocation(longitude, latitude) {
            if (this.cesiumViewer) {
                this.cesiumViewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(
                        longitude,
                        latitude,
                        1000
                    ),
                });
            }
        },
    },
};
</script>

<style>
.cesium-container {
    flex: 1;
    position: relative;
}
</style>
