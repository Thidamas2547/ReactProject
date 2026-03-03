const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// สร้าง Route ทดสอบ
app.get('/', (req, res) => {
  res.send('Backend is running! พร้อมใช้งานแล้วครับ');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});