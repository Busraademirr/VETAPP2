import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import './AvailableDates.css'

function AvailableDates() {
    const BASE_URL = "https://yammering-rasla-busrademir-a841a0e6.koyeb.app"
    const [availableDates, setAvailableDates]=useState([]);

    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/available-dates`);
            setAvailableDates(response.data.content);
        };
        getData ();  
    }, [availableDates]);


    const navigate = useNavigate(); 

  // Veriyi doktor adına göre grupla
  const groupedData = availableDates.reduce((acc, current) => {
    const doctorName = current.doctor.name;
    if (!acc[doctorName]) {
      acc[doctorName] = [];
    }
    acc[doctorName].push(current.workDay);
    return acc;
  }, {});

  // Doktorları alfabetik olarak sırala
  const sortedDoctorNames = Object.keys(groupedData).sort();

  return (
    <div className='doctor-calendar-page'>
        <h2>Doktor Çalışma Takvimi</h2>
        <div className='doctor-calendar-list'>
            {sortedDoctorNames.map((doctorName) => (
            <div key={doctorName} >
              <h3>{doctorName}</h3>
                {groupedData[doctorName].map((workDate, index) => (
                  <p key={index}>{workDate}</p>
                ))}

            </div>
          ))}
        </div>
        <button onClick={()=> navigate("/doctor-available-dates")}>Çalışma Günü Ekle/Düzenle...</button>
    </div>
  )
}

export default AvailableDates