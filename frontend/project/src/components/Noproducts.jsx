import React from 'react'
import "../componentsStyling/Noproducts.css"
                 
const Noproducts = ({keyword}) => {
  return (
    <div className='no-products-content'>
        <div className="no-products-icon">
            ⚠️ 
        </div>
        <h3 className="no-products-title">No Products Found</h3>         
        <p className="no-products-message">
          {keyword
           ? `We couldn't find any products matching "${keyword}". Try using different keywords or explore our complete catalog.`
           : "No products available Please check back again or refresh the page"
          }
        </p>
    </div>
  )
}

export default Noproducts
