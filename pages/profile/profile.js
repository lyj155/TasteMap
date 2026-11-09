// pages/profile/profile.js 我的
Page({
  data: {
    user: {
      nick: '林同学',
      sign: '在学校后街寻找热乎的真实味道 🍜',
      avatar: 'https://picsum.photos/seed/lin/160/160'
    },
    stats: [
      { num: 28, label: '真实评价' },
      { num: 12, label: '我的帖子' },
      { num: 16, label: '收藏店铺' }
    ],
    menus: [
      { name: '我的评价', icon: '📝', bg: '#FFF1E0' },
      { name: '我的帖子', icon: '📷', bg: '#E8F3FF' },
      { name: '收藏店铺', icon: '🏪', bg: '#EAF7EC' },
      { name: '吃过标记', icon: '✅', bg: '#FDEEEE' }
    ],
    // 打卡地图上的定位点（百分比坐标）
    pins: [
      { x: 18, y: 26 },
      { x: 42, y: 58 },
      { x: 70, y: 30 },
      { x: 82, y: 64 }
    ],
    footprints: [
      { id: 1, place: '老陈家牛肉面 · 写了真实评价', time: '今天 12:30' },
      { id: 2, place: '巷口麻辣烫 · 打卡拍照', time: '昨天 19:02' },
      { id: 3, place: '三个大学生奶茶 · 标记「有插座」', time: '11月7日 15:40' }
    ]
  },

  // 同步自定义 tabBar 选中态
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  // 功能入口（Mock：预留跳转）
  onMenuTap(e) {
    const name = e.currentTarget.dataset.name;
    wx.showToast({ title: `「${name}」页面开发中`, icon: 'none' });
  },

  onShareAppMessage() {
    return {
      title: 'TasteMap · 校园周边真实美食记录',
      path: '/pages/index/index'
    };
  }
})
