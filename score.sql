DROP TABLE IF EXISTS high_scores;

CREATE TABLE high_scores (
  score_id SERIAL PRIMARY KEY,
  score INT NOT NULL,
  player_name VARCHAR(255) NOT NULL,
  data_achieved TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
