// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDescription: {},
    similarProductsDescription: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      //   console.log(data)
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
        price: data.price,
      }
      const similarData = data.similar_products.map(eachItem => ({
        availability: eachItem.availability,
        brand: eachItem.brand,
        description: eachItem.description,
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        rating: eachItem.rating,
        style: eachItem.style,
        title: eachItem.title,
        totalReviews: eachItem.total_reviews,
        price: eachItem.price,
      }))

      this.setState({
        productDescription: updatedData,
        similarProductsDescription: similarData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderProductDetails = () => {
    const {productDescription, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDescription
    return (
      <div className="details-container">
        <img src={imageUrl} alt="product" className="product-img" />
        <div className="products-description">
          <h1 className="item">{title}</h1>
          <p className="price">Rs {price} /-</p>
          <div className="rating-review-container">
            <div className="rating-container-list">
              <p className="rating-points">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-image"
              />
            </div>
            <p className="review">{totalReviews} Reviews</p>
          </div>
          <p className="description">{description}</p>
          <div className="available-container">
            <p className="available">Available: </p>
            <p className="text-available"> {availability}</p>
          </div>
          <div className="available-container">
            <p className="available">Brand:</p>
            <p className="text-available"> {brand}</p>
          </div>

          <hr className="seperator" />
          <div className="quantity-container">
            <button
              className="plus-btn"
              data-testid="plus"
              type="button"
              onClick={this.onIncrement}
            >
              <BsPlusSquare className="icon" />
            </button>
            <p className="quantity">{quantity}</p>
            <button
              className="minus-btn"
              data-testid="minus"
              type="button"
              onClick={this.onDecrement}
            >
              <BsDashSquare className="icon" />
            </button>
          </div>
          <button type="button" className="add-btn">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {similarProductsDescription} = this.state
    return (
      <div className="similar-products-container">
        <h1 className="similar">Similar Products</h1>
        <ul className="similar-list">
          {similarProductsDescription.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              similarProductDetails={eachProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  toProducts = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1 className="no-product">Product Not Found</h1>
      <button type="button" className="continue-btn" onClick={this.toProducts}>
        Continue Shopping
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderAllProductsItems = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return (
          <div>
            {' '}
            {this.renderProductDetails()}
            {this.renderSimilarProducts()}
          </div>
        )
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllProductsItems()}
      </>
    )
  }
}

export default ProductItemDetails
