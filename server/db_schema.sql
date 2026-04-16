-- PostgreSQL Initialization Script for Sentinel

-- Connect to your database
-- psql -U postgres -d sentinel

-- Legacy table logic removed. Do not use 'vehicles'.

-- Create the plates table (managed by OCR system)
CREATE TABLE IF NOT EXISTS plates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_text TEXT NOT NULL,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  camera_id TEXT
);

-- Note: Ensure UUID extension works properly. Assuming PG >= 13 where gen_random_uuid() is built-in.

-- Create the approvals table (managed by Sentinel application logic)
CREATE TABLE IF NOT EXISTS approvals (
  id SERIAL PRIMARY KEY,
  plate_id UUID REFERENCES plates(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('approved', 'rejected')),
  approved_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plate_id)
);
