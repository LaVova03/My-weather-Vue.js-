<template>
    <div class="main-wrap">
        <ModalWindow v-if="modal" :modal="modal" :deleteCard="deleteCard" @close-modal="closeModal" />
        <InputMain v-model:city="city" :getweather="getweather" />
        <div class="wrap_btn">
            <button @click="this.switch ? switchInterval() : null">
                {{ $t('Day') }}
            </button>
            <button @click="!this.switch ? switchInterval() : null">
                {{ $t('Week') }}
            </button>
        </div>
        <div class="card_city" v-for="(city, index) in idCity" :key="index">
            <button @click="showModal(index)">
                <img :src="imageDelete" alt="logo" />
            </button>
            <button @click="addCard">
                <img :src="imageAdd" alt="logo" />
            </button>
            <HourlyTemperature :idCity="city" :curCard="index" :iconUrl="iconUrl[index]" :switch="this.switch" />
            <BodyMain :data="data[index]" :iconUrl="iconUrl[index]" :getweather="getweather" :loading="loading"
                :isDaytime="isDaytime[index]" />
        </div>
    </div>
</template>

<script>
import InputMain from '../components/InputMain.vue';
import BodyMain from '../components/BodyMain.vue';
import HourlyTemperature from '../components/HourlyTemperature.vue';
import ModalWindow from '../components/ModalWindow.vue';

import PlusPath from '@/assets/plus.png';
import DeletePath from '@/assets/delete.png';

import axios from 'axios';
import { apiKey } from '../config';

export default {
    name: 'MainPage',
    components: {
        InputMain,
        BodyMain,
        HourlyTemperature,
        ModalWindow
    },
    data() {
        return {
            data: [[]],
            iconUrl: [''],
            idCity: [0],
            city: '',
            cityes: [],
            error: '',
            imageAdd: PlusPath,
            imageDelete: DeletePath,
            curCard: 0,
            modal: false,
            indexCard: null,
            favs: [],
            switch: false,
            userLocation: '',
            loading: false,
            isDaytime: [],
        };
    },
    created() {
        const favLocalStor = localStorage.getItem('favsLocal');
        if (favLocalStor) {
            try {
                this.favs = JSON.parse(favLocalStor);
            } catch (e) {
                console.error('Error parsing favsLocal from localStorage:', e);
                localStorage.removeItem('favsLocal');
            }
        }
        if (!this.userLocation) {
            this.getUserLocation()
        }
    },
    methods: {
        async getweather(city) {
            if (city.trim().length < 2) {
                this.error = "Введіть поле з назвою";
                return false;
            }
            this.error = '';
            this.loading = true
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                if (response.status === 200) {
                    this.data[this.curCard] = [response.data];
                    this.idCity[this.curCard] = +response.data.id;

                    const { sunrise, sunset } = response.data.sys;
                    const currentTime = Math.floor(Date.now() / 1000);

                    this.isDaytime.push(currentTime >= sunrise && currentTime <= sunset);

                    this.iconUrl[this.curCard] = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`;
                }
            } catch (error) {
                this.error = 'Error Get Weather';
                console.error('Error:', error);
            } finally {
                this.loading = false
            }
        },
        addCard() {
            if (this.data.length < 5 && this.data[this.curCard].length > 0) {
                this.data.push([]);
                this.idCity.push(0);
                this.iconUrl.push('');
                this.isDaytime.push(true);
                this.curCard = this.data.length - 1;
                console.log(this.isDaytime)
            }
        },
        showModal(index) {
            if (this.data.length > 1) {
                this.indexCard = index;
                this.modal = true;
            }
        },
        deleteCard() {
            if (this.data.length > 1) {
                this.data.splice(this.indexCard, 1);
                this.idCity.splice(this.indexCard, 1);
                this.isDaytime.splice(this.indexCard, 1);
                this.iconUrl.splice(this.indexCard, 1);
                if (this.curCard >= this.data.length) {
                    this.curCard = this.data.length - 1;
                }
                this.modal = false;
            }
        },
        closeModal() {
            this.modal = false;
        },
        switchInterval() {
            this.switch = !this.switch;
        },
        async getUserLocation() {
            try {
                const response = await axios.get('https://ipapi.co/json/');
                if (response.data) {
                    this.userLocation = response.data.city;
                    this.getweather(this.userLocation);
                }
            } catch (error) {
                console.error('Error fetching location:', error);
                return null;
            }
        }
    }
};
</script>

<style scoped>
.main-wrap {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.main-wrap.visible {
    opacity: 1;
}

.main-wrap {
    opacity: 0;
    animation: fadeInOut 0.5s ease-in-out forwards;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
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

.card_city>button {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -10px;
    right: -10px;
    border: 0;
    background: inherit;
    cursor: pointer;
    width: 20px;
    height: 20px;
    padding: 0;
    border-radius: 50%;
    background-position: center;
}

.card_city>button>img {
    background: inherit;
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
}

.card_city>button:nth-of-type(1) {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -10px;
    left: -10px;
    border: 0;
    background: inherit;
    cursor: pointer;
    width: 20px;
    height: 20px;
    padding: 0;
    border-radius: 50%;
    background-position: center;
}

.card_city>button:nth-of-type(1)>img {
    border-radius: 50%;
    background: inherit;
    width: 28px;
    height: 28px;
    object-fit: cover;
}

@media screen and (max-width: 1200px) {
    .card_city {
        width: 90%;
        flex-direction: column;
    }
}

@media screen and (max-width: 767px) {
    .card_city {
        padding: 10px 0;
        margin: 20px auto;
    }

    .card_city>button {
        top: -5px;
        right: -5px;
        width: 15px;
        height: 15px;
    }

    .card_city>button>img {
        width: 20px;
        height: 20px;
    }

    .card_city>button:nth-of-type(1) {
        top: -5px;
        left: -5px;
        width: 15px;
        height: 15px;
    }

    .card_city>button:nth-of-type(1)>img {
        width: 20px;
        height: 20px;
    }
}
</style>
