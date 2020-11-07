const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');

const PORT = 3001;
const app = express();
const upload = multer();

app.use(cors());
app.post(
  '/up',
  (req, res, next) => {
    let filename = req.get('X-File-Name');
    req.on("data", async (chunk) => {
      filename = filename.replace(/[^0-9a-zA-Z\.]/gi, '');
      const filePath = `./storage/${filename}`;
      const ws = fs.createWriteStream(filePath, {
        flags: 'a',
      })
      ws.write(chunk, err => {
        err && console.log('err', err)
      });
    });
    req.on('end', () => {
      return res.status(201).json({
        status: 'success',
        date: Date.now()
      })
    })
    req.on('error', (err) => {
      res.status(400).json({
        status: 'failed',
        err: err.message,
        date: Date.now()
      })
    })
  }
);
app.post(
  '/upload',
  upload.single('file'),
  (req, res) => {
    const { file } = req;
    let filename = req.get('X-File-Name');
    filename = filename.replace(/[^0-9a-zA-Z\.]/gi, '');
    const filePath = `./storage/${filename}`;
    const ws = fs.createWriteStream(filePath, {
      flags: 'a',
    })
    ws.write(file.buffer, err => {
      if (err) return res.status(400).json({
        status: 'failed',
        time: Date.now(),
        message: err.message
      });
      return res.status(201).json({
        status: 'success',
        date: Date.now()
      })
    });
  }
);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
