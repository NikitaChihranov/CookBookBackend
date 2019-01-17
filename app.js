let express = require('express');
let path = require('path');
let IndexRouter = require('./routes/index');
let cors = require('cors');
let ControllerError = require('./errors/controllerError');

let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cookBook', {useNewUrlParser: true});
try {
    let app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors({origin: true}, {withCredentials: true}));
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