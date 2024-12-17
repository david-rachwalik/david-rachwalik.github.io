// Roadmap data with nested structure
export interface TaskNode {
  name: string;
  children?: TaskNode[];
  link?: string;
}

export const TASK_DATA: TaskNode[] = [
  {
    name: 'Life',
    children: [
      {
        name: 'Life Backlog [Azure DevOps]',
        link: 'https://dev.azure.com/david-rachwalik/Life/_backlogs/backlog/Life%20Team/Epics',
      },
      { name: 'Project setup and automation' },
      { name: 'Deployment pipeline' },
    ],
  },
  {
    name: 'Projects',
    children: [
      {
        name: 'DMR Backlog [Azure DevOps]',
        link: 'https://dev.azure.com/david-rachwalik/DMR/_backlogs/backlog/DMR%20Team/Epics',
      },
      {
        name: 'PC Setup',
        children: [
          {
            name: 'pc-setup Backlog [Azure DevOps]',
            link: 'https://dev.azure.com/david-rachwalik/pc-setup/_backlogs/backlog/pc-setup%20Team/Epics',
          },
          {
            name: 'Planning board',
            link: 'https://dev.azure.com/david-rachwalik/DMR/_backlogs/backlog/DMR%20Team/Epics',
          },
          { name: 'Project setup and automation' },
          { name: 'DevOps - deployment pipeline' },
        ],
      },
      {
        name: 'eRPGe',
        children: [
          { name: 'Broccoli', link: 'https://www.example.com' },
          { name: 'Brussels sprouts' },
        ],
      },
    ],
  },
];
