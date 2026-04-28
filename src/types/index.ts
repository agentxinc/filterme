export interface LifeEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string | null;
  imageFile?: File | null;
}

export interface StoryPage {
  eventId: string;
  title: string;
  date: string;
  narrative: string;
  imageUrl: string | null;
  pageNumber: number;
}

export interface GeneratedStory {
  title: string;
  subtitle: string;
  pages: StoryPage[];
  generatedAt: string;
}
