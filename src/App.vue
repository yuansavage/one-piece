<template>
  <div id="nav">
    <router-link to="/editScene" class="tab">Place it !</router-link>
    <router-link to="/locationAR" class="tab">Find it !</router-link>
  </div>
  <router-view />
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  background: linear-gradient(90deg, #4a90e2, #9013fe);
}

.tab {
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.tab:hover {
  background-color: #3498db;
}
</style>
