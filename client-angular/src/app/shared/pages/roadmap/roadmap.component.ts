import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';

// Data with nested structure
interface TaskNode {
  name: string;
  children?: TaskNode[];
  link?: string;
}

const TASK_DATA: TaskNode[] = [
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

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss'],
})
export class RoadmapComponent implements OnInit {
  treeControl = new NestedTreeControl<TaskNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<TaskNode>();

  constructor() {
    this.dataSource.data = TASK_DATA;
  }

  hasChild = (_: number, node: TaskNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit(): void {}
}
