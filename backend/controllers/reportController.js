// This file handles creating, submitting, viewing, and reviewing weekly reports.

const { Report, Task, Blocker, Achievement, NextWeekTask, HoursByType, ReportReview } = require('../models');

async function createReport(req, res) {
  try {
    const userId = req.user.id;

    const { project_id, week_start, week_end, notes, tasks, blockers, achievements, nextWeekTasks, hoursByType } = req.body;

    const report = await Report.create({
      user_id: userId,
      project_id,
      week_start,
      week_end,
      notes,
      status: 'draft',
    });

    if (tasks && tasks.length > 0) {
      for (const t of tasks) {
        await Task.create({ ...t, report_id: report.id });
      }
    }

    if (blockers && blockers.length > 0) {
      for (const b of blockers) {
        await Blocker.create({ ...b, report_id: report.id });
      }
    }

    if (achievements && achievements.length > 0) {
      for (const a of achievements) {
        await Achievement.create({ ...a, report_id: report.id });
      }
    }

    if (nextWeekTasks && nextWeekTasks.length > 0) {
      for (const n of nextWeekTasks) {
        await NextWeekTask.create({ description: n, report_id: report.id });
      }
    }

    if (hoursByType && hoursByType.length > 0) {
      for (const h of hoursByType) {
        await HoursByType.create({ ...h, report_id: report.id });
      }
    }

    res.json({ message: 'Report created as draft', reportId: report.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function submitReport(req, res) {
  try {
    const userId = req.user.id;
    const reportId = req.params.id;

    const report = await Report.findByPk(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.user_id !== userId) {
      return res.status(403).json({ error: 'You can only submit your own reports' });
    }

    if (report.status !== 'draft' && report.status !== 'needs_correction') {
      return res.status(400).json({ error: 'This report cannot be submitted right now' });
    }

    report.status = 'submitted';
    await report.save();

    res.json({ message: 'Report submitted', reportId: report.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getMyReports(req, res) {
  try {
    const userId = req.user.id;

    const reports = await Report.findAll({
      where: { user_id: userId },
      order: [['week_start', 'DESC']],
    });

    res.json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getReportById(req, res) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const reportId = req.params.id;

    const report = await Report.findByPk(reportId, {
      include: [
        { model: Task },
        { model: Blocker },
        { model: Achievement },
        { model: NextWeekTask },
        { model: HoursByType },
      ],
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (userRole !== 'manager' && report.user_id !== userId) {
      return res.status(403).json({ error: 'You can only view your own reports' });
    }

    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateReport(req, res) {
  try {
    const userId = req.user.id;
    const reportId = req.params.id;

    const report = await Report.findByPk(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.user_id !== userId) {
      return res.status(403).json({ error: 'You can only edit your own reports' });
    }

    if (report.status !== 'draft' && report.status !== 'needs_correction') {
      return res.status(400).json({ error: 'This report cannot be edited right now' });
    }

    const { project_id, week_start, week_end, notes } = req.body;

    report.project_id = project_id;
    report.week_start = week_start;
    report.week_end = week_end;
    report.notes = notes;
    await report.save();

    const { tasks, blockers, achievements, nextWeekTasks, hoursByType } = req.body;

    await Task.destroy({ where: { report_id: reportId } });
    if (tasks && tasks.length > 0) {
      for (const t of tasks) {
        await Task.create({ ...t, report_id: reportId });
      }
    }

    await Blocker.destroy({ where: { report_id: reportId } });
    if (blockers && blockers.length > 0) {
      for (const b of blockers) {
        await Blocker.create({ ...b, report_id: reportId });
      }
    }

    await Achievement.destroy({ where: { report_id: reportId } });
    if (achievements && achievements.length > 0) {
      for (const a of achievements) {
        await Achievement.create({ ...a, report_id: reportId });
      }
    }

    await NextWeekTask.destroy({ where: { report_id: reportId } });
    if (nextWeekTasks && nextWeekTasks.length > 0) {
      for (const n of nextWeekTasks) {
        await NextWeekTask.create({ description: n, report_id: reportId });
      }
    }

    await HoursByType.destroy({ where: { report_id: reportId } });
    if (hoursByType && hoursByType.length > 0) {
      for (const h of hoursByType) {
        await HoursByType.create({ ...h, report_id: reportId });
      }
    }

    res.json({ message: 'Report updated', reportId: report.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getAllReports(req, res) {
  try {
    const { status, project_id, user_id, week_start, week_end } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (project_id) whereClause.project_id = project_id;
    if (user_id) whereClause.user_id = user_id;
    if (week_start) whereClause.week_start = week_start;
    if (week_end) whereClause.week_end = week_end;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const reports = await Report.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['week_start', 'DESC']],
    });

    res.json({
      total: reports.count,
      page,
      totalPages: Math.ceil(reports.count / limit),
      reports: reports.rows,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function reviewReport(req, res) {
  try {
    const reviewerId = req.user.id;
    const reportId = req.params.id;
    const { action, comment } = req.body;

    const report = await Report.findByPk(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.status !== 'submitted') {
      return res.status(400).json({ error: 'Only submitted reports can be reviewed' });
    }

    if (action !== 'approved' && action !== 'requested_changes') {
      return res.status(400).json({ error: 'Action must be approved or requested_changes' });
    }

    await ReportReview.create({
      report_id: report.id,
      reviewer_id: reviewerId,
      action,
      comment,
      reviewed_version: report.version_number,
    });

    if (action === 'approved') {
      report.status = 'approved';
      report.latest_comment = null;
    } else {
      report.status = 'needs_correction';
      report.latest_comment = comment;
    }

    await report.save();

    res.json({ message: `Report ${action}`, reportId: report.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
async function getDashboardStats(req, res) {
  try {
    const totalSubmittedThisWeek = await Report.count({ where: { status: 'submitted' } });
    const needsCorrectionCount = await Report.count({ where: { status: 'needs_correction' } });
    const approvedCount = await Report.count({ where: { status: 'approved' } });
    const draftCount = await Report.count({ where: { status: 'draft' } });

    const totalReports = totalSubmittedThisWeek + needsCorrectionCount + approvedCount + draftCount;
    const compliance = totalReports > 0
      ? Math.round(((totalSubmittedThisWeek + approvedCount) / totalReports) * 100)
      : 0;

    const openBlockersCount = await Blocker.count();

    // Workload by project: count of reports per project
    const reportsByProject = await Report.findAll({
      attributes: ['project_id', [Report.sequelize.fn('COUNT', Report.sequelize.col('id')), 'count']],
      group: ['project_id'],
    });

    // Hours by type, team-wide: sum of hours per task_type
    const hoursByTypeTotals = await HoursByType.findAll({
      attributes: ['task_type', [HoursByType.sequelize.fn('SUM', HoursByType.sequelize.col('hours')), 'total_hours']],
      group: ['task_type'],
    });

    // Status by team member: count of reports per user, per status
    const reportsByUser = await Report.findAll({
      attributes: ['user_id', 'status', [Report.sequelize.fn('COUNT', Report.sequelize.col('id')), 'count']],
      group: ['user_id', 'status'],
    });

    res.json({
      summary: {
        totalSubmitted: totalSubmittedThisWeek,
        complianceRate: compliance,
        needsCorrectionCount,
        openBlockersCount,
      },
      workloadByProject: reportsByProject,
      hoursByType: hoursByTypeTotals,
      statusByUser: reportsByUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = { createReport, submitReport, getMyReports, getReportById, updateReport, getAllReports, reviewReport, getDashboardStats };