import React from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Project {
  name: string;
  client: string;
  description: string;
  technologies: string[];
  link?: string;
  isInternal?: boolean;
  highlight: string;
}

const projects: Project[] = [
  {
    name: 'Floor Coordinator – SBOSS',
    client: 'State Bank of India',
    description: 'A high-scale customer and branch feedback system designed to capture and process transactional feedback entries across SBI branches, ensuring reliability, performance, and data integrity.',
    technologies: ['Node.js', 'Backend Architecture', 'High Availability'],
    link: 'https://www.sbossfc.com/login',
    highlight: '10-11 Lakh daily transactions',
  },
  {
    name: 'Admin Feedback System',
    client: 'Canara Bank',
    description: 'An internal admin feedback platform enabling secure role-based feedback collection, reporting, and analysis for internal stakeholders.',
    technologies: ['Node.js', 'React.js', 'Oracle Database', 'NGINX'],
    isInternal: true,
    highlight: 'Enterprise-grade security',
  },
  {
    name: 'Customer Feedback System',
    client: 'Canara Bank',
    description: 'A large-scale customer feedback system built for high availability, fast processing, and secure backend operations.',
    technologies: ['Node.js', 'Backend Architecture', 'Performance Optimization'],
    link: 'https://canfeedback.canarabank.bank.in/cankiosk',
    highlight: '14-15 Lakh daily submissions',
  },
];

export function ProjectsWindow() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Featured Projects</h2>
        <p className="text-sm text-muted-foreground">Enterprise-scale systems for major Indian banks</p>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground">{project.name}</h3>
                <p className="text-sm text-primary">{project.client}</p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {project.highlight}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">{project.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>

            {project.isInternal ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Internal deployment (hosted on bank servers)</span>
              </div>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live
                </a>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
