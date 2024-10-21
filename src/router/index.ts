import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/records/:recordId',
      name: "records",
      props: true,
      component: () => import("@/views/RecordView.vue")
    },
    {
      path: '/schedule',
      name: "schedule",
      component: () => import("@/views/ScheduleView.vue")
    }
  ]
})

// router.beforeEach(async (to, from) => {
//   if (
//     // 检查用户是否已登录
//     Auth.getToken() === "" &&
//     // ❗️ 避免无限重定向
//     !(to.name === "login" || to.name === "register")
//   ) {
//     // 将用户重定向到登录页面
//     return { name: "login" };
//   }

//   if (
//     Auth.getToken() !== "" &&
//     to.name === "login"
//   ) {
//     return { name: "home" }
//   }
// });

export default router
