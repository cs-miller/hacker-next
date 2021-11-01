export interface User {
  id: string;
  created: string;
  karma: number;
  about?: string;
  submitted: Array<string>;
}

export interface Story {
  id: string;
  type: "story";
  deleted?: boolean;
  by?: string;
  time?: string;
  text?: string;
  dead?: boolean;
  kids: Array<string>;
  url?: string;
  score?: number;
  title?: string;
  descendants?: number;
}

export interface Comment {
  id: string;
  type: "comment";
  deleted?: boolean;
  by?: string;
  time?: string;
  text?: string;
  dead?: boolean;
  parent?: string;
  kids: Array<string>;
}

export interface Job {
  id: string;
  type: "job";
  deleted?: boolean;
  by?: string;
  time?: string;
  text?: string;
  dead?: boolean;
  url?: string;
  score?: number;
  title?: string;
  descendants?: number;
}
