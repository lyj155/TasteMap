// app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      return;
    }
    // TODO: 替换为你自己的云开发环境 ID（微信开发者工具 - 云开发控制台可查看）
    wx.cloud.init({
      env: 'tastemap-d5gatucm3ff90ddc5',
      traceUser: true
    });

    // 获取openid（示例云函数调用）
    wx.cloud.callFunction({
      name: 'login',
      success: (res) => {
        this.globalData.openid = res.result.openid;
      },
      fail: (err) => {
        console.warn('云函数 login 调用失败（Mock模式下可忽略）', err);
      }
    });
  },

  globalData: {
    openid: '',
    userInfo: null
  }
})
