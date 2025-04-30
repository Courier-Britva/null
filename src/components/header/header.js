import './header.css'

const icon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 73.825a182.177 182.177 0 0 0-182.179 182.18c0 100.6 81.563 182.17 182.179 182.17 100.61 0 182.18-81.57 182.18-182.17A182.182 182.182 0 0 0 256 73.825zm-50.703 258.39a4.725 4.725 0 0 1-6.619 4.332l-65.558-28.581a4.721 4.721 0 0 1-2.839-4.324V179.776a4.725 4.725 0 0 1 6.618-4.332l65.549 28.58a4.724 4.724 0 0 1 2.84 4.334v123.856zm89.146-28.573a4.727 4.727 0 0 1-2.83 4.324l-65.566 28.581a4.716 4.716 0 0 1-6.61-4.332V208.359a4.717 4.717 0 0 1 2.83-4.333l65.558-28.581a4.725 4.725 0 0 1 6.618 4.332zm89.166 28.573a4.725 4.725 0 0 1-6.618 4.332l-65.568-28.581a4.713 4.713 0 0 1-2.83-4.324V179.776a4.725 4.725 0 0 1 6.618-4.332l65.549 28.58a4.724 4.724 0 0 1 2.84 4.334v123.856z" data-name="Map"/></svg>


function Header() {
    return (
        <header className="header">  
          <div className="container header__container">
            <div className="header__icon">
              {icon}
            </div> 
            <ul className="header__list">
              <li className="header__list_element">
                <a href="" className="header_list__link">
                  about Earth
                </a>
              </li>
              <li className="header__list_element">
                <a href="" className="header_list__link">
                  How does it work?
                </a>
              </li>
              <li className="header__list_element">
                <a href="" className="header_list__link">
                  Impact
                </a>
              </li>
              <li className="header__list_element">
                <a href="" className="header_list__link">
                  Blog
                </a>
              </li>
            </ul>      
          </div>
        </header>
    );
  }
  
export default Header;  