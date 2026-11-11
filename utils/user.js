// utils/user.js 用户信息存取：云数据库 users 集合为主，本地缓存兜底
const COLLECTION = 'users';
const LOCAL_KEY = 'tastemap_user_profile';

const db = () => wx.cloud.database();

// 本地缓存
function getLocal() {
  return wx.getStorageSync(LOCAL_KEY) || null;
}

function setLocal(profile) {
  try {
    wx.setStorageSync(LOCAL_KEY, profile);
  } catch (e) {
    console.warn('本地缓存写入失败', e);
  }
}

// 获取 openid（app.js 启动时已在拉取，这里兜底再取一次）
async function getOpenid() {
  const app = getApp();
  if (app.globalData.openid) return app.globalData.openid;
  const res = await wx.cloud.callFunction({ name: 'login' });
  app.globalData.openid = res.result.openid;
  return app.globalData.openid;
}

/**
 * 读取用户资料
 * 返回 null 表示从未登录过（显示"干饭人"默认态）
 */
async function loadProfile() {
  let profile = getLocal();
  try {
    const openid = await getOpenid();
    const res = await db().collection(COLLECTION)
      .where({ _openid: openid })
      .limit(1)
      .get();
    if (res.data.length > 0) {
      profile = {
        nick: res.data[0].nick,
        sign: res.data[0].sign,
        avatar: res.data[0].avatar || ''
      };
      setLocal(profile);
    }
  } catch (e) {
    console.warn('云端读取用户信息失败，使用本地缓存', e);
  }
  return profile;
}

/**
 * 保存用户资料（本地 + 云端）
 * 云端失败时本地已保存，抛出异常由调用方提示
 */
async function saveProfile(profile) {
  setLocal(profile);
  try {
    const openid = await getOpenid();
    const res = await db().collection(COLLECTION)
      .where({ _openid: openid })
      .limit(1)
      .get();
    if (res.data.length > 0) {
      await db().collection(COLLECTION).doc(res.data[0]._id).update({ data: profile });
    } else {
      // add() 会自动写入 _openid 字段
      await db().collection(COLLECTION).add({ data: profile });
    }
  } catch (e) {
    console.warn('云端保存用户信息失败（本地已保存）', e);
    throw e;
  }
}

// 上传头像到云存储，返回 fileID（其他用户设备可通过 fileID 显示）
async function uploadAvatar(filePath) {
  const ext = filePath.slice(filePath.lastIndexOf('.') + 1) || 'png';
  const cloudPath = `avatars/${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
  const res = await wx.cloud.uploadFile({ cloudPath, filePath });
  return res.fileID;
}

module.exports = { loadProfile, saveProfile, uploadAvatar };
