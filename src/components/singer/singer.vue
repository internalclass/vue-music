<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from 'base/listview/listview'
  import {getSingerList} from 'api/singer'
  import Singer from 'assets/js/singer' // 封装了singer类
  import {mapMutations} from 'vuex' // mapMutations对mutations做了封装 语法糖
  import {ERR_OK} from 'api/config'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      // 获取列表数据
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      // 规范化数据
      _normalizeSinger (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }

        // 遍历list, 对象遍历是无序的
        list.forEach((item, index) => {
          // 前10条定义为热门数据,分析接口需要哪些数据
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }

          const key = item.Findex

          // 没有这个聚合对象就创建一个对象map【key】
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })

        // 为了得到有序列表，我们需要处理map
        let hot = []
        let ret = []

        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }

        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })

        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER' // mutations映射成方法名
      })
    },
    components: {
      ListView
    }
  }
</script>
<style scoped>
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
