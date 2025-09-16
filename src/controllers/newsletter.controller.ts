import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Newsletter } from "../entities/newsletter.entity.js";
import { Logger } from "../utils/logger.js";
import { emailService } from "../services/email.service.js";
import crypto from "crypto";

const logger = new Logger('NewsletterController');
const newsletterRepository = AppDataSource.getRepository(Newsletter);

export const subscribeNewsletter = async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if already subscribed
        const existingSubscription = await newsletterRepository.findOne({
            where: { email }
        });

        if (existingSubscription) {
            if (existingSubscription.active) {
                return res.status(400).json({ error: "Email already subscribed" });
            } else {
                // Reactivate subscription
                existingSubscription.active = true;
                existingSubscription.name = name || existingSubscription.name;
                await newsletterRepository.save(existingSubscription);

                // Send reactivation email
                await emailService.sendNewsletterConfirmation(email, name || existingSubscription.name);

                return res.json({
                    success: true,
                    message: "Subscription reactivated successfully! Check your email for confirmation."
                });
            }
        }

        // Create new subscription
        const unsubscribeToken = crypto.randomBytes(32).toString('hex');
        const subscription = newsletterRepository.create({
            email,
            name,
            unsubscribeToken,
            active: true
        });

        await newsletterRepository.save(subscription);

        // Send confirmation email
        await emailService.sendNewsletterConfirmation(email, name);

        res.status(201).json({
            success: true,
            message: "Successfully subscribed to newsletter! Check your email for confirmation."
        });
    } catch (error) {
        logger.error('Error subscribing to newsletter', error as Error);
        res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
};

export const unsubscribeNewsletter = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ error: "Unsubscribe token is required" });
        }

        const subscription = await newsletterRepository.findOne({
            where: { unsubscribeToken: token }
        });

        if (!subscription) {
            return res.status(404).json({ error: "Subscription not found" });
        }

        subscription.active = false;
        await newsletterRepository.save(subscription);

        res.json({
            success: true,
            message: "Successfully unsubscribed from newsletter"
        });
    } catch (error) {
        logger.error('Error unsubscribing from newsletter', error as Error);
        res.status(500).json({ error: "Failed to unsubscribe from newsletter" });
    }
};

export const getNewsletterSubscribers = async (req: Request, res: Response) => {
    try {
        const { active = true, page = 1, limit = 50 } = req.query;

        const [subscribers, total] = await newsletterRepository.findAndCount({
            where: { active: active === 'true' },
            order: { subscribedAt: 'DESC' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });

        res.json({
            subscribers,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        logger.error('Error fetching newsletter subscribers', error as Error);
        res.status(500).json({ error: "Failed to fetch subscribers" });
    }
};