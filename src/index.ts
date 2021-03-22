import { spawnSync } from 'child_process';
import { parse } from '@fast-csv/parse';
import { createReadStream, readFileSync } from 'fs';
import * as yaml from 'js-yaml';

interface Statistics {
  Path: string;
  'File length': string | number;
  'Class fan-out complexity': string | number;
  'Class data abstraction coupling': string | number;
  'Anonymous inner length': string | number;
  'Function length': string | number;
  'Parameter number': string | number;
  'Cyclomatic complexity': string | number;
  'Nested if depth': string | number;
  'Binary expression complexity': string | number;
  'Nested try depth': string | number;
  'Missing switch default': string | number;
  Total?: number;
  Files?: number;
}

(async () => {
  try {
    let projects = yaml.load(readFileSync(process.argv[2], 'utf8'));
    let everyStats = [];
    for (let project of projects) {
      const filePath = `/tmp/${project.name}.csv`;
      console.log(`Checking ${project.name}`);
      spawnSync('npx', ['nocuous', 'stat', project.root, '-o', filePath], {
        cwd: project.path,
      });

      let result = await parseResults(filePath);
      result['Project'] = project.name;

      everyStats.push(result);
    }

    let result = everyStats.reduce(aggregateStats, { Total: 0, Files: 0 });
    delete result.Project;

    console.table(beautify(result));

    everyStats.map(beautify).forEach((item) => console.table(item));
  } catch (err) {
    console.log(err);
  }
})();

function normalize(row: any): Statistics {
  const item: any = {};
  let total = 0;
  for (let key of Object.keys(row)) {
    if (key === 'Path') {
      item['Path'] = row.Path;
    } else {
      if (row[key] === '') {
        item[key] = 0;
      } else {
        let value = parseFloat(row[key]);
        total += value;
        item[key] = value;
      }
    }
  }

  item['Total'] = total;

  return item;
}

function parseResults(filePath: any): Promise<any> {
  let results: any[] = [];
  return new Promise((resolve) => {
    createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on('data', (row: Statistics) => {
        results.push(normalize(row));
      })
      .on('end', () => {
        let statsPerProject = results.reduce(aggregateStats, {
          Files: 0,
          Total: 0,
        } as Statistics);
        resolve(statsPerProject);
      });
  });
}

function aggregateStats(acc: any, item: any, index: number, arr: any) {
  if ('Files' in item) {
    acc.Files += item['Files'];
  } else {
    acc.Files += 1;
  }

  for (let key of Object.keys(item)) {
    if (key === 'Path') continue;

    if (!(key in acc)) {
      acc[key] = item[key];
    } else {
      acc[key] += item[key];
    }
  }

  return acc;
}

function beautify(record: any) {
  let result: any = {};
  for (let key of Object.keys(record)) {
    if (key !== 'Project') {
      result[key] = Math.floor(record[key]);
    } else {
      result[key] = record[key];
    }
  }

  return result;
}
