<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <div class="search-history">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query">
      <suggest ref="suggest" :query="query"></suggest>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import Scroll from 'base/scroll/scroll'
  import {ERR_OK} from 'api/config'
  import {getHotKey} from 'api/search'

  export default {
    data () {
      return {
        hotKey: [],
        query: ''
      }
    },
    created () {
      this._getHotKey()
    },
    methods: {
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      addQuery (query) {
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange (query) {
        this.query = query
      }
    },
    watch: {
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      SearchBox,
      Suggest,
      Scroll
    }
  }
</script>

<style scoped>
  .search .search-box-wrapper {
    margin: 20px;
  }
  .search .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
  }
  .search .shortcut-wrapper .shortcut {
    height: 100%;
    overflow: hidden;
  }
  .search .shortcut-wrapper .shortcut .hot-key {
    margin: 0 20px 20px 20px;
  }
  .search .shortcut-wrapper .shortcut .hot-key .title {
    margin-bottom: 20px;
    font-size: 14px;
    color: rgba(255,255,255,0.5);
  }
  .search .shortcut-wrapper .shortcut .hot-key .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: #333;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
  }
  .search .shortcut-wrapper .shortcut .search-history {
    position: relative;
    margin: 0 20px;
  }
  .search .shortcut-wrapper .shortcut .search-history .title {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 40px;
    font-size: 14px;
    color: rgba(255,255,255,0.5);
  }
  .search .shortcut-wrapper .shortcut .search-history .title .text {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .search .shortcut-wrapper .shortcut .search-history .title .clear {
    position: relative;
  }
  .search .shortcut-wrapper .shortcut .search-history .title .clear:before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
  }
  .search .shortcut-wrapper .shortcut .search-history .title .clear .icon-clear {
    font-size: 14px;
    color: rgba(255,255,255,0.3);
  }
  .search .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
</style>
