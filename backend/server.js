// Express.js backend for CSV upload and heavy metal index calculation
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());

// Heavy metal standards
const STANDARDS = {
  Pb: 0.01,
  Cd: 0.003,
  Cr: 0.05,
  As: 0.01,
  Hg: 0.001,
  Ni: 0.02,
  Fe: 0.3,
  Zn: 5.0,
  Cu: 0.05,
  Mn: 0.1
};
const IDEALS = Object.fromEntries(Object.keys(STANDARDS).map(m => [m, 0]));

function calculateIndices(row) {
  // Convert all values to numbers
  const metals = {};
  for (const m of Object.keys(STANDARDS)) {
    if (row[m] !== undefined && row[m] !== '') {
      metals[m] = parseFloat(row[m]);
    }
  }
  if (Object.keys(metals).length === 0) return {};
  // HPI
  const K = 1 / Object.keys(metals).reduce((acc, m) => acc + 1 / STANDARDS[m], 0);
  const weights = Object.fromEntries(Object.keys(metals).map(m => [m, K / STANDARDS[m]]));
  const subIndices = Object.fromEntries(Object.keys(metals).map(m => [m, ((metals[m] - IDEALS[m]) / (STANDARDS[m] - IDEALS[m])) * 100]));
  const HPI = Object.keys(metals).reduce((acc, m) => acc + subIndices[m] * weights[m], 0);
  // HEI
  const HEI = Object.keys(metals).reduce((acc, m) => acc + metals[m] / STANDARDS[m], 0);
  // MPI
  const MPI = Math.pow(Object.values(metals).reduce((acc, v) => acc * v, 1), 1 / Object.keys(metals).length);
  // CF & Cd
  const CF = Object.fromEntries(Object.keys(metals).map(m => [m, metals[m] / STANDARDS[m]]));
  const Cd = Object.values(CF).reduce((acc, v) => acc + v, 0);
  // PLI
  const PLI = Math.pow(Object.values(CF).reduce((acc, v) => acc * v, 1), 1 / Object.keys(CF).length);
  return { HPI, HEI, MPI, Cd, PLI };
}

app.post('/process-csv', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      const resultRow = {};
      for (const col of ['Sample_ID', 'Latitude', 'Longitude']) {
        if (row[col] !== undefined) resultRow[col] = row[col];
      }
      Object.assign(resultRow, calculateIndices(row));
      results.push(resultRow);
    })
    .on('end', () => {
      fs.unlinkSync(req.file.path); // Clean up temp file
      res.json(results);
    })
    .on('error', (err) => {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ error: err.message });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node backend running on port ${PORT}`);
});
