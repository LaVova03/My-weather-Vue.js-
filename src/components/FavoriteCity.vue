<template>
    <div class="favs_wrap">
        <div class="wrap_btn">
            <button @click="this.switch ? switchInterval() : null">
                {{ $t('Day') }}
            </button>
            <button @click="!this.switch ? switchInterval() : null">
                {{ $t('Week') }}
            </button>
        </div>
        <div class="card_city" v-for="(city, index) in idCity" :key="index">
            <HourlyTemperature :idCity="city" :curCard="index" :iconUrl="iconUrl[index]" :switch="this.switch" />
            <BodyMain :data="data[index]" :iconUrl="iconUrl[index]" :favorites="favorites" :loading="loading"
                :isDaytime="isDaytime[index]" />
        </div>
    </div>
</template>

<script>
import BodyMain from '../components/BodyMain.vue';
import HourlyTemperature from '../components/HourlyTemperature.vue';
import axios from 'axios';
import { apiKey } from '../config';

export default {
    name: 'FavoriteCity',
    components: {
        BodyMain,
        HourlyTemperature,
    },
    data() {
        return {
            favs: [],
            data: [],
            iconUrl: [],
            idCity: [],
            error: '',
            favorites: true,
            switch: false,
            loading: false,
            isDaytime: [],
        }
    },
    created() {
        const favLocalStor = localStorage.getItem('favsLocal');
        if (favLocalStor) {
            try {
                this.favs = JSON.parse(favLocalStor);
                this.getweather();
            } catch (e) {
                console.error('Error parsing favsLocal from localStorage:', e);
                localStorage.removeItem('favsLocal');
            }
        }
    },
    methods: {
        async getweather() {
            this.idCity = [];
            const favLocalStor = localStorage.getItem('favsLocal');
            this.favs = JSON.parse(favLocalStor);
            for (let i = 0; i < this.favs.length; i++) {
                const city = this.favs[i].split(',')[0].trim();

                if (city.trim().length < 2) {
                    this.error = "Введите полное название";
                    return false;
                }

                this.error = '';
                try {
                    this.loading = true
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                    if (response.status === 200) {
                        this.data.push([response.data]);
                        this.idCity.push(+response.data.id);

                        const { sunrise, sunset } = response.data.sys;
                        const currentTime = Math.floor(Date.now() / 1000);

                        this.isDaytime.push(currentTime >= sunrise && currentTime <= sunset);

                        this.iconUrl.push(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`);
                    }
                } catch (error) {
                    this.error = 'Error Get Weather';
                    console.error('Error:', error);
                } finally {
                    this.loading = false
                }
            }
        },
        switchInterval() {
            this.switch = !this.switch;
        }
    }
}
</script>

<style scoped>
.favs_wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.card_city {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    padding: 20px 0;
    background-color: rgb(233, 233, 233);
    justify-content: space-around;
    align-items: center;
    margin: 50px auto;
    border-radius: 10px;
    border: 1px solid black;
}

.wrap_btn {
    display: flex;
    margin: 0 auto;
    width: max-content;
    height: max-content;
}

.wrap_btn>button {
    width: 100px;
    padding: 10px;
    margin: 0 10px;
    background-color: rgb(233, 233, 233);
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 18px;
    transition: 200ms;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid grey;
}

.wrap_btn>button:hover {
    background-color: rgb(78, 78, 78);
    color: rgb(233, 233, 233);

}
</style>