const sqlite3 = require('sqlite3');
function sqliteInit(dbName){
    let database = new sqlite3.Database(dbName);
    return database;
}
function createTable(dbName, tableName, fieldName){
    dbName.run(`create table if not exists ${tableName}(${fieldName.toString()})`)
}
function insertTable(dbName, tableName, fieldName, fieldValue){
    if(!Array.isArray(fieldValue)){
        return '请传递由值构成的数组'
    }
    let valueLocation = ''
    for(let i=0;i<fieldName.length;i++){
        valueLocation = valueLocation + '?,'
    }
    valueLocation = valueLocation.slice(0, valueLocation.length-1)
    dbName.run(`insert into  ${tableName}(${fieldName.toString()}) values(${valueLocation})`, fieldValue);
}
function selectTable(dbName, tableName, fieldName, fieldValue){
    let selectSQL = '';
    for(let i=0;i<fieldName.length;i++){
        selectSQL = selectSQL +  fieldName[i]+ '='+ "'" +fieldValue[i]+ "'" +' AND '
    }
    selectSQL = selectSQL.slice(0, selectSQL.length-5)
    return new Promise((resolve, reject)=>{
        dbName.get(`select * from ${tableName} WHERE ${selectSQL}`, (err, rows) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}
function selectAllTable(dbName, tableName){
    return new Promise((resolve, reject)=>{
        dbName.all(`select * from ${tableName}`, (err, rows) => {
            if(err) reject(err);
            // rows.forEach(function (row) {
            //     console.log(row.name + ' ' + row.age);
            // });
            resolve(rows);
        });
    })
}
function selectTableCount(dbName, tableName){
    return new Promise((resolve, reject)=>{
        dbName.all(`select count(*) from ${tableName}`, (err, count) => {
            if(err) reject(err);
            resolve(count)
        });
    })
}
function deleteTable(dbName, tableName, fieldName, fieldValue){
    let deleteSQL = '';
    for(let i=0;i<fieldName.length;i++){
        deleteSQL = deleteSQL + fieldName[i]+'='+ "'" +fieldValue[i]+ "'" +' AND '
    }
    deleteSQL = deleteSQL.slice(0, deleteSQL.length-5)
    dbName.run(`DELETE FROM ${tableName} WHERE ${deleteSQL}`)
}
function closeTable(dbName){
    dbName.close();
}
module.exports = {
    sqliteInit,
    createTable,
    deleteTable,
    insertTable,
    selectTable,
    selectAllTable,
    selectTableCount,
    closeTable
}
// exports.sqliteInit = sqliteInit;
// exports.createTable = createTable;
// exports.insertTable = insertTable;
// exports.selectAllTable = selectAllTable;
// exports.selectTableCount = selectTableCount;
// exports.closeTable = closeTable;