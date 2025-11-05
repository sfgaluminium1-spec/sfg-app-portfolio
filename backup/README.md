
# Backup Directory

This directory stores backups of critical data and configurations.

## Backup Schedule

- **Daily:** Full database backup
- **Hourly:** Incremental data backups
- **On registration:** Registration metadata snapshots

## Retention Policy

- Daily backups: 30 days
- Registration snapshots: Permanent
- Critical configs: Permanent

## Restore Procedure

1. Identify the backup file to restore
2. Verify backup integrity
3. Stop application services
4. Restore data from backup
5. Restart services
6. Verify restoration

## Current Backups

- `registration-backup.json` - Latest app registration snapshot
