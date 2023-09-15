import React from 'react'
import ContentLoader from 'react-content-loader'

const BlogCardLoader = props => (

  <ContentLoader 
    className='blog__card__loader'
    viewBox="0 0 500 1200" 
    // height={280} 
    // width={500} 
    {...props}
  >
    <rect x="0" y="0" rx="20" ry="20" width="100%" height="300" />
    <rect x="0" y="320" rx="10" ry="10" width="352" height="20" />
    <rect x="0" y="350" rx="10" ry="10" width="230" height="20" />
    <rect x="0" y="400" rx="25" ry="25" width="150" height="55" />

    <rect x="0" y="500" rx="20" ry="20" width="100%" height="300" />
    <rect x="0" y="820" rx="10" ry="10" width="423" height="20" />
    <rect x="0" y="850" rx="10" ry="10" width="200" height="20" />
    <rect x="0" y="900" rx="25" ry="25" width="150" height="55" />

  </ContentLoader>

)

export default BlogCardLoader