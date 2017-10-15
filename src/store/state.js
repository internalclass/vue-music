import {playMode} from 'assets/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {}, // 定义歌单对象
  topList: {}
}

export default state
