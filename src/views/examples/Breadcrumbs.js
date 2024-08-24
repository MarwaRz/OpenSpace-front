import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean); 

  return (
    <nav>
      <div>
       
        {paths.map((path, index) => (
          <h2 key={index}>
            <Link to={`/${paths.slice(0, index + 1).join('/')}`}>
              {path}
            </Link>
            {index < paths.length - 1 && ' → '}
          </h2>
        ))}
      </div>
    </nav>
  );
}

export default Breadcrumbs;
