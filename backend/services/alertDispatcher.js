const { sendUrgentEmail } = require('./email.service');
const { sendTelegramAlert } = require('./telegram.service');

// Har bir kanal mustaqil ravishda xato berishi mumkin (Telegram/SMTP tushib qolishi) -
// shuning uchun har biri o'z ichida catch qilinadi va asosiy so'rovni to'xtatmaydi.
const dispatchUrgentAlert = async ({ io, startup, title, message, recipients = [] }) => {
  io?.to(`startup:${startup._id}`).emit('urgentAlert', { startupId: startup._id, title, message });

  if (startup.telegramChatId) {
    sendTelegramAlert(startup.telegramChatId, `*${title}*\n${message}`).catch((err) =>
      console.error('Telegram alert failed:', err.message)
    );
  }

  recipients
    .filter((u) => u?.email)
    .forEach((u) => {
      sendUrgentEmail({ to: u.email, subject: title, html: `<p>${message}</p>` }).catch((err) =>
        console.error('Email alert failed:', err.message)
      );
    });
};

module.exports = { dispatchUrgentAlert };
