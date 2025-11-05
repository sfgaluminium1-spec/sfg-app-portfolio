
# Data Directory

This directory stores all operational data for the SFG Aluminium Ltd website.

## Structure

- **enquiries/** - Contact form submissions and general enquiries
- **quotes/** - Quote requests from customers
- **services/** - Service inquiry submissions
- **customers/** - Customer records and profiles
- **uploads/** - User-uploaded documents and files

## File Naming Convention

All files use the following naming pattern:
```
{type}_{timestamp}_{id}.json
```

Example: `enquiry_20251105_abc123.json`

## Data Retention

- Active enquiries: Retained indefinitely
- Completed quotes: Archived after 2 years
- Service records: Retained for 3 years
- Customer data: Retained per GDPR requirements (right to deletion)

## Backup

All data is automatically backed up to the `/backup` directory daily.
