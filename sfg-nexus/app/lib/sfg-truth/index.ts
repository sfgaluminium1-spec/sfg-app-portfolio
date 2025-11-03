
/**
 * SFG NEXUS - Truth File Implementation
 * Version: v1.2.3
 * 
 * Central export point for all SFG Truth File utilities
 */

// BaseNumber Generation
export * from './base-number';

// Folder Structure
export * from './folder-structure';

// Required Fields Validation
export * from './required-fields';

// Product Count Tracking
export * from './product-count';

// Email and Filename Patterns
export * from './email-patterns';

// Status Colors
export * from './status-colors';

// Configuration
import sfgTruthConfig from '../../config/sfg-truth-config.json';
export { sfgTruthConfig };
