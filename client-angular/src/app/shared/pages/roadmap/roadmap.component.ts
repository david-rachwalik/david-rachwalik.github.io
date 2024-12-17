import { NestedTreeControl } from '@angular/cdk/tree';
import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatNestedTreeNode,
  MatTree,
  MatTreeNestedDataSource,
  MatTreeNode,
  MatTreeNodeDef,
  MatTreeNodeOutlet,
  MatTreeNodeToggle,
} from '@angular/material/tree';

import { TASK_DATA, TaskNode } from './roadmap.data';

@Component({
  selector: 'app-roadmap',
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatTree,
    MatTreeNodeDef,
    MatTreeNode,
    MatTreeNodeToggle,
    NgIf,
    MatIcon,
    MatNestedTreeNode,
    MatIconButton,
    MatTreeNodeOutlet,
  ],
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
