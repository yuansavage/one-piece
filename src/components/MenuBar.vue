<template>
  <div class="interface">
    <input type="file" @change="handleFileUpload" accept=".glb" />
    <input
      type="text"
      v-model="address"
      @input="handleAddressChange"
      placeholder="Enter address"
    />
    <button @click="submit">Submit</button>
    <button @click="add">Add Model</button>
  </div>
</template>

<script>
export default {
  name: "MenuBar",
  data() {
    return {
      fileContent: null,
      address: "",
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.name.endsWith(".glb")) {
        const reader = new FileReader();
        reader.onload = () => {
          this.fileContent = reader.result;
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("Please upload a .glb file");
      }
    },
    submit() {
      this.$emit("submit", {
        fileContent: this.fileContent,
        address: this.address,
      });
    },
    add() {
      this.$emit("add", {
        addModel: true,
      });
    },
  },
};
</script>

<style>
.interface {
  padding: 10px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}
.interface button {
  margin-left: 10px;
}
</style>
