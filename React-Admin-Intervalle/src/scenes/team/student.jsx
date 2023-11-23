import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PocketBase from 'pocketbase';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
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




const Team = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');


  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstName: "",
    lastName: "",
    isActive: "",
    matricula:"",
    carreer: "",
    task: [''],  // Campo para Tarea
    hospital: "",  // Campo para Hospital
    doctor_assigned: "",  // Campo para Doctor Asignado
    
  });


   const fetchRecords = async () => {
    try {
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');

      // fetch a paginated records list
      const stulist = await pb.collection('students').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00" && isActive = true',
        expand: "user_assigned, task, hospital, doctor_assigned" 
      });

      const doclist = await pb.collection('doctors').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"'
      });

      const hospslist = await pb.collection('hospitals').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"'
      });

      const taskslist = await pb.collection('tasks').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"'
      });

      
      kov
      setDoctors(doclist.items);
      setHospitals(hospslist.items);
      setTasks(taskslist.items);


      console.log(flattenedRecords)
      console.log('selectedStudent:', selectedStudent);
      console.log('editedData:', editedData);
    
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

  

  const handleEditButtonClick = (id) => {
    const studentToEdit = records.find((student) => student.id === id);
    
    console.log(studentToEdit)
    console.log('selectedStudent:', selectedStudent);
    console.log('editedData:', editedData);
    setEditedData({
      firstName: studentToEdit.firstName,
      lastName: studentToEdit.lastName,
      isActive: studentToEdit.isActive,
      hospital: studentToEdit.hospital,
      doctor_assigned: studentToEdit.doctor_assigned,
      matricula: studentToEdit.matricula,
      carreer: studentToEdit.carreer,
      task: []
    });

    // Convertir ID a cadena
    setSelectedStudent(studentToEdit);
    setIsEditing(true);
  };
  
  const handleDeleteButtonClick = async (id) => {
    const isConfirmed = window.confirm('¿Estás seguro de que deseas marcar como inactivo este registro?');
    if (isConfirmed) {
      try {
        const pb = new PocketBase('https://intervalle-instance.pockethost.io');
    
        // Fetch the student record
        const studentRecord = await pb.collection('students').getOne(id, {
          expand: 'user_assigned',
        });
    
        // Update the isActive state for the student
        const updatedStudentData = { ...studentRecord.data, isActive: false };
        await pb.collection('students').update(id, updatedStudentData);
        console.log(updatedStudentData);

          
        // Update the isActive state for the associated user_assigned
        const userId = studentRecord.expand.user_assigned.id; // Assuming you have a direct reference to the user_assigned
        const userRecord = await pb.collection('users').getOne(userId);
        console.log(userRecord);
        const updatedUserData = { ...userRecord.data, isActive: false };
        await pb.collection('users').update(userId, updatedUserData);
    
        console.log(`El Estudiante ${studentRecord.firstName} ${studentRecord.lastName} y su user asociado marcado como inactivo.`);
        alert(`El Estudiante ${studentRecord.firstName} ${studentRecord.lastName} y su user asociado marcado como inactivo.`);

      } catch (error) {
        console.error('Error al actualizar records:', error.data);
        alert('Hubo un error al actualizar los registros.');
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe automáticamente
    console.log('selectedStudent:', selectedStudent);
    console.log('editedData:', editedData);
    try {
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');
      
      // Convertir ID a cadena para asegurarse de que sea una cadena al actualizar en PocketBase
      const studentId = String(selectedStudent.id);
      
      // Aquí puedes realizar alguna validación o manipulación adicional antes de enviar los datos.
      // Por ejemplo, podrías validar que los campos requeridos estén presentes.
  
      await pb.collection('students').update(studentId, editedData);
      console.log(studentId, editedData);
  
      setIsEditing(false); // Cerrar el diálogo después de guardar los cambios
      console.log(`El Estudiante ${editedData.firstName} ${editedData.lastName} fue actualizado correctamente.`);
      alert(`El Estudiante ${editedData.firstName} ${editedData.lastName} fue actualizado correctamente.`);
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el estudiante.', error);
      alert('Hubo un error al actualizar el estudiante.');
    }
  };
  

  

  const columns = [
    { field: "id", headerName: "ID" },
    // {
    //   field: "username",
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
    {
      field: "matricula",
      headerName: "Matricula",
      flex: 1,
    },
    {
      field: "carreer",
      headerName: "Carrera",
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
      field: "doctor_assigned",
      headerName: "Doctor Asignado",
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
      <Header title="ESTUDIANTES" subtitle="Listado General de los Estudiantes" />
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
        <DataGrid checkboxSelection rows={records} columns={columns} components={{ Toolbar: GridToolbar }} localeText={esES.components.MuiDataGrid.defaultProps.localeText}/>
            {isEditing && (
              <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
              <form onSubmit={handleSaveEdit}>
                <DialogTitle>Editar Estudiante: {selectedStudent.firstName} {selectedStudent.lastName}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Actualice los datos requeridos del estudiante.
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
                    id="edit-matricula"
                    label="Matricula"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    style={{ marginBottom: "16px" }}
                    value={editedData.matricula}
                    onChange={(e) => setEditedData({ ...editedData, matricula: e.target.value })}
                  />
          
                  <TextField
                    autoFocus
                    margin="dense"
                    id="edit-carreer"
                    label="Carrera"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    style={{ marginBottom: "16px" }}
                    value={editedData.carreer}
                    onChange={(e) => setEditedData({ ...editedData, carreer: e.target.value })}
                  />
          
                    <FormControl fullWidth style={{ marginBottom: "16px" }}>
                      <InputLabel id="edit-task-label">Tarea</InputLabel>
                      <Select
                        labelId="edit-task-label"
                        id="edit-task"
                        value={isEditing ? editedData.task : []}
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
                      <InputLabel id="edit-doctor-label">Doctor Asignado</InputLabel>
                      <Select
                        labelId="edit-doctor-label"
                        id="edit-doctor"
                        value={editedData.doctor_assigned}
                        onChange={(e) => setEditedData({ ...editedData, doctor_assigned: e.target.value })}
                        label="Doctor Asignado"
                      >
                        {doctors.map((doctor) => (
                          <MenuItem key={doctor.id} value={doctor.id}>
                            {`${doctor.firstName} ${doctor.lastName}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsEditing(false)} variant="contained">Cancelar</Button>
                  <Button type="submit" variant="contained" color="success">Guardar cambios</Button>
                </DialogActions>
              </form>
            </Dialog>
            )}
      </Box>
      
      )}
    </Box>
  );
};

export default Team;
