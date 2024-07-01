<template>
  <div class="app">
    <header>
      <nav>
        <router-link class="link" to="/">{{ $t('Main') }}</router-link>
        <router-link class="link" to="/selected">{{ $t('Favorites') }}</router-link>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: rgb(221, 230, 238);
}

.app {
  max-width: 1200px;
  min-width: 360px;
  margin: 0 auto;
}

nav {
  width: max-content;
  margin: 0 auto 50px;
  padding: 10px 0;
  background-color: rgb(224, 193, 193);
  border-radius: 0 0 15px 15px;
}

.link {
  display: inline-block;
  width: 100px;
  padding: 15px 20px;
  text-decoration: none;
  color: #333;
  text-align: center;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 18px;
  transition: 200ms;
}

.link:first-child {
  border-right: 1px solid black;
}

.link:hover {
  color: white;
}
</style>
