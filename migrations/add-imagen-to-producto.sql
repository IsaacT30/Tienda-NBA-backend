-- Migration: Add 'imagen' column to 'productos' table
ALTER TABLE productos ADD COLUMN imagen VARCHAR(255) NULL;
