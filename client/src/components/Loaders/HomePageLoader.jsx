import React from 'react'
import ContentLoader from 'react-content-loader'

const HomePageLoader = props => {
  return (
    <ContentLoader 
        className='homepage__loader__styles'
        viewBox="0 0 462 450" 
        // height={160} 
        // width={462} 
        {...props}
    >
      <rect x="0" y="15" rx="5" ry="5" width="250" height="9" />
      <rect x="0" y="30" rx="5" ry="5" width="180" height="8" />
      <rect x="320" y="10" rx="2" ry="2" width="120" height="75"/>
      <rect x="0" y="47" rx="3" ry="3" width="220" height="5" />
      <rect x="0" y="57" rx="3" ry="3" width="200" height="5" />
      <rect x="0" y="75" rx="7" ry="7" width="40" height="15" />

      <rect x="0" y="120" rx="2" ry="2" width="120" height="75"/>
      <rect x="190" y="125" rx="5" ry="5" width="250" height="9" />
      <rect x="190" y="140" rx="5" ry="5" width="180" height="8" />
      <rect x="190" y="157" rx="3" ry="3" width="220" height="5" />
      <rect x="190" y="167" rx="3" ry="3" width="200" height="5" />
      <rect x="190" y="185" rx="7" ry="7" width="40" height="15" />

      <rect x="0" y="225" rx="5" ry="5" width="250" height="9" />
      <rect x="0" y="240" rx="5" ry="5" width="180" height="8" />
      <rect x="320" y="230" rx="2" ry="2" width="120" height="75"/>
      <rect x="0" y="257" rx="3" ry="3" width="220" height="5" />
      <rect x="0" y="267" rx="3" ry="3" width="200" height="5" />
      <rect x="0" y="285" rx="7" ry="7" width="40" height="15" />



    </ContentLoader>
  )
}

export default HomePageLoader