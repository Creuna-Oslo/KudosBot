import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import Routes from './routes';

export default req => {
  let context = {};
  const content = renderToString(
    <StaticRouter path={req.path} context={context}>
      <Routes />
    </StaticRouter>
  );
  return {
    html: `<html>
  <head>
  <title>Atle website</title>
  </head>
  
  <body>
    <div id="mount-point">${content}</div>
    <script src="bundle.js"></script>
  </body>
  </html>`,
    status: context.status
  };
};
