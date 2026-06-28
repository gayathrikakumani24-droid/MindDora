const PDFDocument = require('pdfkit');

/**
 * Generates a monthly growth report PDF and writes it to the provided writable stream.
 * @param {WritableStream} stream - Target writable stream (e.g., Express res)
 * @param {Object} data - Aggregate data including user details, mood stats, goals, habits, and AI suggestions.
 */
const generateMonthlyGrowthPDF = (stream, data) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Pipe output to the target stream
  doc.pipe(stream);

  // Colors
  const primaryColor = '#4f46e5';   // Deep Indigo
  const accentColor = '#06b6d4';    // Cyan
  const darkTextColor = '#0f172a';  // Slate 900
  const lightTextColor = '#475569'; // Slate 600
  const dividerColor = '#e2e8f0';   // Slate 200
  const bgCardColor = '#f8fafc';    // Slate 50

  // 1. Draw Executive Header Banner
  doc.rect(0, 0, 595.28, 125).fill(primaryColor);
  
  doc.fillColor('#ffffff');
  doc.fontSize(28).font('Helvetica-Bold').text('MINDDORA', 50, 32);
  doc.fontSize(13).font('Helvetica').text('Monthly Cognitive & Growth Companion Report', 50, 68);
  doc.fontSize(9.5).text(`Report Period: ${data.reportPeriod || 'Current Month'}`, 50, 88);

  // Right-aligned user info in header
  doc.fontSize(11).font('Helvetica-Bold').text(data.userName || 'Valued User', 380, 42, { align: 'right', width: 165 });
  doc.fontSize(9).font('Helvetica').text(data.userEmail || '', 380, 60, { align: 'right', width: 165 });

  // Move cursor down below header banner
  doc.y = 155;
  doc.fillColor(darkTextColor);

  // 2. Emotional Analysis & Cognitive Metrics Section
  doc.fontSize(15).font('Helvetica-Bold').fillColor(primaryColor).text('1. Emotional & Cognitive Analytics');
  doc.y += 4;
  doc.strokeColor(dividerColor).lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.y += 12;

  // Render 3 metric highlight boxes
  const boxY = doc.y;
  const boxWidth = 155;
  const boxHeight = 45;

  // Box 1: Stress
  doc.roundedRect(50, boxY, boxWidth, boxHeight, 8).fillAndStroke(bgCardColor, dividerColor);
  doc.fillColor(lightTextColor).fontSize(8).font('Helvetica-Bold').text('AVG STRESS LEVEL', 62, boxY + 10);
  doc.fillColor(darkTextColor).fontSize(14).font('Helvetica-Bold').text(`${data.avgStress || 5} / 10`, 62, boxY + 24);

  // Box 2: Confidence
  doc.roundedRect(220, boxY, boxWidth, boxHeight, 8).fillAndStroke(bgCardColor, dividerColor);
  doc.fillColor(lightTextColor).fontSize(8).font('Helvetica-Bold').text('AVG CONFIDENCE SCORE', 232, boxY + 10);
  doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text(`${data.avgConfidence || 5} / 10`, 232, boxY + 24);

  // Box 3: Productivity
  doc.roundedRect(390, boxY, boxWidth, boxHeight, 8).fillAndStroke(bgCardColor, dividerColor);
  doc.fillColor(lightTextColor).fontSize(8).font('Helvetica-Bold').text('AVG PRODUCTIVITY SCORE', 402, boxY + 10);
  doc.fillColor(accentColor).fontSize(14).font('Helvetica-Bold').text(`${data.avgProductivity || 5} / 10`, 402, boxY + 24);

  doc.y = boxY + boxHeight + 18;

  // Mood counts
  doc.fontSize(10).font('Helvetica-Bold').fillColor(darkTextColor).text('Logged Mood Distribution:');
  doc.y += 4;
  doc.fontSize(9.5).font('Helvetica').fillColor(lightTextColor);
  
  const moodCounts = data.moodCounts || {};
  const moodList = Object.entries(moodCounts).map(([key, val]) => `${key}: ${val}`).join('   •   ') || 'No distinct mood logs recorded.';
  doc.text(moodList, 62, doc.y);

  doc.y += 22;

  // 3. Goals Tracking Section
  doc.fontSize(15).font('Helvetica-Bold').fillColor(primaryColor).text('2. Goal Progress Overview');
  doc.y += 4;
  doc.strokeColor(dividerColor).lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.y += 12;

  const activeGoals = data.goals || [];
  if (activeGoals.length === 0) {
    doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(lightTextColor).text('No active goals tracked this month.', 62);
    doc.y += 10;
  } else {
    activeGoals.slice(0, 5).forEach((goal, index) => {
      const isCompleted = goal.status === 'completed';
      const statusText = isCompleted ? 'Completed (100%)' : `In Progress (${goal.progress}%)`;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor(darkTextColor).text(`${index + 1}. ${goal.title}`, 62, doc.y);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(isCompleted ? accentColor : primaryColor).text(statusText, 350, doc.y - 12, { align: 'right', width: 195 });
      if (goal.description) {
        doc.fontSize(8.5).font('Helvetica').fillColor(lightTextColor).text(`   ${goal.description}`, 62);
      }
      doc.y += 6;
    });
  }

  doc.y += 18;

  // 4. Habits Consistency Section
  doc.fontSize(15).font('Helvetica-Bold').fillColor(primaryColor).text('3. Habit Streak Consistency');
  doc.y += 4;
  doc.strokeColor(dividerColor).lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.y += 12;

  const habits = data.habits || [];
  if (habits.length === 0) {
    doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(lightTextColor).text('No habits tracked this month.', 62);
    doc.y += 10;
  } else {
    habits.forEach((habit) => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor(darkTextColor).text(`•  ${habit.habitName}`, 62);
      doc.fontSize(9).font('Helvetica').fillColor(lightTextColor).text(`Current Streak: ${habit.streak} Days   |   Total Completions: ${habit.completedDates?.length || 0}`, 220, doc.y - 12);
      doc.y += 6;
    });
  }

  doc.y += 20;

  // 5. Growth Suggestions Section
  doc.fontSize(15).font('Helvetica-Bold').fillColor(primaryColor).text('4. Executive AI Recommendations');
  doc.y += 4;
  doc.strokeColor(dividerColor).lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.y += 12;

  const recs = data.recommendations || [
    'Reflect regularly on your goals; incremental steps are the key to building lasting habits.',
    'Optimize your sleep pattern and set a dedicated window for daily journaling to boost emotional self-regulation.',
    'Celebrate minor accomplishments - write down three small successes at the end of each day to improve confidence.',
  ];

  const recBoxY = doc.y;
  doc.roundedRect(50, recBoxY, 495, 105, 8).fillAndStroke(bgCardColor, dividerColor);
  doc.fillColor(darkTextColor);

  let recsY = recBoxY + 12;
  recs.forEach((rec, idx) => {
    doc.fontSize(9).font('Helvetica-Bold').fillColor(primaryColor).text(`${idx + 1}.`, 62, recsY);
    doc.fontSize(9).font('Helvetica').fillColor(darkTextColor).text(rec, 78, recsY, { width: 450 });
    recsY += 28;
  });

  // Footer text
  doc.fontSize(8.5).font('Helvetica-Oblique').fillColor(lightTextColor).text(
    '“Your second brain is not just a storage system; it is a springboard for creative, emotional, and professional potential.”',
    50,
    742,
    { align: 'center', width: 495 }
  );

  doc.strokeColor(dividerColor).lineWidth(0.5).moveTo(50, 765).lineTo(545, 765).stroke();
  doc.fontSize(8).font('Helvetica').text('Generated by MindDora AI – Executive Personal Growth Companion', 50, 775, { align: 'center', width: 495 });

  doc.end();
};

module.exports = {
  generateMonthlyGrowthPDF,
};
