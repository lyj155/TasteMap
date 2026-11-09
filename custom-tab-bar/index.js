// custom-tab-bar/index.js 自定义底部导航（含中间"+"发布按钮）
Component({
  data: {
    selected: 0,
    // center 为 true 的项渲染为中间的"+"按钮
    list: [
      { path: '/pages/index/index', text: '首页', idx: 0, icon: '/assets/tabbar/home.png', iconActive: '/assets/tabbar/home-active.png' },
      { path: '/pages/discover/discover', text: '发现', idx: 1, icon: '/assets/tabbar/discover.png', iconActive: '/assets/tabbar/discover-active.png' },
      { center: true },
      { path: '/pages/favorite/favorite', text: '收藏', idx: 2, icon: '/assets/tabbar/favorite.png', iconActive: '/assets/tabbar/favorite-active.png' },
      { path: '/pages/profile/profile', text: '我的', idx: 3, icon: '/assets/tabbar/profile.png', iconActive: '/assets/tabbar/profile-active.png' }
    ]
  },

  methods: {
    // 切换 Tab
    onTabTap(e) {
      const { path, idx } = e.currentTarget.dataset;
      this.setData({ selected: idx });
      wx.switchTab({ url: path });
    },

    // 中间"+"按钮：跳转发布页
    onPublish() {
      wx.navigateTo({ url: '/pages/publish/publish' });
    }
  }
})
