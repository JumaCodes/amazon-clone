const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { responsiveFontSizes } = require('@material-ui/core');
const stripe = require("stripe")("sk_test_51K0oKPI7WK9tL0F6IWiAKLDAL7yoFPeoPRX2tyJBx3HpqgDGpb7ZNCs3yACBLkKkTu7RQtW06asp38ai04dmLiFM00BQVPahjQ")
const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
 

app.get("/", (request, response) => response.status(200).send("hello world"));

app.post("/payments/create", async (request, response) => {
  const total = request.query.total;

  console.log("Payment Request Recieved Boom!!! The amount is ", total);

  const paymentIntent = await stripe.Payment_intent.create({
    amount: total,
    currency: "usd",
  });

  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  })
})
  
exports.api = functions.https.onRequest(app);

// http://localhost:5001/clone-3fd22/us-central1/api
// http://localhost:5001/clone-3fd22/us-central1/api
