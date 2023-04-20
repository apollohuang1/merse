'use client';

import { useAppSelector } from '@/redux-store/hooks';
import { useRouter } from 'next/navigation';
import React from 'react'

type Props = {}

import Stripe from 'stripe';

if (process.env.STRIPE_SECRET_KEY === undefined) {
  throw new Error('STRIPE_SECRET_KEY is undefined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Subscription = (props: Props) => {

  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      // console.log('Order placed! You will receive an email confirmation.');
      // alert('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      // console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
      // alert('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  const createCheckoutSession = async () => {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        customer_email: auth?.currentUser.email,
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1MyucAKt5zOcNNbDYz4Dawak',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription?canceled=true`
      });

      console.log("Checkout session created, redirecting to checkout page");

      // redirect to session.url by using href
      window.location.href = session.url as string;

      // router.push(session.url as string);
  
      // router.push(session.url as string);
    } catch (error: any) {
      console.log("Failed to create checkout session, message: ", error.message);
    }
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <h1>Subscription</h1>

      <button
        onClick={() => {
          createCheckoutSession();
        }}
      >
        Subscribe
      </button>
    </div>
  )
}

export default Subscription;