import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { MdDeleteForever } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdFileDownloadDone } from "react-icons/md";


function Customers() {
    const BASE_URL = "http://localhost:8080"

    const [update, setUpdate]=useState(false);
    const [customers, setCustomers]= useState([]);
    const [newCustomer, setNewCustomer] = useState({
        "name": "",
        "phone": "",
        "email": "",
        "address": "",
        "city": ""
    })
    const [editCustomerId, setEditCustomerId]=useState(null);
    const [editCustomer, setEditCustomer] = useState({
        "name": "",
        "phone": "",
        "email": "",
        "address": "",
        "city": ""
    });
    //datayı çekmek  için
    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/customers`);
            setCustomers(response.data.content)
        };
        getData ();
        setUpdate(false);  
    }, [update]);
    //dataya eklenecek veriyi tanımlama
    const newCustomerInputChange = (e)=>{
        const {name, value} = e.target;
        setNewCustomer(prev=>({
            ...prev, 
            [name]: value
        }))
    };
    //dataya yeni veri ekleme
    const newCustomerAdd =async ()=>{
        await axios.post(`${BASE_URL}/api/v1/customers`, newCustomer);
        setUpdate(true);
        setNewCustomer({
        "name": "",
        "phone": "",
        "email": "",
        "address": "",
        "city": ""})
    };
    //datadan veri silme
    const deleteCustomer= async(e)=>{
        const id = e.target.id;
        await axios.delete(`${BASE_URL}/api/v1/customers/${id}`);
        setUpdate(true);
    };
    //veriyi düzenlemek için
    const handleEditCustomer =(e)=>{
        const id = +e.target.id;
        setEditCustomerId(id);
        customers.map((item)=>{
            if(item.id===id){
                setEditCustomer({
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
    const editCustomerInputChange=(e)=>{
        const {name, value} = e.target;
        setEditCustomer(prev=>({
            ...prev, 
            [name]: value
        }));
    };
    //düzenlenen bilgileri dataya kaydetme
    const editCustomerDone = async(e)=>{
        const {id} = e.target;
        await axios.put(`${BASE_URL}/api/v1/customers/${id}`, editCustomer);
        setEditCustomer({"name": "", "phone": "", "email": "", "address": "", "city": "" })
        setEditCustomerId(null);
        setUpdate(true);
    };

  return (
    <div>
        <h3>Yeni Müşteri</h3>
        <div>
            <input type="text" 
            placeholder="İsim"
            name="name"
            value={newCustomer.name}
            onChange={newCustomerInputChange}
            />
           
            <input type="text" 
            placeholder="Numara"
            name="phone"
            value={newCustomer.phone}
            onChange={newCustomerInputChange}
            />
            
            <input type="text" 
            placeholder="Email"
            name="email"
            value={newCustomer.email}
            onChange={newCustomerInputChange}
            />
            
            <input type="text" 
            placeholder="Adres"
            name="address"
            value={newCustomer.address}
            onChange={newCustomerInputChange}
            />
            
            <input type="text" 
            placeholder="Şehir"
            name="city"
            value={newCustomer.city}
            onChange={newCustomerInputChange}
            />
            <button onClick={newCustomerAdd}>Ekle</button>

            <h3>Müşteri Listesi</h3>
        <div>
            {customers?.map((item, index)=>(
                <div key={index}>
                    {editCustomerId == item.id ? (
                            <div>
                                <div>
                                <input type="text" placeholder='İsim'
                                name='name'
                                value={editCustomer.name}
                                onChange={editCustomerInputChange}/> 

                                <input type="text" placeholder='Numara'
                                name='phone'
                                value={editCustomer.phone}
                                onChange={editCustomerInputChange}/> 

                                <input type="text" placeholder='Email'
                                name='email'
                                value={editCustomer.email}
                                onChange={editCustomerInputChange}/>

                                <input type="text" placeholder='Adres'
                                name='address'
                                value={editCustomer.address}
                                onChange={editCustomerInputChange}/> /
                                <input input type="text" placeholder='Şehir'
                                name='city'
                                value={editCustomer.city}
                                onChange={editCustomerInputChange}/>
                                </div>
                                <MdDeleteForever onClick={deleteCustomer} id={item.id} />
                                <MdFileDownloadDone onClick={editCustomerDone} id={item.id}/>
                            </div>
                        ) : (
                            <>
                            
                                <span> {item.name}</span>
                                <span> {item.phone}</span>
                                <span> {item.email}</span>
                                <span> {item.address}/{item.city}</span>
                                <MdDeleteForever onClick={deleteCustomer} id={item.id} />
                                <BiSolidEditAlt onClick={handleEditCustomer} id={item.id} />
                            </>)}
                </div> ))}
        </div>
        </div>
    </div>
  )
}

export default Customers