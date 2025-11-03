# Backups

Timestamped backup storage following UK 7-year data retention standards.

## Backup Policy

### Retention Period
All backups are retained for **7 years** in compliance with UK business record retention requirements.

### Backup Schedule
- **Daily**: Incremental backups at 02:00 UTC
- **Weekly**: Full backups every Sunday at 03:00 UTC
- **Monthly**: Archive backups on the 1st of each month
- **Yearly**: Long-term archive backups every January 1st

### Backup Contents
- Database snapshots (PostgreSQL)
- Application code and configurations
- Truth files and business rules
- User-generated content
- System logs and audit trails

## Directory Structure
```
backups/
├── daily/
│   └── YYYY-MM-DD/
├── weekly/
│   └── YYYY-WW/
├── monthly/
│   └── YYYY-MM/
└── yearly/
    └── YYYY/
```

## Restoration Procedures
See `/infrastructure/backups/` for restoration scripts and procedures.

## Security
- All backups are encrypted at rest
- Access restricted to Tier 1 (Directors) only
- Audit log maintained for all backup access
- Off-site backup copies maintained

## Compliance
Backups comply with:
- UK Data Protection Act 2018
- GDPR requirements
- Industry-specific retention standards
- Financial record keeping requirements
