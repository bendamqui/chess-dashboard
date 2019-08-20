const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const importRouter = require('./routes/import');
const chartsRouter = require('./routes/charts');
const positionsRouter = require('./routes/positions');
const sandboxRouter = require('./routes/sandbox');

const app = express();

require('./db/mongo').init();  


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/import', importRouter);
app.use('/api/charts', chartsRouter);
app.use('/api/positions', positionsRouter);
app.use('/api/sandbox', sandboxRouter);

if (process.env.NODE_ENV === 'production') {    
    app.use(express.static(path.join(__dirname, '../web/build')));  
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, '../web/build', 'index.html'));
    });
  }

module.exports = app;
