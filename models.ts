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
  source: string;
  created_at: string;
  web_url: string;
}

export interface Job {
  id: number;
  status: string;
  stage: string;
  name: string;
  allow_failure: boolean;
  created_at: string;
  started_at: string;
  finished_at: string;
  duration: number;
  queued_duration: number;
  pipeline: Pipeline;
  web_url: string;
}

export interface Rail<T> {
  err?: Error;
  result: T | null;
}
