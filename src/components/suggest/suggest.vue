<template>
  <scroll
    ref="suggest"
    class="suggest"
    :data="result"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <div class="no-result-wrapper"></div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {filterSinger} from 'assets/js/song'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        result: []
      }
    },
    methods: {
      search () {
        this.page = 1
        this.hasMore = true
        // this.$refs.sugget.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            console.log(this.result)
          }
        })
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.songname} - ${filterSinger(item.singer)}`
        }
      },
      _genResult (data) {
        let ret = []

        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }

        if (data.song) {
          ret = ret.concat(data.song.list)
        }

        return ret
      }
    },
    watch: {
      query (newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped>
  .suggest {
    height: 100%;
    overflow: hidden;
  }
  .suggest .suggest-list {
    padding: 0 30px;
  }
  .suggest .suggest-list .suggest-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding-bottom: 20px;
  }
  .suggest .suggest-list .icon {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 30px;
    flex: 0 0 30px;
    width: 30px;
  }
  .suggest .suggest-list .icon [class^="icon-"] {
    font-size: 14px;
    color: rgba(255,255,255,0.3);
  }
  .suggest .suggest-list .name {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
    overflow: hidden;
  }
  .suggest .suggest-list .name .text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .suggest .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
</style>
