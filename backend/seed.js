// This script fills the database with realistic sample data:
// a few team members, a manager, some projects, and several weeks
// of reports in different statuses — so the dashboard and charts
// have something meaningful to show.
//
// Run it once with: node seed.js

const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const { User, Project, Report, Task, Blocker, Achievement, NextWeekTask, HoursByType, ReportReview } = require('./models');

async function seed() {
  console.log('Seeding database...');

  // 1. Create a manager (skip if one already exists with this email)
  const managerPassword = await bcrypt.hash('manager123', 10);
  const [manager] = await User.findOrCreate({
    where: { email: 'sarah.manager@example.com' },
    defaults: { name: 'Sarah Manager', password_hash: managerPassword, role: 'manager' },
  });

  // 2. Create 4 team members
  const teamMemberData = [
    { name: 'Alex Fernando', email: 'alex@example.com' },
    { name: 'Priya Kumar', email: 'priya@example.com' },
    { name: 'John Silva', email: 'john@example.com' },
    { name: 'Maya Perera', email: 'maya@example.com' },
  ];

  const teamPassword = await bcrypt.hash('password123', 10);
  const teamMembers = [];
  for (const t of teamMemberData) {
    const [user] = await User.findOrCreate({
      where: { email: t.email },
      defaults: { name: t.name, password_hash: teamPassword, role: 'team_member' },
    });
    teamMembers.push(user);
  }

  // 3. Create a few projects
  const projectData = [
    { name: 'Client A', description: 'External client project' },
    { name: 'Internal Tooling', description: 'Internal dev tools and automation' },
    { name: 'R&D', description: 'Research and prototyping' },
  ];
  const projects = [];
  for (const p of projectData) {
    const [project] = await Project.findOrCreate({
      where: { name: p.name },
      defaults: { description: p.description },
    });
    projects.push(project);
  }

  // 4. Helper: get a Monday-based week range, N weeks back from today
  function getWeekRange(weeksAgo) {
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1 - weeksAgo * 7);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    return {
      start: monday.toISOString().split('T')[0],
      end: friday.toISOString().split('T')[0],
    };
  }

  const taskTypes = ['Development', 'Testing', 'Meetings', 'Documentation'];
  const statuses = ['draft', 'submitted', 'needs_correction', 'approved'];

  // 5. Create 3 weeks of reports for each team member, in varied statuses
  for (const member of teamMembers) {
    for (let week = 0; week < 3; week++) {
      const { start, end } = getWeekRange(week);
      const project = projects[Math.floor(Math.random() * projects.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const report = await Report.create({
        user_id: member.id,
        project_id: project.id,
        week_start: start,
        week_end: end,
        notes: `Weekly update for ${member.name}`,
        status,
        latest_comment: status === 'needs_correction' ? 'Please add more detail on task outcomes.' : null,
      });

      // Add 2 tasks per report
      await Task.create({
        report_id: report.id,
        task_name: 'Feature implementation',
        priority: 'high',
        planned_percent: 100,
        actual_percent: status === 'draft' ? 40 : 100,
        status: status === 'draft' ? 'in_progress' : 'done',
        time_planned_hours: 10,
        time_spent_hours: 9,
        output: 'Implemented and tested the assigned feature',
      });
      await Task.create({
        report_id: report.id,
        task_name: 'Code review',
        priority: 'medium',
        planned_percent: 100,
        actual_percent: 100,
        status: 'done',
        time_planned_hours: 3,
        time_spent_hours: 2,
        output: 'Reviewed 3 pull requests',
      });

      // Blocker
      await Blocker.create({
        report_id: report.id,
        description: 'Waited on API access from another team',
        is_key: true,
      });

      // Achievement
      await Achievement.create({
        report_id: report.id,
        description: 'Shipped the feature ahead of schedule',
        is_key: true,
      });

      // Next week task
      await NextWeekTask.create({
        report_id: report.id,
        description: 'Start work on the next module',
      });

      // Hours by type
      for (const type of taskTypes) {
        await HoursByType.create({
          report_id: report.id,
          task_type: type,
          hours: Math.floor(Math.random() * 8) + 1,
        });
      }

      // If approved or needs_correction, log a review action too
      if (status === 'approved') {
        await ReportReview.create({
          report_id: report.id,
          reviewer_id: manager.id,
          action: 'approved',
          comment: 'Looks good, approved.',
          reviewed_version: 1,
        });
      } else if (status === 'needs_correction') {
        await ReportReview.create({
          report_id: report.id,
          reviewer_id: manager.id,
          action: 'requested_changes',
          comment: 'Please add more detail on task outcomes.',
          reviewed_version: 1,
        });
      }
    }
  }

  console.log('✅ Seed complete!');
  console.log('Manager login: sarah.manager@example.com / manager123');
  console.log('Team member login (any of them): password123');
  teamMemberData.forEach((t) => console.log(`  - ${t.email}`));

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});