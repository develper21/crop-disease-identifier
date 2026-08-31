import nodemailer from 'nodemailer';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

class EmailService {
    private transporter!: nodemailer.Transporter;
    private isConfigured: boolean;

    constructor() {
        this.isConfigured = false;
        this.setupTransporter();
    }

    private setupTransporter() {
        const config: EmailConfig = {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || ''
            }
        };

        if (config.auth.user && config.auth.pass) {
            this.transporter = nodemailer.createTransport(config);
            this.isConfigured = true;
        } else {
            console.warn('Email service not configured. Using mock service.');
        }
    }

    async sendWelcomeEmail(userId: number) {
        if (!this.isConfigured) {
            console.log(`Mock: Welcome email sent to user ${userId}`);
            return;
        }

        try {
            const [user] = await db.select({
                email: users.email,
                fullName: users.fullName
            }).from(users).where(eq(users.id, userId));

            if (!user) return;

            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@cropdisease.com',
                to: user.email,
                subject: 'Welcome to Crop Disease Identifier! 🌾',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c7a2c;">Welcome to Crop Disease Identifier!</h2>
                        <p>Hi ${user.fullName || 'Farmer'},</p>
                        <p>Thank you for joining our platform! You're now ready to:</p>
                        <ul>
                            <li>📸 Identify crop diseases instantly</li>
                            <li>💊 Get treatment recommendations</li>
                            <li>📊 Track your scan history</li>
                            <li>🛒 Find agricultural products</li>
                        </ul>
                        <p>Start by taking a photo of any crop that concerns you!</p>
                        <p>Best regards,<br/>Crop Disease Team</p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${user.email}`);
        } catch (error) {
            console.error('Failed to send welcome email:', error);
        }
    }

    async sendDiseaseAlertEmail(userId: number, diseaseName: string, confidence: number) {
        if (!this.isConfigured) {
            console.log(`Mock: Disease alert sent to user ${userId} for ${diseaseName}`);
            return;
        }

        try {
            const [user] = await db.select({
                email: users.email,
                fullName: users.fullName
            }).from(users).where(eq(users.id, userId));

            if (!user) return;

            const urgency = confidence > 80 ? '🚨 HIGH' : confidence > 60 ? '⚠️ MEDIUM' : '📝 LOW';
            const urgencyColor = confidence > 80 ? '#d32f2f' : confidence > 60 ? '#f57c00' : '#1976d2';

            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@cropdisease.com',
                to: user.email,
                subject: `Disease Detection Alert: ${diseaseName} ${urgency}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: ${urgencyColor};">Disease Detection Alert</h2>
                        <p>Hi ${user.fullName || 'Farmer'},</p>
                        <p>We detected <strong>${diseaseName}</strong> in your recent scan.</p>
                        <div style="background-color: ${urgencyColor}20; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Confidence Level:</strong> ${confidence}%</p>
                            <p><strong>Urgency:</strong> ${urgency}</p>
                        </div>
                        <p>Recommended actions:</p>
                        <ol>
                            <li>Review the detailed analysis in the app</li>
                            <li>Check recommended treatments</li>
                            <li>Consider consulting with an agricultural expert if confidence is high</li>
                        </ol>
                        <p>Access your scan results in the app for complete details.</p>
                        <p>Best regards,<br/>Crop Disease Team</p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Disease alert email sent to ${user.email}`);
        } catch (error) {
            console.error('Failed to send disease alert email:', error);
        }
    }

    async sendWeeklySummary(userId: number, scanCount: number, topDiseases: string[]) {
        if (!this.isConfigured) {
            console.log(`Mock: Weekly summary sent to user ${userId}`);
            return;
        }

        try {
            const [user] = await db.select({
                email: users.email,
                fullName: users.fullName
            }).from(users).where(eq(users.id, userId));

            if (!user) return;

            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@cropdisease.com',
                to: user.email,
                subject: 'Your Weekly Crop Health Summary 📊',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c7a2c;">Weekly Crop Health Summary</h2>
                        <p>Hi ${user.fullName || 'Farmer'},</p>
                        <p>Here's your weekly activity summary:</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>📸 Scans this week:</strong> ${scanCount}</p>
                            ${topDiseases.length > 0 ? `
                                <p><strong>🌾 Most detected diseases:</strong></p>
                                <ul>${topDiseases.map(disease => `<li>${disease}</li>`).join('')}</ul>
                            ` : '<p><strong>✅ No diseases detected this week!</strong></p>'}
                        </div>
                        <p>Keep monitoring your crops regularly for early detection!</p>
                        <p>Best regards,<br/>Crop Disease Team</p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Weekly summary email sent to ${user.email}`);
        } catch (error) {
            console.error('Failed to send weekly summary email:', error);
        }
    }

    async sendPasswordResetEmail(email: string, resetToken: string) {
        if (!this.isConfigured) {
            console.log(`Mock: Password reset email sent to ${email}`);
            return;
        }

        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@cropdisease.com',
                to: email,
                subject: 'Password Reset Request',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c7a2c;">Password Reset</h2>
                        <p>You requested a password reset for your account.</p>
                        <p>Click the link below to reset your password:</p>
                        <p><a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" style="background-color: #2c7a2c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                        <p>Best regards,<br/>Crop Disease Team</p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${email}`);
        } catch (error) {
            console.error('Failed to send password reset email:', error);
        }
    }
}

export const emailService = new EmailService();
