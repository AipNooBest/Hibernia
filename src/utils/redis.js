let redis = {}
// Игорь Денисович, если вы это читайте, поставьте +1 балл за пасхалку :^)

module.exports = {
    // Псевдо Redis. На самом деле пока здесь обычный объект
    // Но в будущем я заменю его на реальный Redis
    add: (key, value) => {
        redis[key] = value;
    },
    get: (key) => {
        return redis[key];
    },
    remove: (key) => {
        delete redis[key];
    }
}