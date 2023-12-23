module.exports.getConnectedStripeAccountID = (user) => {
  const isLive = process.env.STRIPE_PUBLIC_KEY.match(/^pk_live_.*$/);
  if (isLive) {
    return user.connectedStripeAccountID_Live;
  }
  return user.connectedStripeAccountID;
};

