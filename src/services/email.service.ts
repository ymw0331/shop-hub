// src/services/email.service.ts
import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
import { Logger } from '../utils/logger.js';

dotenv.config();

const logger = new Logger('EmailService');

// Brevo Configuration
const apiInstance = new brevo.TransactionalEmailsApi();

// Set API key from environment
apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY || ''
);

// Email Service Class
export class EmailService {
    private senderEmail: string;
    private senderName: string;

    constructor() {
        this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@shophub.com';
        this.senderName = process.env.BREVO_SENDER_NAME || 'ShopHub';

        if (!process.env.BREVO_API_KEY && !process.env.EMAIL_API_KEY) {
            logger.warn('Brevo API key not configured. Email service will not work.');
        }
    }

    /**
     * Send order confirmation email
     */
    async sendOrderConfirmation(to: string, orderDetails: any): Promise<void> {
        try {
            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.sender = {
                email: this.senderEmail,
                name: this.senderName
            };

            sendSmtpEmail.to = [{
                email: to
            }];

            sendSmtpEmail.subject = `Order Confirmation - ${orderDetails.orderId}`;

            sendSmtpEmail.htmlContent = `
                <h2>Thank you for your order!</h2>
                <p>Your order #${orderDetails.orderId} has been confirmed.</p>
                <h3>Order Details:</h3>
                <ul>
                    ${orderDetails.products.map((p: any) =>
                        `<li>${p.name} - Quantity: ${p.quantity} - $${p.price}</li>`
                    ).join('')}
                </ul>
                <p><strong>Total: $${orderDetails.total}</strong></p>
                <p>We'll send you another email when your order ships.</p>
                <br>
                <p>Best regards,<br>The ShopHub Team</p>
            `;

            sendSmtpEmail.textContent = `
                Thank you for your order!
                Order #${orderDetails.orderId}
                Total: $${orderDetails.total}

                We'll send you another email when your order ships.

                Best regards,
                The ShopHub Team
            `;

            await apiInstance.sendTransacEmail(sendSmtpEmail);
            logger.info('Order confirmation email sent', { to, orderId: orderDetails.orderId });
        } catch (error) {
            logger.error('Failed to send order confirmation email', error as Error, { to });
            // Don't throw - email failure shouldn't break the order process
        }
    }

    /**
     * Send welcome email for new user registration
     */
    async sendWelcomeEmail(to: string, userName: string): Promise<void> {
        try {
            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.sender = {
                email: this.senderEmail,
                name: this.senderName
            };

            sendSmtpEmail.to = [{
                email: to
            }];

            sendSmtpEmail.subject = 'Welcome to ShopHub!';

            sendSmtpEmail.htmlContent = `
                <h2>Welcome to ShopHub, ${userName}!</h2>
                <p>Thank you for creating an account with us.</p>
                <p>Start shopping and enjoy exclusive deals and offers!</p>
                <br>
                <p>Best regards,<br>The ShopHub Team</p>
            `;

            sendSmtpEmail.textContent = `
                Welcome to ShopHub, ${userName}!

                Thank you for creating an account with us.
                Start shopping and enjoy exclusive deals and offers!

                Best regards,
                The ShopHub Team
            `;

            await apiInstance.sendTransacEmail(sendSmtpEmail);
            logger.info('Welcome email sent', { to, userName });
        } catch (error) {
            logger.error('Failed to send welcome email', error as Error, { to });
            // Don't throw - email failure shouldn't break registration
        }
    }

    /**
     * Send password reset email
     */
    async sendPasswordReset(to: string, resetToken: string): Promise<void> {
        try {
            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.sender = {
                email: this.senderEmail,
                name: this.senderName
            };

            sendSmtpEmail.to = [{
                email: to
            }];

            sendSmtpEmail.subject = 'Password Reset Request - ShopHub';

            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;

            sendSmtpEmail.htmlContent = `
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br>
                <p>Best regards,<br>The ShopHub Team</p>
            `;

            sendSmtpEmail.textContent = `
                Password Reset Request

                You requested to reset your password.
                Click this link to reset your password:
                ${resetLink}

                This link will expire in 1 hour.
                If you didn't request this, please ignore this email.

                Best regards,
                The ShopHub Team
            `;

            await apiInstance.sendTransacEmail(sendSmtpEmail);
            logger.info('Password reset email sent', { to });
        } catch (error) {
            logger.error('Failed to send password reset email', error as Error, { to });
            throw error; // Throw for password reset - user needs to know if it failed
        }
    }

