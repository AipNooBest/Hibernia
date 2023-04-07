// Мама я безопасник

module.exports = {
    generateSessionToken() {
        return String(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    },
    isUInt(value) {
        return Boolean(/^\d+$/.test(value) && parseInt(value) > 0);
    },
    isValidMonth(value) {
        return Boolean(/^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) < 13);
    },
    isValidYear(value) {
        return Boolean(/^\d+$/.test(value) && parseInt(value) > 0);
    },
    sanitizeString(string) {
        return String(string.replace(/[^a-zA-Z0-9а-яА-ЯёЁ\- ]/g, ''));
    },
    sanitizeObject(object) {
        for (let key in object) {
            if (typeof object[key] === 'string')
                object[key] = this.sanitizeString(object[key]);
        }
        return object;
    }
}