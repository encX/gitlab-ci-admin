import { PageProps } from "$fresh/server.ts";

export default function ProjectPipelines({ params }: PageProps) {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      List pipelines for project {params.projectid}
    </div>
  );
}
