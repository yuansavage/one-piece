<template>
    <div class="map-container" ref="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default {
    name: "MapView",
    props: ["shouldAddLayer"],
    data() {
        return {
            fileModel: null,
            fileModelTransform: null,
            coordinates: { longitude: -0.11473, latitude: 51.51415 },
        };
    },
    watch: {
        shouldAddLayer: {
            handler(newValue) {
                if (newValue) {
                    this.addCustomLayer();
                }
            },
            immediate: true,
        },
    },
    mounted() {
        mapboxgl.accessToken =
            "pk.eyJ1IjoieXVhbnNhdmFnZSIsImEiOiJjbHluZDd3aTMwNGY1MmtzOWFpdjJzcm9zIn0._vR4i-_bHsJkC1FvTAuYGA";
        this.initializeMap();
    },
    methods: {
        initializeMap() {
            this.map = new mapboxgl.Map({
                container: this.$refs.map,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [this.coordinates.longitude, this.coordinates.latitude],
                zoom: 10,
                pitch: 60,
                antialias: true,
            });
        },
        addCustomLayer() {
            const fileModel = this.fileModel;
            const fileModelTransform = this.fileModelTransform;
            const customLayer = {
                id: "3d-model",
                type: "custom",
                renderingMode: "3d",
                onAdd: function (map, gl) {
                    this.camera = new THREE.PerspectiveCamera(
                        75,
                        map.getCanvas().width / map.getCanvas().height,
                        0.1,
                        1000
                    );
                    this.scene = new THREE.Scene();

                    const directionalLight = new THREE.DirectionalLight(
                        0xffffff
                    );
                    directionalLight.position.set(0, -70, 100).normalize();
                    this.scene.add(directionalLight);

                    const directionalLight2 = new THREE.DirectionalLight(
                        0xffffff
                    );
                    directionalLight2.position.set(0, 70, 100).normalize();
                    this.scene.add(directionalLight2);

                    const loader = new GLTFLoader();

                    loader.parse(
                        fileModel,
                        "",
                        (gltf) => {
                            this.model = gltf.scene;
                            this.scene.add(gltf.scene);
                        },
                        (error) => {
                            console.error(
                                "An error happened while parsing the GLTF model",
                                error
                            );
                        }
                    );

                    this.map = map;

                    this.renderer = new THREE.WebGLRenderer({
                        canvas: map.getCanvas(),
                        context: gl,
                        antialias: true,
                    });

                    this.renderer.autoClear = false;
                },
                render: function (gl, matrix) {
                    const rotationX = new THREE.Matrix4().makeRotationAxis(
                        new THREE.Vector3(1, 0, 0),
                        fileModelTransform.rotateX
                    );
                    const rotationY = new THREE.Matrix4().makeRotationAxis(
                        new THREE.Vector3(0, 1, 0),
                        fileModelTransform.rotateY
                    );
                    const rotationZ = new THREE.Matrix4().makeRotationAxis(
                        new THREE.Vector3(0, 0, 1),
                        fileModelTransform.rotateZ
                    );

                    const m = new THREE.Matrix4().fromArray(matrix);
                    const l = new THREE.Matrix4()
                        .makeTranslation(
                            fileModelTransform.translateX,
                            fileModelTransform.translateY,
                            fileModelTransform.translateZ
                        )
                        .scale(
                            new THREE.Vector3(
                                fileModelTransform.scale,
                                -fileModelTransform.scale,
                                fileModelTransform.scale
                            )
                        )
                        .multiply(rotationX)
                        .multiply(rotationY)
                        .multiply(rotationZ);

                    this.camera.projectionMatrix = m.multiply(l);
                    this.renderer.resetState();
                    this.renderer.render(this.scene, this.camera);
                    this.map.triggerRepaint();
                },
            };
            this.map.addLayer(customLayer);
        },
        markLocation(longitude, latitude) {
            if (this.map) {
                this.map.setCenter([longitude, latitude]);
                this.map.setZoom(17);
                this.setFileModelTransform(longitude, latitude);
                this.map.on("load", () => {
                    new mapboxgl.Marker()
                        .setLngLat([longitude, latitude])
                        .addTo(this.map);
                });
                console.log(this.map);
            }
            this.coordinates = { longitude, latitude };
        },
        updateFileContent(content) {
            this.fileModel = content;
        },
        setFileModelTransform(lon, lat) {
            const modelOrigin = [lon, lat];
            const modelAltitude = 0;
            const modelRotate = [Math.PI / 2, 0, 0];

            const modelAsMercatorCoordinate =
                mapboxgl.MercatorCoordinate.fromLngLat(
                    modelOrigin,
                    modelAltitude
                );
            const scaleFactor = 30;
            this.fileModelTransform = {
                translateX: modelAsMercatorCoordinate.x,
                translateY: modelAsMercatorCoordinate.y,
                translateZ: modelAsMercatorCoordinate.z,
                rotateX: modelRotate[0],
                rotateY: modelRotate[1],
                rotateZ: modelRotate[2],

                scale:
                    modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() *
                    scaleFactor,
            };
        },
    },
};
</script>

<style>
.map-container {
    flex: 1;
    height: calc(100vh - 50px);
    position: relative;
}
</style>
