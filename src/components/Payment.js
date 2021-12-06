import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import { Link, useHistory} from 'react-router-dom'
import { getBasketTotal } from '../context-redux/reducer'
import { useStateValue } from '../context-redux/StateProvider'
import '../css/Payment.css'
import { db } from '../firebase'
import CheckoutProduct from './CheckoutProduct';
// import { usePaystackPayment } from 'react-paystack';

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory()
  const [succeeded, setSucceeded] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState(true);

  const stripe = useStripe()
  const elements = useElements();

  useEffect(() => {
    const getClientSecret = async () => {
      const response = await axios({
        method: 'post',
        url:  `/payments/create?total=${getBasketTotal(basket) * 100}`
      });
      setClientSecret(response.data.clientSecret);
    }

    getClientSecret();
  }, [basket])
  
  console.log('THE SECRET IS >>> ', clientSecret)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    }).then(({ paymentItent }) => {
      db
        .collection('users')
        .doc(user?.uid)
        .collections('orders')
        .doc(paymentItent.id)
        .set({
          basket: basket,
          amount: paymentItent.amount,
          created: paymentItent.created
        })

      setSucceeded(true);
      setError(null);
      setProcessing(false);

      dispatch({
        type: 'EMPTY_BASKET'
      })

      history.replace('./orders')
    })
  }

  

  const handleChange = event => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  }


  return (
    <div className="payment">
      <div className="payment__container">
        <h1>Checkout (<Link to='/checkout'>{basket?.length} items</Link>)</h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>White House</p>
            <p>Lagos, Nigeria</p>
          </div>
        </div>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map(item => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment__priceContainer">
              <CurrencyFormat
        renderText={(value) => (
                    <h3>Order Total: {value}</h3>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'$'}
                />
                
                <button disabled={processing || disabled || succeeded}>
                  <span>{ processing ? <p>processing</p> : 'Buy Now' }</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
