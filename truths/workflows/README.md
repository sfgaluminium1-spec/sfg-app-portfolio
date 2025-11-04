# Workflows

This directory contains workflow definitions for SFG Aluminium business processes.

## Files

- `project-lifecycle.json` - ENQ → QUO → ORD → FAB → INS → PAID workflow
- `fabrication-workflow.json` - Fabrication scheduling and production workflow
- `installation-workflow.json` - Installation scheduling and completion workflow
- `enquiry-to-quote.json` - Enquiry to quote conversion workflow

## Format

Workflows define:
- Stages (with codes)
- Actions at each stage
- Transition rules
- Required approvals
- Document requirements

## Usage

Apps coordinate with NEXUS to progress through workflow stages. NEXUS ensures all requirements are met before transitions.