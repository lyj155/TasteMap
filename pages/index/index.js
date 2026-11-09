// pages/index/index.js 首页：校园美食地图
const { CAMPUS_CENTER, shops } = require('../../utils/data.js');

Page({
  data: {
    latitude: CAMPUS_CENTER.latitude,
    longitude: CAMPUS_CENTER.longitude,
    markers: [],
    keyword: '',
    exploreAll: false // 关：只看有真实评价的店；开：探索完整地图
  },

  onLoad() {
    this.renderMarkers();
  },

  // 生成地图 markers：橙色=有真实评价，灰色=无评价
  renderMarkers() {
    const { exploreAll } = this.data;
    const list = exploreAll ? shops : shops.filter((s) => s.hasReview);

    const markers = list.map((s) => ({
      id: s.id,
      latitude: s.latitude,
      longitude: s.longitude,
      width: 28,
      height: 36,
      label: {
        content: s.name,
        color: '#FFFFFF',
        bgColor: s.hasReview ? '#FF8C00' : '#9E9E9E',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        padding: 6,
        fontSize: 11,
        anchorX: -20,
        anchorY: -40,
        textAlign: 'center'
      },
      callout: {
        content: `${s.name}\n人均 ¥${s.avgPrice} · ${s.distanceText}\n${s.hasReview ? '✅ 有真实评价' : '暂无真实评价'}`,
        color: '#333333',
        bgColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        width: 180,
        display: 'BYCLICK'
      }
    }));

    this.setData({ markers });
  },

  // 探索完整地图 开关
  onExploreChange(e) {
    this.setData({ exploreAll: e.detail.value });
    this.renderMarkers();
    wx.showToast({
      title: e.detail.value ? '已展示全部店铺' : '仅展示有评价店铺',
      icon: 'none',
      duration: 1200
    });
  },

  // 搜索
  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearchConfirm() {
    const kw = (this.data.keyword || '').trim();
    if (!kw) return;
    const target = shops.find(
      (s) => s.name.indexOf(kw) > -1 || s.category.indexOf(kw) > -1
    );
    if (target) {
      this.setData({
        latitude: target.latitude,
        longitude: target.longitude,
        exploreAll: true
      });
      this.renderMarkers();
      wx.showToast({ title: `已定位：${target.name}`, icon: 'none' });
    } else {
      wx.showToast({ title: '没找到相关店铺~', icon: 'none' });
    }
  },

  // 点击 marker：地图居中到该店铺
  onMarkerTap(e) {
    const markerId = e.detail.markerId;
    const target = shops.find((s) => s.id === markerId);
    if (target) {
      this.setData({ latitude: target.latitude, longitude: target.longitude });
    }
  },

  onRegionChange() {
    // 地图视野变化预留（后续接入定位/联动）
  }
})
