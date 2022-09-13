import { Handlers, PageProps } from "$fresh/server.ts";
import { GitLabHost, GitLabKey } from "../../constants.ts";
import { Pipeline, Rail } from "../../models.ts";

export const handler: Handlers<Rail<Pipeline>> = {
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
          `Statuscode ${projectResp.status}; ${await projectResp.json()}`,
        ),
        result: null,
      });
    }

    const pipeline: Pipeline = await projectResp.json();
    return ctx.render({ result: pipeline });
  },
};

export default function ProjectPage({ data }: PageProps<Rail<Pipeline>>) {
  // validate param 'projectid' is an int?
  // render skeleton page
  // fetch project detail
  // if project not found return 404 page
  // else fetch pipeline from project and render rows
  if (data.err) return <div>{data.err.message}</div>;
  const pipeline = data.result!;
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      Pipeline page where it infinite-load jobs for pipeline{JSON.stringify(
        pipeline,
      )}
      {/* <a href={project.web_url} className="font-bold">{project.name}</a> */}
      <p>job</p>
      <p>job</p>
      <p>job</p>
      <p>job</p>
      <p>job</p>
      <p>job</p>
      <p>job</p>
    </div>
  );
}
