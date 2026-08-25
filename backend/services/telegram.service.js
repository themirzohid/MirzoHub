const TelegramBot = require('node-telegram-bot-api');

// polling: false - bot faqat xabar yuborish uchun, buyruq qabul qilmaydi
const bot = process.env.TELEGRAM_BOT_TOKEN
  ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false })
  : null;

const sendTelegramAlert = async (chatId, text) => {
  if (!bot || !chatId) return;
  await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
};

module.exports = { sendTelegramAlert };
