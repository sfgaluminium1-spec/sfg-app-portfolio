
/**
 * Example Business Logic - QuickSpace Workspace Management
 * 
 * This is a complete example showing how to structure business logic
 * for a satellite app registration.
 */

import type { BusinessLogic } from '../types/business-logic';

export const exampleBusinessLogic: BusinessLogic = {
  // Basic Information
  app_name: 'quickspace',
  category: 'WORKSPACE_MANAGEMENT',
  description: 'Quick workspace setup and management with automated permissions and file organization',
  version: '1.0.0',
  app_url: 'https://quickspace.abacusai.app',
  contact_email: 'warren@sfg-innovations.com',
  repository_url: 'https://github.com/sfgaluminium1-spec/quickspace',

  // Capabilities
  capabilities: [
    'Create workspaces with custom templates',
    'Manage user permissions and access controls',
    'Automated file organization and structure',
    'Integration with SharePoint and Azure AD',
    'Real-time collaboration features',
    'Activity logging and audit trails',
    'Bulk workspace operations',
  ],

  // Workflows
  workflows: [
    {
      name: 'Workspace Creation',
      description: 'Create a new workspace with default settings and permissions',
      steps: [
        'User provides workspace name and template selection',
        'System validates workspace name for uniqueness and naming conventions',
        'System creates directory structure based on template',
        'System sets default permissions based on user role',
        'System sends confirmation email to workspace owner',
        'User receives access URL and credentials',
      ],
      triggers: 'User clicks "Create Workspace" button in dashboard',
      outputs: 'Workspace ID, Access URL, Initial permissions set',
    },
    {
      name: 'Permission Management',
      description: 'Update user access and permissions for workspace',
      steps: [
        'Admin selects workspace and user',
        'Admin assigns role (Owner, Editor, Viewer)',
        'System validates permission hierarchy',
        'System updates access controls in SharePoint',
        'System logs permission change',
        'User receives notification of access change',
      ],
      triggers: 'Admin modifies user permissions in workspace settings',
      outputs: 'Updated permissions, Audit log entry, User notification',
    },
    {
      name: 'File Organization',
      description: 'Automatically organize files based on predefined rules',
      steps: [
        'System monitors workspace for new files',
        'System analyzes file type, name, and metadata',
        'System applies organization rules',
        'System moves file to appropriate folder',
        'System updates file index',
        'System notifies relevant users',
      ],
      triggers: 'New file uploaded to workspace',
      outputs: 'Organized file structure, Updated index, User notifications',
    },
  ],

  // Business Rules
  business_rules: [
    {
      name: 'Workspace Name Validation',
      description: 'Workspace names must be unique and follow naming conventions',
      condition: 'IF workspace name contains special characters OR already exists',
      action: 'THEN reject creation and show error message with suggestions',
      priority: 'high',
    },
    {
      name: 'Permission Hierarchy',
      description: 'Only workspace owners can assign owner permissions to others',
      condition: 'IF user role is not Owner AND attempting to assign Owner role',
      action: 'THEN deny request and show insufficient permissions error',
      priority: 'high',
    },
    {
      name: 'File Size Limit',
      description: 'Individual files cannot exceed 100MB',
      condition: 'IF uploaded file size > 100MB',
      action: 'THEN reject upload and suggest file compression or splitting',
      priority: 'medium',
    },
    {
      name: 'Inactive Workspace Archive',
      description: 'Workspaces inactive for 90 days are automatically archived',
      condition: 'IF workspace last accessed date > 90 days ago',
      action: 'THEN archive workspace and notify owner',
      priority: 'low',
    },
  ],

  // Integrations
  integrations: [
    'SharePoint Online - Document storage and collaboration',
    'Azure Active Directory - User authentication and authorization',
    'Microsoft Teams - Workspace notifications and chat',
    'Outlook - Email notifications and calendar integration',
  ],

  // API Endpoints
  api_endpoints: [
    {
      endpoint: '/api/workspaces',
      method: 'GET',
      purpose: 'List all workspaces for authenticated user',
      auth_required: true,
    },
    {
      endpoint: '/api/workspaces',
      method: 'POST',
      purpose: 'Create new workspace',
      auth_required: true,
    },
    {
      endpoint: '/api/workspaces/:id',
      method: 'GET',
      purpose: 'Get workspace details',
      auth_required: true,
    },
    {
      endpoint: '/api/workspaces/:id',
      method: 'PUT',
      purpose: 'Update workspace settings',
      auth_required: true,
    },
    {
      endpoint: '/api/workspaces/:id',
      method: 'DELETE',
      purpose: 'Archive workspace',
      auth_required: true,
    },
    {
      endpoint: '/api/workspaces/:id/permissions',
      method: 'GET',
      purpose: 'List workspace permissions',
      auth_required: true,
    },
    {
      endpoint: '/api/workspaces/:id/permissions',
      method: 'POST',
      purpose: 'Add user to workspace with specified role',
      auth_required: true,
    },
    {
      endpoint: '/api/workspaces/:id/files',
      method: 'GET',
      purpose: 'List files in workspace',
      auth_required: true,
    },
  ],

  // Data Models
  data_models: [
    {
      name: 'Workspace',
      description: 'Workspace entity representing a collaborative space',
      key_fields: [
        'id',
        'name',
        'owner_id',
        'template_id',
        'status',
        'created_at',
        'last_accessed_at',
        'sharepoint_url',
      ],
    },
    {
      name: 'WorkspacePermission',
      description: 'User permissions for workspace access',
      key_fields: [
        'id',
        'workspace_id',
        'user_id',
        'role',
        'granted_by',
        'granted_at',
      ],
    },
    {
      name: 'WorkspaceTemplate',
      description: 'Predefined workspace structure template',
      key_fields: [
        'id',
        'name',
        'description',
        'folder_structure',
        'default_permissions',
      ],
    },
    {
      name: 'WorkspaceFile',
      description: 'File metadata for workspace files',
      key_fields: [
        'id',
        'workspace_id',
        'name',
        'path',
        'size',
        'type',
        'uploaded_by',
        'uploaded_at',
      ],
    },
  ],
};

/**
 * Export function that matches the expected signature
 */
export function extractBusinessLogic(): BusinessLogic {
  return exampleBusinessLogic;
}
