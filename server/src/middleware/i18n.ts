import { Request, Response, NextFunction } from 'express';
import { i18nService } from '../services/i18nService';

// Middleware to extract language from request
export const extractLanguage = (req: any, res: Response, next: NextFunction) => {
    // Try to get language from various sources in order of priority:
    // 1. User's preferred language from database (if authenticated)
    // 2. Accept-Language header
    // 3. Query parameter ?lang=hi
    // 4. Default to English

    let language = 'en';

    // Check if user is authenticated and has preferred language
    if (req.user && req.user.preferredLanguage) {
        language = req.user.preferredLanguage;
    } else {
        // Check Accept-Language header
        const acceptLanguage = req.headers['accept-language'];
        if (acceptLanguage && typeof acceptLanguage === 'string') {
            const preferredLang = acceptLanguage.split(',')[0].split('-')[0];
            if (i18nService.isLanguageSupported(preferredLang)) {
                language = preferredLang;
            }
        }

        // Check query parameter
        const queryLang = req.query.lang as string;
        if (queryLang && i18nService.isLanguageSupported(queryLang)) {
            language = queryLang;
        }
    }

    req.language = language;
    next();
};

// Helper function to create localized responses
export const createLocalizedResponse = (
    req: any, 
    messageKey: string, 
    data?: any, 
    statusCode: number = 200
) => {
    const message = i18nService.translate(messageKey, req.language);
    const response: any = { message };

    if (data) {
        response.data = data;
    }

    return { statusCode, response };
};

// Helper function to create localized error responses
export const createLocalizedError = (
    req: any, 
    errorKey: string, 
    statusCode: number = 400,
    additionalData?: any
) => {
    const message = i18nService.getErrorMessage(errorKey, req.language);
    const response: any = { error: message };

    if (additionalData) {
        Object.assign(response, additionalData);
    }

    return { statusCode, response };
};
