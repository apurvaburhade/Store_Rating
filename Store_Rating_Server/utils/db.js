const mysql2 = require('mysql2')

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'w3_93020_Apurva',
    password: 'manager',
    database: 'store'
})

module.exports = pool