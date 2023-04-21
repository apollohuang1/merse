"use client";

import useAuth from "@/hooks/useAuth";
import { useAppSelector } from "@/redux-store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

import Stripe from "stripe";

if (process.env.STRIPE_SECRET_KEY === undefined) {
  throw new Error("STRIPE_SECRET_KEY is undefined, please include in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const Subscription = (props: Props) => {
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);

  const { fetchCurrentUser, reloadCurrentLocalUser } = useAuth();

  const [subscription, setSubscription] = React.useState<any>(null);
  const [isRetrievingSubscription, setIsRetrievingSubscription] = React.useState<any>(false);

  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      // console.log('Order placed! You will receive an email confirmation.');
      // alert('Order placed! You will receive an email confirmation.');
      console.log("Order placed! You will receive an email confirmation.");

      reloadCurrentLocalUser()
        .then((localuser: any) => {
          fetchCurrentUser(localuser?._id);
        })
        .catch((error) => {
          // error handler. no local user found.
        });

      // router.push("/subscription");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
      // alert('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  React.useEffect(() => {
    const localUser = localStorage.getItem("currentUser");

    if (!localUser) return;

    const localUserData = JSON.parse(localUser);
    const userStripeSubscriptionId = localUserData?.stripe_subscription_id as string;
    if (!userStripeSubscriptionId) return;

    retrieveSubscription(userStripeSubscriptionId);

  }, []);

  const retrieveSubscription = async (subscriptionId: string) => {
    try {
      setIsRetrievingSubscription(true);
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      setSubscription(subscription);
      console.log("###----------Retrieved Subscription----------###");
      console.log(subscription);
      setIsRetrievingSubscription(false);
    } catch (error: any) {
      setIsRetrievingSubscription(false);
      console.log("Failed to retrieve subscription, message: ", error.message);
    }
  };

  const createStripePortalSession = async () => {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: auth?.currentUser.stripe_customer_id,
      return_url: process.env.NEXT_PUBLIC_BASE_URL + "/subscription", // This is the url to which the customer will be redirected when they are done managing their billing with the portal.
    });
    window.location.href = portalSession.url as string;
  };

  const createCheckoutSession = async () => {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        customer_email: auth?.currentUser.email,
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: "price_1MyucAKt5zOcNNbDYz4Dawak",
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription?success=true&checkout_session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription?canceled=true`,
      });

      // redirect to session.url by using href
      window.location.href = session.url as string;
    } catch (error: any) {
      console.log(
        "Failed to create checkout session, message: ",
        error.message
      );
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center p-6">
      <div className="flex flex-col gap-6 w-full items-center">
        <h1>Subscription</h1>

        {/* <button
          className="text-accent"
          onClick={() => {
            retrieveSubscription();
          }}
        >
          Retrieve Subscription
        </button> */}

        {isRetrievingSubscription ? (
          <div className="flex w-full h-44 animate-pulse bg-light-background-secondary dark:bg-dark-background-secondary" />
        ) : (
          <>
            { subscription ? (
              <button
                className="text-accent"
                onClick={() => {
                  createStripePortalSession();
                }}
              >
                Manage Subscription
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    createCheckoutSession();
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-full"
                >
                  Subscribe for $10/month
                </button>

                <p className="text-center">
                  Note: this is test mode, use{" "}
                  <span className="text-accent">4242 4242 4242 4242</span> as a
                  visa card number to test with any expiration date and CVC
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Subscription;
