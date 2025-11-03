
/**
 * BaseNumber Allocation System
 * Immutable, atomic allocation with concurrency control
 */

import { prisma } from './db'

export async function allocateBaseNumber(): Promise<string> {
  return await prisma.$transaction(async (tx) => {
    // Get or create sequence
    let sequence = await tx.baseNumberSequence.findFirst()
    
    if (!sequence) {
      // Initialize sequence starting at 10000
      sequence = await tx.baseNumberSequence.create({
        data: {
          currentNumber: 10000
        }
      })
    }
    
    // Allocate next number
    const nextNumber = sequence.currentNumber + 1
    
    // Update sequence
    await tx.baseNumberSequence.update({
      where: { id: sequence.id },
      data: { currentNumber: nextNumber }
    })
    
    // Return padded number (e.g., "10001")
    return String(nextNumber)
  })
}

export function formatBaseNumber(baseNumber: string, prefix: string): string {
  return `${baseNumber}-${prefix}`
}

export function parseBaseNumber(formatted: string): { baseNumber: string; prefix: string } | null {
  const match = formatted.match(/^(\d+)-([A-Z]+)$/)
  if (!match) return null
  
  return {
    baseNumber: match[1],
    prefix: match[2]
  }
}
