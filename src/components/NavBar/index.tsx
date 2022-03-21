import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './index.less'

import bookshelf from '../../assets/imgs/bookshelf.png'
import bookshelfActive from '../../assets/imgs/bookshelf_active.png'
import recommend from '../../assets/imgs/recommend.png'
import recommendActive from '../../assets/imgs/recommend_active.png'
import sort from '../../assets/imgs/sort.png'
import sortActive from '../../assets/imgs/sort_active.png'

const NavBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeName, setActiveName] = useState<string>('')

  useEffect(() => {
    setActiveName(location.pathname)
  })

  const handleClickItem = (link: string) => {
    if (activeName.indexOf(link) === -1) {
      navigate(link)
    }
  }

  return (
    <div id="nav-bar">
      <div
        className="nav-bar-item"
        role="tab"
        tabIndex={0}
        onClick={() => handleClickItem('/bookshelf')}
        onKeyDown={() => handleClickItem('/bookshelf')}
      >
        <img
          src={bookshelf}
          alt="bookshelf"
          className="icons"
          style={{ display: activeName === '/bookshelf' ? 'none' : '' }}
        />
        <img
          src={bookshelfActive}
          alt="bookshelf"
          className="icons"
          style={{ display: activeName === '/bookshelf' ? '' : 'none' }}
        />
        <div className={activeName === '/bookshelf' ? 'active-name' : ''}>书架</div>
      </div>

      <div
        className="nav-bar-item"
        role="tab"
        tabIndex={0}
        onClick={() => handleClickItem('/recommend')}
        onKeyDown={() => handleClickItem('/recommend')}
      >
        <img
          src={recommend}
          alt="recommend"
          className="icons"
          style={{ display: activeName === '/recommend' ? 'none' : '' }}
        />
        <img
          src={recommendActive}
          alt="recommend"
          className="icons"
          style={{ display: activeName === '/recommend' ? '' : 'none' }}
        />
        <div className={activeName === '/recommend' ? 'active-name' : ''}>榜单</div>
      </div>

      <div
        className="nav-bar-item"
        role="tab"
        tabIndex={0}
        onClick={() => handleClickItem('/sort')}
        onKeyDown={() => handleClickItem('/sort')}
      >
        <img
          src={sort}
          alt="sort"
          className="icons"
          style={{ display: activeName.indexOf('/sort') !== -1 ? 'none' : '' }}
        />
        <img
          src={sortActive}
          alt="sort"
          className="icons"
          style={{ display: activeName.indexOf('/sort') !== -1 ? '' : 'none' }}
        />
        <div className={activeName.indexOf('/sort') !== -1 ? 'active-name' : ''}>分类</div>
      </div>
    </div>
  )
}

export default NavBar
