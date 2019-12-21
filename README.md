# Matthackin On Demand

## About
This is a project I made for my home network to allow family to read from a collection of PDF magazines. It consists of a Node.js backend for accessing the host's file system for listing directory contents as well as a React.js frontend for rendering the magazines. I have added basic functionality for swapping magazines, navigating pages and changing views. Currently it is only supported in browser and no mobile support yet.

## Installation
- <code>npm install</code>
- Place your PDF files in <code>/public/assets/pdf</code>
- In src/App.js, change <code>INSERT LOCAL IP ADDRESS HERE</code> to your host device's local IP address
- <code>npm run start:all</code> will start the backend and the frontend
- <code>localhost:3001</code> to view the site