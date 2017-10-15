<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'assets/js/dom'
  export default {
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted () {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      }, 20)

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }

        this._setSliderWidth(true)
        this.slider.refresh() // 强制 scroll 重新计算，当 better-scroll 中的元素发生变化的时候调用此方法
      })
    },
    methods: {
      _setSliderWidth (isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        let slidWidth = this.$refs.sliderGroup.clientWidth

        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = slidWidth + 'px'
          width += slidWidth
        }

        if (this.loop && !isResize) {
          width += 2 * slidWidth
        }

        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,   // 滚动方向为 X 轴
          scrollY: false,  // 滚动方向为 Y 轴
          momentum: false, // 当快速滑动时是否开启滑动惯性
          snap: true,      // 该属性是给 slider 组件使用的，普通的列表滚动不需要配置
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        // 滚动结束时触发
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX  // 获取滚动的当前页，返回的对象结构为 {x, y, pageX, pageY}, pageX横向滚动的索引

          if (this.loop) {
            pageIndex--
          }

          this.currentPageIndex = pageIndex

          if (this.autoplay) {
            this._play()
          }
        })
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      },
      _play () {
        let pageIndex = this.currentPageIndex + 1

        if (this.loop) {
          pageIndex += 1
        }

        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400) // 滚动到对应的页面，x 表示横向页面索引
        }, this.interval)
      }
    }
  }
</script>
