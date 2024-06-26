import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdFileDownloadDone } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

function Reports() {
    const BASE_URL = "https://yammering-rasla-busrademir-a841a0e6.koyeb.app";

    const [update, setUpdate] = useState(false);
    const [reports, setReports] = useState([]);
    const [newReport, setNewReport] = useState({
        "title": "",
        "diagnosis": "",
        "price": "",
        "appointmentId": ""
    });
    const [editReportId, setEditReportId] = useState(null);
    const [editReport, setEditReport] = useState({
        "title": "",
        "diagnosis": "",
        "price": "",
        "appointmentId": ""
    });
    const [appointments, setAppointments] = useState([]);
    const [searchReportId, setSearchReportId] = useState("");

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(`${BASE_URL}/api/v1/reports`);
            setReports(response.data.content);
        };
        getData();
        setUpdate(false);
    }, [update]);

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(`${BASE_URL}/api/v1/appointments`);
            setAppointments(response.data.content);
        };
        getData();
        setUpdate(false);
    }, []);
    
    const newReportInputChange = (e) => {
        const { name, value } = e.target;
        setNewReport(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const appointmentSelectChange = (e) => {
        const id = +e.target.value;
        appointments?.map((appointment) => {
            if (id === appointment.id) {
                setNewReport(prev => ({
                    ...prev, 
                    appointmentId: appointment.id
                }));
            }
        });
    }
    const addNewReport = async () => {
        await axios.post(`${BASE_URL}/api/v1/reports`, newReport);
        setUpdate(true);
        setNewReport({
            "title": "",
            "diagnosis": "",
            "price": "",
            "appointmentId": ""
        });
    }
    const deleteReport = async(e)=>{
        const {id}=e.target;
        await axios.delete(`${BASE_URL}/api/v1/reports/${id}`);
        setUpdate(true);
    };
    const handleEditReport = (e) =>{
        const id = +e.target.id;
        console.log("edit tıklanıldı id: " , id)
        setEditReportId(id);
        reports?.map((item)=>{
            if(item.id === +id){
                setEditReport({
                    title: item.title,
                    diagnosis: item.diagnosis,
                    price: item.price,
                    appointmentId: item.appointment.id });
            }
        })
        console.log("edit fixlendi");
    };
    const editReportInputChange =(e)=>{
        const {name, value}=e.target;
        setEditReport(prev=>({
            ...prev, [name]: value
        }))
    };
    const editAppointmentSelectChange =(e)=>{
        const id = e.target.value;
        appointments?.map((appointment)=>{
            if(id==appointment.id){
                setEditReport(prev=>({
                    ...prev, 
                    appointmentId: appointment.id
                }));
            }
        })
    };
    const editReportDone =async(e)=>{
        const {id}=e.target;
        await axios.put(`${BASE_URL}/api/v1/reports/${id}`, editReport);
        setEditReport({
            "title": "",
            "diagnosis": "",
            "price": "",
            "appointmentId": ""});
        setEditReportId(null);
        setUpdate(true);
    };
    const handleSearchReportId = async(e) => {
        const value = e.target.value;
        setSearchReportId(value);
        if (value === '') {
        await axios.get(`${BASE_URL}/api/v1/reports`)
            .then(response => {
                setReports(response.data.content);
            })
        }
        else{
        await axios.get(`${BASE_URL}/api/v1/reports/${value}`)
         .then(response => {
            setReports([response.data]);
        })}
    };

    return (
        <div className='container'>
            {/* yeni rapor ekleme alanı */}
            <div className='addNewBox'>
                <h3>Yeni Rapor Ekle</h3>
                <select
                    value={newReport.appointmentId}
                    onChange={appointmentSelectChange}
                    name='appointment'>
                    <option value={""} selected disabled hidden>Randevu Seçiniz</option>
                    {appointments?.map((item) => (
                        <option key={item.id} value={item.id}>Tarih: {item.appointmentDate.split('T')[0]} Doktor Adı: {item.doctor.name}</option>
                    ))}
                </select>
                <input type="text" 
                    placeholder="Başlık"
                    name="title"
                    value={newReport.title}
                    onChange={newReportInputChange}
                />
                <input type="text" 
                    placeholder="Hastalık"
                    name="diagnosis"
                    value={newReport.diagnosis}
                    onChange={newReportInputChange}
                />
                <input type="text" 
                    placeholder="Ücret"
                    name="price"
                    value={newReport.price}
                    onChange={newReportInputChange}
                />
                <button onClick={addNewReport}>Rapor Ekle</button>
            </div>
            {/* yeni rapor ekleme alanı bitiş */}
            {/* rapor listeleme ve güncelleme alanı */}
            <div className='listBoxContainer'>
                <h3>Raporlar</h3>
                <div className='listBox'>
                <div className='listHeader'>
                
                <input type="text" placeholder='Başlık'/>
                <input type="text" placeholder='Hastalık'/>
                <input type="text" placeholder='Ücret'/>
                <input type="text" 
                placeholder='Randevu Detayı' value={searchReportId}
                onChange={handleSearchReportId}/>
                <div><BsThreeDotsVertical /></div>
                </div>
                <div className='listItems'>
                {reports?.map(item => (
                        <div key={item.id}>
                        {editReportId === item.id ? (
                            <div className='listItemsEdit'>
                            <select
                            value={editReport.appointmentId}
                            onChange={editAppointmentSelectChange}
                            name='appointment'>
                            <option value={""} selected disabled hidden>Randevu Seçiniz</option>
                            {appointments?.map((item) => (
                                <option key={item.id} value={item.id}>Tarih: {item.appointmentDate.split('T')[0]} Doktor Adı: {item.doctor.name}</option>
                            ))}
                            </select>
                            <input type="text" 
                                placeholder="Başlık"
                                name="title"
                                value={editReport.title}
                                onChange={editReportInputChange}
                            />
                            <input type="text" 
                                placeholder="Hastalık"
                                name="diagnosis"
                                value={editReport.diagnosis}
                                onChange={editReportInputChange}
                            />
                            <input type="text" 
                                placeholder="Hastalık"
                                name="diagnosis"
                                value={editReport.diagnosis}
                                onChange={editReportInputChange}
                            />
                            <input type="text" 
                                placeholder="Ücret"
                                name="price"
                                value={editReport.price}
                                onChange={editReportInputChange}
                            />
                            <MdDeleteForever onClick={deleteReport} id={item.id} />
                            <MdFileDownloadDone onClick={editReportDone} id={item.id}/>
                            </div>
                        ) :(
                            <div className='listRow'>
                                <span>{item.title}</span>
                                <span>{item.diagnosis}</span>
                                <span>{item.price}₺</span>
                                <span>{item.appointment.date.split('T')[0]} Doktor: {item.appointment.doctorName}</span>
                                <div>
                                    <MdDeleteForever onClick={deleteReport} id={item.id} />
                                    <BiSolidEditAlt onClick={handleEditReport} id={item.id}/>
                                </div>
                            </div>
                        )}
                        </div>
                    ))}
                    </div>
                    </div>
                    {/* rapor listeleme ve güncelleme alanı bitiş */}
            </div>
        </div>
    )
}
export default Reports