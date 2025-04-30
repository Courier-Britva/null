import { useState } from 'react'
import './payment.css'

function Payment({ onConfirm, selection }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [sponsor, setSponsor] = useState('')

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const handleCardChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4)
    let month = value.slice(0, 2)
    let year = value.slice(2, 4)

    if (month.length === 1 && +month > 1) month = '0' + month
    if (month.length === 2) {
      if (+month === 0) month = '01'
      if (+month > 12) month = '12'
    }

    let result = month
    if (value.length > 2) result += '/' + year

    setExpiry(result)
  }

  const handleCvcChange = (e) => {
    setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))
  }

  const handleSponsorChange = (e) => {
    setSponsor(e.target.value)
  }

  const area = selection?.w * selection?.h || 0
  const price = area * 1

  return (
    <div className="payment__container">
      <span className="payment__container__title">
        Payment form
      </span>
      <div className="payment__container__body">
        <div className="payment__container__payment_element">
          <input
            type="text"
            placeholder="XXXX XXXX XXXX XXXX"
            className="payment_element__input"
            value={cardNumber}
            onChange={handleCardChange}
          />
          <div className="payment__container__payment_element_devider"></div>
          <div className="payment__element_inputs_container">
            <input
              type="text"
              placeholder="MM/YY"
              className="payment_element__input"
              value={expiry}
              onChange={handleExpiryChange}
            />
            <input
              type="text"
              placeholder="CVC"
              className="payment_element__input"
              value={cvc}
              onChange={handleCvcChange}
            />
          </div>
        </div>

        <div className="payment_form__content">
          <span className="payment__container__summary">
            You've selected {area} m² — that's ${price}/month
          </span>
          <span style={{marginTop: '12px'}} className="payment__container__about">
            Without your support it would take 12 years and 1 month for this area to become Green again
          </span>
          <span className="payment__container__about_details">
            How we know this?
          </span>
          <input
              type="text"
              placeholder="Sponsor name"
              className="sponsor_element__input"
              value={sponsor}
              onChange={handleSponsorChange}
          />
        </div>
        <button className="canvas_buy__button" onClick={() => onConfirm(sponsor || 'Anonymous')}>
          Pay
        </button>
      </div>
    </div>
  )
}

export default Payment
