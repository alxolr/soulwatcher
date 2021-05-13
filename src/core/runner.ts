import EventEmitter from 'events';
import { IProject, IPlugin } from './interfaces';

export class Runner extends EventEmitter {
  public plugins: IPlugin[] = [];
  constructor(private readonly projects: IProject[]) {
    super();
  }

  public add(plugin: IPlugin) {
    this.plugins.push(plugin);

    return this;
  }

  async execute() {
    for (let project of this.projects) {
      console.log('\nChecking %s', project.name);

      for (let plugin of this.plugins) {
        console.log('Running plugin %s', plugin.name);

        const stat = {
          [plugin.name]: await plugin.run(project),
        };

        this.emit('stats', stat);
      }
    }
  }
}
