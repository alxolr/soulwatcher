import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Runner } from './core/runner';
import { SlocPlugin } from './plugin/sloc.plugin';
import { NocuousPlugin } from './plugin/nocuous.plugin';
import { sumStats } from './util';

(async () => {
  try {
    let projects = yaml.load(readFileSync(process.argv[2], 'utf8'));
    let runner = new Runner(projects);
    let stats: any = {};
    runner.on('stats', sumStats(stats));

    runner.add(new SlocPlugin()).add(new NocuousPlugin());
    await runner.execute();

    console.log(stats);
  } catch (err) {
    console.log(err);
  }
})();
