import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';



export function SubscribeButton() {

  const [session] = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    if (session?.activeSubscription) {
      router.push('/');
      return;
    }
    try {
      // Faz a chamada p/ API Route
      const response = await api.post('subscribe');

      // Pega o retorno definido na API Routes p/ gerar URL
      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      // Redericiona o usuário p/ checkout, passando o ID
      await stripe.redirectToCheckout({
        sessionId: sessionId
      });

    } catch (err) {
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}