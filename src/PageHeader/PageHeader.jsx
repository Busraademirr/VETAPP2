import React from 'react'
import {Link} from 'react-router-dom';

function PageHeader() {
  return (
    <div>
         <div>
        <ul >
          <li><Link  to="/"> Home </Link></li>
          <li><Link  to="/customers"> Müşteri </Link></li>
          <li><Link  to="/doctors"> Doktor </Link></li>
          <li><Link  to="/animals"> Hayvan </Link></li>
          <li><Link  to="/vaccinations"> Aşı </Link></li>
          <li><Link  to="/appointments"> Randevu </Link></li>
          <li><Link  to="/available-dates"> Poliklinik Günleri </Link></li>
        </ul>
    </div>
    </div>
  )
}

export default PageHeader