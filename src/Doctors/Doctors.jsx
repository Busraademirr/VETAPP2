import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { MdDeleteForever } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdFileDownloadDone } from "react-icons/md";


function Doctors() {
    const BASE_URL = "http://localhost:8080"

    const [update, setUpdate]=useState(false);
    const [doctors, setDoctors]= useState([]);
    const [newDoctor, setNewDoctor] = useState({
        "name": "",
        "phone": "",
        "email": "",
        "address": "",
        "city": ""
    })
    const [editDoctorId, setEditDoctorId]=useState(null);
    const [editDoctor, setEditDoctor] = useState({
        "name": "",
        "phone": "",
        "email": "",
        "address": "",
        "city": ""
    });
    //datayı çekmek  için
    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/doctors`);
            setDoctors(response.data.content)
        };
        getData ();
        setUpdate(false);  
    }, [update]);
    //dataya eklenecek veriyi tanımlama
    const newDoctorInputChange = (e)=>{
        const {name, value} = e.target;
        setNewDoctor(prev=>({
            ...prev, 
            [name]: value
        }))
    };
    //dataya yeni veri ekleme
    const newDoctorAdd =async ()=>{
        await axios.post(`${BASE_URL}/api/v1/doctors`, newDoctor);
        setUpdate(true);
        setNewDoctor({
        "name": "",
        "phone": "",
        "email": "",
        "address": "",
        "city": ""})
    };
    //datadan veri silme
    const deleteDoctor= async(e)=>{
        const id = e.target.id;
        await axios.delete(`${BASE_URL}/api/v1/doctors/${id}`);
        setUpdate(true);
    };
    //veriyi düzenlemek için
    const handleEditDoctor =(e)=>{
        const id = +e.target.id;
        setEditDoctorId(id);
        doctors.map((item)=>{
            if(item.id===id){
                setEditDoctor({
                    name: item.name,
                    phone: item.phone,
                    email: item.email,
                    address: item.address,
                    city: item.city
                });
            }
        })
    };
    //mevcut veriyi yeni değişkene atama
    const editDoctorInputChange=(e)=>{
        const {name, value} = e.target;
        setEditDoctor(prev=>({
            ...prev, 
            [name]: value
        }));
    };
    //düzenlenen bilgileri dataya kaydetme
    const editDoctorDone = async(e)=>{
        const {id} = e.target;
        await axios.put(`${BASE_URL}/api/v1/doctors/${id}`, editDoctor);
        setEditDoctor({"name": "", "phone": "", "email": "", "address": "", "city": "" })
        setEditDoctorId(null);
        setUpdate(true);
    };

  return (
    <div>
        <h3>Yeni Doktor</h3>
        <div>
            <input type="text" 
            placeholder="İsim"
            name="name"
            value={newDoctor.name}
            onChange={newDoctorInputChange}
            />
           
            <input type="text" 
            placeholder="Numara"
            name="phone"
            value={newDoctor.phone}
            onChange={newDoctorInputChange}
            />
            
            <input type="text" 
            placeholder="Email"
            name="email"
            value={newDoctor.email}
            onChange={newDoctorInputChange}
            />
            
            <input type="text" 
            placeholder="Adres"
            name="address"
            value={newDoctor.address}
            onChange={newDoctorInputChange}
            />
            
            <input type="text" 
            placeholder="Şehir"
            name="city"
            value={newDoctor.city}
            onChange={newDoctorInputChange}
            />
            <button onClick={newDoctorAdd}>Ekle</button>

            <h3>Doktor Listesi</h3>
        <div>
            {doctors?.map((item, index)=>(
                <div key={index}>
                    {editDoctorId == item.id ? (
                            <div>
                                <div>
                                <input type="text" placeholder='İsim'
                                name='name'
                                value={editDoctor.name}
                                onChange={editDoctorInputChange}/> 

                                <input type="text" placeholder='Numara'
                                name='phone'
                                value={editDoctor.phone}
                                onChange={editDoctorInputChange}/> 

                                <input type="text" placeholder='Email'
                                name='email'
                                value={editDoctor.email}
                                onChange={editDoctorInputChange}/>

                                <input type="text" placeholder='Adres'
                                name='address'
                                value={editDoctor.address}
                                onChange={editDoctorInputChange}/> /
                                <input input type="text" placeholder='Şehir'
                                name='city'
                                value={editDoctor.city}
                                onChange={editDooctorInputChange}/>
                                </div>
                                <MdDeleteForever onClick={deleteDoctor} id={item.id} />
                                <MdFileDownloadDone onClick={editDoctorDone} id={item.id}/>
                            </div>
                        ) : (
                            <>
                            
                                <span> {item.name}</span>
                                <span> {item.phone}</span>
                                <span> {item.email}</span>
                                <span> {item.address}/{item.city}</span>
                                <MdDeleteForever onClick={deleteDoctor} id={item.id} />
                                <BiSolidEditAlt onClick={handleEditDoctor} id={item.id} />
                            </>)}
                </div> ))}
        </div>
        </div>
    </div>
  )
}

export default Doctors