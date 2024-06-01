"use server";

import { auth } from "@/auth"
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { getUserById } from "@/db/data/user";

export const createCustomerAction = async (name, email, userId) => {
    const existingCustomer = await stripe.customers.list({
        email,
        limit: 1,
    });

    if (existingCustomer.data.length > 0) {
        throw new Error("Customer already exists");
    }
    
    try {
        const customer = await stripe.customers.create({
            name: name,
            email: email,
            metadata: {
                userId: userId,
            },
        });
        return customer;
    } catch (error) {
        console.log(error);
        throw new Error("Error creating customer");
    }
}

export async function generateStripeSessionAction(priceId) {
    const session = await auth(); 

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const { user } = session;
    if (!user.email || !user.id) {
        throw new Error('Email and userId are required');
    }

    let stripeCustomer;
    let stripeSession;

    const customer = await getUserById(user.id);
    if (!customer.stripeCustomerId) {
        try {
            stripeCustomer = await createCustomerAction(user.name, user.email, user.id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    } else {
        stripeCustomer = { id: customer.stripeCustomerId };
    }

    const checkoutObject = {
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        payment_method_types: ['card'],
        mode: 'subscription',
        customer: stripeCustomer.id,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        metadata: {
            userId: user.id,
        },
    };

    try {
        stripeSession = await stripe.checkout.sessions.create(checkoutObject);
        
    } catch (error) {
        console.log(error);
        throw new Error('Error creating Stripe checkout session');
    }
    redirect(stripeSession.url);
}

export const createBillingPortalAction = async (userId) => {
    const user =  await getUserById(userId);

    const billingPortal = await stripe.billingPortal.sessions.create({
        customer: user[0].stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });
    redirect(billingPortal.url)
}
