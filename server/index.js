const express = require('express');
const cors = require('cors');
const fs = require('fs');

const PORT = 3001;
const app = express();

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

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
