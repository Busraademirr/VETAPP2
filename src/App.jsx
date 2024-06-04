import { Route, Routes } from 'react-router'
import './App.css'
import PageHeader from './PageHeader/PageHeader'
import Home from './HomePage/Home'
import Customers from './Customers/Customers'
import Doctors from './Doctors/Doctors'
import Animals from './Animal/Animals'
import AvailableDates from './AvailableDates/AvailableDates'
import DoctorAvailableDays from './AvailableDates/DoctorAvailableDays'
import Vaccinations from './Vaccinations/Vaccinations'
import Appointments from './Appointments/Appointments'

function App() {


  return (
    <>
    <PageHeader/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/customers' element={<Customers/>}/>
      <Route path='/doctors' element={<Doctors/>}/>
      <Route path='/animals' element={<Animals/>}/>
      <Route path='/vaccinations' element={<Vaccinations/>}/>
      <Route path='/available-dates' element={<AvailableDates/>}/>
      <Route path='/appointments' element={<Appointments/>}/>
      <Route path='/doctor-available-dates' element={<DoctorAvailableDays/>}/>
    </Routes>
    </>
  )
}

export default App
