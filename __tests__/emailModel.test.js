const { deriveEmail } = require('../models/emailModel');
const ERROR_MESSAGES = require('../constants/errors');

describe('deriveEmail', () => {
    beforeEach(() => {
        // Mocking file read operations
        jest.spyOn(require('fs'), 'readFileSync').mockImplementation((path) => {
            if (path.includes('emailPatterns.json')) {
                return JSON.stringify([
                    { domain: 'babbel.com', patterns: ['{first_name}{last_name}@{domain}', '{first_name_initial}{last_name}@{domain}'] },
                    { domain: 'gmail.com', patterns: ['{first_name}{last_name}@{domain}', '{first_name_initial}{last_name}@{domain}'] }
                ]);
            }
            if (path.includes('sampleEmails.json')) {
                return JSON.stringify({
                    'Jane Doe': 'jdoe@babbel.com',
                    'John Smith': 'jsmith@gmail.com'
                });
            }
        });
    });

    test('should return emails for valid full name and domain', () => {
        const result = deriveEmail('Jane Doe', 'babbel.com');
        expect(result.success).toBe(true);
        expect(result.emails).toContain('jdoe@babbel.com');
        expect(result.emails).toContain('jdoe@babbel.com'); 
    });

    test('should handle a case where only a first name is provided', () => {
        const result = deriveEmail('Jane', 'babbel.com');
        expect(result.success).toBe(true);
        expect(result.emails).toContain('jane@babbel.com');  
    });

    test('should handle a case where domain is not found', () => {
        const result = deriveEmail('Jane Doe', 'unknown.com');
        expect(result.success).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.PATTERN_NOT_FOUND);
    });

    test('should handle a case where full name is invalid', () => {
        const result = deriveEmail('', 'babbel.com');
        expect(result.success).toBe(false);
        expect(result.error).toBe(ERROR_MESSAGES.INVALID_FORMAT);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});
