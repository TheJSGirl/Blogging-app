const login = require('express').Router();
const pool = require('../db');
const sendResponse = require('../helpers/sendResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

login.route('/')
  .post(async(req, res) => {
    
    //validate userName and password
    req.checkBody('userName', 'userName require').notEmpty().isLength({min:4});
    req.checkBody('password', 'too short password').notEmpty().isLength({min:5});

    let errors = req.validationErrors();
    
    if(errors){
          return sendResponse(res, 422, [], errors[0].msg);
        }

    //get userName and password from req.body by destructuring
    const{userName, password} = req.body;

    try{

      const [result] = await pool.query(`SELECT userName, password, userType FROM users where userName = '${userName}'`);

      const passwordFromDb = result[0].password;
     
      // console.log(passwordFromDb);
      const isValidPassword = await bcrypt.compare(password, passwordFromDb);

      if(!isValidPassword){
        return sendResponse(res, 401, [], 'Unauthorised');
      }

      const userDetailForToken = {
        userName,
        userType: result[0].userType,
      }

      //generate token 
      const token = jwt.sign(userDetailForToken, 'abcdefghijklmnop', {expiresIn: 60});
      // console.log('your token is:', token);

      return res.header('x-auth', token).status(200).json({
        status: 'ok',
        message: 'welcome'
      });
      
    }
    catch(err){
      console.error(err);
      if(err.code === 'ER_BAD_FIELD_ERROR'){
        return sendResponse(res, 400, [], 'bad request' );
      }

      return sendResponse(res, 500, [], 'something went wrong');
    }
    
  })


module.exports = login;