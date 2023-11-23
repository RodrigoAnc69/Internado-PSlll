import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import React, {useState, useEffect} from "react";
import { ReactBingmaps } from 'react-bingmaps';
import PocketBase from 'pocketbase';



const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [hospitals, setHospitals] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);

  const fetchHospitals = async () => {
    try {
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');
      const resultList = await pb.collection('hospitals').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"',
        expand: 'doctor_assigned, students_assigned'
      });
     
      setHospitals(resultList.items);
      console.log(resultList.items);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []); // Empty dependency array to ensure the effect runs only once

  const handlePinClick = (pin) => {
    setSelectedPin(pin);
  };

  const handleInfoboxClick = () => {
    // Lógica para manejar clic en el infobox
    console.log('Infobox clicado');
  };

  const handlePushpinClick = () => {
    // Lógica para manejar clic en el pushpin
    console.log('Pushpin clicado');
  };

  const infoboxesWithPushPins = [];
  
  hospitals.forEach((hospital, index) => {
    infoboxesWithPushPins.push({
      location: [hospital.latitude, hospital.longitude, index], // Añade el índice como identificador único
      addHandler: "mouseover",
      option: { color: 'red' },
      infoboxOption: {
        title: hospital.name,
        description: (hospital.expand.doctor_assigned ? 'Doctor Asignado: ' + hospital.expand.doctor_assigned.firstName + ' ' + hospital.expand.doctor_assigned.lastName  : "Sin Asignar") + 
                     (hospital.expand.students_assigned ? '\nEstudiantes Asignados: ' + hospital.expand.students_assigned.map((s) => `${s.firstName} ${s.lastName}`).join(", ") : "Sin Asignar"),
      },
      pushPinOption: {
        title: hospital.name,
        description: 'sacar de la BDD',
        // icon: 'URL_DEL_ICONO', // Reemplaza con la ruta correcta al ícono
      },
      infoboxAddHandler: { type: "click", callback: handleInfoboxClick },
      pushPinAddHandler: { type: "click", callback: handlePushpinClick },
    });
  });


  return (
    
    <Box m="20px">
     
      <Header title="Mapa General" subtitle="Vista Satelital de los Hospitales" />

      <Box

        height="75vh"
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
      >
        <ReactBingmaps
          bingmapKey="AkwaUAO1DJ-trQEE3vKtuYE8jH0Q5dRFwTepsp8mFwlGqPK22xDxyRcd-14YYLNK"
          center={[-17.3895, -66.1568]}
          infoboxesWithPushPins={infoboxesWithPushPins}
        />
      </Box>

      
    </Box>
  );
};



export default Geography;


