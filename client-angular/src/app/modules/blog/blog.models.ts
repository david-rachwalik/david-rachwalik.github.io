export interface BlogMetadata {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  created: string;
  modified: string;
  active: boolean;
  tags: string[];
  category?: string;
  imagePath?: string;
}

export interface BlogArticle {
  metadata: BlogMetadata;
  content: string;
  error: string;
}
