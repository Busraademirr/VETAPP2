import React, { useState } from 'react';

function Calendar({setNewSelectedDate}) {

    const [date, setDate] = useState(new Date());
  // const [newSelectedDate, setNewSelectedDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const nextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan',
    'Mayıs', 'Haziran', 'Temmuz', 'Ağustos',
    'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const days = [
    'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe',
    'Cuma', 'Cumartesi', 'Pazar'
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    let week = new Array(7).fill(null);
    
    // İlk haftayı doldurmak için boş günler ekle
    for (let i = 0; i < (date.getDay() === 0 ? 6 : date.getDay() - 1); i++) {
      week[i] = null;
    }

    while (date.getMonth() === month) {
      const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
      week[dayOfWeek] = new Date(date);
      if (dayOfWeek === 6) {
        days.push(week);
        week = new Array(7).fill(null);
      }
      date.setDate(date.getDate() + 1);
    }
    if (week.some(day => day !== null)) {
      days.push(week);
    }
    return days;
  };

  const daysInMonth = getDaysInMonth(date.getMonth(), date.getFullYear());

  const handleDateClick = (day) => {
    const greenDate = `${day.getFullYear()}-${('0' + (day.getMonth() + 1)).slice(-2)}-${('0' + day.getDate()).slice(-2)}`;
    setNewSelectedDate(greenDate);
    setSelectedDate(day);
  }


  return (
    <div>
        <div>
            <p>Çalışma günü eklemek için takvimden bir gün seçiniz</p>
      <div>
        <h4>{month} {year}</h4>
        <table>
          <thead>
            <tr>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysInMonth.map((week, index) => (
              <tr key={index}>
                {week.map((day, idx) => (
                  <td key={idx} onClick={() => day && handleDateClick(day)} style={{
                    backgroundColor: selectedDate && selectedDate.getTime() === (day && day.getTime()) ? 'green' : 'white'
                  }}>
                    {day ? day.getDate() : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={prevMonth}>Önceki Ay</button>
        <button onClick={nextMonth}>Sonraki Ay</button>
      </div>
    </div>
    </div>
  )
}

export default Calendar