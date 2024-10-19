import usePreventDoubleNavigation from '@/customfook/usePreventDoubleNavigation';
import React from 'react'

const Navbar = () => {
  const navigate = usePreventDoubleNavigation();

  return (
    <nav className="container mx-auto lg:px-2 px-5 lg:w-2/5">
      <div className="container flex items-center justify-between mx-auto">
        <span
          className='text-2xl font-medium cursor-pointer'
          onClick={() => navigate('/')}>
          NotionBlog
        </span>
        <div>
          <ul className="flex items-center text-sm py-4">
            <li>
              <span
                className="block px-4 py-2 hover:text-sky-900 transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/')}>
                Home
              </span>
            </li>
            <li>
              {/* こちらのリンクは "#" となっているため、遷移しないリンクとして残しておくか、適切なパスに変更する必要があります */}
              <span
                className="block px-4 py-2 hover:text-sky-900 transition-all duration-300 cursor-pointer"
                onClick={() => {/* 適切なアクションをここに追加 */ }}>
                Portfolio
              </span>
            </li>
            <li>
              <span
                className="block px-4 py-2 hover:text-sky-900 transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/')}>
                Twitter
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;