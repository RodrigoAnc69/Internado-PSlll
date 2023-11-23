import { Box} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid"
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import PocketBase from 'pocketbase';
import Button from '@mui/material/Button';
import { GridCsvExportOptions } from '@mui/x-data-grid';
import { ReactBingmaps } from 'react-bingmaps';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
} from "@mui/material";


const Contacts = (props) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstName: "",
    lastName: "",
    isActive: "",
    speciality: "",
    task: [], // Campo para Tareas
    hospital: "", // Campo para Hospital
    students_assigned: [], // Campo para Estudiantes Asignados
  });

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');


  // Función asincrónica para obtener registros
  const fetchRecords = async () => {
    try {
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');

      // fetch a paginated records list
      const doclist = await pb.collection('doctors').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00" && isActive = true',
        expand: "user_assigned, students_assigned, task, hospital" 
      });

       // fetch a paginated records list
       const stulist = await pb.collection('students').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00" && isActive = true',
        expand: "user_assigned, task, hospital, doctor_assigned" 
      });


      const hospslist = await pb.collection('hospitals').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"'
      });

      const taskslist = await pb.collection('tasks').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"'
      });

      
      const flattenedRecords = doclist.items.map((item) => ({
        id: item.id,
        email: item.expand.user_assigned.email,
        firstName: item.firstName,
        lastName: item.lastName,
        speciality: item.speciality,
        isActive: item.isActive,
        students_assigned: item.expand.students_assigned ? item.expand.students_assigned.map((s) => `${s.firstName} ${s.lastName}`).join(", ") : "Sin Asignar",
        // `${item.expand.students_assigned.map((s) => ({firstName: s.firstName, lastName: s.lastName})))}`,
        task: item.expand.task ? item.expand.task.map((s) => `${s.title}`).join(", ") : "Sin tareas",
        hospital: item.expand.hospital.name,
      }));
  
      setRecords(flattenedRecords);
      setStudents(stulist.items);
      setHospitals(hospslist.items);
      setTasks(taskslist.items);

      console.log(flattenedRecords)

      console.log('selectedDoctor:', selectedDoctor);
      console.log('editedData:', editedData);
      
      // Log para verificar los datos recuperados
      // console.log('Datos recuperados:', doclist);


      // setRecords(doclist.items);
      setLoading(false);

      // let data = doclist.items
      // data.forEach((el)=>{
      //   console.log('user:', el.expand.user_assigned)
      //   console.log('student:',el.expand.students_assigned)
      //   //console.log('task:', el.expand.task)
       
      // });

      
      
    } catch (error) {
      console.error('Error fetching records:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Llamada a la función para obtener registros al montar el componente
    fetchRecords();
  }, []); // El segundo argumento [] asegura que se llama solo al montar el componente

  
  const handleDeleteButtonClick = async (id) => {
    const isConfirmed = window.confirm('¿Estás seguro de que deseas marcar como inactivo este registro?');
    if (isConfirmed) {
      try {
        const pb = new PocketBase('https://intervalle-instance.pockethost.io');
    
        // Fetch the doctor record
        const doctorRecord = await pb.collection('doctors').getOne(id, {
          expand: 'user_assigned',
        });
    
        // Update the isActive state for the doctor
        const updatedDoctorData = { ...doctorRecord.data, isActive: false };
        await pb.collection('doctors').update(id, updatedDoctorData);
        console.log(updatedDoctorData);

          
        // Update the isActive state for the associated user_assigned
        const userId = doctorRecord.expand.user_assigned.id; // Assuming you have a direct reference to the user_assigned
        const userRecord = await pb.collection('users').getOne(userId);
        console.log(userRecord);
        const updatedUserData = { ...userRecord.data, isActive: false };
        await pb.collection('users').update(userId, updatedUserData);
    
        console.log(`El Doctor ${doctorRecord.firstName} ${doctorRecord.lastName} y su user asociado marcado como inactivo.`);
        alert(`El Doctor ${doctorRecord.firstName} ${doctorRecord.lastName} y su user asociado marcado como inactivo.`);

      } catch (error) {
        console.error('Error al actualizar records:', error);
        alert('Hubo un error al actualizar los registros.');
      }
    }
  };

  const handleEditButtonClick = (id) => {
    const doctorToEdit = records.find((doctor) => doctor.id === id);

    setEditedData({
      firstName: doctorToEdit.firstName,
      lastName: doctorToEdit.lastName,
      isActive: doctorToEdit.isActive,
      speciality: doctorToEdit.speciality,
      task: [], // Asumiendo que `task` es un array de objetos con una propiedad `id`
      hospital: doctorToEdit.hospital.id, // Asumiendo que `hospital` es un objeto con una propiedad `id`
      students_assigned: [], // Asumiendo que `students_assigned` es un array de objetos con una propiedad `id`
    });

    setSelectedDoctor(doctorToEdit);
    setIsEditing(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');
      const doctorId = String(selectedDoctor.id);

      // Realiza las validaciones o manipulaciones adicionales según sea necesario
      await pb.collection('doctors').update(doctorId, editedData);
      console.log(editedData);
      setIsEditing(false);

      console.log(`El Doctor ${editedData.firstName} ${editedData.lastName} fue actualizado correctamente.`);
      alert(`El Doctor ${editedData.firstName} ${editedData.lastName} fue actualizado correctamente.`);

      window.location.reload(); // Recarga la página después de guardar los cambios
    } catch (error) {
      console.error('Error al actualizar el doctor.', error);
      alert('Hubo un error al actualizar el doctor.');
    }
  };
  
  
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    // {
    //   field: "expand.user_assigned",
    //   headerName: "Username",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "firstName",
      headerName: "Nombres",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Apellidos",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    // {
    //   field: "contact",
    //   headerName: "Número de Contacto",
    //   flex: 1,
    // },
    {
      field: "speciality",
      headerName: "Especialidad",
      flex: 1,
    },
    // {
    //   field: "birthdate",
    //   headerName: "Fecha de Nacimiento",
    //   flex: 1,
    // },
    {
      field: "isActive",
      headerName: "Esta Activo?",
      flex: 1,
    },
    {
      field: "students_assigned",
      headerName: "Estudiantes a su Cargo",
      flex: 1,
    },
    {
      field: "task",
      headerName: "Tarea",
      flex: 1,
    },
    {
      field: "hospital",
      headerName: "Hospital",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEditButtonClick(params.row.id)}
          >
            Editar
          </Button>
  
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteButtonClick(params.row.id)}
          >
            Borrar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="DOCTORES" 
        subtitle="Listado General de los Doctores" 
      />
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '40px',
            color: "secondary"
          }}
        >
          <CircularProgress color="primary" size={80} thickness={4} />
          <Box mt={2}>
            <Typography variant="h6" color="textSecondary">
              Cargando datos...
            </Typography>
          </Box>
        </Box>
      ) : (
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        
        <DataGrid
          checkboxSelection rows={records}
          columns={columns}
          components={{ Toolbar: GridToolbar }}     
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          csvOptions={{
            fileName: 'Listado_Doctores(Intervalle)',
            delimiter: ';',
            utf8WithBom: true,
          }}
        />
        {isEditing && (
            <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
            <form onSubmit={handleSaveEdit}>
              <DialogTitle>
                Editar Doctor: {selectedDoctor.firstName} {selectedDoctor.lastName}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Actualice los datos requeridos del doctor.
                </DialogContentText>

                {/* Campos del formulario */}
                <TextField
                  autoFocus
                  margin="dense"
                  id="edit-firstName"
                  label="Nombre"
                  type="text"
                  variant="outlined"
                  fullWidth
                  required
                  style={{ marginBottom: "16px" }}
                  value={editedData.firstName}
                  onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                />

                <TextField
                  autoFocus
                  margin="dense"
                  id="edit-lastName"
                  label="Apellido"
                  type="text"
                  variant="outlined"
                  fullWidth
                  required
                  style={{ marginBottom: "16px" }}
                  value={editedData.lastName}
                  onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                />

                <TextField
                  autoFocus
                  margin="dense"
                  id="edit-speciality"
                  label="Especialidad"
                  type="text"
                  variant="outlined"
                  fullWidth
                  required
                  style={{ marginBottom: "16px" }}
                  value={editedData.speciality}
                  onChange={(e) => setEditedData({ ...editedData, speciality: e.target.value })}
                />

              

                <FormControl fullWidth style={{ marginBottom: "16px" }}>
                  <InputLabel id="edit-task-label">Tarea</InputLabel>
                  <Select
                    labelId="edit-task-label"
                    id="edit-task"
                    value={editedData.task}
                    onChange={(e) => setEditedData({ ...editedData, task: e.target.value })}
                    label="Tarea"
                    multiple
                  >
                    {tasks.map((task) => (
                      <MenuItem key={task.id} value={task.id}>
                        {`${task.title}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth style={{ marginBottom: "16px" }}>
                  <InputLabel id="edit-hospital-label">Hospital</InputLabel>
                  <Select
                    labelId="edit-hospital-label"
                    id="edit-hospital"
                    value={editedData.hospital}
                    onChange={(e) => setEditedData({ ...editedData, hospital: e.target.value })}
                    label="Hospital"
                  >
                    {hospitals.map((hospital) => (
                      <MenuItem key={hospital.id} value={hospital.id}>
                        {`${hospital.name}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth style={{ marginBottom: "16px" }}>
                  <InputLabel id="edit-students-label">Estudiantes Asignados</InputLabel>
                  <Select
                    labelId="edit-students-label"
                    id="edit-students"
                    value={editedData.students_assigned}
                    onChange={(e) => setEditedData({ ...editedData, students_assigned: e.target.value })}
                    label="Estudiantes Asignados"
                    multiple
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {`${student.firstName} ${student.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsEditing(false)} variant="contained">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="success">
                  Guardar cambios
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          )}
      </Box>
      )}
    </Box>
  );
};

export default Contacts;
