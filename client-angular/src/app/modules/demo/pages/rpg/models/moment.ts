export interface MomentChoice {
  id: string;
  label: string;
  enabled?: boolean;
}

export interface Moment {
  id: string;
  title: string;
  description: string; // tooltips
  content: string;
  choices: MomentChoice[];
  tags: string[];
}
