const axios = require('axios');

exports.createPaymentIntention = async ({
  amount,
  user,
  orderId,
  paintingName
}) => {
  const response = await axios.post(
    'https://accept.paymob.com/v1/intention/',
    {
      amount: Math.round(amount * 100),
      currency: 'EGP',

      payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)],

      items: [
        {
          name: paintingName,
          amount: Math.round(amount * 100),
          description: `Payment for ${paintingName}`,
          quantity: 1
        }
      ],

      billing_data: {
        first_name: user.name,
        last_name: 'ByteShadow',
        phone_number: user.phone,
        email: user.email,

        apartment: 'NA',
        floor: 'NA',
        street: user.address || 'NA',
        building: 'NA',
        city: 'Mansoura',
        state: 'Dakahlia',
        country: 'EG'
      },

      special_reference: orderId.toString(),

      expiration: 3600,

      notification_url: `${process.env.BASE_URL}/api/v1/orders/paymob-webhook`,

      redirection_url: `${process.env.BASE_URL}/account`
    },
    {
      headers: {
        Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};
