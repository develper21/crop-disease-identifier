interface Translation {
    [key: string]: string | Translation;
}

interface LanguageData {
    [key: string]: Translation;
}

class I18nService {
    private translations: LanguageData = {};
    private defaultLanguage = 'en';
    private supportedLanguages = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa'];

    constructor() {
        this.loadTranslations();
    }

    private loadTranslations() {
        // English translations (default)
        this.translations['en'] = {
            auth: {
                welcome: 'Welcome to Crop Disease Identifier',
                loginSuccess: 'Login successful',
                registerSuccess: 'Registration successful',
                invalidCredentials: 'Invalid email or password',
                emailExists: 'Email already exists',
                tokenRequired: 'Authentication token required',
                tokenInvalid: 'Invalid authentication token',
                userNotFound: 'User not found'
            },
            scans: {
                uploadSuccess: 'Image uploaded successfully',
                scanCreated: 'Scan created successfully',
                scanNotFound: 'Scan not found',
                scanDeleted: 'Scan deleted successfully',
                scanUpdated: 'Scan updated successfully',
                invalidImage: 'Invalid image format',
                imageTooLarge: 'Image size too large',
                processingFailed: 'Image processing failed',
                lowConfidence: 'Low confidence detection',
                highConfidence: 'High confidence detection',
                mediumConfidence: 'Medium confidence detection'
            },
            products: {
                notFound: 'Product not found',
                created: 'Product created successfully',
                updated: 'Product updated successfully',
                deleted: 'Product deleted successfully',
                outOfStock: 'Product out of stock',
                categoryNotFound: 'Category not found'
            },
            diseases: {
                notFound: 'Disease information not found',
                created: 'Disease information created successfully',
                updated: 'Disease information updated successfully',
                deleted: 'Disease information deleted successfully',
                noSolutions: 'No solutions available',
                emergency: 'Emergency treatment required'
            },
            errors: {
                serverError: 'Internal server error',
                notFound: 'Resource not found',
                unauthorized: 'Unauthorized access',
                forbidden: 'Access forbidden',
                validationError: 'Validation error',
                rateLimitExceeded: 'Too many requests, please try again later',
                databaseError: 'Database operation failed',
                networkError: 'Network error',
                fileUploadError: 'File upload failed',
                emailSendError: 'Failed to send email'
            },
            success: {
                operationCompleted: 'Operation completed successfully',
                dataSaved: 'Data saved successfully',
                dataUpdated: 'Data updated successfully',
                dataDeleted: 'Data deleted successfully'
            },
            common: {
                yes: 'Yes',
                no: 'No',
                ok: 'OK',
                cancel: 'Cancel',
                save: 'Save',
                delete: 'Delete',
                edit: 'Edit',
                view: 'View',
                search: 'Search',
                filter: 'Filter',
                loading: 'Loading...',
                error: 'Error',
                success: 'Success',
                warning: 'Warning',
                info: 'Information'
            }
        };

        // Hindi translations
        this.translations['hi'] = {
            auth: {
                welcome: 'फसल रोग पहचानकर्ता में आपका स्वागत है',
                loginSuccess: 'लॉगिन सफल',
                registerSuccess: 'पंजीकरण सफल',
                invalidCredentials: 'अमान्य ईमेल या पासवर्ड',
                emailExists: 'ईमेल पहले से मौजूद है',
                tokenRequired: 'प्रमाणीकरण टोकन आवश्यक',
                tokenInvalid: 'अमान्य प्रमाणीकरण टोकन',
                userNotFound: 'उपयोगकर्ता नहीं मिला'
            },
            scans: {
                uploadSuccess: 'छवि सफलतापूर्वक अपलोड हुई',
                scanCreated: 'स्कैन सफलतापूर्वक बनाया गया',
                scanNotFound: 'स्कैन नहीं मिला',
                scanDeleted: 'स्कैन सफलतापूर्वक हटाया गया',
                scanUpdated: 'स्कैन सफलतापूर्वक अपडेट किया गया',
                invalidImage: 'अमान्य छवि प्रारूप',
                imageTooLarge: 'छवि आकार बहुत बड़ा है',
                processingFailed: 'छवि प्रसंस्करण विफल',
                lowConfidence: 'कम विश्वास पहचान',
                highConfidence: 'उच्च विश्वास पहचान',
                mediumConfidence: 'मध्यम विश्वास पहचान'
            },
            products: {
                notFound: 'उत्पाद नहीं मिला',
                created: 'उत्पाद सफलतापूर्वक बनाया गया',
                updated: 'उत्पाद सफलतापूर्वक अपडेट किया गया',
                deleted: 'उत्पाद सफलतापूर्वक हटाया गया',
                outOfStock: 'उत्पाद स्टॉक में नहीं है',
                categoryNotFound: 'श्रेणी नहीं मिली'
            },
            diseases: {
                notFound: 'रोग की जानकारी नहीं मिली',
                created: 'रोग की जानकारी सफलतापूर्वक बनाई गई',
                updated: 'रोग की जानकारी सफलतापूर्वक अपडेट की गई',
                deleted: 'रोग की जानकारी सफलतापूर्वक हटाई गई',
                noSolutions: 'कोई समाधान उपलब्ध नहीं',
                emergency: 'आपातकालीन उपचार आवश्यक'
            },
            errors: {
                serverError: 'आंतरिक सर्वर त्रुटि',
                notFound: 'संसाधन नहीं मिला',
                unauthorized: 'अनधिकृत पहुंच',
                forbidden: 'पहुंच निषिद्ध',
                validationError: 'सत्यापन त्रुटि',
                rateLimitExceeded: 'बहुत अधिक अनुरोध, कृपया बाद में प्रयास करें',
                databaseError: 'डेटाबेस ऑपरेशन विफल',
                networkError: 'नेटवर्क त्रुटि',
                fileUploadError: 'फ़ाइल अपलोड विफल',
                emailSendError: 'ईमेल भेजना विफल'
            },
            success: {
                operationCompleted: 'ऑपरेशन सफलतापूर्वक पूरा हुआ',
                dataSaved: 'डेटा सफलतापूर्वक सहेजा गया',
                dataUpdated: 'डेटा सफलतापूर्वक अपडेट किया गया',
                dataDeleted: 'डेटा सफलतापूर्वक हटाया गया'
            },
            common: {
                yes: 'हाँ',
                no: 'नहीं',
                ok: 'ठीक है',
                cancel: 'रद्द करें',
                save: 'सहेजें',
                delete: 'हटाएं',
                edit: 'संपादित करें',
                view: 'देखें',
                search: 'खोजें',
                filter: 'फ़िल्टर',
                loading: 'लोड हो रहा है...',
                error: 'त्रुटि',
                success: 'सफलता',
                warning: 'चेतावनी',
                info: 'जानकारी'
            }
        };

        // Bengali translations (partial for demo)
        this.translations['bn'] = {
            auth: {
                welcome: 'ফসল রোগ সনাক্তকারীতে স্বাগতম',
                loginSuccess: 'লগইন সফল',
                registerSuccess: 'নিবন্ধন সফল',
                invalidCredentials: 'অবৈধ ইমেল বা পাসওয়ার্ড',
                emailExists: 'ইমেল ইতিমধ্যেই বিদ্যমান'
            },
            errors: {
                serverError: 'অভ্যন্তরীণ সার্ভার ত্রুটি',
                notFound: 'সম্পদ পাওয়া যায়নি',
                unauthorized: 'অননুমোদিত অ্যাক্সেস'
            },
            common: {
                yes: 'হ্যাঁ',
                no: 'না',
                ok: 'ঠিক আছে',
                cancel: 'বাতিল',
                save: 'সংরক্ষণ করুন',
                delete: 'মুছুন',
                edit: 'সম্পাদনা করুন',
                view: 'দেখুন',
                search: 'অনুসন্ধান করুন'
            }
        };
    }

