const express = require('express');
const path = require('path');
const IndexRouter = require('./routes/index');
const cors = require('cors');
const ControllerError = require('./errors/controllerError');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cookBook', {useNewUrlParser: true});
try {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors({origin: true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(IndexRouter);
    app.use((req, res, next) => {
        next(new ControllerError('Not found', 404));
    });

    app.use((err, req, res, next) => {
      res.status(500).json({
          message: err.msg,
          status: err.status
      });
    });

    app.listen(12000, () => {
      console.log('Listening port 12000...');
    })


} catch(e){
  console.log(e);
}