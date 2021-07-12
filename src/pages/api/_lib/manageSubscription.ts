import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb';
import { stripe } from "../../../services/stripe";

// Salvar essas info no B.D
export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {

  // Buscar usuário no B.D com ID: {customerId}
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  );

  // Buscar todos os dados da subscription
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id
  }

  if (createAction) {
    // Salvar os dados da subscription do usário no B.D
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index("subscription_by_id"),
              subscriptionId,
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }
}


