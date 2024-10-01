const mysql = require('mysql2/promise');
const dbModel = require('./dbModel');

class Database {
  constructor(config) {
    this.config = config;
    this.initialized = this.initializeDatabase();
  }
  async getConnection() {
    // Make sure the database is initialized before trying to get a connection.
    await this.initialized;
    return this._getConnection();
  }

  async _getConnection(setUse = true) {
    const connection = await mysql.createConnection({
      host: this.config.db.host,
      user: this.config.db.user,
      password: this.config.db.password,
      connectTimeout: this.config.db.connectTimeout,
      decimalNumbers: true,
    });
    if (setUse) {
      await connection.query(`USE ${this.config.db.database}`);
    }
    return connection;
  }

  async checkDatabaseExists(connection) {
    const [rows] = await connection.execute(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [this.config.db.database]);
    return rows.length > 0;
  }

  async initializeDatabase() {
    try {
      const connection = await this._getConnection(false);
      try {
        const dbExists = await this.checkDatabaseExists(connection);
        console.log(dbExists ? 'Database exists' : 'Database does not exist');

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${this.config.db.database}`);
        await connection.query(`USE ${this.config.db.database}`);
        if (!dbExists) {
          for (const statement of dbModel) {
            await connection.query(statement);
          }
        }
      } finally {
        connection.end();
      }
    } catch (err) {
      console.error(JSON.stringify({ message: 'Error initializing database', exception: err.message }));
    }
  }

  async query(querySQL) {
    const connection = await this.getConnection();
    try {
      const [rows] = await connection.query(querySQL);
      return rows;
    } catch (err) {
      return err;
    } finally {
      connection.end();
    }
  }
}

module.exports = Database;