    /**
     * Send order status update email
     */
    async sendOrderStatusUpdate(to: string, orderId: string, status: string): Promise<void> {
        try {
            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.sender = {
                email: this.senderEmail,
                name: this.senderName
            };

            sendSmtpEmail.to = [{
                email: to
            }];

            sendSmtpEmail.subject = `Order Update - ${orderId}`;

            let statusMessage = '';
            switch(status) {
                case 'processing':
                    statusMessage = 'Your order is being processed.';
                    break;
                case 'shipped':
                    statusMessage = 'Great news! Your order has been shipped.';
                    break;
                case 'delivered':
                    statusMessage = 'Your order has been delivered. Enjoy your purchase!';
                    break;
                case 'cancelled':
                    statusMessage = 'Your order has been cancelled.';
                    break;
                default:
                    statusMessage = `Your order status is: ${status}`;
            }

            sendSmtpEmail.htmlContent = `
                <h2>Order Update</h2>
                <p>Order #${orderId}</p>
                <p>${statusMessage}</p>
                <br>
                <p>Best regards,<br>The ShopHub Team</p>
            `;

            sendSmtpEmail.textContent = `
                Order Update
                Order #${orderId}

                ${statusMessage}

                Best regards,
                The ShopHub Team
            `;

            await apiInstance.sendTransacEmail(sendSmtpEmail);
            logger.info('Order status update email sent', { to, orderId, status });
        } catch (error) {
            logger.error('Failed to send order status email', error as Error, { to, orderId });
            // Don't throw - status update email failure shouldn't break the process
        }
    }

    /**
     * Send newsletter subscription confirmation email
     */
    async sendNewsletterConfirmation(to: string, userName?: string): Promise<void> {
        try {
            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.sender = {
                email: this.senderEmail,
                name: this.senderName
            };

            sendSmtpEmail.to = [{
                email: to
            }];

            sendSmtpEmail.subject = '🎉 Welcome to ShopHub Newsletter!';

            sendSmtpEmail.htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to ShopHub Newsletter!</h2>
                    <p>Hi ${userName || 'there'}!</p>
                    <p>Thank you for subscribing to our newsletter. You're now part of our exclusive community!</p>

                    <h3>What you can expect:</h3>
                    <ul>
                        <li>🎁 Exclusive deals and early access to sales</li>
                        <li>🆕 New product launches and updates</li>
                        <li>💡 Shopping tips and style guides</li>
                        <li>🎉 Special birthday offers</li>
                    </ul>

                    <p><strong>As a welcome gift, enjoy 10% OFF your next purchase!</strong></p>
                    <p>Use code: <span style="background: #f0f0f0; padding: 5px 10px; font-weight: bold;">WELCOME10</span></p>

                    <div style="margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/shop"
                           style="display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px;">
                            Start Shopping Now
                        </a>
                    </div>

                    <p>Stay tuned for amazing deals coming your way!</p>

                    <hr style="border: 1px solid #e0e0e0; margin: 30px 0;">

                    <p style="color: #666; font-size: 12px;">
                        You received this email because you subscribed to ShopHub newsletter.
                        If you wish to unsubscribe, you can do so at any time from your account settings.
                    </p>

                    <p>Best regards,<br><strong>The ShopHub Team</strong></p>
                </div>
            `;

            sendSmtpEmail.textContent = `
                Welcome to ShopHub Newsletter!

                Hi ${userName || 'there'}!

                Thank you for subscribing to our newsletter. You're now part of our exclusive community!

                What you can expect:
                - Exclusive deals and early access to sales
                - New product launches and updates
                - Shopping tips and style guides
                - Special birthday offers

                As a welcome gift, enjoy 10% OFF your next purchase!
                Use code: WELCOME10

                Visit our shop: ${process.env.FRONTEND_URL || 'http://localhost:3001'}/shop

                Stay tuned for amazing deals coming your way!

                Best regards,
                The ShopHub Team

                ---
                You received this email because you subscribed to ShopHub newsletter.
            `;

            await apiInstance.sendTransacEmail(sendSmtpEmail);
            logger.info('Newsletter confirmation email sent', { to });
        } catch (error) {
            logger.error('Failed to send newsletter confirmation email', error as Error, { to });
            // Don't throw - email failure shouldn't break the subscription process
        }
    }

    /**
     * Test email configuration
     */
    async testEmailConfiguration(): Promise<boolean> {
        try {
            const testEmail = process.env.TEST_EMAIL || 'test@example.com';

            const sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.sender = {
                email: this.senderEmail,
                name: this.senderName
            };

            sendSmtpEmail.to = [{
                email: testEmail
            }];

            sendSmtpEmail.subject = 'Test Email - ShopHub Configuration';
            sendSmtpEmail.htmlContent = '<p>This is a test email to verify Brevo configuration.</p>';
            sendSmtpEmail.textContent = 'This is a test email to verify Brevo configuration.';

            await apiInstance.sendTransacEmail(sendSmtpEmail);
            logger.info('Test email sent successfully', { to: testEmail });
            return true;
        } catch (error) {
            logger.error('Email configuration test failed', error as Error);
            return false;
        }
    }
}

// Export singleton instance
export const emailService = new EmailService();