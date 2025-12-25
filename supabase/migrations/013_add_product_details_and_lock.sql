-- ============================================
-- Migration: Add product_details JSONB, total_tang_count, and is_locked
-- Purpose: Support sub-category tracking and immutable records
-- ============================================

-- 1. Add product_details JSONB column for sub-category counts
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS product_details JSONB DEFAULT '{}'::jsonb;

-- 2. Ensure total_tang_count exists (Integer, default 0)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_tang_count integer DEFAULT 0;

-- 3. Add is_locked column (Boolean, default false)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS is_locked boolean DEFAULT false NOT NULL;

-- 4. Add index on is_locked for performance
CREATE INDEX IF NOT EXISTS idx_daily_records_is_locked ON daily_records(is_locked);

-- 5. Add index on product_details for JSONB queries (GIN index)
CREATE INDEX IF NOT EXISTS idx_daily_records_product_details ON daily_records USING GIN (product_details);

-- ============================================
-- 6. Create Trigger Function to prevent UPDATE/DELETE when locked
-- ============================================
CREATE OR REPLACE FUNCTION prevent_locked_record_modification()
RETURNS TRIGGER AS $$
BEGIN
    -- For UPDATE: Check if the record is locked
    IF TG_OP = 'UPDATE' THEN
        -- Check OLD record (before update)
        IF OLD.is_locked = true THEN
            RAISE EXCEPTION 'Cannot update record: Record is locked (is_locked = true). Record ID: %', OLD.id;
        END IF;
        -- Prevent changing is_locked from true to false
        IF OLD.is_locked = false AND NEW.is_locked = false THEN
            -- Allow normal updates when not locked
            RETURN NEW;
        END IF;
        RETURN NEW;
    END IF;
    
    -- For DELETE: Check if the record is locked
    IF TG_OP = 'DELETE' THEN
        IF OLD.is_locked = true THEN
            RAISE EXCEPTION 'Cannot delete record: Record is locked (is_locked = true). Record ID: %', OLD.id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7. Create Trigger BEFORE UPDATE and DELETE
DROP TRIGGER IF EXISTS trigger_prevent_locked_update ON daily_records;
CREATE TRIGGER trigger_prevent_locked_update
    BEFORE UPDATE ON daily_records
    FOR EACH ROW
    EXECUTE FUNCTION prevent_locked_record_modification();

DROP TRIGGER IF EXISTS trigger_prevent_locked_delete ON daily_records;
CREATE TRIGGER trigger_prevent_locked_delete
    BEFORE DELETE ON daily_records
    FOR EACH ROW
    EXECUTE FUNCTION prevent_locked_record_modification();

-- ============================================
-- 8. Alternative: RLS Policy (if using Supabase RLS instead of triggers)
-- ============================================
-- Uncomment below if you prefer RLS over triggers:
/*
-- Policy: Users can only update their own records if NOT locked
DROP POLICY IF EXISTS "Users can update unlocked records" ON daily_records;
CREATE POLICY "Users can update unlocked records" ON daily_records
    FOR UPDATE
    USING (
        auth.uid() = user_id 
        AND is_locked = false
    )
    WITH CHECK (
        auth.uid() = user_id 
        AND is_locked = false
    );

-- Policy: Users can only delete their own records if NOT locked
DROP POLICY IF EXISTS "Users can delete unlocked records" ON daily_records;
CREATE POLICY "Users can delete unlocked records" ON daily_records
    FOR DELETE
    USING (
        auth.uid() = user_id 
        AND is_locked = false
    );
*/

-- ============================================
-- 9. Add comments for documentation
-- ============================================
COMMENT ON COLUMN daily_records.product_details IS 'JSONB object storing sub-category counts, e.g., {"A产品-型号1": 5, "A产品-型号2": 3}';
COMMENT ON COLUMN daily_records.total_tang_count IS 'Sum of all sub-category counts (Integer)';
COMMENT ON COLUMN daily_records.is_locked IS 'When true, prevents UPDATE and DELETE operations (Boolean)';

-- ============================================
-- 10. Refresh PostgREST schema cache (Supabase)
-- ============================================
SELECT pg_notify('pgrst', 'reload schema');

