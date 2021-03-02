export interface IPlugin<T> {
  getCostPerInstance(): number;
  getName(): string;
  getOptions?(): T;
  run(): string[];
}

export interface IStats<T> {
  Smell: string;
  Instances: number;
  TimeToFix: number;
}
