# SFG NEXUS - Main Application

The central hub of the SFG Aluminium ecosystem. Built with NextJS, Prisma, and PostgreSQL.

## Purpose
SFG NEXUS is the main orchestration application that:
- Manages the single webhook system with unlimited redirects
- Coordinates all satellite applications
- Implements Truth File v1.2.3 with BaseNumber system
- Handles staff and customer tier logic
- Integrates with Xero for customer database and credit checking

## Technology Stack
- **Frontend**: NextJS (App Router)
- **Backend**: NextJS API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Tier-based access control
- **Integration**: Xero API

## Directory Structure
- `/app/` - NextJS application directory
- `/prisma/` - Database schema and migrations
- `/lib/` - Utilities and shared modules
- `/config/` - Configuration files

## Setup Instructions
See deployment guide in `/docs/` for detailed setup instructions.

## Truth File System
This application implements Truth File v1.2.3 with:
- BaseNumber system for project identification
- Folder structure management
- Required field validation
- Staff and customer tier logic

---

**Backup Source**: This is a complete backup from /home/ubuntu/sfg-nexus-mockup/
