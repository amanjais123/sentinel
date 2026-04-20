-- PostgreSQL Initialization Script for Sentinel

-- Connect to your database
-- psql -U postgres -d sentinel

-- Legacy table logic removed. Do not use 'vehicles'.

-- Create the plates table (managed by OCR system)
CREATE TABLE plates (
    id SERIAL PRIMARY KEY,
    plate_text VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: Ensure UUID extension works properly. Assuming PG >= 13 where gen_random_uuid() is built-in.

-- Create the approvals table (managed by Sentinel application logic)
DROP TABLE IF EXISTS approvals;

CREATE TABLE approvals (
  id SERIAL PRIMARY KEY,
  plate_id INTEGER REFERENCES plates(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('approved', 'rejected')),
  approved_by TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plate_id)
);
