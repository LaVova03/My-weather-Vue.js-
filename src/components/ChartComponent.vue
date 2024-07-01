<template>
    <div class="hourly_wrap">
        <canvas ref="myChart"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

export default {
    name: 'ChartComponent',
    props: {
        chartData: {
            type: Object,
            required: true
        }
    },
    watch: {
        chartData: {
            handler() {
                this.renderChart();
            },
            deep: true,
        }
    },
    mounted() {
        this.renderChart();
    },
    methods: {
        renderChart() {
            if (this.chart) {
                this.chart.destroy();
            }
            const ctx = this.$refs.myChart.getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: this.chartData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    },
    beforeUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
};
</script>

<style scoped>
.hourly_wrap {
    display: flex;
    justify-content: center;
    width: max-content;
}

canvas {
    width: auto;
    height: 300px !important;
}

@media screen and (max-width: 767px) {
    canvas {
        height: 250px !important;
        width: 450px;
    }
}

@media screen and (max-width: 550px) {
    canvas {
        height: 200px !important;
    }
}

@media screen and (max-width: 485px) {
    canvas {
        height: 150px !important;
    }
}
</style>
