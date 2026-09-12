CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('team_member', 'manager') NOT NULL DEFAULT 'team_member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_id INT NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  status ENUM('draft', 'submitted', 'needs_correction', 'approved') NOT NULL DEFAULT 'draft',
  notes TEXT,
  latest_comment TEXT,
  version_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  task_name VARCHAR(200) NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  planned_percent INT DEFAULT 0,
  actual_percent INT DEFAULT 0,
  status ENUM('not_started', 'in_progress', 'done') DEFAULT 'not_started',
  time_planned_hours DECIMAL(5,2) DEFAULT 0,
  time_spent_hours DECIMAL(5,2) DEFAULT 0,
  output TEXT,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE blockers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  description TEXT NOT NULL,
  is_key BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  description TEXT NOT NULL,
  is_key BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE next_week_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE hours_by_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  task_type VARCHAR(50) NOT NULL,
  hours DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE report_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  action ENUM('approved', 'requested_changes') NOT NULL,
  comment TEXT,
  reviewed_version INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id)
);