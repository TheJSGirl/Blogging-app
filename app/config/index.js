const env = process.env.NODE_ENV || 'development';
process.env.JWT_SECRET = 'thisisasimplesecreat';
process.env.JWT_EXPIRY = '1d';

let poolConfig = null;
if (env === 'production') {
  poolConfig = {
    connectionLimit: 5,
    host: process.env.DB_HOST_NAME,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}


if (env === 'development') {
  poolConfig = {
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'pinku',
    database: 'blog_post',
  };
} else if (env === 'test') {
  poolConfig = {
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'pinku',
    database: 'blog_post_test',
  };
}


module.exports = poolConfig;
