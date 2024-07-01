<template>
    <div class="chart_wrap">
        <h3 v-if="this.switch">{{ $t('Temperature (Next 5 Days)') }}</h3>
        <h3 v-else>{{ $t('Temperature every 3 hours (current day)') }}</h3>
        <ChartComponent :chartData="chartData" />
        <div v-if="error">{{ error }}</div>
    </div>
</template>

<script>
import axios from 'axios';
import { apiKey } from '../config';
import ChartComponent from './ChartComponent.vue';

export default {
    name: 'HourlyTemperature',
    components: {
        ChartComponent
    },
    props: {
        idCity: {
            type: Number,
            required: true
        },
        curCard: {
            type: Number,
            required: true
        },
        switch: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            temperature: [],
            error: '',
            chartData: {},
            curDate: new Date().toISOString().split('T')[0],
        };
    },
    computed: {
        filteredTemperature() {
            if (!this.switch) {
                return this.temperature.filter(item => item.dt_txt.startsWith(this.curDate));
            } else {
                return this.temperature.filter(item => {
                    const date = new Date(item.dt_txt);
                    return date.getHours() === 15;
                });
            }
        }
    },
    watch: {
        idCity: {
            handler(newIdCity, oldIdCity) {
                if (newIdCity !== oldIdCity && newIdCity !== 0) {
                    if (!this.switch) {
                        this.getHourlyTemp();
                    } else {
                        this.getWeeklyTemp();
                    }
                }
            },
            immediate: true
        },
        switch(newSwitch, oldSwitch) {
            if (newSwitch !== oldSwitch) {
                if (!newSwitch) {
                    this.getHourlyTemp();
                } else {
                    this.getWeeklyTemp();
                }
            }
        }
    },
    methods: {
        async getHourlyTemp() {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=${this.idCity}&appid=${apiKey}&units=metric`);
                if (response.status === 200) {
                    this.temperature = response.data.list;

                    const labels = this.filteredTemperature.map(item => item.dt_txt);
                    const temperatures = this.filteredTemperature.map(item => item.main.temp);

                    this.chartData = {
                        labels,
                        datasets: [
                            {
                                label: this.t('Temperature (°C)'),
                                data: temperatures,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }
                        ]
                    };
                }
            } catch (error) {
                this.error = 'Error fetching weather data';
                console.error('Error:', error);
            }
        },
        async getWeeklyTemp() {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=${this.idCity}&cnt=40&appid=${apiKey}&units=metric`);
                if (response.status === 200) {
                    this.temperature = response.data.list;
                    const labels = this.filteredTemperature.map(item => item.dt_txt.split(' ')[0]);
                    const temperatures = this.filteredTemperature.map(item => item.main.temp);


                    this.chartData = {
                        labels,
                        datasets: [
                            {
                                label: this.$t('Temperature (°C)'),
                                data: temperatures,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }
                        ]
                    };
                }
            } catch (error) {
                this.error = 'Error fetching weather data';
                console.error('Error:', error);
            }
        }
    }
};
</script>

<style scoped>
h3 {
    width: max-content;
    margin: 0 auto;
}

@media screen and (max-width: 767px) {

    .chart_wrap {
        width: 80%;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    h3 {
        display: flex;
        flex-wrap: wrap;
        width: 80vw;
        height: auto;
    }
}

@media screen and (max-width: 600px) {

    .chart_wrap {
        width: 90%;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
}
</style>
