import { IProject, IPlugin } from '../core/interfaces';
import { exec } from 'child_process';
import { promisify, format } from 'util';
import { createReadStream } from 'fs';
import { parse } from '@fast-csv/parse';
import { sumStats } from '../util';
const execPromise = promisify(exec);

export class NocuousPlugin implements IPlugin {
  public name = 'Nocuous';

  public async run<INucousStats>(project: IProject): Promise<INucousStats> {
    const filePath = `/tmp/${this.name}-${project.name}.csv`;
    let cmd = format('npx nocuous %s -o %s', project.root, filePath);
    await execPromise(cmd, { cwd: project.path });

    return (this.processNocuousStats(filePath) as unknown) as INucousStats;
  }

  private processNocuousStats(filePath: string): Promise<INucousStats> {
    let stats: any[] = [];
    return new Promise((resolve) => {
      createReadStream(filePath)
        .pipe(parse({ headers: true }))
        .on('data', (data: unknown) => {
          stats.push(this.normalize(data));
        })
        .on('end', () => {
          let aggStats: INucousStats = {};
          stats.forEach(sumStats(aggStats));
          resolve(aggStats);
        });
    });
  }

  private normalize(row: any): INucousStats {
    const item: INucousStats = {};
    let total = 0;
    for (let key of Object.keys(row)) {
      if (key !== 'Path') {
        if (!(key in row)) {
          item[key] = 0;
        } else {
          let value = Math.ceil(parseFloat(row[key])) || 0;
          total += value;
          item[key] = value;
        }
      }
    }
    return item;
  }
}

interface INucousStats {
  [k: string]: number | undefined;
}
