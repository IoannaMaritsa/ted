import React from 'react';
import { useAppContext } from '../context/appContext';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const { isAdmin } = useAppContext();

  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    'epaggelmatias_article': 'Άρθρο',
    'epaggelmatias_aggelies': 'Αγγελίες',
    'contact': 'Contact',
    'admin_user': 'Προφίλ Χρήστη'
    // Add more mappings as needed
  };

  return (
    <nav className="breadcrumbs">
      <Link to={isAdmin ? '/admin' : '/epaggelmatias_homepage'}>🏠︎</Link>
    
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const name = breadcrumbNameMap[value] || value;

        return (
          <span key={to}>
            <span className="breadcrumb-separator"> / </span>
            {index === pathnames.length - 1 || value === "epaggelmatias_article" ? (
              <span>{name}</span>
            ) : (
              <Link to={to}>{name}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;