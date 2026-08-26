import { notFound } from 'next/navigation';
import { projects as DEFAULT_PROJECTS } from '@/lib/constants';
import CaseStudyClient from './CaseStudyClient';

async function getProject(slug: string) {
  // Use static data since we removed backend portfolio fetching
  const projects = DEFAULT_PROJECTS;
  return projects.find((p: any) => p.slug === slug);
}

export default async function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project || !project.caseStudy) {
    notFound();
  }

  return <CaseStudyClient project={project} />;
}
