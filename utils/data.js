/**
 * utils/data.js
 * 全局 Mock 数据 —— 校园周边真实美食记录（示例坐标：某大学城）
 */

// 校园中心坐标
const CAMPUS_CENTER = {
  latitude: 23.0489,
  longitude: 113.3963
};

// 店铺数据（橙色/灰色由“是否有带定位的帖子”动态计算，见 pages/index/index.js）
const shops = [
  { id: 1, name: '老陈家牛肉面', category: '面馆', tags: ['一人食', '平价'], avgPrice: 15, distanceText: '150m', rating: 4.8, hasReview: true, latitude: 23.0501, longitude: 113.3975, cover: 'https://picsum.photos/seed/shop1/640/400' },
  { id: 2, name: '巷口麻辣烫', category: '小吃', tags: ['平价'], avgPrice: 18, distanceText: '230m', rating: 4.5, hasReview: true, latitude: 23.0482, longitude: 113.3988, cover: 'https://picsum.photos/seed/shop2/640/400' },
  { id: 3, name: '三个大学生奶茶', category: '饮品', tags: ['有插座'], avgPrice: 12, distanceText: '310m', rating: 4.2, hasReview: false, latitude: 23.0475, longitude: 113.3952, cover: 'https://picsum.photos/seed/shop3/640/400' },
  { id: 4, name: '黄焖鸡米饭', category: '快餐', tags: ['一人食', '平价'], avgPrice: 16, distanceText: '420m', rating: 4.3, hasReview: true, latitude: 23.0508, longitude: 113.3948, cover: 'https://picsum.photos/seed/shop4/640/400' },
  { id: 5, name: '深夜粥铺', category: '夜宵', tags: ['附近'], avgPrice: 14, distanceText: '560m', rating: 4.6, hasReview: false, latitude: 23.0471, longitude: 113.3979, cover: 'https://picsum.photos/seed/shop5/640/400' },
  { id: 6, name: '七点半烘焙', category: '甜品', tags: ['有插座'], avgPrice: 25, distanceText: '640m', rating: 4.7, hasReview: true, latitude: 23.0512, longitude: 113.3989, cover: 'https://picsum.photos/seed/shop6/640/400' },
  { id: 7, name: '兄弟烧烤', category: '烧烤', tags: ['附近'], avgPrice: 35, distanceText: '780m', rating: 4.4, hasReview: false, latitude: 23.0468, longitude: 113.3940, cover: 'https://picsum.photos/seed/shop7/640/400' },
  { id: 8, name: '学苑餐厅', category: '食堂', tags: ['平价'], avgPrice: 10, distanceText: '90m', rating: 4.9, hasReview: true, latitude: 23.0496, longitude: 113.3959, cover: 'https://picsum.photos/seed/shop8/640/400' }
];

// 发现页帖子数据
const posts = [
  {
    id: 1,
    located: true, // 是否带店铺定位（true = 该店铺在地图显示橙色图标）
    title: '晚课后这一碗牛肉面，热乎又满足',
    cover: 'https://picsum.photos/seed/post1/640/760',
    user: { nick: '林同学', avatar: 'https://picsum.photos/seed/lin/80/80' },
    shopName: '老陈家牛肉面',
    distanceText: '150m',
    likes: 328,
    tags: ['一人食', '平价']
  },
  {
    id: 2,
    located: false,
    title: '三块钱的糖水，是青春的味道',
    cover: 'https://picsum.photos/seed/post2/640/520',
    user: { nick: '阿茶不吃香菜', avatar: 'https://picsum.photos/seed/tea/80/80' },
    shopName: '甜姨糖水铺',
    distanceText: '350m',
    likes: 156,
    tags: ['平价', '附近']
  },
  {
    id: 3,
    located: true,
    title: '自习搭子的新据点：有插座还有窗户位',
    cover: 'https://picsum.photos/seed/post3/640/620',
    user: { nick: '早八战神', avatar: 'https://picsum.photos/seed/bagua/80/80' },
    shopName: '七点半烘焙',
    distanceText: '640m',
    likes: 489,
    tags: ['有插座']
  },
  {
    id: 4,
    located: true,
    title: '麻辣烫自由！称重小技巧快码住',
    cover: 'https://picsum.photos/seed/post4/640/540',
    user: { nick: '碳水脑袋', avatar: 'https://picsum.photos/seed/tanshui/80/80' },
    shopName: '巷口麻辣烫',
    distanceText: '230m',
    likes: 274,
    tags: ['平价', '一人食']
  },
  {
    id: 5,
    located: false,
    title: '深夜十二点的粥铺，治愈赶论文的胃',
    cover: 'https://picsum.photos/seed/post5/640/700',
    user: { nick: '秃头小学期', avatar: 'https://picsum.photos/seed/tutou/80/80' },
    shopName: '深夜粥铺',
    distanceText: '560m',
    likes: 92,
    tags: ['附近']
  },
  {
    id: 6,
    located: false,
    title: '烤馒头片一元一串，是烧烤摊的隐藏王牌',
    cover: 'https://picsum.photos/seed/post6/640/580',
    user: { nick: '夜宵委员', avatar: 'https://picsum.photos/seed/yexiao/80/80' },
    shopName: '兄弟烧烤',
    distanceText: '780m',
    likes: 433,
    tags: ['附近']
  },
  {
    id: 7,
    located: false,
    title: '黄焖鸡加土豆才是灵魂搭配，不接受反驳',
    cover: 'https://picsum.photos/seed/post7/640/660',
    user: { nick: '土豆狂魔', avatar: 'https://picsum.photos/seed/potato/80/80' },
    shopName: '黄焖鸡米饭',
    distanceText: '420m',
    likes: 187,
    tags: ['一人食', '平价']
  },
  {
    id: 8,
    located: true,
    title: '食堂三楼的阿姨手不抖，亲测有效',
    cover: 'https://picsum.photos/seed/post8/640/500',
    user: { nick: '干饭第一名', avatar: 'https://picsum.photos/seed/ganfan/80/80' },
    shopName: '学苑餐厅',
    distanceText: '90m',
    likes: 612,
    tags: ['平价', '附近']
  }
];

// 收藏页 - 收藏的店铺
const favoriteShops = [
  { id: 1, name: '老陈家牛肉面', cover: 'https://picsum.photos/seed/fshop1/640/400', avgPrice: 15, distanceText: '150m', tags: ['一人食', '平价'], rating: 4.8 },
  { id: 6, name: '七点半烘焙', cover: 'https://picsum.photos/seed/fshop6/640/400', avgPrice: 25, distanceText: '640m', tags: ['有插座'], rating: 4.7 },
  { id: 2, name: '巷口麻辣烫', cover: 'https://picsum.photos/seed/fshop2/640/400', avgPrice: 18, distanceText: '230m', tags: ['平价'], rating: 4.5 },
  { id: 8, name: '学苑餐厅', cover: 'https://picsum.photos/seed/fshop8/640/400', avgPrice: 10, distanceText: '90m', tags: ['平价'], rating: 4.9 }
];

// 收藏页 - 收藏的帖子
const favoritePosts = [posts[0], posts[2], posts[5], posts[7]];

module.exports = {
  CAMPUS_CENTER,
  shops,
  posts,
  favoriteShops,
  favoritePosts
};
