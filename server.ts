// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { default: axios } = require("axios");
const express = require("express");
const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const fulfillOrder = async (lineItems: any) => {
  try {
    // TODO: fill me in
    // console.log("Fulfilling order", lineItems);

    const response = await axios({
      method: "PUT",
      url: "/api/users",
      data: {
        _id: "6436f3032b67ae01b9c884bb",
        stripe_customer_id: "mark-is-testing-1234",
      },
    });

    console.log("response", response);
  } catch (error: any) {
    console.log("Failed to fulfill order, message: " + error.message);
  }
};

// const fulfillOrder = (session: any) => {
//   // TODO: fill me in
//   console.log("Fulfilling order", session);
// };

const createOrder = (session: any) => {
  // TODO: fill me in
  console.log("Creating order", session);
};

const emailCustomerAboutFailedPayment = (session: any) => {
  // TODO: fill me in
  console.log("Emailing customer", session);
};

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request: any, response: any) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err: any) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Save an order in your database, marked as 'awaiting payment'
        // createOrder(session);

        // Check if the order is paid (for example, from a card payment)
        //
        // A delayed notification payment will have an `unpaid` status, as
        // you're still waiting for funds to be transferred from the customer's
        // account.
        if (session.payment_status === "paid") {
          fulfillOrder(session);
        }

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        // Fulfill the purchase...
        fulfillOrder(session);

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;

        // Send an email to the customer asking them to retry their order
        // emailCustomerAboutFailedPayment(session);

        break;
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    // response.json({ received: true });
    response.status(200).end();
  }
);

app.listen(3000, () => console.log("Running on port 3000"));
