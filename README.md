Deployment Link
---------------

https://blog-site-deep00987.netlify.app/

Backend Installation
--------------------

To install backend dependencies, run the following command at the root directory:

`npm install`

Frontend Installation
---------------------

To install frontend dependencies, navigate to the client folder and run the following commands:

`cd client`

`npm install`

Starting the Application
------------------------

To start the frontend only, use the following command:

`npm run client`

To start the backend development server only, use the following command:

`npm run server`

To start both the frontend and backend concurrently, use the following command:

`npm run dev`

Frontend Environment File Format (Development)
----------------------------------------------

`REACT_APP_STATIC_URI=http://localhost:4000`

`REACT_APP_API_URI=http://localhost:4000/api`

Frontend Environment File Format (Production)
---------------------------------------------

`REACT_APP_STATIC_URI=https://prod-domain.com
REACT_APP_API_URI=https://prod-domain.com/api`

Backend Environment File Format
-------------------------------

`PORT=4000`<br>
`JWT_KEY=`<br>
`NODE_ENV=`<br>
`MONGO_URI=`

Please make sure to replace the placeholders (e.g., JWT_KEY, MONGO_URI) with appropriate values relevant to your setup.

