<template>
  <div class="player" v-show="playlist.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image" alt="">
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd" :class="cdCls">
              <img :src="currentSong.image" alt="" class="image">
            </div>
          </div>
        </div>
        <div class="middle-r"></div>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{ format(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
          </div>
          <span class="time time-r">{{ format(currentSong.duration) }}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="iconMode"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center">
            <i :class="playIcon" @click.stop="togglePlaying"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon">
        <img width="40" height="40" :src="currentSong.image">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <progress-circle :percent="percent" :radius="radius">
          <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
        </progress-circle>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
    <audio ref="audio" :src="currentSong.url" @timeupdate="updateTime" @canplay="ready" @error="error" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  import { playMode } from 'assets/js/config'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import { shuffle } from 'assets/js/util'

  export default {
    data () {
      return {
        songReady: false,
        currentTime: 0,
        radius: 32
      }
    },
    computed: {
      cdCls () {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      // 当前播放的时间除以歌曲的总时长
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      iconMode () {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    methods: {
      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      togglePlaying () {
        this.setPlayingState(!this.playing)
      },
      end () {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      },
      next () {
        if (!this.songReady) {
          return false
        }

        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }

        this.setCurrentIndex(index)

        if (!this.playing) {
          this.togglePlaying()
        }

        this.songReady = false
      },
      prev () {
        if (!this.songReady) {
          return false
        }

        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }

        this.setCurrentIndex(index)

        if (!this.playing) {
          this.togglePlaying()
        }

        this.songReady = false
      },
      // 设置标识符解决频繁点击出现错误显示
      ready () {
        this.songReady = true
      },
      // 处理没有网络、url错误的情况
      error () {
        this.songReady = true
      },
      updateTime (e) {
        this.currentTime = e.target.currentTime
      },
      format (interval) {
        interval = interval | 0 //  相当于Math.floor向下取整
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      onProgressBarChange (precent) {
        this.$refs.audio.currentTime = this.currentSong.duration * precent
        // 没有播放的状态的时候调用
        if (!this.playing) {
          this.togglePlaying()
        }
      },
      changeMode () {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        console.log('1145435')
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex (list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })

        this.setCurrentIndex(index)
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      })
    },
    watch: {
      currentSong (newSong, oldSong) {
        // id没改变不触发
        if (newSong.id === oldSong.id) {
          return
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      },
      playing (newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle
    }
  }
</script>

<style>
  @font-face{
    font-family: 'music-icon';
    src: url('../../assets/fonts/music-icon.eot?2qevqt');
    src: url('../../assets/fonts/music-icon.eot?2qevqt#iefix') format('embedded-opentype'),
    url('../../assets/fonts/music-icon.ttf?2qevqt') format('truetype'),
    url('../../assets/fonts/music-icon.woff?2qevqt') format('woff'),
    url('../../assets/fonts/music-icon.svg?2qevqt#music-icon') format('svg');
    font-weight: normal;
    font-style: normal;
  }
  [class^="icon-"], [class*=" icon-"] {
    font-family: 'music-icon';
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .icon-ok:before {
    content: "\e900";
  }
  .icon-close:before {
    content: "\e901"
  }

  .icon-add:before {
    content: "\e902"
  }

  .icon-play-mini:before {
    content: "\e903"
  }

  .icon-playlist:before {
    content: "\e904"
  }

  .icon-music:before {
    content: "\e905"
  }

  .icon-search:before {
    content: "\e906"
  }

  .icon-clear:before {
    content: "\e907"
  }

  .icon-delete:before {
    content: "\e908"
  }

  .icon-favorite:before {
    content: "\e909"
  }

  .icon-not-favorite:before {
    content: "\e90a"
  }

  .icon-pause:before {
    content: "\e90b"
  }

  .icon-play:before {
    content: "\e90c"
  }

  .icon-prev:before {
    content: "\e90d"
  }

  .icon-loop:before {
    content: "\e90e"
  }

  .icon-sequence:before {
    content: "\e90f"
  }

  .icon-random:before {
    content: "\e910"
  }

  .icon-back:before {
    content: "\e911"
  }

  .icon-mine:before {
    content: "\e912"
  }

  .icon-next:before {
    content: "\e913"
  }

  .icon-dismiss:before {
    content: "\e914"
  }

  .icon-pause-mini:before {
    content: "\e915"
  }

  .player .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #222;
  }
  .player .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #222;
  }
  .player .normal-player .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    -webkit-filter: blur(20px);
    filter: blur(20px);
  }
  .player .normal-player .top {
    position: relative;
    margin-bottom: 25px;
  }
  .player .normal-player .top .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
  }
  .player .normal-player .top .back .icon-back {
    display: block;
    padding: 9px;
    font-size: 22px;
    color: #ffcd32;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }
  .player .normal-player .top .title {
    width: 70%;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 18px;
    color: #fff;
  }
  .player .normal-player .top .subtitle {
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    color: #fff;
  }
  .player .normal-player .middle {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;
  }
  .player .normal-player .middle-l {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 0;
    padding-top: 80%;
  }
  .player .normal-player .middle .middle-l .cd-wrapper {
    position: absolute;
    left: 10%;
    top: 0;
    width: 80%;
    height: 100%;
  }
  .player .normal-player .middle .middle-l .cd-wrapper .cd {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 10px solid rgba(255,255,255,0.1);
    border-radius: 50%;
  }
  .player .normal-player .middle .middle-l .cd-wrapper .cd.play {
    -webkit-animation: rotate 20s linear infinite;
    animation: rotate 20s linear infinite;
  }
  .player .normal-player .middle .middle-l .cd-wrapper .cd.pause {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .player .middle-l .cd-wrapper .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .player .normal-player .middle .middle-l .playing-lyric-wrapper {
    width: 80%;
    margin: 30px auto 0 auto;
    overflow: hidden;
    text-align: center;
  }
  .player .normal-player .middle .middle-l .playing-lyric-wrapper .playing-lyric {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: rgba(255,255,255,0.5);
  }
  .player .normal-player .middle .middle-r {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .player .normal-player .middle .middle-r .lyric-wrapper {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
  }
  .player .normal-player .middle .middle-r .lyric-wrapper .text {
    line-height: 32px;
    color: rgba(255,255,255,0.5);
    font-size: 14px;
  }
  .player .normal-player .middle .middle-r .lyric-wrapper .text.current {
    color: #fff;
  }
  .player .normal-player .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
  }
  .player .normal-player .bottom .dot-wrapper {
    text-align: center;
    font-size: 0;
  }
  .player .normal-player .bottom .dot-wrapper .dot {
    display: inline-block;
    vertical-align: middle;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
  }
  .player .normal-player .bottom .dot-wrapper .dot.active {
    width: 20px;
    border-radius: 5px;
    background: rgba(255,255,255,0.8);
  }
  .player .normal-player .bottom .progress-wrapper {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 80%;
    margin: 0px auto;
    padding: 10px 0;
  }
  .player .normal-player .bottom .progress-wrapper .time {
    color: #fff;
    font-size: 12px;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 30px;
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
  }
  .player .normal-player .bottom .progress-wrapper .time.time-l {
    text-align: left;
  }
  .player .normal-player .bottom .progress-wrapper .time.time-r {
    text-align: right;
  }
  .player .normal-player .bottom .progress-wrapper .progress-bar-wrapper {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .player .normal-player .bottom .operators {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .player .normal-player .bottom .operators .icon {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    color: #ffcd32;
  }
  .player .normal-player .bottom .operators .icon.disable {
    color: rgba(255,205,49,0.5);
  }
  .player .normal-player .bottom .operators .icon i {
    font-size: 30px;
  }
  .player .normal-player .bottom .operators .i-left {
    text-align: right;
  }
  .player .normal-player .bottom .operators .i-center {
    padding: 0 20px;
    text-align: center;
  }
  .player .normal-player .bottom .operators .i-center i {
    font-size: 40px;
  }
  .player .normal-player .bottom .operators .i-right {
    text-align: left;
  }
  .player .normal-player .bottom .operators .icon-favorite {
    color: #d93f30;
  }
  .player .normal-player.normal-enter-active,
  .player .normal-player.normal-leave-active {
    transition: all 0.4s;
  }
  .player .normal-player.normal-enter-active .top,
  .player .normal-player.normal-leave-active .top,
  .player .normal-player.normal-enter-active .bottom,
  .player .normal-player.normal-leave-active .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
  .player .normal-player.normal-enter,
  .player .normal-player.normal-leave-to {
    opacity: 0;
  }
  .player .normal-player.normal-enter .top,
  .player .normal-player.normal-leave-to .top {
    -webkit-transform: translate3d(0, -100px, 0);
    transform: translate3d(0, -100px, 0);
  }
  .player .normal-player.normal-enter .bottom,
  .player .normal-player.normal-leave-to .bottom {
    -webkit-transform: translate3d(0, 100px, 0);
    transform: translate3d(0, 100px, 0);
  }
  .player .mini-player {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #333;
  }
  .player .mini-player.mini-enter-active,
  .player .mini-player.mini-leave-active {
    transition: all 0.4s;
  }
  .player .mini-player.mini-enter,
  .player .mini-player.mini-leave-to {
    opacity: 0;
  }
  .player .mini-player .icon {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 40px;
    flex: 0 0 40px;
    width: 40px;
    padding: 0 10px 0 20px;
  }
  .player .mini-player .icon img {
    border-radius: 50%;
  }
  .player .mini-player .icon img.play {
    -webkit-animation: rotate 10s linear infinite;
    animation: rotate 10s linear infinite;
  }
  .player .mini-player .icon img.pause {
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
  }
  .player .mini-player .text {
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
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
  }
  .player .mini-player .text .name {
    margin-bottom: 2px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    color: #fff;
  }
  .player .mini-player .text .desc {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    color: rgba(255,255,255,0.3);
  }
  .player .mini-player .control {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 30px;
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
  }
  .player .mini-player .control .icon-play-mini,
  .player .mini-player .control .icon-pause-mini,
  .player .mini-player .control .icon-playlist {
    font-size: 30px;
    color: rgba(255,205,49,0.5);
  }
  .player .mini-player .control .icon-mini {
    font-size: 32px;
    position: absolute;
    left: 0;
    top: 0;
  }
  @-webkit-keyframes rotate {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes rotate {
    0% {
      -webkit-transform: rotate(0);
      transform: rotate(0);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
