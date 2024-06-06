import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdFileDownloadDone } from "react-icons/md";

function Vaccinations() {
    const BASE_URL = "http://localhost:8080"

    const [update, setUpdate] = useState(false);
    const [vaccinations, setVaccinations] = useState([]);
    const [newVaccination, setNewVaccination] = useState({
        "name": "",
        "code": "",
        "protectionStartDate": "",
        "protectionFinishDate": "",
        "animalWithoutCustomer": {}
    });
    const [editVaccinationId, setEditVaccinationId] = useState(null);
    const [editVaccination, setEditVaccination] = useState({
        "name": "",
        "code": "",
        "protectionStartDate": "",
        "protectionFinishDate": "",
        "animalWithoutCustomer": {}
    });
    const [animals, setAnimals] = useState([]);
    const [searchVaccinationId, setSearchVaccinationId] = useState("");
    const [searchVaccinationAnimal, setSearchVaccinationAnimal] = useState("");
    const [searchVaccinationStartDate, setSearchVaccinationStartDate] = useState("");
    const [searchVaccinationEndDate, setSearchVaccinationEndDate] = useState("");

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(`${BASE_URL}/api/v1/vaccinations`);
            setVaccinations(response.data.content);
        };
        getData();
        setUpdate(false);
    }, [update]);

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(`${BASE_URL}/api/v1/animals`);
            setAnimals(response.data.content);
        };
        getData();
    }, []);

    const newVaccinationInputChange = (e) => {
        const { name, value } = e.target;
        setNewVaccination(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const addNewVaccination = async () => {
        await axios.post(`${BASE_URL}/api/v1/vaccinations`, newVaccination)
        setUpdate(true);
        setNewVaccination({
            "name": "",
            "code": "",
            "protectionStartDate": "",
            "protectionFinishDate": "",
            "animalWithoutCustomer": {}
        })
    }

    const animalNameSelectChange = (e) => {
        const id = e.target.value;
        animals?.forEach((animal) => {
            if (id == animal.id) {
                setNewVaccination(prev => ({
                    ...prev,
                    animalWithoutCustomer: animal
                }));
            }
        })
    }

    const deleteVaccination = async (e) => {
        const { id } = e.target;
        await axios.delete(`${BASE_URL}/api/v1/vaccinations/${id}`);
        setUpdate(true);
    };

    const handleEditVaccination = (e) => {
        const id = +e.target.id;
        setEditVaccinationId(id);
        vaccinations?.forEach((item) => {
            if (item.id === id) {
                setEditVaccination({
                    name: item.name,
                    code: item.code,
                    protectionStartDate: item.protectionStartDate,
                    protectionFinishDate: item.protectionFinishDate,
                    animalWithoutCustomer: { name: item.animal.name, id: item.animal.id }
                });
            }
        })
    };

    const editVaccinationInputChange = (e) => {
        const { name, value } = e.target;
        setEditVaccination(prev => ({
            ...prev, [name]: value
        }))
    };

    const editAnimalNameSelectChange = (e) => {
        const id = e.target.value;
        animals?.forEach((animal) => {
            if (id == animal.id) {
                setEditVaccination(prev => ({
                    ...prev,
                    animalWithoutCustomer: animal
                }));
            }
        })
    };

    const editVaccinationDone = async (e) => {
        const { id } = e.target;
        await axios.put(`${BASE_URL}/api/v1/vaccinations/${id}`, editVaccination);
        setEditVaccination({
            "name": "",
            "code": "",
            "protectionStartDate": "",
            "protectionFinishDate": "",
            "animalWithoutCustomer": { id: "", name: "" }
        });
        setEditVaccinationId(null);
        setUpdate(true);
    };

    const handleSearchVaccinationId = async (e) => {
        const value = e.target.value;
        setSearchVaccinationId(value);
        if (value === '') {
            const response = await axios.get(`${BASE_URL}/api/v1/vaccinations`);
            setVaccinations(response.data.content);
        } else {
            const response = await axios.get(`${BASE_URL}/api/v1/vaccinations/${value}`);
            setVaccinations([response.data]);
        }
    };

    const handleSearchVaccinationAnimal = async (e) => {
        const value = e.target.value;
        setSearchVaccinationAnimal(value);
        if (value === '') {
            const response = await axios.get(`${BASE_URL}/api/v1/vaccinations`);
            setVaccinations(response.data.content);
        } else {
            const response = await axios.get(`${BASE_URL}/api/v1/vaccinations/searchByAnimal?id=${value}`);
            setVaccinations(response.data.content);
        }
    };

    const handleSearchVaccinationStartDate = async (e) => {
        const value = e.target.value;
        setSearchVaccinationStartDate(value);
        if (value !== '' && searchVaccinationEndDate !== '') {
            const response = await axios.get(`${BASE_URL}/api/v1/vaccinations/searchByVaccinationRange`, {
                params: {
                    startDate: value,
                    endDate: searchVaccinationEndDate
                }
            });
            setVaccinations(response.data.content);
        }
    };

    const handleSearchVaccinationEndDate = async (e) => {
        const value = e.target.value;
        setSearchVaccinationEndDate(value);
        if (value !== '' && searchVaccinationStartDate !== '') {
            const response = await axios.get(`${BASE_URL}/api/v1/vaccinations/searchByVaccinationRange`, {
                params: {
                    startDate: searchVaccinationStartDate,
                    endDate: value
                }
            });
            setVaccinations(response.data.content);
        }
    };

    return (
        <div>
            <div>
                <h3>Aşı Ekle</h3>
                <input type="text"
                    placeholder="Aşı Adı"
                    name="name"
                    value={newVaccination.name}
                    onChange={newVaccinationInputChange}
                />
                <input type="text"
                    placeholder="Aşı Kodu"
                    name="code"
                    value={newVaccination.code}
                    onChange={newVaccinationInputChange}
                />
                <input type="date"
                    placeholder="Aşı Başlangıç"
                    name="protectionStartDate"
                    value={newVaccination.protectionStartDate}
                    onChange={newVaccinationInputChange}
                />
                <input type="date"
                    placeholder="Aşı Bitiş"
                    name="protectionFinishDate"
                    value={newVaccination.protectionFinishDate}
                    onChange={newVaccinationInputChange}
                />
                <select
                    id='animalSelect'
                    value={newVaccination.animalWithoutCustomer.id}
                    onChange={animalNameSelectChange}
                    name='animalWithoutCustomer'>
                    <option value={""} selected disabled hidden>Hayvan Seçiniz</option>
                    {animals?.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
                <button onClick={addNewVaccination}>Ekle</button>
            </div>

            <div>
                <h3>Aşı Takip</h3>
                <div className='listHeader'>
                    <input type="text" placeholder='Aşı Adı'
                        value={searchVaccinationId}
                        onChange={handleSearchVaccinationId} />
                    <input type="text" placeholder='Aşı Kodu' />
                    <input type="text" placeholder='Başlangıç Tarihi YYYY-AA-GG'
                        value={searchVaccinationStartDate}
                        onChange={handleSearchVaccinationStartDate} />
                    <input type="text" placeholder='Bitiş Tarihi YYYY-AA-GG'
                        value={searchVaccinationEndDate}
                        onChange={handleSearchVaccinationEndDate} />
                    <input type="text" placeholder='Hayvan Adı'
                        value={searchVaccinationAnimal}
                        onChange={handleSearchVaccinationAnimal} />
                    <input type="text" placeholder='Düzenle' />
                </div>
                {vaccinations?.map((item, index) => (
                    <div key={index}>
                        {editVaccinationId === item.id ? (
                            <div>
                                <input type="text"
                                    placeholder="Aşı Adı"
                                    name="name"
                                    value={editVaccination.name}
                                    onChange={editVaccinationInputChange}
                                />
                                <input type="text"
                                    placeholder="Aşı Kodu"
                                    name="code"
                                    value={editVaccination.code}
                                    onChange={editVaccinationInputChange}
                                />
                                <input type="date"
                                    placeholder="Aşı Başlangıç"
                                    name="protectionStartDate"
                                    value={editVaccination.protectionStartDate}
                                    onChange={editVaccinationInputChange}
                                />
                                <input type="date"
                                    placeholder="Aşı Bitiş"
                                    name="protectionFinishDate"
                                    value={editVaccination.protectionFinishDate}
                                    onChange={editVaccinationInputChange}
                                />
                                <select
                                    id='animalSelect'
                                    value={editVaccination.animalWithoutCustomer.id}
                                    onChange={editAnimalNameSelectChange}
                                    name='animalWithoutCustomer'>
                                    <option value={""} selected disabled hidden>Hayvan Seçiniz</option>
                                    {animals?.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                                <MdDeleteForever onClick={deleteVaccination} id={item.id} />
                                <MdFileDownloadDone onClick={editVaccinationDone} id={item.id} />
                            </div>
                        ) : (
                            <>
                                <span>Aşı adı: {item.name}</span>
                                <span>Aşı kodu: {item.code}</span>
                                <span>Aşı koruma başlangıcı: {item.protectionStartDate}</span>
                                <span>Aşı bitiş: {item.protectionFinishDate}</span>
                                <span>Hayvan Adı: {item.animal.name}</span><span>
                                    <MdDeleteForever onClick={deleteVaccination} id={item.id} />
                                    <BiSolidEditAlt onClick={handleEditVaccination} id={item.id} /></span>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Vaccinations;