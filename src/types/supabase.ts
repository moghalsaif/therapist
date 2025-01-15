export interface Therapist {
  id: string;
  name: string;
  email: string;
  bio: string;
  specialties: string[];
  languages: string[];
  session_format: 'in-person' | 'online' | 'both';
  rate: number;
  rating: number;
  location: string;
  availability: {
    [key: string]: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  age: string;
  location: string;
  preferred_language: string;
  session_format: 'in-person' | 'online' | 'both';
  budget: string;
  issues: string[];
  gender_preference: 'male' | 'female' | 'no-preference';
  additional_notes: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  therapist_id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  therapist: Therapist;
} 