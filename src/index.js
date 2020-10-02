#!/usr/bin/env node
const { exec } = require("child_process");
const { writeFileSync } = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const nodeIgnore = `node`;
const laravelIgnore = `laravel`;
const pythonIgnore = `python`;

exec("npm bin", { cwd: __dirname }, (err, stdout, stderr) => {
  console.log(chalk.blue("dotgitignore"));
  console.log(chalk.blue("Easily ignore environment files on your projects"));
  inquirer
    .prompt([
      {
        name: "ignore",
        type: "checkbox",
        message: "What project file do you wish to ignore",
        choices: ["node", "laravel", "python"],
      },
    ])
    .then((answers) => {
      const answer = answers.ignore[0];
      const cwd = process.cwd();
      let ignoreFile = null;
      switch (answer) {
        case "node":
          ignoreFile = nodeIgnore;
          break;
        case "laravel":
          ignoreFile = laravelIgnore;
          break;
        case "python":
          ignoreFile = pythonIgnore;
          break;
        default:
          ignoreFile = simpleIgnore;
      }
       writeFileSync(cwd + "/.gitignore", ignoreFile,(err) => {
           if(err){
            process.exit(1);
        }
        console.log(chalk.blue("success"))
       });
    });
});
