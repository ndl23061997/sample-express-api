#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app");
var debug = require("debug")("store:server");
var http = require("http");
const TokenService = require("../services/TokenServices");
const path = require("path");
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.info("Server runing on port", port);
  console.info("Get Token list...");
  TokenService.readFromFile(path.join(process.env.ROOT_PATH, "TokenList.json"));
});
server.on("error", onError);
server.on("listening", onListening);
server.on("close", onCloseServer);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

// Graceful stop
process.on("SIGINT", () => {
  server.close();
});

/**
 * On Server Close
 */
function onCloseServer() {
  console.log("\nSaving token list ...");
  TokenService.writeToFile(path.join(process.env.ROOT_PATH, "TokenList.json"));
  console.log("Server close");
}

// Error Handle
app.use("/api/*", (error, req, res, next) => {
  console.log(error);
  let errorCode = error.code || 500;
  return res.status(errorCode).json(error.message);
});
