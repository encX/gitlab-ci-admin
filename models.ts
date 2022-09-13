export interface Project {
  id: number;
  name: string;
  web_url: string;
}

export interface Pipeline {
  id: number;
  iid: number;
  sha: string;
  ref: string;
  status: "success" | "running" | "failed";
  created_at: string;
  web_url: string;
}

export interface Job {}

export interface Rail<T> {
  err?: Error;
  result: T | null;
}
