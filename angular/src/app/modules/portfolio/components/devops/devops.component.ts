import { Component, OnInit } from '@angular/core';

interface ProjectCard {
  flex: string;
  header: string;
  path: string;
  content: string;
}

@Component({
  selector: 'app-devops',
  templateUrl: './devops.component.html',
  styleUrls: ['./devops.component.scss'],
})
export class DevopsComponent implements OnInit {
  projectCards: ProjectCard[];

  constructor() {
    this.projectCards = [
      {
        flex: '33.3%',
        header: 'Presentation 4.2 - Continuous Integration (CI)',
        path: '/portfolio/buwebdev/web-430/ci',
        content:
          'A detailed presentation that summarizes what Continuous Integration is and how it is used.',
      },
      {
        flex: '33.3%',
        header: 'Presentation 6.2 - Dangers of Change Approval Processes',
        path: '/portfolio/buwebdev/web-430/ca-processes',
        content:
          'A detailed presentation that summarizes the dangers of having poor change management processes as it relates to DevOps.',
      },
      {
        flex: '33.3%',
        header: 'Presentation 7.2 - Technology vs Business',
        path: '/portfolio/buwebdev/web-430/it-vs-business',
        content:
          'A detailed presentation summarizing the balance between technology-driven versus business-driven decision making.',
      },
      {
        flex: '33.3%',
        header:
          'Presentation 8.2 - Security Controls in Shared Source Code Repositories',
        path: '/portfolio/buwebdev/web-430/source-control-security',
        content:
          'Presentation that summarizes how to have secure controls for a shared source code repository.',
      },
      {
        flex: '33.3%',
        header: 'Presentation 9.2 - Change Management',
        path: '/portfolio/buwebdev/web-430/change-management',
        content:
          'Presentation that summarizes the details of a software change management process.',
      },
    ];
  }

  ngOnInit(): void {}
}
