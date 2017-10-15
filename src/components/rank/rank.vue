<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" alt="">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList">
              <span> {{ index + 1 }} </span>
              <span> {{ song.songname }} - {{ song.singername }} </span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-container" v-show="!topList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import { getTopList } from 'api/rank'
  import { ERR_OK } from 'api/config'
  import Loading from 'base/loading/loading'
  import { mapMutations } from 'vuex'

  export default {
    data () {
      return {
        topList: []
      }
    },
    created () {
      this._getTopList()
    },
    methods: {
      selectItem (item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      _getTopList () {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped>
  .rank {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
  .rank .toplist {
    height: 100%;
    overflow: hidden;
  }
  .rank .toplist .item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin: 0 20px;
    padding-top: 20px;
    height: 100px;
  }
  .rank .toplist .item:last-child {
    padding-bottom: 20px;
  }
  .rank .toplist .item .icon {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 100px;
    flex: 0 0 100px;
    width: 100px;
    height: 100px;
  }
  .rank .toplist .item .songlist {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    padding: 0 20px;
    height: 100px;
    overflow: hidden;
    background: #333;
    color: rgba(255,255,255,0.3);
    font-size: 12px;
  }
  .rank .toplist .item .songlist .song {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 26px;
  }
  .rank .toplist .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
</style>
