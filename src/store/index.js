import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

// 注册插件
Vue.use(Vuex)

// 调试工具，线下开发debug设置为true，会有一定的性能损坏
const debug = process.env.NODE_ENV !== 'production'

// store的实例 类似单例模式
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : [] // 能方便的看到日志
})

