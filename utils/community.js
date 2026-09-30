const mock = require('../services/mock');

const POSTS_KEY = 'communityPosts';
const LIKES_KEY = 'communityLikes';
const FOLLOWS_KEY = 'communityFollows';

const getUserPosts = () => wx.getStorageSync(POSTS_KEY) || [];

const getAllPosts = () => {
  const userPosts = getUserPosts();
  const mockIds = new Set(mock.COMMUNITY_POSTS.map(p => p.id));
  const uniqueUser = userPosts.filter(p => !mockIds.has(p.id));
  return [...uniqueUser, ...mock.COMMUNITY_POSTS];
};

const getPostById = (id) => {
  const numId = Number(id);
  return getAllPosts().find(p => p.id === numId) || mock.getCommunityPostById(numId);
};

const savePost = (post) => {
  const list = getUserPosts();
  list.unshift(post);
  wx.setStorageSync(POSTS_KEY, list);
};

const getCommentsKey = (postId) => `communityComments_${postId}`;

const getComments = (postId) => wx.getStorageSync(getCommentsKey(postId)) || [];

const addComment = (postId, comment) => {
  const list = getComments(postId);
  list.push(comment);
  wx.setStorageSync(getCommentsKey(postId), list);
  return list;
};

const getLikes = () => wx.getStorageSync(LIKES_KEY) || [];

const isLiked = (postId) => getLikes().includes(Number(postId));

const toggleLike = (postId) => {
  const id = Number(postId);
  let likes = getLikes();
  const liked = likes.includes(id);
  if (liked) likes = likes.filter(i => i !== id);
  else likes.push(id);
  wx.setStorageSync(LIKES_KEY, likes);
  return !liked;
};

const isFollowing = (author) => {
  const list = wx.getStorageSync(FOLLOWS_KEY) || [];
  return list.includes(author);
};

const toggleFollow = (author) => {
  let list = wx.getStorageSync(FOLLOWS_KEY) || [];
  const following = list.includes(author);
  if (following) list = list.filter((name) => name !== author);
  else list.push(author);
  wx.setStorageSync(FOLLOWS_KEY, list);
  return !following;
};

const splitWaterfall = (list) => {
  const left = [];
  const right = [];
  list.forEach((item, index) => {
    if (index % 2 === 0) left.push(item);
    else right.push(item);
  });
  return { left, right };
};

module.exports = {
  getAllPosts,
  getPostById,
  savePost,
  getComments,
  addComment,
  isLiked,
  toggleLike,
  isFollowing,
  toggleFollow,
  splitWaterfall
};
