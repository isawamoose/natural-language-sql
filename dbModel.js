const model = [
  `
    CREATE TABLE Runner (
        runner_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        height_meters DECIMAL(5,2),
        weight_kilos DECIMAL(5,2)
    );
`,
  `
    CREATE TABLE Race (
        race_id INT AUTO_INCREMENT PRIMARY KEY,
        runner_id INT NOT NULL,
        race_time TIME NOT NULL, 
        distance_meters SMALLINT UNSIGNED NOT NULL,
        race_date DATE NOT NULL,
        FOREIGN KEY (runner_id) REFERENCES Runner(runner_id)
    );`,
];

module.exports = model;
