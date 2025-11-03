
/**
 * SFG Satellite App Registration - Business Logic Extraction
 * @version 2.0
 * @date November 3, 2025
 */

import type { BusinessLogic } from '../types/business-logic';

/**
 * Extract business logic from your application
 * 
 * INSTRUCTIONS:
 * 1. Replace the placeholder values with your app's actual information
 * 2. Add all capabilities your app provides
 * 3. Document key workflows with steps, triggers, and outputs
 * 4. Define business rules with conditions and actions
 * 5. List all integrations with external systems
 * 6. Document API endpoints with methods and purposes
 * 7. Define data models with key fields
 * 
 * @returns {BusinessLogic} Complete business logic structure
 */
export function extractBusinessLogic(): BusinessLogic {
  return {
    // Basic Information
    app_name: 'YOUR_APP_NAME',
    category: 'OTHER', // Change to appropriate category
    description: 'Brief description of what your app does',
    version: '1.0.0',
    app_url: 'https://your-app.abacusai.app',
    contact_email: 'warren@sfg-innovations.com',

    // Capabilities - What can your app do?
    capabilities: [
      'Capability 1: Description',
      'Capability 2: Description',
      'Capability 3: Description',
    ],

    // Workflows - How does your app work?
    workflows: [
      {
        name: 'Primary Workflow',
        description: 'Description of what this workflow does',
        steps: [
          'Step 1: User action',
          'Step 2: System processing',
          'Step 3: Output generation',
        ],
        triggers: 'What triggers this workflow (e.g., button click, schedule, webhook)',
        outputs: 'What this workflow produces (e.g., report, notification, data update)',
      },
      {
        name: 'Secondary Workflow',
        description: 'Description of another workflow',
        steps: [
          'Step 1: Initialize',
          'Step 2: Process',
          'Step 3: Complete',
        ],
        triggers: 'Workflow trigger',
        outputs: 'Expected outputs',
      },
    ],

    // Business Rules - What are the constraints and validations?
    business_rules: [
      {
        name: 'Validation Rule',
        description: 'Description of the rule',
        condition: 'IF condition is met',
        action: 'THEN perform this action',
        priority: 'high',
      },
      {
        name: 'Processing Rule',
        description: 'Another business rule',
        condition: 'IF another condition',
        action: 'THEN another action',
        priority: 'medium',
      },
    ],

    // Integrations - What systems does your app connect to?
    integrations: [
      'System 1 (e.g., SharePoint, Xero, DocuSign)',
      'System 2',
      'System 3',
    ],

    // API Endpoints - What APIs does your app expose?
    api_endpoints: [
      {
        endpoint: '/api/resource',
        method: 'GET',
        purpose: 'Retrieve resource data',
        auth_required: true,
      },
      {
        endpoint: '/api/resource',
        method: 'POST',
        purpose: 'Create new resource',
        auth_required: true,
      },
      {
        endpoint: '/api/resource/:id',
        method: 'PUT',
        purpose: 'Update existing resource',
        auth_required: true,
      },
    ],

    // Data Models - What are your key data structures?
    data_models: [
      {
        name: 'PrimaryModel',
        description: 'Description of the data model',
        key_fields: ['id', 'name', 'status', 'created_at', 'updated_at'],
      },
      {
        name: 'SecondaryModel',
        description: 'Another data model',
        key_fields: ['id', 'type', 'value'],
      },
    ],
  };
}

/**
 * Validate business logic completeness
 * @param logic Business logic to validate
 * @returns Array of validation warnings
 */
export function validateBusinessLogic(logic: BusinessLogic): string[] {
  const warnings: string[] = [];

  if (logic.app_name === 'YOUR_APP_NAME') {
    warnings.push('❌ App name is not customized');
  }

  if (logic.capabilities.length === 0) {
    warnings.push('⚠️  No capabilities defined');
  }

  if (logic.workflows.length === 0) {
    warnings.push('⚠️  No workflows defined');
  }

  if (logic.business_rules.length === 0) {
    warnings.push('⚠️  No business rules defined');
  }

  if (logic.api_endpoints.length === 0) {
    warnings.push('⚠️  No API endpoints defined');
  }

  return warnings;
}
