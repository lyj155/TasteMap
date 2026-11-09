// pages/discover/discover.js 发现列表
const { posts } = require('../../utils/data.js');

// 简易地理距离：由文本距离换算数值，用于“附近”筛选
function parseDistance(text) {
  return parseInt(text, 10) || 9999;
}

Page({
  data: {
    filters: ['附近', '一人食', '有插座', '平价'],
    activeFilter: 0,
    leftColumn: [],
    rightColumn: []
  },

  onLoad() {
    this.applyFilter(0);
  },

  // 切换筛选标签
  onFilterTap(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.applyFilter(index);
  },

  applyFilter(index) {
    const filterName = this.data.filters[index];
    let list = posts;

    if (filterName === '附近') {
      list = posts.filter((p) => parseDistance(p.distanceText) <= 500);
    } else {
      list = posts.filter((p) => p.tags.includes(filterName));
    }

    // 奇偶分列，形成瀑布流（左列短卡开头，视觉错落）
    const left = [];
    const right = [];
    list.forEach((p, i) => {
      (i % 2 === 0 ? left : right).push(p);
    });

    this.setData({ activeFilter: index, leftColumn: left, rightColumn: right });
  },

  // 进入帖子详情（Mock：弹提示，后续接入详情页）
  onPostTap(e) {
    const id = e.currentTarget.dataset.id;
    const post = posts.find((p) => p.id === id);
    if (post) {
      wx.showToast({ title: `「${post.shopName}」详情开发中`, icon: 'none' });
    }
  },

  onShareAppMessage() {
    return {
      title: 'TasteMap · 校园周边真实美食记录',
      path: '/pages/discover/discover'
    };
  }
})
