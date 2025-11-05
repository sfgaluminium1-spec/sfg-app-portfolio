
-- Add employee authentication fields
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "homePostcode" VARCHAR(10);
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "doorNumber" VARCHAR(10);
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "passwordHash" VARCHAR(255);
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "lastLogin" TIMESTAMP;
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "loginAttempts" INTEGER DEFAULT 0;
ALTER TABLE "Employee" ADD COLUMN IF NOT EXISTS "accountLocked" BOOLEAN DEFAULT false;

-- Add location tracking to timesheet
ALTER TABLE "Timesheet" ADD COLUMN IF NOT EXISTS "clockInLocation" JSONB;
ALTER TABLE "Timesheet" ADD COLUMN IF NOT EXISTS "clockOutLocation" JSONB;
ALTER TABLE "Timesheet" ADD COLUMN IF NOT EXISTS "locationVerified" BOOLEAN DEFAULT false;
ALTER TABLE "Timesheet" ADD COLUMN IF NOT EXISTS "geofenceDistance" INTEGER;

-- Create employee contact database
CREATE TABLE IF NOT EXISTS "EmployeeContact" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "employeeId" TEXT NOT NULL REFERENCES "Employee"("id") ON DELETE CASCADE,
  "homeAddress" TEXT,
  "emergencyContactName" TEXT,
  "emergencyContactPhone" TEXT,
  "emergencyContactRelation" TEXT,
  "nextOfKin" TEXT,
  "medicalConditions" TEXT,
  "bloodType" VARCHAR(5),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create audit log for HR compliance
CREATE TABLE IF NOT EXISTS "HRComplianceLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "action" TEXT NOT NULL,
  "userId" TEXT,
  "employeeId" TEXT,
  "details" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "timestamp" TIMESTAMP DEFAULT NOW()
);

-- Insert sample employee data with authentication
INSERT INTO "Employee" (
  "id", "employeeNumber", "firstName", "lastName", "email", 
  "phone", "department", "role", "hourlyRate", "weeklyHours",
  "homePostcode", "doorNumber", "passwordHash", "isActive"
) VALUES 
  -- Directors (already exist, just update with auth)
  (gen_random_uuid()::TEXT, 'SFG001', 'Yanika', 'Heathcote', 'yanika@sfg-aluminium.co.uk', '+44 161 884 0131', 'Management', 'Director', 35.00, 42.5, 'M45NG', '12', '$2a$10$placeholder_hash', true),
  (gen_random_uuid()::TEXT, 'SFG002', 'Warren', 'Heathcote', 'warren@sfg-aluminium.co.uk', '+44 7787 631861', 'Operations', 'Operations Manager', 32.00, 42.5, 'M12QR', '8A', '$2a$10$placeholder_hash', true),
  (gen_random_uuid()::TEXT, 'SFG003', 'Pawel', 'Marzec', 'pawel@sfg-aluminium.co.uk', '+44 161 884 0132', 'Finance', 'Payroll Officer', 28.00, 42.5, 'M145TY', '15', '$2a$10$placeholder_hash', true)
ON CONFLICT (email) DO UPDATE SET
  "homePostcode" = EXCLUDED."homePostcode",
  "doorNumber" = EXCLUDED."doorNumber",
  "passwordHash" = EXCLUDED."passwordHash";

-- Add employee contact details
INSERT INTO "EmployeeContact" ("employeeId", "homeAddress", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelation")
SELECT 
  e."id",
  CASE 
    WHEN e."firstName" = 'Yanika' THEN '12 Acacia Drive, Northwich M45 NG'
    WHEN e."firstName" = 'Warren' THEN '8A Greenwood Terrace, Manchester M12 QR'  
    WHEN e."firstName" = 'Pawel' THEN '15 Victoria Street, Manchester M14 5TY'
  END,
  CASE 
    WHEN e."firstName" = 'Yanika' THEN 'Warren Heathcote'
    WHEN e."firstName" = 'Warren' THEN 'Yanika Heathcote'
    WHEN e."firstName" = 'Pawel' THEN 'Anna Marzec'
  END,
  CASE 
    WHEN e."firstName" = 'Yanika' THEN '+44 7787 631861'
    WHEN e."firstName" = 'Warren' THEN '+44 161 884 0131'
    WHEN e."firstName" = 'Pawel' THEN '+44 7123 456789'
  END,
  CASE 
    WHEN e."firstName" = 'Yanika' THEN 'Husband'
    WHEN e."firstName" = 'Warren' THEN 'Wife'
    WHEN e."firstName" = 'Pawel' THEN 'Wife'
  END
FROM "Employee" e
WHERE e."email" IN ('yanika@sfg-aluminium.co.uk', 'warren@sfg-aluminium.co.uk', 'pawel@sfg-aluminium.co.uk')
ON CONFLICT DO NOTHING;
