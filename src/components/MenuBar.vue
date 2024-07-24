<template>
  <div class="interface">
    <div class="input-group">
      <input
        class="file-input"
        type="file"
        @change="handleFileUpload"
        accept=".glb"
      />
      <div class="input-submit-group">
        <input
          class="text-input"
          type="text"
          v-model="address"
          @input="handleAddressChange"
          placeholder="Enter place"
        />
        <button class="btn submit-btn" @click="submit">Submit</button>
      </div>
    </div>
    <button class="btn add-btn" @click="add">Add Model</button>
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
        this.$store.dispatch("fetchModelName", file.name);
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
  padding: 20px;

  background-color: #f0f2f5;
  border-bottom: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 600px;
}
.input-submit-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.file-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.text-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  font-size: 14px;
  color: #333;
  width: 500px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-btn,
.add-btn {
  background: linear-gradient(90deg, #4a90e2, #9013fe);
}
</style>
