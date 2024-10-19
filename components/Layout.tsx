import React, { ReactNode } from 'react'
import Navbar from './Navbar/Navbar';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  // app.tsxでこのコンポーネントでラップすることによって全ての範囲に適用される
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}

export default Layout