import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdFileDownloadDone } from "react-icons/md";
import Calendar from './Calendar'

function DoctorAvailableDays() {

    const BASE_URL = "http://localhost:8080"

    const [update, setUpdate]=useState(false);
    const [availableDates, setAvailableDates]= useState([]);
    const [newAvailableDate, setNewAvailableDate] = useState({
        "workDate": "",
        "doctorId": { id: "", name: ""},
    })
    const [editAvailableDateId, setEditAvailableDateId]=useState(null);
    const [editAvailableDate, setEditAvailableDate] = useState({
        "workDate": "",
        "doctorId": { id: "", name: ""},
    });
    const [doctors, setDoctors]=useState([]);
    const [selectedDoctorId, setSelectedDoctorId]=useState(null);
    const [newSelectedDate, setNewSelectedDate] = useState("");

    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/available-dates`);
            setAvailableDates(response.data.content);
        };
        getData ();
        setUpdate(false);  
        console.log("liste güüncellendi useeff", availableDates)
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
            setNewAvailableDate({workDate: newSelectedDate, doctorId : selectedDoctorId});
        }
        handleSetNewAvailableDate();
    },[newSelectedDate]);

    const addNewAvailableDate = async()=>{
        console.log("kaydete basıldı, newAvailableDate:", newAvailableDate);
        await axios.post(`${BASE_URL}/api/v1/available-dates`, newAvailableDate);
        setNewSelectedDate("");
        setNewAvailableDate({"workDate": "" , "doctorId":""});
        setUpdate(true);
        console.log("post edildi toplam liste: ", availableDates);
    }

    const deleteAvailableDate = async(e)=>{
        const {id}=e.target;
        console.log("item id", id);
        await axios.delete(`${BASE_URL}/api/v1/available-dates/${id}`);
        setUpdate(true);
        console.log("delete tıklandı");
    };
    const handleEditAvailableDate = (e) =>{
        const id = e.target.id;
        setEditAvailableDateId(id);
        console.log("input id atandı")
        availableDates?.map((item)=>{
            if(item.id == id){
                setEditAvailableDate({workDate: item.workDay , doctorId: item.doctor.id});
                console.log("edit tılandı, id bulundu, bilgi eşitlendi", editAvailableDate);
            }
        })
    };
    const editAvailableDateInput =(e)=>{
        const {value}= e.target;
        console.log("value değeri" , value);
        setEditAvailableDate(prev=>({
            ...prev,
            workDate : value
        }));
        console.log("data şuna güncellenecekk :", editAvailableDate);
    };
    const editAvailableDateDone =async(e)=>{
        const {id}=e.target;
        console.log("güncellenecek data id: ", id)
        console.log("data güncelleme isteği")
        await axios.put(`${BASE_URL}/api/v1/available-dates/${id}`, editAvailableDate);
        setEditAvailableDate({"workDate": "" ,"doctorId":""});
        setEditAvailableDateId(null);
        setUpdate(true);
        console.log("data güncellendi")
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
        {availableDates?.map((item)=>{
            if(item.doctor.id == selectedDoctorId){
                return (
                    <div key={item.id}>
                        {editAvailableDateId == item.id ? (
                            <div>
                            <input type="date" 
                            value={editAvailableDate.workDate}
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