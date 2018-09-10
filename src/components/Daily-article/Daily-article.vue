<template>
    <div class="daily-article">
        <div class="daily-article-title">{{data.title}}</div>
        <div class="daily-article-content" v-html="data.body"></div>
        <div class="daily-comments" v-show="comments.length">
            <span>评论{{comments.length}}</span>
            <div class="daily-comment" v-for="(comment, index) in comments" :key="index">
                <div class="daily-comment-avatar">
                  <img :src="comment.avatar" alt="">
                </div>
                <div class="daily-comment-content">
                  <div class="daily-comment-name">{{comment.author}}</div>
                  <div class="daily-comment-time">{{comment.time * 1000 | relativeTime}}</div>
                  <div class="daily-comment-text">{{comment.content}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'daily-article',
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      data: {},
      comments: [] // 接收评论数据
    }
  },
  methods: {
    getArticle () {
      this.$axios.get('news/' + this.id)
        .then(res => {
          // 将文章中的图片地址替换为代理的地址
          res.body = res.body
            .replace(/src="http/g, 'src="' + 'http://127.0.0.1:8011/img/' + 'http')
          res.body = res.body
            .replace(/src="https/g, 'src="' + 'http://127.0.0.1:8011/img/' + 'http')
          this.data = res
          // 返回文章顶端
          window.scrollTo(0, 0)
          this.getComments()
        })
    },
    getComments () {
      this.comments = []
      this.$axios.get('story/' + this.id + '/short-comments')
        .then(res => {
          console.log('文章底部评论数据', res)
          this.comments = res.comments.map(comment => {
            // 将头像的图片地址转为代理地址
            comment.avatar = 'http://127.0.0.1:8011/img/' + comment.avatar
            return comment
          })
        })
        .catch(err => {
          console.log('文章底部评论数据获取失败', err)
        })
    }
  },
  watch: {
    id: function (val) {
      if (val) this.getArticle()
    }
  }
}
</script>
