const env = require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const app = require('./app');
const { port } = require('./config.js')

app.listen(port, () => {
    console.log(chalk.bgRedBright.bold(`Server is listening on port ${port}`))
});

