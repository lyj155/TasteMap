// pages/profile/profile.js 我的
const { loadProfile, saveProfile, uploadAvatar } = require('../../utils/user.js');

// 未登录时的默认资料
const DEFAULT_PROFILE = {
  nick: '干饭人',
  sign: '该用户的个性签名为空',
  avatar: ''
};

Page({
  data: {
    user: { ...DEFAULT_PROFILE },
    isLogged: false,
    showEdit: false,
    saving: false,
    // 弹窗草稿
    draft: { nick: '', sign: '', avatar: '' },
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

  onShow() {
    // 同步自定义 tabBar 选中态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
    // 读取用户资料：云数据库优先，本地缓存兜底
    this.initProfile();
  },

  async initProfile() {
    try {
      const profile = await loadProfile();
      if (profile) {
        this.setData({ user: profile, isLogged: true });
      } else {
        this.setData({ user: { ...DEFAULT_PROFILE }, isLogged: false });
      }
    } catch (e) {
      console.warn('读取用户资料失败', e);
    }
  },

  // ===== 登录 / 编辑资料 =====
  onGoLogin() {
    this.openEditModal();
  },

  onEditProfile() {
    this.openEditModal();
  },

  openEditModal() {
    const u = this.data.user;
    this.setData({
      showEdit: true,
      draft: { nick: u.nick, sign: u.sign, avatar: u.avatar }
    });
  },

  onCloseEdit() {
    this.setData({ showEdit: false });
  },

  // 阻止点击弹窗内容冒泡到遮罩层
  preventTap() {},

  // 选择微信头像（官方头像填写能力，返回临时路径）
  onChooseAvatar(e) {
    this.setData({ 'draft.avatar': e.detail.avatarUrl });
  },

  onNickInput(e) {
    this.setData({ 'draft.nick': e.detail.value });
  },

  // type=nickname 输入框失焦时微信会回填推荐昵称，需同步
  onNickBlur(e) {
    if (e.detail.value) {
      this.setData({ 'draft.nick': e.detail.value });
    }
  },

  onSignInput(e) {
    this.setData({ 'draft.sign': e.detail.value });
  },

  // 保存资料：头像上传云存储 → 本地+云端保存
  async onSaveProfile() {
    if (this.data.saving) return;
    const d = this.data.draft;
    const nick = (d.nick || '').trim();
    if (!nick) {
      wx.showToast({ title: '请填写昵称', icon: 'none' });
      return;
    }

    this.setData({ saving: true });
    wx.showLoading({ title: '保存中' });
    try {
      // 临时路径的本地图片需上传云存储，换成 fileID 后所有用户设备都能显示
      let avatar = d.avatar;
      if (avatar && avatar.indexOf('cloud://') !== 0 && avatar.indexOf('https://') !== 0) {
        avatar = await uploadAvatar(avatar);
      }
      const profile = {
        nick,
        sign: (d.sign || '').trim() || '该用户的个性签名为空',
        avatar: avatar || ''
      };
      await saveProfile(profile);
      this.setData({ user: profile, isLogged: true, showEdit: false, saving: false });
      wx.hideLoading();
      wx.showToast({ title: '已保存', icon: 'success' });
    } catch (e) {
      wx.hideLoading();
      this.setData({ saving: false });
      wx.showToast({ title: '云端保存失败，请检查云开发环境', icon: 'none' });
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
