// This file handles the AI chat assistant — managers can ask questions
// about team activity, and this fetches relevant report data, then
// asks Gemini to answer based on it.

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Report, Task, Blocker, Achievement, User, Project } = require('../models');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askAssistant(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Please provide a question' });
    }

    // Gather recent reports with their key details, to give the AI real context
    const reports = await Report.findAll({
      include: [
        { model: User, attributes: ['name'] },
        { model: Task },
        { model: Blocker },
        { model: Achievement },
      ],
      order: [['week_start', 'DESC']],
      limit: 20, // keep it reasonable so we don't send too much data
    });

    // Turn the reports into a plain-text summary the AI can read
    const context = reports.map((r) => {
      const tasks = r.Tasks.map((t) => `${t.task_name} (${t.status})`).join(', ') || 'none';
      const blockers = r.Blockers.map((b) => b.description).join(', ') || 'none';
      const achievements = r.Achievements.map((a) => a.description).join(', ') || 'none';
      return `${r.User.name} — Week ${r.week_start} to ${r.week_end} (${r.status}): Tasks: ${tasks}. Blockers: ${blockers}. Achievements: ${achievements}.`;
    }).join('\n');

    const prompt = `You are a helpful assistant for a team manager reviewing weekly work reports.
Here is the recent report data:

${context}

Based only on this data, answer the manager's question concisely.

Question: ${question}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not get a response from the assistant' });
  }
}

module.exports = { askAssistant };