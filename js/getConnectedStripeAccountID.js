"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedStripeAccountID = void 0;
var getConnectedStripeAccountID = function (user) {
    if (!user) {
        return;
    }
    var isLive = process.env.STRIPE_PUBLIC_KEY.match(/^pk_live_.*$/);
    if (isLive) {
        return user.connectedStripeAccountID_Live;
    }
    return user.connectedStripeAccountID;
};
exports.getConnectedStripeAccountID = getConnectedStripeAccountID;
