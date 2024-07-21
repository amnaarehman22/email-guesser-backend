const { deriveEmail } = require('../models/emailModel');
const ERROR_MESSAGES = require('../constants/errors').ERROR_MESSAGES;

const handleDeriveEmail = (req, res) => {
    const { fullName, domain } = req.body;

    // Convert inputs to lowercase for consistency
    const lowerCaseFullName = fullName ? fullName.toLowerCase() : '';
    const lowerCaseDomain = domain ? domain.toLowerCase() : '';

    if (!lowerCaseFullName || !lowerCaseDomain) {
        return res.status(400).json({ error: ERROR_MESSAGES.MISSING_INPUT });
    }

    try {
        const result = deriveEmail(lowerCaseFullName, lowerCaseDomain);
        console.log("result:", result);

        if (result.success) {
            return res.json({ emails: result.emails });
        } else {
            return res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
    }
};

module.exports = {
    handleDeriveEmail
};
