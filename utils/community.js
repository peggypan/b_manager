const mock = require('../services/mock');

const POSTS_KEY = 'communityPosts';
const LIKES_KEY = 'communityLikes';
const FOLLOWS_KEY = 'communityFollows';

const getUserPosts = () => wx.getStorageSync(POSTS_KEY) || [];

const getAllPosts = () => {
  const userPosts = getUserPosts();
  const mockIds = new Set(mock.COMMUNITY_POSTS.map(p => p.id));
  const uniqueUser = userPosts.filter(
    (p) => !mockIds.has(p.id) && p.status !== 'offline',
  );
  return [...uniqueUser, ...mock.COMMUNITY_POSTS];
};

const getUserPostById = (postId) =>
  getUserPosts().find((p) => p.id === Number(postId));

const updatePost = (postId, patch) => {
  const id = Number(postId);
  const list = getUserPosts().map((p) =>
    p.id === id ? { ...p, ...patch, status: patch.status || 'published' } : p,
  );
  wx.setStorageSync(POSTS_KEY, list);
  return list.find((p) => p.id === id);
};

const setPostOffline = (postId) => updatePost(postId, { status: 'offline' });

const getPostById = (id) => {
  const numId = Number(id);
  return getAllPosts().find(p => p.id === numId) || mock.getCommunityPostById(numId);
};

const savePost = (post) => {
  const list = getUserPosts();
  list.unshift({ ...post, status: post.status || 'published' });
  wx.setStorageSync(POSTS_KEY, list);
};

const isUserPostId = (postId) => getUserPosts().some((p) => p.id === Number(postId));

const getCommentsKey = (postId) => `communityComments_${postId}`;

const getComments = (postId) => wx.getStorageSync(getCommentsKey(postId)) || [];

const addComment = (postId, comment) => {
  const list = getComments(postId);
  list.push(comment);
  wx.setStorageSync(getCommentsKey(postId), list);
  return list;
};

const deleteComment = (postId, commentId) => {
  const id = Number(commentId);
  const list = getComments(postId).filter((c) => Number(c.id) !== id);
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

const deletePost = (postId) => {
  const id = Number(postId);
  const list = getUserPosts().filter((p) => p.id !== id);
  wx.setStorageSync(POSTS_KEY, list);
  wx.removeStorageSync(getCommentsKey(id));
  const likes = getLikes().filter((i) => i !== id);
  wx.setStorageSync(LIKES_KEY, likes);
  return true;
};

const isFollowing = (author) => {
  const list = wx.getStorageSync(FOLLOWS_KEY) || [];
  return list.includes(author);
};

const getFollowList = () => wx.getStorageSync(FOLLOWS_KEY) || [];

const toggleFollow = (author) => {
  let list = getFollowList();
  const following = list.includes(author);
  if (following) list = list.filter((name) => name !== author);
  else list.push(author);
  wx.setStorageSync(FOLLOWS_KEY, list);
  return !following;
};

const markPostsOwnership = (posts) => {
  const owned = new Set(getUserPosts().map((p) => p.id));
  return posts.map((p) => ({ ...p, isMine: owned.has(p.id) }));
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
  getUserPosts,
  getUserPostById,
  getAllPosts,
  getPostById,
  savePost,
  updatePost,
  setPostOffline,
  deletePost,
  isUserPostId,
  getComments,
  addComment,
  deleteComment,
  isLiked,
  toggleLike,
  getFollowList,
  isFollowing,
  toggleFollow,
  markPostsOwnership,
  splitWaterfall,
};
