#!/usr/bin/env node
const { writeFile, readdir, readFile } = require("fs").promises;
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");

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

  //prompt user
  await inquirer
    .prompt([
      {
        name: "ignore",
        type: "list",
        message: "What project file do you wish to ignore",
        choices: Object.keys(configFiles),
      },
    ])
    .then(async ({ ignore }) => {
      // read file based on chosen value
      const config = await readFile(configFiles[ignore]).catch((err) =>
        console.log(chalk.red(err))
      );
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
