// Мама я безопасник

module.exports = {
    generateSessionToken: () => {
        return crypto.randomBytes(32).toString('hex');
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