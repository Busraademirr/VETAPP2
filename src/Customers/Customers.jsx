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
    const [searchCustomerName, setSearchCustomerName] = useState("");
    //müşteri datayı çekmek  için
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
    //müşteri search datasını çekmek için
    const handleSearchCustomer = async(e) => {
        const value = e.target.value;
        setSearchCustomerName(value);
        await axios.get(`${BASE_URL}/api/v1/customers/searchByName?name=${value}`)
            .then(response => {
                setCustomers(response.data.content);
            })
        await axios.get(`${BASE_URL}/api/v1/customers/${value}`)
            .then(response => {
                setCustomers([response.data]);
            })
    };

  return (
    <div >
        <div className='container'>
        {/* yeni müşteri ekleme   */}
        <div className='addNewBox'>
        <h3>Yeni Müşteri</h3>
        
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
        <button onClick={newCustomerAdd}>EKLE</button>
        </div>
        {/* yeni müşteri bitiş */}

        {/* müşteri listeleme ve düzenleme */}
        <div className='listBox'>
        
        <h3>Müşteri Listesi</h3>
        <div className='listHeader'>
        <input type="text" 
        placeholder='İsim' 
        value={searchCustomerName}
        onChange={handleSearchCustomer}/>
        <input type="text" placeholder='Numara'/>
        <input type="text" placeholder='Mail'/>
        <input type="text" placeholder='Adres'/>
        <input type="text" placeholder='Şehir'/>
        <input type="text" placeholder='Düzenle'/>
        </div>
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
                            <div className='listRow'>
                            
                                <p> {item.name}</p>
                                <p> {item.phone}</p>
                                <p> {item.email}</p>
                                <p> {item.address}/{item.city}</p><p>
                                <MdDeleteForever onClick={deleteCustomer} id={item.id} />
                                <BiSolidEditAlt onClick={handleEditCustomer} id={item.id} /></p>
                            </div>)}
                </div> ))}
        </div>
        {/* müşteri listeleme ve düzenleme bitiş */}
        </div>
    </div>
  )
}

export default Customers