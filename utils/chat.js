/**
 * 在线沟通：会话列表 + 聊天页存储（接入 IM/云数据库后可替换实现）
 */
const SESSIONS_KEY = 'chat_sessions_v1';
const MSG_KEY_PREFIX = 'chat_msgs_v1_';

function readSessions() {
  try {
    return wx.getStorageSync(SESSIONS_KEY) || [];
  } catch (e) {
    return [];
  }
}

function writeSessions(list) {
  wx.setStorageSync(SESSIONS_KEY, list);
}

function getMessages(targetId) {
  try {
    return wx.getStorageSync(MSG_KEY_PREFIX + targetId) || [];
  } catch (e) {
    return [];
  }
}

function saveMessages(targetId, list) {
  wx.setStorageSync(MSG_KEY_PREFIX + targetId, list);
}

function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function upsertSession(session) {
  const list = readSessions().filter((s) => s.targetId !== session.targetId);
  list.unshift({
    ...session,
    updatedAt: session.updatedAt || Date.now(),
  });
  writeSessions(list.slice(0, 50));
}

function ensureWelcome(targetId, targetName) {
  const msgs = getMessages(targetId);
  if (msgs.length > 0) return msgs;
  const welcome = {
    id: `sys_${Date.now()}`,
    from: 'other',
    content: `您好，这里是「${targetName}」，请问有什么可以帮您？`,
    time: formatTime(new Date()),
    ts: Date.now(),
  };
  saveMessages(targetId, [welcome]);
  return [welcome];
}

function appendMessage(targetId, { from, content }) {
  const list = getMessages(targetId);
  const row = {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    from,
    content,
    time: formatTime(new Date()),
    ts: Date.now(),
  };
  list.push(row);
  saveMessages(targetId, list);
  return row;
}

/** 模拟对方回复（演示用） */
function mockReply(targetId, targetName, userText) {
  const replies = [
    '好的，收到，我们稍后详细回复您。',
    '感谢咨询，可以把您的具体需求（数量、规格）发一下吗？',
    '可以的，我们支持小批量试单，欢迎进一步沟通。',
  ];
  const pick = replies[userText.length % replies.length];
  setTimeout(() => {
    appendMessage(targetId, {
      from: 'other',
      content: `${targetName}：${pick}`,
    });
    const sessions = readSessions();
    const s = sessions.find((x) => x.targetId === targetId);
    if (s) {
      s.lastMessage = pick;
      s.updatedAt = Date.now();
      writeSessions(sessions);
    }
    const pages = getCurrentPages();
    const cur = pages[pages.length - 1];
    if (
      cur &&
      cur.route === 'pages/chat/chat' &&
      cur.data &&
      cur.data.targetId === targetId &&
      typeof cur.loadMessages === 'function'
    ) {
      cur.loadMessages();
    }
  }, 800);
}

function openChat({ targetId, targetName, targetType, subtitle }) {
  if (!targetId || !targetName) {
    wx.showToast({ title: '无法发起会话', icon: 'none' });
    return;
  }
  ensureWelcome(targetId, targetName);
  upsertSession({
    targetId,
    targetName,
    targetType: targetType || 'other',
    subtitle: subtitle || '',
    lastMessage: getMessages(targetId).slice(-1)[0]?.content || '',
  });
  const q = [
    `targetId=${encodeURIComponent(targetId)}`,
    `targetName=${encodeURIComponent(targetName)}`,
    `targetType=${encodeURIComponent(targetType || 'other')}`,
  ];
  if (subtitle) q.push(`subtitle=${encodeURIComponent(subtitle)}`);
  wx.navigateTo({ url: `/pages/chat/chat?${q.join('&')}` });
}

function listSessions() {
  return readSessions().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

module.exports = {
  openChat,
  getMessages,
  appendMessage,
  mockReply,
  upsertSession,
  listSessions,
  formatTime,
  ensureWelcome,
};
