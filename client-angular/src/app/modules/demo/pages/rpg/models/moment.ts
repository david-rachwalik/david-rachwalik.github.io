export interface MomentChoice {
  id: string;
  label: string;
  enabled?: boolean;
}

export interface Moment {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  choices: MomentChoice[];
}
