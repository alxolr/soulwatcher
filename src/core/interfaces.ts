export interface IPlugin {
  name: string;
  run(project: IProject): Promise<IStat>;
}

export interface IProject {
  name: string;
  path: string;
  root: string;
}

export interface IStat {
  [k: string]: number | undefined;
}
