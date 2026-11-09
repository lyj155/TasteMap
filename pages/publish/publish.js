// pages/publish/publish.js 发布页（中间"+"按钮跳转目标）
const { shops } = require('../../utils/data.js');

Page({
  data: {
    type: 0, // 0=发评价 1=发帖子
    title: '',
    content: '',
    images: [],
    shopNames: shops.map((s) => s.name),
    shopIndex: -1
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

  onShopPick(e) {
    this.setData({ shopIndex: Number(e.detail.value) });
  },

  // 提交（Mock：校验后返回）
  onSubmit() {
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请填写标题', icon: 'none' });
      return;
    }
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请填写正文内容', icon: 'none' });
      return;
    }

    // TODO: 接入云开发后，改为写入 posts / reviews 集合
    wx.showLoading({ title: '发布中' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 800);
    }, 600);
  }
})
