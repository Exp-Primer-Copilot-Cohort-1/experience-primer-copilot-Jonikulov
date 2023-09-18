// Create web server
// 
// This file is part of the "Comment Server" project, and is licensed under the MIT license.
// See LICENSE.md for license information.
//
// The comments.js file is the main entry point for the Comment Server. It creates a web server
// and a socket.io server, and handles all incoming requests and socket messages.
//

// Import the required libraries
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var socketio = require("socket.io");
var marked = require("marked");
var moment = require("moment");

// Import the configuration file
var config = require("./config.json");

// Create an Express app
var app = express();

// Create a socket.io server
var io = socketio();

// Create a server object
var server = {
    app: app,
    io: io,
    config: config
};

// Set up the Express app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up the static file server
app.use(express.static(path.join(__dirname, "public")));

// Set up the socket.io server
io.on("connection", function(socket) {
    // Handle the "getComments" message
    socket.on("getComments", function(data) {
        // Get the comments from the database
        getComments(server, data, function(err, comments) {
            // If there was an error, send an error message
            if (err) {
                socket.emit("error", err);
                return;
            }

            // Send the comments to the client
            socket.emit("comments", comments);
        });
    });

    // Handle the "addComment" message
    socket.on("addComment", function(data) {
        // Add the comment to the database
        addComment(server, data, function(err, comment) {
            // If there was an error, send an error message
            if (err) {
                socket.emit("error", err);
                return;
            }

            // Send the comment to all connected clients
            io.emit("comment", comment);
        });
    });

    // Handle the "updateComment" message
    socket.on("updateComment", function(data) {
        // Update the comment in the database
        updateComment(server, data, function(err, comment) {
            // If there was an error, send an error message
            if (err) {
                socket.emit("error", err);
                return;
            }

            // Send the comment to all connected clients
            io.emit("comment", comment);
        });
    });

    // Handle the "deleteComment" message
    socket.on("deleteComment", function(data) {
        // Delete the comment from the database
        deleteComment(server, data, function(err, comment) {
            // If there was an error, send an error message
            if (err) {
                socket.emit("error", err);
                return;
            }

            // Send the comment to all connected clients
            io.emit("comment", comment);
        });
    }
, 1000);});
