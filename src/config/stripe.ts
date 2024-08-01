export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPdf: 15,
    price: {
      amount: 0.0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 50,
    pagesPerPdf: 50,
    price: {
      amount: 29.95,
      priceIds: {
        test: process.env.STRIPE_PRICE_ID!,
        production: "",
      },
    },
  },
];
