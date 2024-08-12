<template>
    <div class="model-container" ref="modelContainer">
        <model-viewer
            :src="modelSrc"
            auto-rotate
            camera-controls
            style="width: 100%; height: 480px"
        ></model-viewer>
    </div>
</template>

<script>
import "@google/model-viewer";
export default {
    name: "ModelView",
    props: ["shouldAddLayer"],
    data() {
        return { modelSrc: "" };
    },

    mounted() {},
    watch: {
        shouldAddLayer: {
            handler(newValue) {
                if (newValue) {
                    this.getModel();
                }
            },
            immediate: true,
        },
    },
    methods: {
        getModel() {
            const arrayBufferData = this.$store.getters.placedModelFile;
            const blob = new Blob([arrayBufferData], {
                type: "model/gltf-binary",
            });
            this.modelSrc = URL.createObjectURL(blob);
            console.log(this.modelSrc);
        },
    },
};
</script>

<style>
.model-container {
    flex: 1;
    position: relative;
    background-color: black;
}
</style>
