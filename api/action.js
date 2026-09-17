// Простая память-хранилище для теста (в продакшене лучше подключить MongoDB или Supabase)
const users = {};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, telegram_id } = req.body || {};

  if (!telegram_id) {
    return res.status(400).json({ error: "No telegram_id provided" });
  }

  // Инициализация пользователя, если его нет
  if (!users[telegram_id]) {
    users[telegram_id] = {
      milk_balance: 0,
      streak_day: 1,
      last_claim_date: null,
      wallet_address: null
    };
  }

  const user = users[telegram_id];
  const today = new Date().toISOString().split('T')[0];
  const STREAK_REWARDS = { 1: 5, 2: 10, 3: 20, 4: 30, 5: 40, 6: 50, 7: 70 };

  if (action === "get_user") {
    return res.status(200).json(user);
  }

  if (action === "daily_reward") {
    if (user.last_claim_date === today) {
      return res.status(400).json({ error: "Награда сегодня уже получена!" });
    }

    // Проверка на пропуск дня
    if (user.last_claim_date) {
      const lastDate = new Date(user.last_claim_date);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        user.streak_day = 1;
      }
    }

    const reward = STREAK_REWARDS[user.streak_day] || 5;
    user.milk_balance += reward;
    user.last_claim_date = today;

    const currentStreak = user.streak_day;
    user.streak_day = user.streak_day < 7 ? user.streak_day + 1 : 1;

    return res.status(200).json({
      success: true,
      reward,
      new_balance: user.milk_balance,
      next_streak: user.streak_day
    });
  }

  if (action === "watch_ad") {
    user.milk_balance += 5;
    return res.status(200).json({ success: true, added: 5, new_balance: user.milk_balance });
  }

  if (action === "update_wallet") {
    user.wallet_address = req.body.wallet_address;
    return res.status(200).json({ success: true, wallet_address: user.wallet_address });
  }

  return res.status(400).json({ error: "Unknown action" });
}
