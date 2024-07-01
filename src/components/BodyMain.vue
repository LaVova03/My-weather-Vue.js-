<template>
  <div class="body-main">
    <ModalWindow :modal="modal" :modalCard="modalCard" @close-modal="closeModal" />
    <button v-if="data.length > 0">
      <img :src="isFavorite(fullCityName) ? imageGoldStar : imageAddFav" alt="logo"
        @click="toggleFavorite(fullCityName)" />
    </button>
    <ul v-if="!data[0]">
      <li>
        <div v-if="loading" class="loader">{{ $t('Loading...') }}</div>
        <div>{{ $t('Enter the city name into the search bar !') }}</div>
      </li>
    </ul>
    <ul v-else :id="!isDaytime ? 'night' : ''">
      <li>{{ formattedDateTime }}</li>
      <li>{{ $t(`${data[0]?.name}`) }} {{ data[0]?.sys?.country }}</li>
      <li><img :src="iconUrl" /> {{ Math.round(+data[0]?.main?.temp) }}°C</li>
      <li>{{ $t('Feels_like ') }}{{ (Math.round(+data[0]?.main?.feels_like)) }}°C, {{
        $t(`${data[0]?.weather[0]?.description}`) }}.
      </li>
      <li>
        <ul>
          <li>{{ $t('Wind speed:') }} {{ data[0]?.wind?.speed }}{{ $t('m/s') }}</li>
          <li>{{ $t('Humidity:') }} {{ data[0]?.main?.humidity }}%</li>
          <li>{{ $t('Visibility:') }} {{ data[0]?.visibility }}{{ $t('km') }}</li>
          <li>{{ $t('Pressure:') }} {{ data[0]?.main?.pressure }}{{ $t('hPa') }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import ModalWindow from './ModalWindow.vue';
import AddFavorite from '@/assets/star.png';
import GoldStar from '@/assets/izbran.png';

export default {
  name: 'BodyMain',
  components: {
    ModalWindow
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    iconUrl: {
      type: String,
      required: true
    },
    favorites: {
      type: Boolean,
      required: false
    },
    loading: {
      type: Boolean,
      required: true
    },
    isDaytime: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formattedDateTime: '',
      imageAddFav: AddFavorite,
      imageGoldStar: GoldStar,
      favs: [],
      modal: false,
      modalCard: false
    };
  },
  computed: {
    fullCityName() {
      return `${this.data[0]?.name}, ${this.data[0]?.sys?.country}`;
    }
  },
  mounted() {
    this.getCurrentDateTime();
    this.loadFavorites();
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    getCurrentDateTime() {
      const now = new Date();
      const monthNames = [
        this.$t('Jan'), this.$t('Feb'), this.$t('Mar'), this.$t('Apr'),
        this.$t('May'), this.$t('Jun'), this.$t('Jul'), this.$t('Aug'),
        this.$t('Sep'), this.$t('Oct'), this.$t('Nov'), this.$t('Dec')
      ];

      const month = monthNames[now.getMonth()];
      const day = now.getDate();
      let hour = now.getHours();
      const minute = now.getMinutes();
      const period = hour >= 12 ? this.$t('pm') : this.$t('am');

      hour = hour % 12;
      hour = hour ? hour : 12;

      const formattedDate = `${month} ${day}, ${this.formatTime(hour)}:${this.formatTime(minute)}${period}`;
      this.formattedDateTime = formattedDate;
    },
    formatTime(time) {
      return time < 10 ? `0${time}` : time;
    },
    loadFavorites() {
      const favLocalStor = localStorage.getItem('favsLocal');
      if (favLocalStor) {
        this.favs = JSON.parse(favLocalStor);
      } else {
        this.favs = [];
      }
    },
    isFavorite(city) {
      return this.favs.includes(city);
    },
    closeModal() {
      this.modal = false;
      this.modalCard = false;
    },
    handleStorageChange(event) {
      if (event.key === 'favsLocal') {
        this.loadFavorites();
      }
    },
    toggleFavorite(city) {
      if (this.isFavorite(city)) {
        this.deleteCityLocal(city);
      } else {
        this.addCityLocal(city);
      }
    },
    addCityLocal(city) {
      const favoriteCities = localStorage.getItem('favsLocal');
      let srt = [];

      try {
        srt = JSON.parse(favoriteCities) || [];
      } catch (e) {
        console.error('Error parsing favsLocal from localStorage:', e);
        srt = [];
      }

      if (srt.length < 5) {
        this.favs = srt;
        if (!this.favs.includes(city)) {
          this.favs.push(city);
          localStorage.setItem('favsLocal', JSON.stringify(this.favs));
        }
      } else {
        this.modalCard = true;
        setTimeout(() => {
          this.closeModal();
        }, 3000)
      }
    },
    deleteCityLocal(city) {
      const favoriteCities = localStorage.getItem('favsLocal');
      let srt = [];

      try {
        srt = JSON.parse(favoriteCities) || [];
      } catch (e) {
        console.error('Error parsing favsLocal from localStorage:', e);
        srt = [];
      }

      this.favs = srt;
      const index = this.favs.indexOf(city);
      if (index !== -1) {
        this.favs.splice(index, 1);
        localStorage.setItem('favsLocal', JSON.stringify(this.favs));
      }
    }
  }
}
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
}

.body-main {
  width: max-content;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

#night,
.body-main>ul {
  border-radius: 10px;
  border: 1px solid black;
  background-color: rgb(224, 193, 193);
  width: 20vw;
  min-height: 40vh;
  padding: 20px 30px;
}

#night {
  background-color: rgb(167, 138, 138) !important;
}

.body-main>ul>li:first-child {
  color: rgb(214, 44, 44);
  font-size: 18px;
}

.body-main>ul>li:nth-of-type(2) {
  font-size: 32px;
}

.body-main>ul>li:nth-of-type(3) {
  display: flex;
  align-items: center;
  font-size: 40px;
}

.body-main>ul>li:nth-of-type(3)>img {
  margin-right: 10px;
}

.body-main>ul>li:nth-of-type(4) {
  display: flex;
  font-size: 16px;
  margin-bottom: 10px
}

.body-main>ul>li:nth-of-type(5) {
  border-left: 1px solid rgb(214, 44, 44);
  padding: 0 20px;
  color: #707070;
}

#night>li:nth-of-type(5) {
  border-left: 1px solid rgb(214, 44, 44);
  padding: 0 20px;
  color: #c2c1c1;
}

.body-main>ul>li:nth-of-type(5)>ul>li {
  margin-bottom: 5px;
}

.body-main>button {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 15px;
  right: 20px;
  border: 0;
  background: inherit;
  cursor: pointer;
  background: inherit;
  width: 20px;
  height: 20px;
  padding: 0;
  border-radius: 50%;
  background-position: center;
}

.body-main>button>img {
  border-radius: 50%;
  background: inherit;
  width: 28px;
  height: 28px;
  object-fit: cover;
}


@media screen and (max-width: 1200px) {

  #night,
  .body-main>ul {
    width: 40vw;
    min-height: max-content;
    margin: 30px 0 0 0;
  }
}

@media screen and (max-width: 767px) {

  #night,
  .body-main>ul {
    width: 70vw;
    min-height: max-content;
  }
}
</style>
