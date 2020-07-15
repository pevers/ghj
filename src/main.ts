#!/usr/bin/env node

import * as util from 'util';
import * as child_process from 'child_process';
import * as open from 'open';
import { Command, commands } from './commands';
import { RepoContext } from './context';
const exec = util.promisify(child_process.exec);

function printHelp() {
  const availableCommands = commands.reduce<string>(
    (previousValue: string, currentValue: Command) =>
      `\t${previousValue}\n\t${currentValue.name}\t${
        currentValue.option ? currentValue.option : ''
      }\t\t${currentValue.description}`,
    '',
  );

  console.info('usage: ghj <command>\n');
  console.info('where <command> is one of:');
  console.info(availableCommands);
  console.info('\thelp\t\t\tPrint this help page');
}

if (process.argv.length < 3 || process.argv.length > 4) {
  printHelp();
  process.exit(1);
}

const getRepoAndOrganization = async (): Promise<
  Pick<RepoContext, 'organization' | 'repo'>
> => {
  const { stdout, stderr } = await exec(
    "git remote get-url origin | sed -n 's/^.*:\\(.*\\).git$/\\1/p'",
  );

  if (stderr) {
    console.error(
      'Cannot get the current repository, are you sure you are in a GitHub repository?',
      stderr,
    );
    process.exit(1);
  }

  const tokens = stdout.trim().split('/');
  if (tokens.length != 2) {
    console.error(
      'Cannot get the current repository, are you sure you are in a GitHub repository?',
      stderr,
    );
    process.exit(1);
  }

  const organization = tokens[0];
  const repo = tokens[1];

  return {
    organization,
    repo,
  };
};

const getCurrentBranch = async (): Promise<string> => {
  const { stdout, stderr } = await exec('git rev-parse --abbrev-ref HEAD');

  if (stderr) {
    console.error(
      'Cannot get the current repository, are you sure you are in a GitHub repository?',
      stderr,
    );
    process.exit(1);
  }

  return stdout.trim();
};

const getContext = async (): Promise<RepoContext> => {
  const context = await Promise.all([
    getRepoAndOrganization(),
    getCurrentBranch(),
  ]);
  return {
    ...context[0],
    branch: context[1],
  };
};

(async () => {
  const commandString = process.argv[2];
  const args = process.argv.slice(2);

  const command = commands.filter((cmd) => cmd.name === commandString)[0];
  if (!command) {
    console.error(`Command not found ${command}`);
    printHelp();
    process.exit(1);
  }

  const context = await getContext();
  const url = command.url(context, ...args);
  await open(url);
})();
