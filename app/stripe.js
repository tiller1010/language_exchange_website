const stripe = require('stripe')(process.env.STRIPE_SECRET || '');

// Create a new customer and then create an invoice item then invoice it:
async function createOrder(email, description, amount, currency = 'usd'){

  /* Partially working create invoice code */

  // let invoice;
  // await stripe.customers
  // .create({
  //   email,
  // })
  // .then((customer) => {
  //   // have access to the customer object
  //   return stripe.invoiceItems
  //     .create({
  //       customer: customer.id, // set the customer id
  //       amount, // 25
  //       currency,
  //       description,
  //     })
  //     .then((invoiceItem) => {
  //       invoice = invoiceItem;
  //       return stripe.invoices.create({
  //         collection_method: 'send_invoice',
  //         customer: invoiceItem.customer,
  //       });
  //     })
  //     .catch((err) => {
  //       // Deal with an error
  //     });
  // });
  // return invoice;


  /* Working create product and price code */
  
  const product = await stripe.products.create({
    name: description,
  });

  return await stripe.prices.create({
    unit_amount: amount,
    currency,
    product: product.id
  });

}

module.exports = { createOrder };