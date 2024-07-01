import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../containers/MainPage.vue';
import SelectedPage from '../containers/SelectedPage.vue';

const routes = [
    {
        path: '/',
        name: 'mainPage',
        component: MainPage
    },
    {
        path: '/selected',
        name: 'selectedPage',
        component: SelectedPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
