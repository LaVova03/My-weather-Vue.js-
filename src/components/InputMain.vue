<template>
    <div class="input-wrap">
        <input v-model="inputCity" type="text" min="0" :placeholder="$t('Search city')" />
        <ul v-if="showCitiesList" class="autocomplete-list">
            <li v-for="city in cities" :key="city.id" @click="selectCity(city)">
                {{ city.name }} - {{ city.country }}
            </li>
        </ul>
        <button @click="searchCities">{{ $t('Search') }}</button>
    </div>
</template>

<script>

import axios from 'axios';
import { apiKey } from '../config';

export default {
    name: 'InputMain',
    props: {
        getweather: {
            type: Function,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            inputCity: this.city,
            cities: [],
            showCitiesList: false,
            favs: []
        };
    },
    watch: {
        city(newCity) {
            this.inputCity = newCity;
        }
    },
    methods: {
        async searchCities() {
            try {
                const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
                    params: {
                        q: this.inputCity,
                        limit: 10,
                        appid: apiKey
                    }
                });
                if (response.status === 200) {
                    this.cities = response.data;
                    this.showCitiesList = true;
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        },
        selectCity(selectedCity) {
            this.inputCity = `${selectedCity.name}, ${selectedCity.country}`;
            this.$emit('update:city', this.inputCity);
            this.getWeather();
            this.showCitiesList = false;
            this.cities = [];
        },
        getWeather() {
            this.getweather(this.inputCity);
        },
    }
};
</script>

<style scoped>
.input-wrap>input {
    border-radius: 10px 0 0 10px;
    border: 0;
    width: 410px;
    outline: none;
    height: 35px;
    padding: 0 10px;
    background-color: #fafafa;
    color: #333;
    font-size: 14px;
}

.input-wrap>button {
    width: 100px;
    height: 35px;
    color: #fff;
    cursor: pointer;
    background: #3f3f3f;
    border: 0;
    border-radius: 0 10px 10px 0;
    transition: 200ms;
    font-size: 14px;
}

.input-wrap>button:hover {
    background: #808080;
}

.input-wrap {
    display: flex;
    position: relative;
    justify-content: center;
    margin: 0 auto 30px;
    height: max-content;
    width: max-content;
}

.autocomplete-list {
    position: absolute;
    top: 35px;
    background-color: #fff;
    border: 1px solid #ccc;
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: max-content;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.autocomplete-list li {
    width: 100px;
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.autocomplete-list li:last-child {
    border-bottom: none;
}

.autocomplete-list li:hover {
    background-color: #f1f1f1;
}

@media screen and (max-width: 1200px) {
    canvas {
        height: 200px !important;
    }
}

@media screen and (max-width: 767px) {
    .input-wrap>input {
        width: 50vw;
    }
}
</style>