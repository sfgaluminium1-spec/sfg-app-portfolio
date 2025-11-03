
export class JobNumberGenerator {
  private static currentYear = new Date().getFullYear();
  private static currentSequence = 18456; // Starting from SFG's current sequence
  
  static generateJobNumber(): string {
    this.currentSequence++;
    return this.currentSequence.toString();
  }
  
  static generateQuoteNumber(): string {
    // Quote numbers follow similar pattern but with different prefix
    const year = this.currentYear;
    const sequence = Math.floor(Math.random() * 1000) + 21500; // Starting from 21500 range
    return sequence.toString();
  }
  
  static generateOrderNumber(): string {
    // Order numbers are typically 5-digit
    const sequence = Math.floor(Math.random() * 10000) + 30000;
    return sequence.toString();
  }
  
  static parseJobNumber(jobNumber: string): { year?: number; sequence: number; isValid: boolean } {
    const num = parseInt(jobNumber);
    if (isNaN(num)) {
      return { sequence: 0, isValid: false };
    }
    
    // SFG uses simple sequential numbers
    return {
      sequence: num,
      isValid: num > 10000 && num < 99999
    };
  }
  
  static getNextJobNumber(): string {
    return (this.currentSequence + 1).toString();
  }
  
  static setCurrentSequence(sequence: number): void {
    this.currentSequence = sequence;
  }
}
