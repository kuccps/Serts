const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');
const marksRouter = require('./routes/marks');
const { Document, Packer, Paragraph, Table, TableCell, TableRow } = require('docx');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/marks', marksRouter);

app.get('/results', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT name, subject, marks FROM marks');
    const totals = {};
    rows.forEach(r => {
      if (!totals[r.name]) totals[r.name] = 0;
      totals[r.name] += parseInt(r.marks);
    });

    const ranked = Object.entries(totals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    res.json(ranked);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

app.post('/download', async (req, res) => {
  if (req.body.password !== '361087') return res.status(403).send('Unauthorized');

  try {
    const { rows } = await pool.query('SELECT name, subject, marks FROM marks');
    const doc = new Document();

    doc.addSection({
      children: [
        new Paragraph("Igumori Junior Secondary Results"),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Name")] }),
                new TableCell({ children: [new Paragraph("Subject")] }),
                new TableCell({ children: [new Paragraph("Marks")] })
              ]
            }),
            ...rows.map(row => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(row.name)] }),
                new TableCell({ children: [new Paragraph(row.subject)] }),
                new TableCell({ children: [new Paragraph(row.marks.toString())] })
              ]
            }))
          ]
        })
      ]
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader("Content-Disposition", "attachment; filename=Igumori_Results.docx");
    res.send(buffer);
  } catch (err) {
    res.status(500).send('Failed to generate document');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
