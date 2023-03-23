"use strict";
const REACT_APP_PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const {
      totalPrice,
      email,
      products,
      streetAddress,
      city,
      state,
      phoneNumber,
    } = ctx.request.body;

    try {
      //   CREATE THE ITEM
      await strapi.service("api::order.order").create({
        data: {
          userName: email,
          products: products,
          streetAddress: streetAddress,
          city: city,
          state: state,
          phoneNumber: phoneNumber,
        },
      });

      //   RETURN THE SESSION ID TO BE USED ON THE FRONTEND
      return {
        email: email,
        totalPrice: totalPrice,
        publicKey: REACT_APP_PAYSTACK_PUBLIC_KEY,
      };
    } catch (error) {
      ctx.response.status = 500;
      return { error: { message: "There was a problem creating the charge." } };
    }
  },
}));
