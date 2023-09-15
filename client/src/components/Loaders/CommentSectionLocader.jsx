import React from 'react'
import ContentLoader from 'react-content-loader'

const CommentSectionLoader = props => (
  <ContentLoader 
    className='comment__section__Loader__styles'
    viewBox="0 0 850 390" 
    height={475} 
 
    {...props}
  >
  
    <circle cx="30" cy="30" r="30" />
    <rect x="90" y="5" width="150" rx="5" ry="5" height="12" />
    <rect x="90" y="25" width="100" rx="5" ry="5" height="10" />
    <rect x="90" y="55" width="400" rx="7" ry="7" height="12" />
    <rect x="90" y="75" width="212.5" rx="7" ry="7" height="12" />
    <rect x="0" y="110" width="100%" rx="7" ry="7" height="1" />

    <circle cx="30" cy="170" r="30" />
    <rect x="90" y="145" width="150" rx="5" ry="5" height="12" />
    <rect x="90" y="165" width="100" rx="5" ry="5" height="10" />
    <rect x="90" y="195" width="400" rx="7" ry="7" height="12" />
    <rect x="90" y="215" width="212.5" rx="7" ry="7" height="12" />
    <rect x="0" y="250" width="100%" rx="7" ry="7" height="1" />

    <circle cx="30" cy="310" r="30" />
    <rect x="90" y="285" width="150" rx="5" ry="5" height="12" />
    <rect x="90" y="305" width="100" rx="5" ry="5" height="10" />
    <rect x="90" y="325" width="400" rx="7" ry="7" height="12" />
    <rect x="90" y="345" width="212.5" rx="7" ry="7" height="12" />
    <rect x="0" y="380" width="100%" rx="7" ry="7" height="1" />
  
  </ContentLoader>
)

export default CommentSectionLoader