const sqlite = require('./database')
const { v4: uuidv4 } = require('uuid');
let db = sqlite.sqliteInit('test1.db');

// sqlite.createTable(db, 'hh', ['id', 'name', 'path'])

// sqlite.insertTable(db, 'hh', ['id', 'name', 'path'], [2, '你好', 'aaa'])

console.log(sqlite.selectTable(db, 'hh', ['id', 'name', 'path'], [2, '你好', 'aaa']))
// sqlite.selectTable(db, 'hh', ['id', 'name', 'path']).then(result=>console.log(result))
// sqlite.selectTableCount(db, 'hh').then(result=>console.log(result))

// sqlite.closeTable(db);

// console.log(uuidv4())