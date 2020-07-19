import { commands } from "../build/src/commands";

describe('command invocation', () => {
  it('issue command returns the issue URL', () => {
    const command = commands.filter(cmd => cmd.name === 'issue')[0];
    expect(command.option).toBe('repo');
    const url = command.url({ organization: 'test', repo: 'test', branch: 'master' });
    expect(url).toBe('https://github.com/test/test/issues/new');
  });

  it('issue command with parameter return issue URL of target repo', () => {
    const command = commands.filter(cmd => cmd.name === 'issue')[0];
    expect(command.option).toBe('repo');
    const url = command.url({ organization: 'test', repo: 'test', branch: 'master' }, 'target-repo');
    expect(url).toBe('https://github.com/test/target-repo/issues/new');
  });

  it('pr command return the PR URL', () => {
    const command = commands.filter(cmd => cmd.name === 'pr')[0];
    expect(command.option).toBe('branch');
    const url = command.url({ organization: 'test', repo: 'test', branch: 'staging' });
    expect(url).toBe('https://github.com/test/test/compare/master...staging');    
  });

  it('pr command with parameter return the PR URL with a different target', () => {
    const command = commands.filter(cmd => cmd.name === 'pr')[0];
    expect(command.option).toBe('branch');
    const url = command.url({ organization: 'test', repo: 'test', branch: 'staging' }, 'some-branch');
    expect(url).toBe('https://github.com/test/test/compare/some-branch...staging');    
  });

  it('board command return the board URL', () => {
    const command = commands.filter(cmd => cmd.name === 'board')[0];
    expect(command.option).toBeUndefined();
    const url = command.url({ organization: 'test', repo: 'test', branch: 'staging' });
    expect(url).toBe('https://github.com/orgs/test/projects');       
  });
});