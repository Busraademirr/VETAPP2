import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdDeleteForever } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdFileDownloadDone } from "react-icons/md";

function Appointments() {

    const BASE_URL = "http://localhost:8080"

    const [update, setUpdate]=useState(false);
    const [appointments, setAppointments]= useState([]);
    const [newAppointment, setNewAppointment] = useState({
        "appointmentDate": "",
        "doctor": { id: "", name: "" },
        "animal": { id: "", name: "" }
    });
    const [editAppointmentId, setEditAppointmentId]=useState(null);
    const [editAppointment, setEditAppointment] = useState({
        "appointmentDate": "",
        "doctor": { id: "", name: "" },
        "animal": { id: "", name: "" }
    });
    const [animals, setAnimals]=useState([]);
    const [doctors, setDoctors]=useState([]);
    const [availableDates, setAvailableDates]=useState([]);
    const [selectedDoctorWorkDay, setSelectedDoctorWorkDay] =useState([]);
    const [selectedDate, setSelectedDate]=useState("");
    const [selectedTime, setSelectedTime]=useState("");
    const [selectedAppointmentDate, setSelectedAppointmentDate]=useState("");
    const [editSelectedDate, setEditSelectedDate]=useState("");
    const [editSelectedTime, setEditSelectedTime]=useState("");
    const[editSelectedAppointmentDate, setEditSelectedAppointmentDate] =useState("");


    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/appointments`);
            setAppointments(response.data.content);
        };
        getData ();
        setUpdate(false);  
    }, [update]);

    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/animals`);
            setAnimals(response.data.content);
        };
        getData ();  
    }, []);

    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/doctors`);
            setDoctors(response.data.content);
        };
        getData ();  
    }, []);
    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/available-dates`);
            setAvailableDates(response.data.content);
        };
        getData ();
    }, []);

    
    const newAppointmentDoctorSelectChange = (e) => {
        const { value } = e.target;
        const selectedDoctor = doctors.find(doc => doc.id == value);
        
        if (selectedDoctor) {
            let selectedDoctorWorkDays = [];
    
            availableDates?.forEach((item) => {
                if (item.doctor.id == selectedDoctor.id) {
                    selectedDoctorWorkDays.push({
                        workDay: item.workDay,
                        id: item.id
                    });
                }
            });
            setSelectedDoctorWorkDay(selectedDoctorWorkDays);
            setNewAppointment(prev => ({
                ...prev,
                doctor: selectedDoctor
            }));
        }
    };
    const newAppointmentAnimalSelectChange = (e) => {
        const { value } = e.target;
        setNewAppointment(prev => ({
            ...prev,
            animal: animals?.find(animal => animal.id == value)
        }));
    }
    const newSelectedDoctorAvailableDateChange =(e)=>{
        setSelectedDate(e.target.value);
        setSelectedAppointmentDate(`${selectedDate}T${selectedTime}`);

    }
    const newSelectedTimeChange = (e) => {
        const newTime = e.target.value;
        setSelectedTime(newTime);
        setNewAppointment(prev => ({
            ...prev,
            appointmentDate: `${selectedDate}T${newTime}`
        }));
    };
    
    const addNewAppointment = async () => {
        await axios.post(`${BASE_URL}/api/v1/appointments`, newAppointment)
        setUpdate(true);
        setNewAppointment({
            "appointmentDate": "",
            "doctor": { id: "", name: "" },
            "animal": { id: "", name: "" }
        })
        setSelectedDate("");
        setSelectedTime("");
    }

    const deleteAppointment = async(e)=>{
        const id = e.currentTarget.id;
        await axios.delete(`${BASE_URL}/api/v1/appointments/${id}`);
        setUpdate(true);
    };
    const handleEditAppointment = (e) => {
        const id = +e.currentTarget.id;
        setEditAppointmentId(id);
        appointments?.forEach((item) => {
            if (item.id === id) {
                setEditAppointment({
                    appointmentDate: item.appointmentDate,
                    doctor: { name: item.doctor.name, id: item.doctor.id },
                    animal: { name: item.animal.name, id: item.animal.id }
                });
                
                setEditSelectedDate(item.appointmentDate.split('T')[0]); 
                setEditSelectedTime(item.appointmentDate.split('T')[1]); 
            }
        })
    };

    const editAppointmentDoctorSelectChange = (e) => {
        const { value } = e.target;
        const selectedDoctor = doctors.find(doc => doc.id === +value);
        setEditAppointment(prev => ({
            ...prev,
            doctor: selectedDoctor
        }));

        // Seçilen doktora göre uygun tarihleri bul
        const selectedDoctorAvailableDates = availableDates.filter(date => date.doctor.id === selectedDoctor.id);
        setSelectedDoctorWorkDay(selectedDoctorAvailableDates);
};

    const editAppointmentAnimalSelectChange = (e) => {
        const { value } = e.target;
        const selectedAnimal = animals.find(animal => animal.id === +value);
        setEditAppointment(prev => ({
            ...prev,
            animal: selectedAnimal
        }));
    }
    const editSelectedDoctorAvailableDateChange = (e)=>{
        setEditSelectedDate(e.target.value);
        setEditSelectedAppointmentDate(`${selectedDate}T${selectedTime}`);
        setEditAppointment(prev=>({
            ...prev, 
            appointmentDate: selectedAppointmentDate
        }))

    }
    const editSelectedTimeChange = (e) => {
        const newTime = e.target.value;
        setEditSelectedTime(newTime);
        setEditAppointment(prev => ({
            ...prev,
            appointmentDate: `${editSelectedDate}T${newTime}`
        }));
    };

    const editAppointmentDone = async(e)=>{
        const id = editAppointmentId;
        await axios.put(`${BASE_URL}/api/v1/appointments/${id}`, editAppointment);
        setEditAppointmentId(null);
        setUpdate(true);
    };

    return (
        <div>
            <div>
                <h3>Yeni Randevu Ekle</h3>
                <select
                    id='doctorSelect'
                    value={newAppointment.doctor.id || ""}
                    onChange={newAppointmentDoctorSelectChange}
                    name='doctor'>
                    <option value={""} disabled hidden>Doktor Seçiniz</option>
                    {doctors?.map((item)=>(
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <select
                    id='animalSelect'
                    value={newAppointment.animal.id || ""}
                    onChange={newAppointmentAnimalSelectChange}
                    name='animal'>
                    <option value={""} disabled hidden>Hayvan Seçiniz</option>
                    {animals?.map((item)=>(
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <select
                    value={selectedDate || ""}
                    onChange={newSelectedDoctorAvailableDateChange}
                    name='appointmentDate'>
                    <option value={""} disabled hidden>Gün Seçiniz</option>
                    {selectedDoctorWorkDay?.map((item)=>(
                        <option key={item.id} value={item.workDay}>{item.workDay}</option>
                    ))}
                </select>
                <input type="time" 
                placeholder="saat seçiniz" 
                value={selectedTime || ""}
                onChange={newSelectedTimeChange}/>

                <button onClick={addNewAppointment}>Ekle</button>
            </div>
            <div>
                <h3>Randevular</h3>
                {appointments?.map(item=>(
                    <div key={item.id}>
                        {editAppointmentId === item.id ? (
                            <div>
                                <select
                                    id='doctorSelect'
                                    value={editAppointment.doctor.id || ""}
                                    onChange={editAppointmentDoctorSelectChange}
                                    name='doctor'>
                                    <option value={""} disabled hidden>Doktor Seçiniz</option>
                                    {doctors?.map((doc)=>(
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                                <select
                                    id='animalSelect'
                                    value={editAppointment.animal.id || ""}
                                    onChange={editAppointmentAnimalSelectChange}
                                    name='animal'>
                                    <option value={""} disabled hidden>Hayvan Seçiniz</option>
                                    {animals?.map((animal)=>(
                                        <option key={animal.id} value={animal.id}>{animal.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={editSelectedDate || ""}
                                    onChange={editSelectedDoctorAvailableDateChange}
                                    name='appointmentDate'>
                                    <option value={""} disabled hidden>Gün Seçiniz</option>
                                    {selectedDoctorWorkDay?.map((item)=>(
                                        <option key={item.id} value={item.workDay}>{item.workDay}</option>
                                    ))}
                                </select>
                                <input type="time" 
                                placeholder="saat seçiniz" 
                                value={editSelectedTime || ""}
                                onChange={editSelectedTimeChange}/>
                                <MdDeleteForever onClick={deleteAppointment} id={item.id} />
                                <MdFileDownloadDone onClick={editAppointmentDone} />
                            </div>
                        ) : (
                            <div key={item.id}>
                                {/* <span>{item.appointmentDate}</span> */}
                                <span>{item.appointmentDate.split('T')[0]}</span>
                                <span>{item.appointmentDate.split('T')[1].split(':').slice(0, 2).join(':')}</span>
                                <span>{item.doctor.name}</span>
                                <span>{item.animal.name}</span>
                                <span>
                                    <MdDeleteForever onClick={deleteAppointment} id={item.id} />
                                    <BiSolidEditAlt onClick={handleEditAppointment} id={item.id}/>
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Appointments;
