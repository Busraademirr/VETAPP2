import React from 'react';
import { TbVaccine, TbReportMedical } from "react-icons/tb";
import { MdPeopleAlt, MdPets, MdWorkOutline } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { IoCalendarNumberOutline } from "react-icons/io5";
import './Home.css'
import { useNavigate } from 'react-router-dom';

function Home() {
const navigate = useNavigate(); 
  return (
    <div className="home-container">
      <h1>İŞLEMLER</h1>
      <div className="icon-grid">
        <div className="icon-item">
          <MdPeopleAlt className="icon" onClick={()=> navigate("/customers")}/>
          <h2>Müşteri</h2>
        </div>
        <div className="icon-item">
          <FaUserDoctor className="icon" 
          onClick={()=> navigate("/doctors")}/>
          <h2>Doktor</h2>
        </div>
        <div className="icon-item">
          <MdPets className="icon" onClick={()=> navigate("/animals")}/>
          <h2>Hayvan</h2>
        </div>
        <div className="icon-item">
          <MdWorkOutline className="icon" onClick={()=> navigate("/doctor-available-dates")}/>
          <h2>Doktor Çalışma Günü</h2>
        </div>
        <div className="icon-item">
          <IoCalendarNumberOutline className="icon" onClick={()=> navigate("/appointments")}/>
          <h2>Randevu</h2>
        </div>
        <div className="icon-item">
          <TbVaccine className="icon" onClick={()=> navigate("/vaccinations")}/>
          <h2>Aşı</h2>
        </div>
        <div className="icon-item">
          <TbReportMedical className="icon" onClick={()=> navigate("/reports")}/>
          <h2>Rapor</h2>
        </div>
      </div>
    </div>
  );
}
export default Home