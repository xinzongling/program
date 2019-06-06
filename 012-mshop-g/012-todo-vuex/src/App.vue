
<template>
  <div class="App" id='app'>
    <router-view></router-view>
    <TabBar />
  </div>
</template>

<script>

  import TabBar from './components/TabBar/TabBar'
  export default {
    name:'App',
    components:{
      TabBar
    }
  }
</script>

<style lang="less">
  #app{
    .rem(padding-bottom,60)
  }
</style>