In order to run this:

npm install
npm start

In postgres, you will also need to run the following commands,

CREATE TABLE reviewpage (id serial, username text, dining int, dish text, review text );
CREATE TABLE diningusers (username text, salt text, hash text );

also in database.js, replace username and password with the necessary information.

or use our heroku link