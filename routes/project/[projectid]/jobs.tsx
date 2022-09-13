import { PageProps } from "$fresh/server.ts";

export default function ProjectJobs({ params }: PageProps) {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      List jobs for project {params.projectid}
    </div>
  );
}
