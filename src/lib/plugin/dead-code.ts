import { IPlugin } from '../interfaces';

export class DeadCode implements IPlugin<IDeadCodeOptions> {
  constructor(private options?: IDeadCodeOptions) {}

  getCostPerInstance(): number {
    return 15; // 15 minutes
  }

  getName(): string {
    return 'Dead Code';
  }

  run(): string[] {
    return ['string1', 'string2'];
  }
}

export interface IDeadCodeOptions {}
