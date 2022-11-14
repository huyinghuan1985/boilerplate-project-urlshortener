require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const dns = require('dns');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

let shorturls = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// 获取要被转换的url
app.post('/api/shorturl', (req, res) => {
  const original_url = req.body.url;
  // dns.lookup(original_url, (error, address) => {
  //   if (error) return console.log(error);
  //   console.log(address);
  // });
  if (!/https*:\/\/.+\..+/.test(original_url))
    return res.json({ error: 'Invalid URL' });
  let short_url = shorturls.indexOf(original_url);

  if (short_url === -1) {
    shorturls.push(req.body.url);
    short_url = shorturls.length - 1;
  }

  res.json({ original_url, short_url });
});

// 解析短网址跳转到真实url
app.get('/api/shorturl/:short_url', (req, res) => {
  let short_url = req.params.short_url;
  if (/[^0-9]+/.test(short_url)) return res.json({ error: 'Wrong format' });
  let original_url = shorturls[short_url];

  if (original_url === undefined) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  res.redirect(302, original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
