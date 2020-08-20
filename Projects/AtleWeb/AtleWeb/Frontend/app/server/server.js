const Renderer = require('./source/renderer');
const express = require('express');
const app = express();

app.get('*', (req, res) => {
  const rendererInstance = Renderer(req);

  if (rendererInstance.routestatus == 404)
    res.status(404).end('404 - Page Not Found');
  else res.send(Renderer(req));
});

app.use(
  express.static('public', {
    index: false
  })
);

app.listen(3000, () => console.log('Listening on port 3000'));
