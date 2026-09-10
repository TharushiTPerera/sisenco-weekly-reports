// This file connects our models to each other,
// so Sequelize knows how tables relate (one-to-many, etc.)

const Report = require('./Report');
const Task = require('./Task');
const Blocker = require('./Blocker');
const Achievement = require('./Achievement');
const NextWeekTask = require('./NextWeekTask');
const HoursByType = require('./HoursByType');
const User = require('./User');
const ReportReview = require('./ReportReview');
const Project = require('./Project');

Report.hasMany(ReportReview, { foreignKey: 'report_id' });
ReportReview.belongsTo(Report, { foreignKey: 'report_id' });

// One report has many of each of these
Report.hasMany(Task, { foreignKey: 'report_id' });
Report.hasMany(Blocker, { foreignKey: 'report_id' });
Report.hasMany(Achievement, { foreignKey: 'report_id' });
Report.hasMany(NextWeekTask, { foreignKey: 'report_id' });
Report.hasMany(HoursByType, { foreignKey: 'report_id' });

// And each of those belongs to one report
Task.belongsTo(Report, { foreignKey: 'report_id' });
Blocker.belongsTo(Report, { foreignKey: 'report_id' });
Achievement.belongsTo(Report, { foreignKey: 'report_id' });
NextWeekTask.belongsTo(Report, { foreignKey: 'report_id' });
HoursByType.belongsTo(Report, { foreignKey: 'report_id' });

// A report belongs to a user (the person who wrote it)
Report.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Report, { foreignKey: 'user_id' });

module.exports = { Report, Task, Blocker, Achievement, NextWeekTask, HoursByType, User, ReportReview, Project };