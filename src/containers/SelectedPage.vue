<template>
    <div class="fav_page">
        <FavoriteCity />
    </div>
</template>

<script>

import FavoriteCity from '@/components/FavoriteCity.vue';

export default {
    name: 'SelectedPage',
    components: {
        FavoriteCity
    }
}
</script>

<style scoped>
.fav_page {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.fav_page.visible {
    opacity: 1;
}

.fav_page {
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
</style>