interface User {
  connectedStripeAccountID: string;
  connectedStripeAccountID_Live: string;
}

export const getConnectedStripeAccountID = (user: User) => {
  if (!user) {
    return;
  }
  const isLive = process.env.STRIPE_PUBLIC_KEY.match(/^pk_live_.*$/);
  if (isLive) {
    return user.connectedStripeAccountID_Live;
  }
  return user.connectedStripeAccountID;
};

