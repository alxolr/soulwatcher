import { IProject, IPlugin, IStat } from '../core/interfaces';
import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);

export class SlocPlugin implements IPlugin {
  public name = 'Sloc';

  public async run(project: IProject): Promise<ISlocStat> {
    let cmd = `npx sloc ${this.extractRootPath(project)}/`;

    const { stdout } = await execPromise(cmd, {
      cwd: project.path,
    });

    return ({
      'Lines of code': this.extractNumber('Source', stdout),
      Files: this.extractNumber('of files', stdout),
    } as unknown) as ISlocStat;
  }

  private extractNumber(word: string, logs: string): number {
    const regex = new RegExp(word);
    let sourceLine = logs
      .split('\n')
      .filter((line) => regex.test(line))
      .pop();

    if (!sourceLine) {
      return 0;
    }

    let number = sourceLine
      .trim()
      .split(':')
      .filter((line: string) => /\d/.test(line))
      .pop();

    return parseInt(number ? number : '0', 10);
  }

  private extractRootPath(project: IProject) {
    return project.root.split('/')[0];
  }
}

interface ISlocStat extends IStat {
  'Lines of code': number;
  Files: number;
}
