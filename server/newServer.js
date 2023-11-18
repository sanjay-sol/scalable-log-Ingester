import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// searching on query
app.get('/search/:index/:type', async (req, res) => {
  const { phraseSearch } = require('./SearchEngine');
  const data = await phraseSearch(req.params.index, req.params.type, req.query.q);
  res.json(data);
});

app.listen(3333, () => console.log('server running at 3333'));