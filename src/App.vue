<template>
  <div id="app">
    <div class="daily">
      <div  class="daily-menu">
        <div class="daily-menu-item"
        @click="handleToRecommend"
        :class="{on: type === 'recommend'}">每日推荐</div>
        <div class="daily-menu-item"
        :class="{on: type==='recommend'}"
        @click="showThemes = !showThemes">主题日报</div>
        <ul v-show="showThemes">
          <li v-for="(item, index) in themes" :key="index">
            <a href="#" :class="{on: item.id === themeId && type === 'daily'}"
            @click="handleToTheme(item.id)">{{item.name}}</a>
          </li>
        </ul>
      </div>
      <div class="daily-list" ref="list">
        <template v-if="type === 'recommend'">
          <div v-for="(list, index) in recommendList" :key="index">
            <div class="daily-date">{{ list.date | convertTime('MM 月 DD 日') }}</div>
            <Item
              v-for="item in list.stories"
              :data="item"
              :key="item.id"
              @click.native="handleClick(item.id)"></Item>
          </div>
        </template>
        <template v-if="type === 'daily'">
          <Item
            v-for="item in list"
            :data="item"
            :key="item.id"
            @click.native="handleClick(item.id)"></Item>
        </template>
      </div>
      <daily-article :id="articleId"></daily-article>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      themes: [], // 接收主题日报类目列表数据
      showThemes: false,
      type: 'recommend',
      recommendList: [], // 接收推荐列表数据
      dailyTime: this.$getTodayTime(),
      isLoading: false,
      list: [], // 中间栏的数据
      themeId: 0,
      articleId: 0
    }
  },
  created () {
    this.$axios.get('themes')
      .then(res => {
        console.log('主题日报类目列表', res)
        this.themes = res.others
      })
      .catch(err => {
        console.log('主题日报类目列表获取失败', err)
      })
  },
  mounted () {
    this.getRecommendList()
    // this.getThemes()
    // 获取到DOM
    const $list = this.$refs.list
    // 监听中栏滚动事件
    $list.addEventListener('scroll', () => {
      // 在'主题日报'或正在加载推荐列表时停止操作
      if (this.type === 'daily' || this.isLoading) return
      if ($list.scrollTop + document.body.clientHeight >= $list.scrollHeight) {
        // 时间相对减少一天
        this.dailyTime -= 86400000
        this.getRecommendList()
      }
    })
  },
  methods: {
    handleToTheme (id) {
      // 改变菜单分类
      this.type = 'daily'
      // 设置当前子类的主题日报 id
      this.themeId = id
      console.log(this.themeId)
      // 清空中间栏的数据
      this.list = []
      this.$axios.get('theme/' + id)
        .then(res => {
          console.log('主题日报文章列表数据', res)
          // 过滤掉类型为1的文章，该类型下的文章为空
          this.list = res.stories.filter(item => item.type !== 1)
        })
        .catch(err => {
          console.log('主题日报文章列表获取失败', err)
        })
    },
    handleToRecommend () {
      this.type = 'recommend'
      // 清空数据
      this.recommendList = []
      this.dailyTime = this.$getTodayTime()
      this.getRecommendList()
    },
    getRecommendList () {
      // 加载时设置为 true，加载完成后设置为 false
      this.isLoading = true
      const prevDay = this.$prevDay(this.dailyTime + 86400000) // this.dailyTime 'number'
      this.$axios.get('news/before/' + prevDay)
        .then(res => {
          console.log('每日推荐列表数据', res)
          this.recommendList.push(res)
          this.isLoading = false
          // console.log('第一条推荐的id是', res.stories[0].id)
          if (this.articleId === 0) this.articleId = res.stories[0].id // 默认显示第一条推荐
        })
        .catch(err => {
          console.log('每日推荐列表获取失败', err)
        })
    },
    handleClick (id) {
      this.articleId = id
    }
  }
}
</script>

<style>
</style>
