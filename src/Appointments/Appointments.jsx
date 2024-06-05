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

    const newAppointmentInputChange=(e)=>{
        const {name, value} = e.target;
        setNewAppointment(prev=>({
            ...prev,
            [name] : value
        }))
        console.log("new: ", newAppointment);
    }

    const newAppointmentDoctorSelectChange = (e) => {
        const { value } = e.target;
        setNewAppointment(prev => ({
            ...prev,
            doctor: doctors?.find(doc => doc.id == value)
        }));
        console.log("new: ", newAppointment);
    }

    const newAppointmentAnimalSelectChange = (e) => {
        const { value } = e.target;
        setNewAppointment(prev => ({
            ...prev,
            animal: animals?.find(animal => animal.id == value)
        }));
        console.log("new: ", newAppointment);
    }

    const addNewAppointment = async () => {
        await axios.post(`${BASE_URL}/api/v1/appointments`, newAppointment)
        setUpdate(true);
        setNewAppointment({
            "appointmentDate": "",
            "doctor": { id: "", name: "" },
            "animal": { id: "", name: "" }
        })
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
            }
        })
    };

    const editAppointmentInputChange=(e)=>{
        const {name, value} = e.target;
        setEditAppointment(prev=>({
            ...prev,
            [name] : value
        }))
    }

    const editAppointmentDoctorSelectChange = (e) => {
        const { value } = e.target;
        const selectedDoctor = doctors.find(doc => doc.id === +value);
        setEditAppointment(prev => ({
            ...prev,
            doctor: selectedDoctor
        }));
    }

    const editAppointmentAnimalSelectChange = (e) => {
        const { value } = e.target;
        const selectedAnimal = animals.find(animal => animal.id === +value);
        setEditAppointment(prev => ({
            ...prev,
            animal: selectedAnimal
        }));
    }

    const editAppointmentDone =async(e)=>{
        const id = editAppointmentId;
        await axios.put(`${BASE_URL}/api/v1/appointments/${id}`, editAppointment);
        setEditAppointment({
            "appointmentDate": "",
            "doctor": { id: "", name: "" },
            "animal": { id: "", name: "" }
        });
        setEditAppointmentId(null);
        setUpdate(true);
    };

    return (
        <div>
            <div>
                <h3>Yeni Randevu Ekle</h3>
                <input type="datetime-local" 
                    placeholder="randevu tarihi"
                    name="appointmentDate"
                    value={newAppointment.appointmentDate}
                    onChange={newAppointmentInputChange}
                />
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
                <button onClick={addNewAppointment}>Ekle</button>
            </div>
            <div>
                <h3>Randevular</h3>
                {appointments?.map(item=>(
                    <div key={item.id}>
                        {editAppointmentId === item.id ? (
                            <div>
                                <input type="datetime-local" 
                                    placeholder="randevu tarihi"
                                    name="appointmentDate"
                                    value={editAppointment.appointmentDate}
                                    onChange={editAppointmentInputChange}
                                />
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
                                <MdDeleteForever onClick={deleteAppointment} id={item.id} />
                                <MdFileDownloadDone onClick={editAppointmentDone} />
                            </div>
                        ) : (
                            <div key={item.id}>
                                <span>{item.appointmentDate}</span>
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