import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdFileDownloadDone } from "react-icons/md";
import Calendar from './Calendar'
import { BsThreeDotsVertical } from "react-icons/bs";

function DoctorAvailableDays() {

    const BASE_URL = "http://localhost:8080"

    const [update, setUpdate]=useState(false);
    const [availableDates, setAvailableDates]= useState([]);
    const [newAvailableDate, setNewAvailableDate] = useState({
        "workDay": "",
        "doctorId": { id: "", name: ""},
    })
    const [editAvailableDateId, setEditAvailableDateId]=useState(null);
    const [editAvailableDate, setEditAvailableDate] = useState({
        "workDay": "",
        "doctorId": { id: "", name: ""},
    });
    const [doctors, setDoctors]=useState([]);
    const [selectedDoctorId, setSelectedDoctorId]=useState(null);
    const [newSelectedDate, setNewSelectedDate] = useState("");
    const [searchAvailableId, setSearchAvailableId] = useState("");

    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/available-dates`);
            setAvailableDates(response.data.content);
        };
        getData ();
        setUpdate(false);  
    }, [update]);

    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/doctors`);
            setDoctors(response.data.content);
        };
        getData ();  
    }, [doctors]);

    const doctorNameSelectChange = (e)=>{
        setSelectedDoctorId(e.target.value);
    };

    useEffect(()=>{
        const handleSetNewAvailableDate = ()=>{
            setNewAvailableDate({workDay: newSelectedDate, doctorId : selectedDoctorId});
        }
        handleSetNewAvailableDate();
    },[newSelectedDate]);

    const addNewAvailableDate = async()=>{
        await axios.post(`${BASE_URL}/api/v1/available-dates`, newAvailableDate);
        setNewSelectedDate("");
        setNewAvailableDate({"workDay": "" , "doctorId":""});
        setUpdate(true);
    }

    const deleteAvailableDate = async(e)=>{
        const {id}=e.target;
        await axios.delete(`${BASE_URL}/api/v1/available-dates/${id}`);
        setUpdate(true);
    };
    const handleEditAvailableDate = (e) =>{
        const id = e.target.id;
        setEditAvailableDateId(id);
        availableDates?.map((item)=>{
            if(item.id == id){
                setEditAvailableDate({workDay: item.workDay , doctorId: item.doctor.id});
            }
        })
    };
    const editAvailableDateInput =(e)=>{
        const {value}= e.target;
        setEditAvailableDate(prev=>({
            ...prev,
            workDay : value
        }));
    };
    const editAvailableDateDone =async(e)=>{
        const {id}=e.target;
        await axios.put(`${BASE_URL}/api/v1/available-dates/${id}`, editAvailableDate);
        setEditAvailableDate({"workDay": "" ,"doctorId":""});
        setEditAvailableDateId(null);
        setUpdate(true);
    };
    const handleSearchAvailableId = async(e) => {
        const value = e.target.value;
        setSearchAvailableId(value);
        if (value === "") {
        await axios.get(`${BASE_URL}/api/v1/available-dates`)
            .then(response => {
                setAvailableDates(response.data.content);
            })
        }
        else{
        await axios.get(`${BASE_URL}/api/v1/available-dates/${value}`)
            .then(response => {
                setAvailableDates([response.data]);
            })}
    };


  return (
    <div>
        <select
            onChange={doctorNameSelectChange}
            value={selectedDoctorId}
            id='doctorSelect'
            name='doctorName'
            >
                <option selected disabled>Bir doktor seçiniz</option>
                {doctors?.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                ))}
            </select>
        <Calendar setNewSelectedDate={setNewSelectedDate}/>
        <button onClick={addNewAvailableDate}>Ekle</button>
        <div>
        <h3>Doktor Çalışma Günleri:</h3>  
        <div className='listHeader'>
            <input type="text" 
            placeholder='Çalışma Günü' 
            value={searchAvailableId}
            onChange={handleSearchAvailableId}/>
            </div> 
        {availableDates?.map((item)=>{
            if(item.doctor.id == selectedDoctorId){
                return (
                    <div key={item.id}>
                        {editAvailableDateId == item.id ? (
                            <div>
                            <input type="date" 
                            value={editAvailableDate.workDay}
                            onChange={editAvailableDateInput}/>
                            <MdDeleteForever onClick={deleteAvailableDate} id={item.id}/>
                            <MdFileDownloadDone onClick={editAvailableDateDone} id={item.id} />
                            </div>
                        ): (
                        <div>
                        <span key={item.id}>{item.workDay}</span>
                        <span><MdDeleteForever onClick={deleteAvailableDate} id={item.id} /></span>
                        <span><BiSolidEditAlt onClick={handleEditAvailableDate} id={item.id} /></span>
                        </div>
                        )}
                    </div>
                    
                ) 
            }
            
        })}
        </div>
        

    </div>
  )
}

export default DoctorAvailableDays