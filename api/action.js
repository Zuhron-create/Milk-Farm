let tonConnectUI = null;

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://tonconnect.org/manifest.json',

        buttonRootId: null
    });

    // Слушатель изменения статуса подключения
    tonConnectUI.onStatusChange(walletInfo => {
        if (walletInfo) {
            // Получаем реальный адрес кошелька
            let rawAddress = walletInfo.account.address;
            // Красиво сокращаем адрес (первые 4 и последние 4 символа)
            walletAddress = rawAddress.slice(0, 4) + '...' + rawAddress.slice(-4);
            saveGame();
            updateUI();
            alert("Кошелек успешно подключен: " + walletAddress);
        } else {
            walletAddress = "";
            saveGame();
            updateUI();
        }
    });
});

// Вызов окна подключения при нажатии на кнопку
async function connectWallet() {
    try {
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect();
        } else {
            await tonConnectUI.openModal();
        }
    } catch (error) {
        console.error(error);
        alert("Ошибка подключения кошелька");
    }
}
// Инициализация рекламного блока с твоим UnitID
const adController = Adsgram.init({ blockId: "48608" });

function watchAdForMilk() {
    adController.show().then((result) => {
        // Реклама успешно просмотрена до конца
        if (result.done) {
            // Добавляем +5 молока игроку
            addMilk(5); 
            alert("Бонус получен! +5 молока добавлено на ферму.");
        }
    }).catch((result) => {
        // Ошибка или пользователь закрыл рекламу досрочно
        console.log("Ad error", result);
        alert("Реклама не была досмотрена, бонус не начислен.");
    });
}
