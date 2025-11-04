# NEXUS Code Backups

This directory contains backups of NEXUS core system code.

## Purpose

- Version control for NEXUS core
- Recovery point in case of issues
- Historical reference for changes

## Structure

```
backups/
├── sfg-nexus-core/
│   ├── prisma/
│   ├── lib/
│   ├── app/
│   └── README.md
```

## Backup Frequency

- After major features
- Before significant refactors
- After Truth File System updates
- On demand as needed

## Usage

To restore from backup:
1. Copy files from backup directory
2. Run `yarn install`
3. Run database migrations
4. Test thoroughly before deploying