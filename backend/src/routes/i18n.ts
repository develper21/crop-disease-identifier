import { Router } from 'express';
import { i18nService } from '../services/i18nService';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get supported languages
router.get('/languages', (req, res) => {
    res.json({
        languages: i18nService.getSupportedLanguages(),
        default: 'en'
    });
});

// Get translations for a specific language
router.get('/translations/:lang', (req, res) => {
    const { lang } = req.params;
    
    if (!i18nService.isLanguageSupported(lang)) {
        return res.status(400).json({ 
            error: 'Unsupported language',
            supportedLanguages: i18nService.getSupportedLanguages()
        });
    }

    const translations = i18nService.getTranslationsForLanguage(lang);
    res.json({ language: lang, translations });
});

// Translate a specific key
router.post('/translate', authenticateToken, (req: any, res) => {
    const { key, language } = req.body;
    
    if (!key) {
        return res.status(400).json({ error: 'Key is required' });
    }

    const translation = i18nService.translate(key, language || req.language);
    res.json({ key, translation, language: language || req.language });
});

export default router;
