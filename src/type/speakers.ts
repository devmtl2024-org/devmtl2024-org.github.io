export interface Speaker {
  name: string;
  bio: string | null;
  position: string | null;
  // Set on the sessions hosted by a partner meetup
  community?: string;
  image: string;
  time: string;
  track: number;
  title: string;
  description: string;
  github: string | null;
  linkedin: string | null;
  website: string | null;
  videoLink?: string;
}
