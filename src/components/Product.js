import React from 'react'
import '../css/Product.css'
import StarIcon from '@material-ui/icons/Star';
import { useStateValue } from '../context-redux/StateProvider';

function Product({ id, title, image, price, rating, alt }) {

  const [{ basket }, dispatch] = useStateValue();

  const addToBasket = () => {
    // diapatch the item into the data layer
    dispatch({
      type: 'ADD_TO_BASKET',
      item: {
        id: id,
        title,
        image: image,
        price: price,
        rating: rating,
      }
    })
  }
  return (
    <div className="product">
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {Array(rating).fill().map((_, i) => (
            <p><StarIcon className='rating__icons' /></p>
          ))}
          
        </div>
      </div>
      <img src={image} alt={alt} />

      <button onClick={addToBasket}>Add to Basket</button>
    </div>
  )
}

export default Product
