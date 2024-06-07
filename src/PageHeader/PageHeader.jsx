import React from 'react';
import { Link } from 'react-router-dom';
import './PageHeader.css'

function PageHeader() {
  return (
    <div className='navbar'>
      <nav>
        <div className='logo'>
          <img src="/logo3.png" alt="Logo" />
        </div>
        <div className='menu'>
          <ul className='flex'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/customers">Müşteri</Link></li>
            <li><Link to="/doctors">Doktor</Link></li>
            <li><Link to="/animals">Hayvan</Link></li>
            <li><Link to="/vaccinations">Aşı</Link></li>
            <li><Link to="/appointments">Randevu</Link></li>
            <li><Link to="/available-dates">Poliklinik</Link></li>
            <li><Link to="/reports">Raporlar</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default PageHeader;