const dbModel = require('./dbModel');

class GPT {
  constructor(config) {
    this.config = config;
    this.dbModelString = dbModel.join('\n');
  }
  async generateSQL(query) {
    const queryRequest = `Given the following mysql database: ${this.dbModelString}\n${query}\n Please return only the SQL statement.`;
    const response = await fetch(this.config.gpt.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.gpt.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: queryRequest }],
      }),
    });
    const data = await response.json();
    const gptSQL = data.choices[0].message.content;
    const sql = gptSQL
      .replace(/```sql\n|```/g, '')
      .replace(/\n\s*'/g, '')
      .replace(/\s*\+\s*'/g, '')
      .trim();
    return sql;
  }

  async interpretResult(query, result) {
    const queryRequest = `Given the following query: ${query} made to the following database: ${
      this.dbModelString
    }\nPlease give a short user-friendly version of these results: ${JSON.stringify(
      result
    )}. If there was an error, just state there was an error without explaining the error.`;
    const response = await fetch(this.config.gpt.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.gpt.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: queryRequest }],
      }),
    });
    const data = await response.json();
    const interpretedResult = data.choices[0].message.content;
    return interpretedResult;
  }
}

module.exports = GPT;
