import React from 'react'

type PageWrapperProps = {
  children: React.ReactNode
  className?: string
}

const PageWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <main className={`pt-28 pb-20 ${className}`}>
      {children}
    </main>
  )
}

export default PageWrapper
