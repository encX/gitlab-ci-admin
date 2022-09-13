import { Handlers, PageProps } from "$fresh/server.ts";
import { GitLabHost, GitLabKey } from "../../constants.ts";
import { Job, Pipeline, Project, Rail } from "../../models.ts";

interface ProjectPageVM {
  project: Project;
  pipelines: Pipeline[];
  jobs: Job[];
}

export const handler: Handlers<Rail<ProjectPageVM>> = {
  async GET(_, ctx) {
    const { projectid: _projectId } = ctx.params;
    if (!/^\d+$/.test(_projectId)) {
      return ctx.render({
        err: new Error("Project Id invalid format"),
        result: null,
      });
    }
    const projectId = Number.parseInt(_projectId);
    const projectResp = await fetch(
      `${GitLabHost}/api/v4/projects/${projectId}`,
      { headers: { "PRIVATE-TOKEN": GitLabKey } },
    );

    if (projectResp.status === 404) {
      return ctx.render({ err: new Error("Project not found"), result: null });
    }

    if (projectResp.status !== 200) {
      return ctx.render({
        err: new Error(
          `Gitlab returned status ${projectResp.status};`,
        ),
        result: null,
      });
    }

    const pipelinesResp = await fetch(
      `${GitLabHost}/api/v4/projects/${projectId}/pipelines`,
      { headers: { "PRIVATE-TOKEN": GitLabKey } },
    );

    if (pipelinesResp.status !== 200) {
      return ctx.render({
        err: new Error(
          `Gitlab returned status ${projectResp.status};`,
        ),
        result: null,
      });
    }

    const jobsResp = await fetch(
      `${GitLabHost}/api/v4/projects/${projectId}/jobs`,
      { headers: { "PRIVATE-TOKEN": GitLabKey } },
    );

    if (jobsResp.status !== 200) {
      return ctx.render({
        err: new Error(
          `Gitlab returned status ${jobsResp.status};`,
        ),
        result: null,
      });
    }
    const project: Project = await projectResp.json();
    const pipelines: Pipeline[] = await pipelinesResp.json();
    const jobs: Job[] = await jobsResp.json();
    return ctx.render({ result: { project, pipelines, jobs } });
  },
};

export default function ProjectPage({ data }: PageProps<Rail<ProjectPageVM>>) {
  // validate param 'projectid' is an int?
  // render skeleton page
  // fetch project detail
  // if project not found return 404 page
  // else fetch pipeline from project and render rows
  if (data.err) return <div>{data.err.message}</div>;
  const { project, pipelines, jobs } = data.result!;

  const pipelinesList = () =>
    pipelines.map((p) => (
      <p>
        IID: {p.iid} Ref: {p.ref} SHA: {p.sha} Status: {p.status}{" "}
        <a href={p.web_url}>View</a>
      </p>
    ));

  const jobsList = () =>
    jobs.map((j) => (
      <p>
        ID: {j.id} Pipeline: {j.pipeline.iid} Queued: {j.queued_duration}{" "}
        Duration: {j.duration} <a href={j.web_url}>View</a>
      </p>
    ));

  return (
    <div class="p-4 mx-auto max-w-screen-md">
      Project page where it infinite-load pipelines for project{" "}
      <a href={project.web_url} className="font-bold">{project.name}</a>
      <div className="mt-8">{pipelinesList()}</div>
      <div className="mt-8">{jobsList()}</div>
    </div>
  );
}
