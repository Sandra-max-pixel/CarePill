# 💊 CarePill

An IoT-Based Smart Medicine Compliance and Emergency Alert System designed to improve medication adherence and provide emergency assistance for elderly individuals and patients requiring regular medication.

## 📖 Overview

CarePill helps users follow their prescribed medication schedule by providing timely reminders, tracking medicine intake, and notifying caregivers in emergency situations. The system combines IoT hardware with a web-based dashboard for real-time monitoring.

## ✨ Features

- 💊 Scheduled medicine reminders (Morning, Afternoon, Night)
- ⏰ Real-time medication tracking
- 🚨 Emergency alert system
- 📧 Email notifications to caregivers
- 📊 Web dashboard for monitoring medicine status
- 🌐 Cloud database integration using MongoDB Atlas
- 🔄 Automatic reminder scheduling using Node Cron

## 🛠️ Technologies Used

### Hardware
- ESP32 DevKit V1
- RTC DS3231
- 16x2 I2C LCD Display
- LEDs
- Push Buttons
- Buzzer

### Software
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MongoDB Atlas
- Node Cron
- Nodemailer

## 📂 Project Structure

```
CarePill/
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── routes/
│
└── README.md
```

## 🚀 How It Works

1. The caregiver sets the medicine schedule.
2. The ESP32 monitors reminder timings using the RTC module.
3. Visual and audio alerts remind the patient to take medicine.
4. Medicine status is updated on the web dashboard.
5. If the emergency button is pressed, an alert email is sent to the caregiver.

## 📸 Future Improvements

- Mobile application support
- SMS and WhatsApp alerts
- Voice assistant integration
- AI-based medicine adherence prediction
- Multiple patient management

## 🎯 Applications

- Elderly care
- Home healthcare
- Assisted living facilities
- Chronic disease management

## 👥 Team

- Niranjana Dileep
- Sandra K Venugopal
- Sreya
- Anunayana CP
- Ranjith MK
- Anandakrishna
- Gopika

## 📄 License

This project is developed for educational purposes as part of completion of Internship at Inker Robotics.
