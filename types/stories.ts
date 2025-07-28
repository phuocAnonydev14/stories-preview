interface Timeline {
  event_date: string;
  exact_time?: string | null;
  estimated_period?: string | null;
  estimated_period_time?: string | null;
  event: string;
}

interface KeyFigure {
  name: string;
  description: string;
  quote: any;
}

interface KeyStat {
  value: string;
  description: string;
}

interface Article {
  title: string;
  url: string;
  image: string
}

export interface Story {
  id: string;
  title: string;
  overview: string;
  highlights: string[];
  timeline: Timeline[];
  locations: string[];
  key_figures: KeyFigure[];
  key_stats: KeyStat[];
  category: string;
  created_at: number;
  updated_at: number;
  last_article_published_at: number;
  articles: Article[];
}
