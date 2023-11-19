import express from 'express';
import logs from './routes/logs.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 3000 || process.env.PORT;


app.use(express.json());
app.use(cors());


/*****************  ROUTES ********************************************  */

app.use(logs);



app.get("/", (req, res) => {
  return res.send("Hello World..");
});

app.listen(PORT || 3003, () =>
  console.log(`Listening on the Port ${PORT}`)
);