    public translate(key: string, language?: string): string {
        const lang = language || this.defaultLanguage;
        
        if (!this.supportedLanguages.includes(lang)) {
            console.warn(`Unsupported language: ${lang}, falling back to ${this.defaultLanguage}`);
            return this.translate(key, this.defaultLanguage);
        }

        const keys = key.split('.');
        let translation: any = this.translations[lang];

        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                // Fallback to English if key not found
                if (lang !== this.defaultLanguage) {
                    return this.translate(key, this.defaultLanguage);
                }
                return key; // Return key if not found in default language
            }
        }

        return typeof translation === 'string' ? translation : key;
    }

    public getSupportedLanguages(): string[] {
        return [...this.supportedLanguages];
    }

    public isLanguageSupported(language: string): boolean {
        return this.supportedLanguages.includes(language);
    }

    public addTranslation(language: string, key: string, value: string): void {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }

        const keys = key.split('.');
        let current: any = this.translations[language];

        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!current[k] || typeof current[k] !== 'object') {
                current[k] = {};
            }
            current = current[k];
        }

        current[keys[keys.length - 1]] = value;
    }

    public getTranslationsForLanguage(language: string): Translation | null {
        return this.translations[language] || null;
    }

    // Helper method to create localized responses
    public createLocalizedResponse(
        messageKey: string, 
        language?: string, 
        data?: any, 
        status?: number
    ) {
        const message = this.translate(messageKey, language);
        const response: any = { message };

        if (data) {
            response.data = data;
        }

        if (status) {
            response.status = status;
        }

        return response;
    }

    // Method to get localized error messages
    public getErrorMessage(errorKey: string, language?: string): string {
        return this.translate(`errors.${errorKey}`, language);
    }

    // Method to get localized success messages
    public getSuccessMessage(successKey: string, language?: string): string {
        return this.translate(`success.${successKey}`, language);
    }
}

export const i18nService = new I18nService();
