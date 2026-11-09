// pages/favorite/favorite.js 收藏 / 今天吃什么大转盘
const { favoriteShops, favoritePosts } = require('../../utils/data.js');

Page({
  data: {
    // ===== 大转盘 =====
    wheelOptions: [
      { name: '牛肉面', angle: 0 },
      { name: '麻辣烫', angle: 60 },
      { name: '黄焖鸡', angle: 120 },
      { name: '奶茶甜品', angle: 180 },
      { name: '食堂三楼', angle: 240 },
      { name: '烧烤夜宵', angle: 300 }
    ],
    wheelStyle: '',
    wheelAngle: 0,
    spinning: false,
    result: '',
    // ===== 收藏列表 =====
    tabs: ['店铺', '帖子'],
    activeTab: 0,
    shopList: favoriteShops,
    postList: favoritePosts
  },

  // 同步自定义 tabBar 选中态
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  onLoad() {
    // 用 conic-gradient 画 6 个交替色扇形（默认 0deg 从顶部开始，指针在顶部对准扇形中心，故 from -30deg）
    const colors = ['#FF8C00', '#FFB25E'];
    const sector = 360 / this.data.wheelOptions.length;
    const stops = [];
    for (let i = 0; i < this.data.wheelOptions.length; i++) {
      stops.push(`${colors[i % 2]} ${i * sector}deg ${(i + 1) * sector}deg`);
    }
    this.setData({
      wheelStyle: `background: conic-gradient(from -${sector / 2}deg, ${stops.join(', ')});`
    });
  },

  // 转动转盘：随机结果 + 旋转动画
  spinWheel() {
    if (this.data.spinning) return;
    const count = this.data.wheelOptions.length;
    const sector = 360 / count;
    const index = Math.floor(Math.random() * count);

    // 在当前角度基础上多转4圈，并让指针停在目标扇形中心
    const base = this.data.wheelAngle - (this.data.wheelAngle % 360);
    const target = base + 360 * 4 + (360 - index * sector - sector / 2);

    this.setData({ spinning: true, result: '', wheelAngle: target });

    setTimeout(() => {
      const name = this.data.wheelOptions[index].name;
      this.setData({ spinning: false, result: name });
      wx.showToast({ title: `今天吃「${name}」！`, icon: 'none', duration: 2000 });
    }, 3100);
  },

  // 分段器切换
  onTabChange(e) {
    this.setData({ activeTab: Number(e.currentTarget.dataset.index) });
  },

  // 取消收藏店铺（Mock：仅前端移除）
  onUnlikeShop(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消收藏',
      content: '确定不再收藏这家店吗？',
      confirmColor: '#FF8C00',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            shopList: this.data.shopList.filter((s) => s.id !== id)
          });
          wx.showToast({ title: '已取消收藏', icon: 'none' });
        }
      }
    });
  }
})
