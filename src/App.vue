<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
    <player></player>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import player from 'components/player/player'

  export default {
    components: {
      MHeader,
      Tab,
      player
    }
  }
</script>

<style>
</style>
