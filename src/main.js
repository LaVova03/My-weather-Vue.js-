import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './routers/Routers';
import messagesUk from './locales/uk.json';
import messagesEn from './locales/en.json';

const app = createApp(App);


const i18n = createI18n({
    locale: 'en',
    messages: {
        en: messagesEn,
        uk: messagesUk
    }
});

app.use(router);
app.use(i18n);

app.mount('#app');

