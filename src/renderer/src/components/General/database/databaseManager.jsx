const sqlite = require('better-sqlite3-with-prebuilds');
const sqlDb = new sqlite("./text.db");
exports.db = sqlDb;