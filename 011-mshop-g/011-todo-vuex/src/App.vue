  <template>
    <div class="App">
      <h3>ToDo List</h3>
      <Header />
      <List />
      <Footer />
    </div>
  </template>

<script>
  import Header from './components/Header.vue'
  import List from './components/List.vue'
  import Footer from './components/Footer.vue'
  export default{
    name:'App',
    components:{
      Header,
      List,
      Footer
    }
  }
</script>

<style>
  .App{
    width:600px;
    margin:0 auto;
  }
  .App h3{
    width:100%;
    text-align:center;
    line-height:30px;
  }
</style>
