import { RepoContext } from './context';

export type Command = {
  name: 'issue' | 'pr' | 'board';
  description: string;
  url: (context: RepoContext, ...args: string[]) => string;
  option?: string;
};

export const commands: Command[] = [
  {
    name: 'issue',
    description:
      'Open a new pull request for a the current repo or target <repo>',
    option: 'repo',
    url: (context: RepoContext, ...args: string[]): string => {
      let targetRepo = context.repo;
      if (args.length == 2) {
        // ghj issue other-repo
        targetRepo = args[1];
      }
      return `https://github.com/${context.organization}/${targetRepo}/issues/new`;
    },
  },
  {
    name: 'pr',
    description:
      'Open a new pull request in the current repo against master or target <branch>',
    option: 'branch',
    url: (context: RepoContext, ...args: string[]): string => {
      let targetBranch = 'master';
      if (args.length == 2) {
        // ghj pr other-branch
        targetBranch = args[1];
      }
      return `https://github.com/${context.organization}/${context.repo}/compare/${targetBranch}...${context.branch}`;
    },
  },
  {
    name: 'board',
    description:
      'Open the project board for the organization (note: not for a user)',
    url: (context: RepoContext): string =>
      `https://github.com/orgs/${context.organization}/projects`,
  },
];
