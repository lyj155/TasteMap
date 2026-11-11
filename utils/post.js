/**
 * utils/post.js 帖子发布与查询接口（预留）
 *
 * 当前为 Mock 实现；接入云开发时，只需把标注 TODO 的部分
 * 替换为 wx.cloud.database() 的真实读写，页面代码无需改动。
 *
 * 约定：帖子必须带店铺定位（located 恒为 true，location 为发帖时真实坐标），
 * 首页地图据此以橙色图标展示有帖子的店铺。
 */
const { posts, CAMPUS_CENTER } = require('./data.js');

// 已发布帖子（Mock：保存在内存，本次会话内“发现”页可见；
// TODO: 接入云开发后由 posts 集合查询替代）
const publishedPosts = [];

/**
 * 计算帖子定位与校园中心的距离文本
 */
function calcDistanceText(location) {
  const rad = Math.PI / 180;
  const R = 6371000; // 地球半径（米）
  const dLat = (location.latitude - CAMPUS_CENTER.latitude) * rad;
  const dLng = (location.longitude - CAMPUS_CENTER.longitude) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(CAMPUS_CENTER.latitude * rad) *
      Math.cos(location.latitude * rad) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const d = 2 * R * Math.asin(Math.sqrt(a));
  return d >= 1000 ? `${(d / 1000).toFixed(1)}km` : `${Math.round(d)}m`;
}

/**
 * 获取当前登录用户的昵称/头像（用于帖子作者信息展示）
 * TODO: 接入云开发后改为按 openid 查询 users 集合
 */
function getAuthorProfile() {
  return wx.getStorageSync('tastemap_user_profile') || {
    nick: '干饭人',
    avatar: ''
  };
}

/**
 * 上传帖子图片到云存储
 * TODO: 接入云开发后启用
 * @param {string[]} tempFiles 本地临时路径数组
 * @returns {Promise<string[]>} fileID 数组
 */
async function uploadPostImages(tempFiles) {
  if (!tempFiles || tempFiles.length === 0) return [];
  // TODO: 接入云开发后替换为真实上传
  // return Promise.all(tempFiles.map((filePath) => {
  //   const ext = filePath.slice(filePath.lastIndexOf('.') + 1) || 'png';
  //   const cloudPath = `posts/${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
  //   return wx.cloud.uploadFile({ cloudPath, filePath }).then((res) => res.fileID);
  // }));
  return tempFiles;
}

/**
 * 发布帖子（Mock：延时返回成功）
 * TODO: 接入云开发后替换为：
 *   return await wx.cloud.database().collection('posts').add({ data: record });
 * 集合权限建议：所有用户可读，仅创建者可写
 *
 * @param {Object} params
 * @param {string} params.title 标题（必填）
 * @param {string} params.content 正文（必填）
 * @param {string[]} params.images 本地图片临时路径
 * @param {Object} params.shop 关联店铺对象 { id, name, ... }（必填）
 * @param {Object} params.location 发帖时的定位 { latitude, longitude }（必填）
 * @param {string} params.postType 'review' | 'post'
 */
async function createPost({ title, content, images, shop, location, postType }) {
  const files = await uploadPostImages(images);

  // 待写入数据库的完整记录结构（与云数据库 posts 集合字段约定一致）
  const record = {
    title,
    content,
    images: files,          // 云存储 fileID 数组
    shopId: shop ? shop.id : null,      // 关联店铺（预留，可为空）
    shopName: shop ? shop.name : '',
    located: true,          // 帖子必带店铺定位
    location,               // 发帖时的真实坐标 { latitude, longitude }
    postType,               // 'review' 评价 | 'post' 帖子
    createTime: Date.now()
    // TODO: 接入云开发后由 _openid 自动标识作者，
    // 显示时可联表 users 集合取作者昵称与头像
  };

  // Mock：模拟网络延时
  await new Promise((resolve) => setTimeout(resolve, 500));
  const created = { ...record, id: Date.now() };

  // 组装与“发现”页卡片结构一致的展示数据，插入列表最前
  const author = getAuthorProfile();
  publishedPosts.unshift({
    id: created.id,
    title,
    cover: files[0] || `https://picsum.photos/seed/newpost${created.id}/640/600`,
    user: {
      nick: author.nick,
      avatar: author.avatar || 'https://picsum.photos/seed/lin/80/80'
    },
    shopName: record.shopName || '地图选点',
    distanceText: calcDistanceText(location),
    likes: 0,
    tags: ['附近'],
    located: true,
    location,
    postType
  });

  return created;
}

/**
 * 查询帖子列表
 * TODO: 接入云开发后替换为数据库查询，支持按标签/店铺/距离筛选
 * @param {Object} filter { shopId, postType, tag }
 * @returns {Promise<Object[]>}
 */
async function fetchPosts(filter = {}) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // 已发布的帖子在前，Mock 数据在后
  // TODO: 接入云开发后替换为 collection('posts').orderBy('createTime', 'desc').get()
  let list = [...publishedPosts, ...posts];
  if (filter.shopId) {
    list = list.filter((p) => p.shopId === filter.shopId);
  }
  if (filter.postType) {
    list = list.filter((p) => p.postType === filter.postType);
  }
  if (filter.tag) {
    list = list.filter((p) => p.tags.includes(filter.tag));
  }
  return list;
}

module.exports = { createPost, fetchPosts, uploadPostImages };
