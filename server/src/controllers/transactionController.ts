import Stripe from "stripe";
import dotenv from "dotenv";
import { Request, Response } from "express";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
        "STRIPE_SECRET_KEY é obrigatória mas não foi achada nas variáveis de ambiente."
    )
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createTransaction = async (
    req: Request,
    res: Response,
): Promise<void> => {

    const { userId, courseId, transactionId, amount, paymentProvider } = req.body;
    
    try {
        const course = await Course.get(courseId);

        // criando uma nova transação na tabela de transações

        const newTransaction = new Transaction({
            dateTime: new Date().toISOString(),
            userId,
            courseId,
            transactionId,
            amount,
            paymentProvider
        })

        await newTransaction.save();

        // adicionando nova entrada na tabela de progresso de usuario

        const initialProgress = new UserCourseProgress({
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            overallProgress: 0,
            sections: course.sections.map((section: any) => ({
                sectionId: section.sectionId,
                chapters: section.chapters.map((chapter: any) => ({
                    chapterId: chapter.chapterId,
                    completed: false
                })
            )})),
            lastAccessedTimestamp: new Date().toISOString()
        })

        await initialProgress.save();

        // adicionando o usuário à lista de inscritos no curso

        await Course.update({
            courseId,
        }, {
            $ADD: {
                enrollments: [ { userId }],
            }
        });

        res.json({
            message: "Pagamento criado com sucesso.",
            data: {
                transaction: newTransaction,
                courseProgress: initialProgress
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar a transação.",
            error  
        })
    }
}

export const createStripePaymentIntent = async (
    req: Request,
    res: Response,
): Promise<void> => {
    let { amount } = req.body;

    amount = Number(amount);

    if (!amount || amount <= 0) {
        amount = 50;
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "brl",
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            }
        })

        res.json({ message: "", data: {
            clientSecret: paymentIntent.client_secret
        }})
    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar o pagamento.",
            error  
        })
    }
}
