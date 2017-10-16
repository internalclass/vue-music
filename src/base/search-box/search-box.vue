<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" :placeholder="placeholder" v-model="query" ref="query">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: ''
      }
    },
    methods: {
      clear () {
        this.query = ''
      },
      setQuery (query) {
        console.log(query)
        this.query = query
      }
    },
    created () {
      // 派发query事件
      this.$watch('query', (newQuery) => {
        this.$emit('query', newQuery)
      })
    }
  }

</script>

<style scoped>
  .search-box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: #333;
    border-radius: 6px;
  }
  .search-box .icon-search {
    font-size: 24px;
    color: #222;
  }
  .search-box .box {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: #333;
    color: #fff;
    font-size: 14px;
  }
  .search-box .box::-webkit-input-placeholder {
    color: rgba(255,255,255,0.3);
  }
  .search-box .box:-ms-input-placeholder {
    color: rgba(255,255,255,0.3);
  }
  .search-box .box::placeholder {
    color: rgba(255,255,255,0.3);
  }
  .search-box .icon-dismiss {
    font-size: 16px;
    color: #222;
  }

</style>
