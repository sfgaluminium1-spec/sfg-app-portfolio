
/**
 * SFG NEXUS - BaseNumber Generation System
 * Version: v1.2.3
 * 
 * NON-NEGOTIABLE: BaseNumber is immutable and always first in subject, filename, and folder path.
 * This module provides database-backed sequential number generation with concurrency control.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type PrefixType = 'ENQ' | 'QUO' | 'ORD' | 'INV' | 'DEL' | 'PAID';

export interface BaseNumberResult {
  baseNumber: string;
  prefix: PrefixType;
  fullNumber: string;
  sequenceNumber: number;
}

/**
 * Allocates a new BaseNumber with proper concurrency control
 * BaseNumber format: YYYY-NNNN (e.g., 2025-0001)
 * Full number format: YYYY-NNNN-PREFIX (e.g., 2025-0001-ENQ)
 */
export async function allocateBaseNumber(prefix: PrefixType = 'ENQ'): Promise<BaseNumberResult> {
  const year = new Date().getFullYear();
  const sequenceKey = `BASE_NUMBER_${year}`;
  
  try {
    // Use atomic database transaction for concurrency control
    const result = await prisma.$transaction(async (tx: any) => {
      // Get or create sequence record
      let sequence = await tx.systemSettings.findUnique({
        where: { key: sequenceKey }
      });

      let nextNumber: number;
      
      if (!sequence) {
        // Create initial sequence
        nextNumber = 1;
        await tx.systemSettings.create({
          data: {
            key: sequenceKey,
            value: '1'
          }
        });
      } else {
        // Increment sequence atomically
        nextNumber = parseInt(sequence.value) + 1;
        await tx.systemSettings.update({
          where: { key: sequenceKey },
          data: { value: nextNumber.toString() }
        });
      }

      return nextNumber;
    });

    // Format BaseNumber: YYYY-NNNN
    const baseNumber = `${year}-${result.toString().padStart(4, '0')}`;
    const fullNumber = `${baseNumber}-${prefix}`;

    return {
      baseNumber,
      prefix,
      fullNumber,
      sequenceNumber: result
    };
  } catch (error) {
    console.error('BaseNumber allocation failed:', error);
    throw new Error('Failed to allocate BaseNumber. System may be experiencing high concurrency.');
  }
}

/**
 * Validates a BaseNumber format
 */
export function validateBaseNumber(baseNumber: string): boolean {
  const pattern = /^\d{4}-\d{4}$/;
  return pattern.test(baseNumber);
}

/**
 * Validates a full number format
 */
export function validateFullNumber(fullNumber: string): boolean {
  const pattern = /^\d{4}-\d{4}-(ENQ|QUO|ORD|INV|DEL|PAID)$/;
  return pattern.test(fullNumber);
}

/**
 * Extracts BaseNumber from full number
 */
export function extractBaseNumber(fullNumber: string): string {
  const match = fullNumber.match(/^(\d{4}-\d{4})/);
  return match ? match[1] : '';
}

/**
 * Extracts prefix from full number
 */
export function extractPrefix(fullNumber: string): PrefixType | null {
  const match = fullNumber.match(/-(ENQ|QUO|ORD|INV|DEL|PAID)$/);
  return match ? (match[1] as PrefixType) : null;
}

/**
 * Converts a prefix to the next stage prefix
 * ENQ → QUO → ORD → INV → DEL → PAID
 */
export function getNextPrefix(currentPrefix: PrefixType): PrefixType | null {
  const progression: Record<PrefixType, PrefixType | null> = {
    'ENQ': 'QUO',
    'QUO': 'ORD',
    'ORD': 'INV',
    'INV': 'DEL',
    'DEL': 'PAID',
    'PAID': null
  };
  
  return progression[currentPrefix];
}

/**
 * Checks if a prefix transition is valid
 */
export function isValidPrefixTransition(from: PrefixType, to: PrefixType): boolean {
  const validTransitions: Record<PrefixType, PrefixType[]> = {
    'ENQ': ['QUO'],
    'QUO': ['ORD', 'QUO'], // QUO → QUO allows revisions
    'ORD': ['INV'],
    'INV': ['DEL'],
    'DEL': ['PAID'],
    'PAID': []
  };
  
  return validTransitions[from]?.includes(to) ?? false;
}
