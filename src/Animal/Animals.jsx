import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdFileDownloadDone } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";


function Animals() {
    const BASE_URL = "http://localhost:8080"

    const [update, setUpdate]=useState(false);
    const [animals, setAnimals]= useState([]);
    const [newAnimal, setNewAnimal] = useState({
        "name": "",
        "species": "",
        "breed": "",
        "gender": "",
        "dateOfBirth": "",
        "colour": "",
        "customer" : { id: "", name: ""},
    })
    const [editAnimalId, setEditAnimalId]=useState(null);
    const [editAnimal, setEditAnimal] = useState({
        "name": "",
        "species": "",
        "breed": "",
        "gender": "",
        "dateOfBirth": "",
        "colour": "",
        "customer" :{ id: "", name: ""},
    });
    const [customers, setCustomers]=useState([]);
    const [searchAnimal, setSearchAnimal] = useState("");
    const [searchAnimalCustomer, setSearchAnimalCustomer] = useState("");

    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/animals`);
            setAnimals(response.data.content);
        };
        getData ();
        setUpdate(false);  
    }, [update]);
    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/customers`);
            setCustomers(response.data.content);
        };
        getData ();
        setUpdate(false);  
    }, [update]);
    //dataya eklenecek veriyi tanımlama
    const newAnimalInputChange = (e)=>{
        const {name, value} = e.target;
        setNewAnimal(prev=>({
            ...prev, 
            [name]: value
        }))
    };
    //dataya yeni veri ekleme
    const newAnimalAdd =async ()=>{
        await axios.post(`${BASE_URL}/api/v1/animals`, newAnimal);
        setUpdate(true);
        setNewAnimal({
            "name": "",
            "species": "",
            "breed": "",
            "gender": "",
            "dateOfBirth": "",
            "colour": "",
            "customer" : { id: "", name: ""}})
    };
    //datadan veri silme
    const deleteAnimal= async(e)=>{
        const id = e.target.id;
        await axios.delete(`${BASE_URL}/api/v1/animals/${id}`);
        setUpdate(true);
    };
    //veriyi düzenlemek için
    const handleEditAnimal =(e)=>{
        const id = +e.target.id;
        setEditAnimalId(id);
        const animal = animals.find(item => item.id === id);
        if (animal) {
            setEditAnimal({
                name: animal.name,
                species: animal.species,
                breed: animal.breed,
                gender: animal.gender,
                dateOfBirth: animal.dateOfBirth,
                colour: animal.colour,
                customer: animal.customer
            });
        }
    };
    //mevcut veriyi yeni değişkene atama
    const editAnimalInputChange=(e)=>{
        const {name, value} = e.target;
        setEditAnimal(prev=>({
            ...prev, 
            [name]: value
        }));
    };
    //düzenlenen bilgileri dataya kaydetme
    const editAnimalDone = async(e)=>{
        const id = +e.target.id;
        console.log("edit için id", editAnimal);
        await axios.put(`${BASE_URL}/api/v1/animals/${id}`, editAnimal);
        setEditAnimal({"name": "",
        "species": "",
        "breed": "",
        "gender": "",
        "dateOfBirth": "",
        "colour": "",
        "customer" : { id: "", name: ""}})
        // burayı kontrol
        console.log("edit yapılıdı", editAnimal)
        setEditAnimalId(null);
        setUpdate(true);
    };

    const customerNameSelectChange =(e)=>{
        const id = e.target.value;
        const selectedCustomer = customers.find(item => item.id == id);
        if (selectedCustomer) {
            setNewAnimal(prev => ({
                ...prev,
                customer: selectedCustomer
            }));
        }
    };

    const editCustomerNameSelectChange =(e)=>{
        const id = e.target.value;
        const selectedCustomer = customers.find(item => item.id == id);
        if (selectedCustomer) {
            setEditAnimal(prev => ({
                ...prev,
                customer: selectedCustomer
            }));
        }
    };
    const handleSearchAnimal = async (e) => {
        const value = e.target.value;
        setSearchAnimal(value);
        await axios.get(`${BASE_URL}/api/v1/animals/searchByName?name=${value}`)
            .then(response => {
                setAnimals(response.data.content);
            })
        await axios.get(`${BASE_URL}/api/v1/animals/${value}`)
            .then(response => {
                setAnimals([response.data]);
            })
    };
    const handleSearchAnimalCustomer = async(e) => {
        const value = e.target.value;
        setSearchAnimalCustomer(value);
        if (value === '') {
            await axios.get(`${BASE_URL}/api/v1/animals`)
                .then(response => {
                    setAnimals(response.data.content);
                })
        }
        else{
        await axios.get(`${BASE_URL}/api/v1/animals/searchByCustomer?customerName=${value}`)
            .then(response => {
                setAnimals(response.data.content);
            })}
       
    };


  return (
    <div className='container'>
        {/* yeni hayvan ekleme */}
        <div className='addNewBox'> 
        <h3>Hayvan Ekle</h3>
            <input type="text"  placeholder="İsim"
            name="name"
            value={newAnimal.name}
            onChange={newAnimalInputChange}
            />
            <input type="text"  placeholder="Tür"
            name="species"
            value={newAnimal.species}
            onChange={newAnimalInputChange}
            />
            <input type="text"  placeholder="Cins"
            name="breed"
            value={newAnimal.breed}
            onChange={newAnimalInputChange}
            />
            <input type="text"  placeholder="Cinsiyet"
            name="gender"
            value={newAnimal.gender}
            onChange={newAnimalInputChange}
            />
            <input type="date"
            name="dateOfBirth"
            value={newAnimal.dateOfBirth}
            onChange={newAnimalInputChange}
            />
            <input type="text"  placeholder="Renk"
            name="colour"
            value={newAnimal.colour}
            onChange={newAnimalInputChange}
            />
            <select
            onChange={customerNameSelectChange}
            value={newAnimal.customer.id || ""}
            id='customerSelect'
            name='customer'
            >
                <option value="" disabled hidden>Hayvan Sahibi Seçiniz</option>
                {customers.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                ))}
            </select>
            <button onClick={newAnimalAdd}>Ekle</button>
        </div>
        {/* yeni hayvan ekleme bitiş */}
        <div className='listBoxContainer'>
        <h3>Hayvan Listesi</h3>
        <div className='listBox'>
        {/* hayvan liste başlık alanı */}
        <div className='listHeader'>
            <input type="text" placeholder='İsim' 
            value={searchAnimal}
            onChange={handleSearchAnimal}/>
            <input type="text" placeholder='Tür'/>
            <input type="text" placeholder='Cins'/>
            <input type="text" placeholder='Cinsiyet'/>
            <input type="text" placeholder='Doğum Tarihi'/>
            <input type="text" placeholder='Renk'/>
            <input type="text" placeholder='Hayvan Sahibi'
            value={searchAnimalCustomer}
            onChange={handleSearchAnimalCustomer}/>
            <div><BsThreeDotsVertical /></div>
        </div>
        {/* hayvan liste başlık alanı bitiş */}
        {/* hayvan düzenleme ve listeleme */}
        <div className='listItems'>
        { animals?.map((item, index)=>(
            <div key={index}>
                {editAnimalId== item.id ?( 
                // hayvan düzenleme başlangıç
                        <div className='listItemsEdit'>
                            <input type="text" placeholder="İsim"
                                name="name"
                                value={editAnimal.name}
                                onChange={editAnimalInputChange}/>
                            <input type="text" placeholder="Tür"
                                name="species"
                                value={editAnimal.species}
                                onChange={editAnimalInputChange} />
                            <input type="text" placeholder="Cins"
                                name="breed"
                                value={editAnimal.breed}
                                onChange={editAnimalInputChange}/>
                            <input type="text" placeholder="Cinsiyet"
                                name="gender"
                                value={editAnimal.gender}
                                onChange={editAnimalInputChange}/>
                            <input type="date" name="dateOfBirth"
                                value={editAnimal.dateOfBirth}
                                onChange={editAnimalInputChange}/>
                            <input type="text" 
                                placeholder="Renk"
                                name="colour"
                                value={editAnimal.colour}
                                onChange={editAnimalInputChange}/>
                            <select
                                onChange={editCustomerNameSelectChange}
                                value={editAnimal.customer.id || ""}
                                id='customerSelect'
                                name='customer'>
                                <option value="" disabled hidden>Hayvan Sahibi Seçiniz</option>
                                    {customers.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                            </select>
                            <div>
                                <MdDeleteForever onClick={deleteAnimal} id={item.id} />
                                <MdFileDownloadDone onClick={editAnimalDone} id={item.id}/>
                            </div>
                        </div>
                        // hayvan düzenleme bitiş
                    ): (
                        // hayvan listeleme başlangıç
                        <div className='listRow'>
                            <span>{item.name}</span>
                            <span>{item.species}</span>
                            <span>{item.breed}</span>
                            <span>{item.gender}</span>
                            <span>{item.dateOfBirth}</span>
                            <span>{item.colour}</span>
                            <span>{item.customer.name}</span>
                            <div>
                                <MdDeleteForever onClick={deleteAnimal} id={item.id} />
                                <BiSolidEditAlt onClick={handleEditAnimal} id={item.id} />
                            </div>
                            {/* hayvan düzenleme bitiş */}
                    </div> )}
                </div>))}
        </div>
        </div>
        </div>
        </div>
  )
}

export default Animals