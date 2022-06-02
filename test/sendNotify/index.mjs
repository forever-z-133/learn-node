import notifyByWeChat from './utils/notifyByWeChat.mjs';

const run = (title = 'hello', content = 'content') => {
  notifyByWeChat(title, content);
};

run();
