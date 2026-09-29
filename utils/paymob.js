const axios = require('axios');

exports.createPaymentIntention = async ({
  amount,
  user,
  orderId,
  paintingName
}) => {
    try {
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

          //   special_reference: orderId.toString(),
          special_reference: `${orderId}-${Date.now()}`,

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
    } catch (err) {
      console.log('================ PAYMOB ERROR ================');
      console.log('STATUS:', err.response?.status);
      console.log('DATA:', err.response?.data);
      console.log('===============================================');

      throw err;
    }
//   const response = await axios.post(
//     'https://accept.paymob.com/v1/intention/',
//     {
//       amount: Math.round(amount * 100),
//       currency: 'EGP',

//       payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)],

//       items: [
//         {
//           name: paintingName,
//           amount: Math.round(amount * 100),
//           description: `Payment for ${paintingName}`,
//           quantity: 1
//         }
//       ],

//       billing_data: {
//         first_name: user.name,
//         last_name: 'ByteShadow',
//         phone_number: user.phone,
//         email: user.email,

//         apartment: 'NA',
//         floor: 'NA',
//         street: user.address || 'NA',
//         building: 'NA',
//         city: 'Mansoura',
//         state: 'Dakahlia',
//         country: 'EG'
//       },

//       special_reference: orderId.toString(),

//       expiration: 3600,

//       notification_url: `${process.env.BASE_URL}/api/v1/orders/paymob-webhook`,

//       redirection_url: `${process.env.BASE_URL}/account`
//     },
//     {
//       headers: {
//         Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     }
//   );

//   return response.data;
};


const crypto = require('crypto');

exports.verifyPaymobHmac = (obj, receivedHmac) => {
  const sourceData = obj.source_data || {};

  const fields = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order.id,
    obj.owner,
    obj.pending,
    sourceData.pan,
    sourceData.sub_type,
    sourceData.type,
    obj.success
  ];

  const data = fields.map(String).join('');

  const calculatedHmac = crypto
    .createHmac('sha512', process.env.PAYMOB_HMAC_SECRET)
    .update(data)
    .digest('hex');

  return calculatedHmac === receivedHmac;
};