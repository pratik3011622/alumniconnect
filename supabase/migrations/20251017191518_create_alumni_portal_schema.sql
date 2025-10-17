/*
  # Alumni Portal Database Schema
  
  ## Overview
  Complete database schema for university alumni portal with authentication, profiles, events, jobs, messaging, and connections.
  
  ## New Tables
  
  ### 1. profiles
  Extended user profile information for all users (alumni, students, admins)
  - Links to auth.users via user_id
  - Stores: role, batch, branch, profession, company, location, bio, social links
  - Includes approval status for alumni verification
  
  ### 2. connection_requests
  Manages connection requests between alumni
  - sender_id: User sending the request
  - receiver_id: User receiving the request
  - status: pending, accepted, rejected
  
  ### 3. events
  University and alumni events
  - title, description, date, location, capacity
  - created_by: Admin who created the event
  - Tracks registration count
  
  ### 4. event_registrations
  Tracks which users registered for which events
  - Links users to events
  - Prevents duplicate registrations
  
  ### 5. jobs
  Job and internship postings by alumni
  - title, company, description, type (job/internship)
  - location, salary_range, requirements
  - posted_by: Alumni who posted the job
  
  ### 6. job_applications
  Tracks job applications from students/alumni
  - Links applicants to jobs
  - Stores cover letter and resume link
  
  ### 7. messages
  Direct messaging between users
  - sender_id, receiver_id, content
  - read status tracking
  
  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users based on roles
  - Users can only modify their own data
  - Admins have elevated permissions
  - Public read access for approved alumni profiles
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'alumni', 'student');
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE job_type AS ENUM ('job', 'internship');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email text NOT NULL,
  full_name text NOT NULL,
  role user_role DEFAULT 'student' NOT NULL,
  batch text,
  branch text,
  profession text,
  company text,
  location text,
  bio text,
  linkedin_url text,
  resume_url text,
  avatar_url text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Connection requests table
CREATE TABLE IF NOT EXISTS connection_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  status connection_status DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date timestamptz NOT NULL,
  location text NOT NULL,
  capacity integer DEFAULT 0,
  registration_count integer DEFAULT 0,
  image_url text,
  created_by uuid REFERENCES profiles(user_id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  type job_type DEFAULT 'job' NOT NULL,
  location text NOT NULL,
  salary_range text,
  requirements text,
  posted_by uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  cover_letter text,
  resume_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public can view approved alumni profiles"
  ON profiles FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Connection Requests Policies
CREATE POLICY "Users can view their own connection requests"
  ON connection_requests FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can create connection requests"
  ON connection_requests FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update received connection requests"
  ON connection_requests FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

CREATE POLICY "Users can delete their sent connection requests"
  ON connection_requests FOR DELETE
  TO authenticated
  USING (sender_id = auth.uid());

-- Events Policies
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Event Registrations Policies
CREATE POLICY "Users can view their own event registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all event registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can cancel their event registrations"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Jobs Policies
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  USING (is_active = true OR posted_by = auth.uid());

CREATE POLICY "Alumni can create job posts"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    posted_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'alumni'
    )
  );

CREATE POLICY "Job posters can update their jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (posted_by = auth.uid())
  WITH CHECK (posted_by = auth.uid());

CREATE POLICY "Job posters can delete their jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (posted_by = auth.uid());

CREATE POLICY "Admins can manage all jobs"
  ON jobs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Job Applications Policies
CREATE POLICY "Users can view their own applications"
  ON job_applications FOR SELECT
  TO authenticated
  USING (applicant_id = auth.uid());

CREATE POLICY "Job posters can view applications"
  ON job_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_applications.job_id AND jobs.posted_by = auth.uid()
    )
  );

CREATE POLICY "Users can create applications"
  ON job_applications FOR INSERT
  TO authenticated
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Users can delete their applications"
  ON job_applications FOR DELETE
  TO authenticated
  USING (applicant_id = auth.uid());

-- Messages Policies
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipients can update message read status"
  ON messages FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_connection_requests_sender ON connection_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_receiver ON connection_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_job_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connection_requests_updated_at BEFORE UPDATE ON connection_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();