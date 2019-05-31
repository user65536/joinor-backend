let mysql = require("mysql")

function createConnection() {
  let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'joiner',
    password: 'mysql'
  })
  return connection
}

function connect(sql, params) {
  params = params || [];
  return new Promise((resolve, reject) => {
    let connection = createConnection();
    connection.connect();
    connection.query(sql, params, (err, res) => {
      if(err) {
        reject(err)
        console.log(err)
      } else {
        resolve(res);
      }
    })
    connection.end();
  })
}

module.exports = {
  createConnection,
  connect
};