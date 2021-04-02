import EventEmitter from 'events';
import { IProject, IPlugin } from './interfaces';

export class Runner extends EventEmitter {
  public plugins: IPlugin<unknown>[] = [];
  constructor(private readonly projects: IProject[]) {
    super();
  }

  public add<T>(plugin: IPlugin<T>) {
    this.plugins.push(plugin);

    return this;
  }

  async execute() {
    let promises = [];
    for (let project of this.projects) {
      console.log('\nChecking %s', project.name);

      for (let plugin of this.plugins) {
        console.log('Running plugin %s', plugin.name);
        promises.push(plugin.run(project));
      }
    }

    let stats = await Promise.all(promises);
    for (let stat of stats) {
      this.emit('stats', stat);
    }
  }
}
