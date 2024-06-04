import React from 'react'
import Doctors from '../Doctors/Doctors';

function Appointments() {

    const BASE_URL = "http://localhost:8080"

    const [update, setUpdate]=useState(false);
    const [appointments, setAppointments]= useState([]);
    const [newAppointment, setNewAppointment] = useState({
        "appointmentDate": "",
        "doctor": {},
        "animal": {}
    });
    const [editAppointmentId, setEditAppointmentId]=useState(null);
    const [editAppointment, setEditAppointment] = useState({
        "appointmentDate": "",
        "doctor": {},
        "animal": {}
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
    }, [animals]);
    useEffect(()=>{
        const getData = async()=>{
            const response = await axios.get(`${BASE_URL}/api/v1/doctors`);
            setADoctors(response.data.content);
        };
        getData ();  
    }, [doctors]);

    const newAppointmentInputChange=(e)=>{
        const {name, value} = e.target;
        setNewAppointment(prev=>({
            ...prev,
            [name] : value
        }))
        console.log("new: ", newAppointment);
    }
    const newAppointmentSelectChange = (e) => {
        const { id } = e.target;
        setNewAppointment(prev => ({
            ...prev,
            doctor: doctors.find(doc => doc.id == id),
            animal: animals.find(animal => animal.id == id)
        }));
        console.log("new: ", newAppointment);
    }
    const addNewAppointment =async()=>{
        await axios.post(`${BASE_URL}/api/v1/appointments`, newAppointment)
        setUpdate(true);
        setNewAppointment ({
            "appointmentDate": "",
            "doctor": {},
            "animal": {}})
    }
    const deleteAppointment = async(e)=>{
        const {id}=e.target;
        await axios.delete(`${BASE_URL}/api/v1/appointments/${id}`);
        setUpdate(true);
    };



  return (
    <div>
        <div>
        <h3>Yeni Randevu Ekle</h3>
        <input type="date" 
            placeholder="randevu tarihi"
            name="appointmentDate"
            value={newAppointment.appointmentDate}
            onChange={newAppointmentInputChange}
        />
        <select
        id='doctorSelect'
        value={newAppointment.doctor.id}
        onChange={newAppointmentSelectChange}
        name='doctor'>
            <option value={""} selected disabled hidden>Doktor Seçiniz</option>
            {doctors?.map((item)=>(
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </select>
        <select
        id='animalSelect'
        value={newAppointment.animal.id}
        onChange={newAppointmentSelectChange}
        name='animal'>
            <option value={""} selected disabled hidden>Hayvan Seçiniz</option>
            {animals?.map((item)=>(
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </select>
        <button onClick={addNewAppointment}>Ekle</button>
        </div>
        <div>
        <h3>Randevular</h3>
        {appointments.map((item)=>(
            <div key={item.id}>
            <span>{item.appointmentDate}</span>
            <span>{item.doctor}</span>
            <span>{item.animal}</span>
            <MdDeleteForever onClick={deleteAppointment} id={item.id} />
            <BiSolidEditAlt onClick={handleEditAppointment} id={item.id}/>
            </div>
        ))}
        </div>
    </div>
  )
}

export default Appointments