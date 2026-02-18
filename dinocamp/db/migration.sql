-- Migration script to add username and emoji columns to existing users table
-- Run this if you already have a users table without these columns

-- Add username column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'username'
    ) THEN
        ALTER TABLE users ADD COLUMN username VARCHAR(255);
    END IF;
END $$;

-- Add emoji column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'emoji'
    ) THEN
        ALTER TABLE users ADD COLUMN emoji VARCHAR(10);
    END IF;
END $$;

-- Update existing rows with default values if they're null
UPDATE users SET username = 'User' || id WHERE username IS NULL;
UPDATE users SET emoji = '🦕' WHERE emoji IS NULL;

-- Make username and emoji NOT NULL after setting defaults
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users ALTER COLUMN emoji SET NOT NULL;
