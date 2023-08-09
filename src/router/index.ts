import { createRouter, createWebHistory } from 'vue-router'
import GameView from '@/views/GameView.vue'
// import BoringView from '@/views/BoringView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameView
    }
    // TODO:
    // {
    //   path: '/boring-mode',
    //   name: 'boring-mode',
    //   component: BoringView
    // }
  ]
})

export default router
