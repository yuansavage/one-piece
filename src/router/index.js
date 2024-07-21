import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/editScene",
    name: "EditScene",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EditScene.vue"),
  },
  {
    path: "/locationAR",
    name: "LocationAR",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LocationAR.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
