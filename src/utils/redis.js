const { createClient } = require("redis");
let client;

module.exports = {
    add: async (key, value) => {
        if (typeof value === "object") value = JSON.stringify(value);
        await client.set(key, value);
    },
    get: async (key) => {
        const value = await client.get(key);
        if (value) return JSON.parse(value);
        return null;
    },
    remove: async (key) => {
        await client.del(key);
    },
    connect: (url) => {
        if (client) return;
        client = createClient({
            url: url
        });
        client.connect()
            .then(() => console.log("Redis connected"))
            .catch((err) => console.log(err));
    }
}