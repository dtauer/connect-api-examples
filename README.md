## Connect API Examples
This project tries to accomplish two things:
  1) Provide examples of using the Adobe Connect Web Services (located in the `/public` directory)
  2) Provide a basic `Node + Express` web server for developing/testing API example locally by proxing request to your Adobe Connect server.

### HTML Files
Any of the HTML files in the `/public` folder can be added as a piece of content on your Adobe Connect server. Some examples require you to be an administrator because they are using administrator-level APIs. Other will work for any user. In most cases you will have to be logged in so do not give the files public access. These files will not run locally on your computer without a development server running. If you want to run the files locally (or do your own development), you'll need to install the whole project.

### Installation
Firstly, You will need to have `Node (+7.6)` installed: https://nodejs.org/en/. I'm requiring 7.6 or higher because I use async/await on the Node side. If you need to run a lower version, you'll need to modify server.js accordingly.

Once you have Node installed:
  1) Download or clone this repository.
  2) Open a terminal window in the project directory and run:
  ```node
     npm install
  ```
This will install all the required node_modules. There is one more dependency, `nodemon` that I'm using to automatically restart the server when changes occur. You *might* need to install it globally. If so, run:
```node
  npm install -g nodemon
```

### Configuration
  1) Rename `variables.env.sample` to `variables.env`
  2) Edit `variables.env` to include your Connect server URL, username, and password. You can also edit the PORT number used for the development server if it conflicts with another server.

### Start the Development Server
  1) To start the development server, open a terminal/command line in the project directory and run:
  ```node
    npm run dev
  ```
  2) Access the server in your web browser with `http://localhost:1999` (or whatever port number you chose).

The root directory of the development server lists all the files in the `/public` folder. Click on a file to view it. 

### Note about the Proxy
Node is acting as a proxy server to bypass CORS issues on the Connect Server. When you are making API calls from the HTML files, use `/api/xml` as the endpoint. The node server will prepend the server's URL. This way you don't have to clean up the URLs when distributing the files to multiple accounts.

### Starter File
In the `/public` directory, the `start-example.html` file contains a basic API call to the `report-my-meetings` action. This is a good place to start if you want to begin experimenting with an API. I'm loading some remote CSS/JS from CDNs. Any custom JavaScript/CSS is embedded directly in the file so there aren't any local dependencies. If you wanted to use your own external CSS, JS, images, etc, they will either need to be hosted on a remote server or packaged with the HTML file as a SCORM/AICC-compliant bundle.
