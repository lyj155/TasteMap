// pages/index/index.js 首页：校园美食地图
const { CAMPUS_CENTER, shops } = require('../../utils/data.js');
const { fetchPosts } = require('../../utils/post.js');

Page({
  data: {
    latitude: CAMPUS_CENTER.latitude,
    longitude: CAMPUS_CENTER.longitude,
    markers: [],
    keyword: '',
    exploreAll: false, // 关：只看有帖子的店；开：探索完整地图
    located: false,    // 是否已获取用户位置（false 时显示模糊遮罩）
    locating: true,    // 正在定位中
    allPosts: []       // 全部帖子（含刚发布的，用于生成橙色标记点）
  },

  onLoad() {
    // 进入首页即请求定位：系统底部授权弹窗会自动弹出
    this.locateUser();
  },

  // 获取用户位置，成功后地图居中到用户附近
  locateUser() {
    this.setData({ locating: true });
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          located: true,
          locating: false
        });
        // 移动地图视野到用户位置
        const mapCtx = wx.createMapContext('campusMap', this);
        mapCtx.moveToLocation({ latitude: res.latitude, longitude: res.longitude });
      },
      fail: () => {
        // 用户拒绝授权或定位失败：停留在遮罩页，提供去授权入口
        this.setData({ locating: false, located: false });
      }
    });
  },

  // 遮罩页“去授权”：打开授权设置页，勾选位置权限后回到地图
  onRetryLocation() {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          this.locateUser();
        }
      }
    });
  },

  // 同步自定义 tabBar 选中态；每次进入刷新帖子（发帖后新橙色标记点立即可见）
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    this.loadPosts();
  },

  // 拉取帖子列表后渲染标记点
  async loadPosts() {
    const list = await fetchPosts();
    this.setData({ allPosts: list });
    this.renderMarkers();
  },

  // 生成地图 markers：
  // 橙色 = 有带定位帖子的店铺 / 帖子自身的定位点（默认显示）
  // 灰色 = 没有帖子的店铺（打开“探索完整地图”后才显示）
  renderMarkers() {
    const { exploreAll, allPosts } = this.data;

    // 收集所有带定位的帖子关联的店铺名
    const postedShopNames = new Set(
      allPosts.filter((p) => p.located && p.shopName).map((p) => p.shopName)
    );

    // 店铺标记点：默认只显示橙色店铺；打开开关后全部店铺一起显示
    const shopList = exploreAll
      ? shops
      : shops.filter((s) => postedShopNames.has(s.name));

    const shopMarkers = shopList.map((s) => {
      const hasPost = postedShopNames.has(s.name);
      return {
        id: s.id,
        latitude: s.latitude,
        longitude: s.longitude,
        width: 28,
        height: 36,
        label: {
          content: s.name,
          color: '#FFFFFF',
          bgColor: hasPost ? '#FF8C00' : '#9E9E9E',
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
          content: `${s.name}\n人均 ¥${s.avgPrice} · ${s.distanceText}\n${hasPost ? '✅ 有真实体验帖' : '暂无帖子 · 探索完整地图可见'}`,
          color: '#333333',
          bgColor: '#FFFFFF',
          borderRadius: 12,
          padding: 10,
          width: 180,
          display: 'BYCLICK'
        }
      };
    });

    // 帖子标记点：按帖子自身 location 坐标生成橙色标记
    // （未关联到 shops 店铺的新发帖子，也立即在地图上出现）
    const postMarkers = allPosts
      .filter((p) => p.located && p.location && p.location.latitude && !postedShopNames.has(p.shopName))
      .map((p) => {
        const title = p.title.length > 10 ? `${p.title.slice(0, 10)}…` : p.title;
        return {
          id: 100000 + p.id, // 与店铺 id（1~8）区分开
          latitude: p.location.latitude,
          longitude: p.location.longitude,
          width: 28,
          height: 36,
          label: {
            content: `✨${title}`,
            color: '#FFFFFF',
            bgColor: '#FF8C00',
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
            content: `${p.title}\n❤ ${p.likes} · ${p.distanceText}`,
            color: '#333333',
            bgColor: '#FFFFFF',
            borderRadius: 12,
            padding: 10,
            width: 200,
            display: 'BYCLICK'
          }
        };
      });

    this.setData({ markers: [...shopMarkers, ...postMarkers] });
  },

  // 探索完整地图 开关：开启后灰色（无帖子）店铺一起显示
  onExploreChange(e) {
    this.setData({ exploreAll: e.detail.value });
    this.renderMarkers();
    wx.showToast({
      title: e.detail.value ? '已显示全部店铺' : '仅展示有真实体验帖的店铺',
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

  // 点击 marker：地图居中到该店铺；帖子标记点则提示帖子信息
  onMarkerTap(e) {
    const markerId = e.detail.markerId;
    const target = shops.find((s) => s.id === markerId);
    if (target) {
      this.setData({ latitude: target.latitude, longitude: target.longitude });
      return;
    }
    const post = this.data.allPosts.find((p) => 100000 + p.id === markerId);
    if (post) {
      wx.showModal({
        title: post.title,
        content: `${post.user.nick} 发布于 ${post.distanceText}\n${post.content || '点击“发现”查看完整内容'}`,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FF8C00'
      });
    }
  },

  onRegionChange() {
    // 地图视野变化预留（后续接入定位/联动）
  }
})
