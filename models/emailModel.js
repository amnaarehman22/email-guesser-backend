const fs = require('fs');
const path = require('path');
const ERROR_MESSAGES = require('../constants/errors').ERROR_MESSAGES;

const emailPatternsFile = path.join(__dirname, '../constants/emailPatterns.json');
const sampleEmailsFile = path.join(__dirname, '../constants/sampleEmails.json');

const loadPatterns = () => {
    try {
        const data = fs.readFileSync(emailPatternsFile);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading email patterns:", error);
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    }
};

const loadSampleEmails = () => {
    try {
        const data = fs.readFileSync(sampleEmailsFile);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading sample emails:", error);
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    }
};

const deriveEmail = (fullName, domain) => {
    console.log("deriveEmail:", fullName, domain);

    // Convert inputs to lowercase for case-insensitive processing
    const lowerCaseDomain = domain.toLowerCase();
    const lowerCaseFullName = fullName.toLowerCase();

    const patterns = loadPatterns();
    const sampleEmails = loadSampleEmails();
    const domainPatterns = patterns.find((p) => p.domain.toLowerCase() === lowerCaseDomain);

    if (!domainPatterns) {
        console.error("Domain pattern not found:", domain);
        return { success: false, error: ERROR_MESSAGES.PATTERN_NOT_FOUND };
    }

    const names = lowerCaseFullName.split(' ');

    // Extract first and last names, ignore middle names
    const firstName = names[0] || '';
    const lastName = names.length > 1 ? names[names.length - 1] : '';

    if (!firstName) {
        console.error("Invalid format for full name:", fullName);
        return { success: false, error: ERROR_MESSAGES.INVALID_FORMAT };
    }

    const firstNameInitial = firstName.charAt(0).toLowerCase();
    const formattedPatterns = domainPatterns.patterns.map((pattern) =>
        pattern
            .replace(/{first_name}/g, firstName)
            .replace(/{last_name}/g, lastName)
            .replace(/{first_name_initial}/g, firstNameInitial)
            .replace(/{domain}/g, lowerCaseDomain)
    );

    // Collect all possible email addresses
    const emails = formattedPatterns.filter(email => {
        const name = `${firstName} ${lastName}`;
        return sampleEmails[name] && sampleEmails[name] === email;
    });

    return { success: true, emails: emails.length > 0 ? emails : formattedPatterns };
};

module.exports = {
    deriveEmail
};
