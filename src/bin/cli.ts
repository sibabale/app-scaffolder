#!/usr/bin/env node

import { scaffoldApp } from '../scaffold.js';
import inquirer from 'inquirer';

const questions = [
  {
    type: 'input',
    name: 'appName',
    message: 'What is the name of your app?',
    validate: (input:string) => input ? true : 'App name cannot be empty.'
  },
  {
    type: 'list',
    name: 'framework',
    message: 'Which framework would you like to use?',
    choices: ['React', 'Vue', 'Angular', 'Svelte'],
  },
  {
    type: 'list',
    name: 'styleLibrary',
    message: 'Which style library would you like to use?',
    choices: ['Bootstrap', 'Tailwind CSS', 'Material UI', 'None'],
  },
  {
    type: 'list',
    name: 'packageManager',
    message: 'Which package manager would you like to use?',
    choices: ['yarn', 'npm'],
  },
];

inquirer.prompt(questions).then(answers => {
  scaffoldApp(answers.appName, answers.framework, answers.styleLibrary, answers.packageManager);
});
