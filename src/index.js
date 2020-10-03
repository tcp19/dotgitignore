#!/usr/bin/env node
const { writeFile, readdir, readFile } = require("fs").promises;
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const fuzzy = require('fuzzy');
const _ = require('lodash');
// register autocomplete search
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

/**
 * get all files in the ignore files directory
 */
const configFiles = {};
const configFolderPath = path.resolve(__dirname, "ignorefiles");

/**
 * read files and loop through them
 *
 */
(async () => {
  const files = await readdir(configFolderPath).catch(console.log());

  for (let i of files) {
    // get language name
    const lng = i.split(".")[0];
    configFiles[lng] = path.join(configFolderPath, i);
  }

  console.log(chalk.blue("dotgitignore"));
  console.log(chalk.blue("Easily ignore environment files on your projects"));


  // search fuction
  function ignoreFiles(answer, input) {
    input = input || '';

    return new Promise(function (resolve) {
      setTimeout(function () {
        const ignoreNames = Object.keys(configFiles)
        var fuzzyResult = fuzzy.filter(input, ignoreNames);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      }, _.random(30, 500));
    });
  }

  //prompt user
  await inquirer
    .prompt([
      {
        name: "ignore",
        type: "autocomplete",
        message: "What project file do you wish to ignore. search:",
        source: ignoreFiles,
        searchText: 'Searching...',
        emptyText: 'Nothing found!',
        pageSize: 4,
      },
    ])
    .then(async ({ignore}) => {
      // read file based on chosen value
      const config = await readFile(configFiles[ignore]).catch((err) =>
        console.log(chalk.red(err))
      );
      console.log(config)
      // write fiile to root directory
      const gitignore = path.join(process.cwd(), ".gitignore");
      await writeFile(gitignore, config).catch((err) => {
        if (err) {
          console.log(chalk.red(err));
        }
      });
      console.log(chalk.green("successfully created an ignore file :tada"));
    });
})();