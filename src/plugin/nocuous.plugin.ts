import { IProject, IPlugin } from '../core/interfaces';
import { exec } from 'child_process';
import { promisify, format } from 'util';
const execPromise = promisify(exec);

export class NocuousPlugin implements IPlugin<IStats> {
  public name = 'Nocuous';

  public async run<IStats>(project: IProject): Promise<IStats> {
    let cmd = format('npx nocuous %s', project.root);

    // const { stdout } = await execPromise(cmd, {
    //   cwd: project.path,
    // });

    return ({
      Files: 1,
    } as unknown) as IStats;
  }

  // private extractNumberOfLines(logs: string): number {
  //   let sourceLine = logs
  //     .split('\n')
  //     .filter((line) => /Source/.test(line))
  //     .pop();

  //   if (!sourceLine) {
  //     return 0;
  //   }

  //   let number = sourceLine
  //     .trim()
  //     .split(':')
  //     .filter((line: string) => /\d/.test(line))
  //     .pop();

  //   return parseInt(number ? number : '0', 10);
  // }
}

interface IStats {
  Files: number;
}
