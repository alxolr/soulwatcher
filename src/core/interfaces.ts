export interface IPlugin<T> {
  name: string;
  run<T>(project: IProject): Promise<T>;
}

export interface IProject {
  name: string;
  path: string;
  root: string;
}

// 4 sprints
