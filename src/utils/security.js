// Мама я безопасник

module.exports = {
    generateSessionToken: () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    isUInt(value) {
        return /^\d+$/.test(value) && parseInt(value) > 0;
    },
    isValidMonth(value) {
        return /^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) < 13;
    },
    isValidYear(value) {
        return /^\d+$/.test(value) && parseInt(value) > 0;
    },
    sanitizeString(string) {
        return string.replace(/[^a-zA-Z0-9]/g, '');
    }
}