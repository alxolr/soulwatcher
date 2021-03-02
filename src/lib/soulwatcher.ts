import { IPlugin, IStats } from './interfaces';

export class Soulwatcher {
  private plugins: IPlugin<any>[] = [];
  constructor() {}

  addPlugin<T>(plugin: IPlugin<T>) {
    this.plugins.push(plugin);

    return this;
  }

  async execute() {
    const stats: IStats<any>[] = [];

    this.plugins.forEach(async (plugin) => {
      let tokenized = plugin.run();
      const stat: IStats<any> = {
        Instances: tokenized.length,
        Smell: plugin.getName(),
        TimeToFix: tokenized.length * plugin.getCostPerInstance(),
      };

      stats.push(stat);
    });

    console.table(stats);
  }
}
