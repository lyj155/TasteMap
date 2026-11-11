// pages/publish/publish.js 发布页（中间"+"按钮跳转目标）
// 规则：帖子必须带店铺定位（必选），未获取到定位不能发布
const { createPost } = require('../../utils/post.js');

Page({
  data: {
    type: 0, // 0=发评价 1=发帖子
    title: '',
    content: '',
    images: [],
    locating: false,   // 正在获取定位
    location: null,    // { latitude, longitude }，发帖必带
    locationText: ''   // 定位行的展示文案
  },

  onLoad() {
    // 进入发布页即获取当前定位
    this.acquireLocation();
  },

  // ===== 定位：发帖必选 =====
  acquireLocation() {
    this.setData({ locating: true });
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setLocation(res.latitude, res.longitude, '已获取当前位置');
      },
      fail: () => {
        this.setData({ locating: false, location: null });
      }
    });
  },

  // “去修改”：打开地图重新选择位置
  onRelocate() {
    wx.chooseLocation({
      success: (res) => {
        // 优先显示选中的地点名称，如“老陈家牛肉面”
        const text = res.name || res.address || '已选择自定义位置';
        this.setLocation(res.latitude, res.longitude, text);
      },
      fail: () => {
        // 用户取消选择，保留原定位
      }
    });
  },

  setLocation(latitude, longitude, text) {
    this.setData({
      location: { latitude, longitude },
      locationText: text,
      locating: false
    });
  },

  // 定位失败 → 打开授权设置页
  onOpenLocationSetting() {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          this.acquireLocation();
        }
      }
    });
  },

  onTypeChange(e) {
    this.setData({ type: Number(e.currentTarget.dataset.index) });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  // 选择图片（最多3张）
  onChooseImage() {
    const remain = 3 - this.data.images.length;
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImgs = res.tempFiles.map((f) => f.tempFilePath);
        this.setData({ images: this.data.images.concat(newImgs) });
      }
    });
  },

  onPreviewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    });
  },

  // 提交：定位必选
  async onSubmit() {
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请填写标题', icon: 'none' });
      return;
    }
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请填写正文内容', icon: 'none' });
      return;
    }
    if (!this.data.location) {
      wx.showToast({ title: '需要获取你的位置才能发布', icon: 'none' });
      this.onOpenLocationSetting();
      return;
    }

    wx.showLoading({ title: '发布中' });
    try {
      await createPost({
        title: this.data.title.trim(),
        content: this.data.content.trim(),
        images: this.data.images,
        shop: null,
        location: this.data.location,
        postType: this.data.type === 0 ? 'review' : 'post'
      });
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 800);
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '发布失败，请重试', icon: 'none' });
    }
  }
})
