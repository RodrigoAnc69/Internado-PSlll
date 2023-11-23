import { Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid"
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import PocketBase from 'pocketbase';
import Button from '@mui/material/Button';
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
import { GridCsvExportOptions } from '@mui/x-data-grid';

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);

  const [selectedHospital, setSelectedHospital] = useState('');


  const [clickedLocation, setClickedLocation] = useState({
    latitude: 0,
    longitude: 0,
  });


  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');



  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    address: "",
    City: "",
    phoneNumber: "",
    doctor_assigned: "", // Campo para Doctor
    students_assigned: [], // Campo para Estudiantes Asignados
    latitude: 0,
    longitude: 0
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newHospitalData, setNewHospitalData] = useState({
    name: "",
    address: "",
    City: "",
    phoneNumber: "",
    doctor_assigned: "", // Campo para Doctor
    students_assigned: [], // Campo para Estudiantes Asignados
    latitude: 0,
    longitude: 0
  });

  // Manejador para abrir el diálogo de creación
  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  // Manejador para cerrar el diálogo de creación
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };


  // Manejador para abrir el diálogo del mapa
  const handleOpenMapDialog = () => {
    setMapDialogOpen(true);
    setClickedLocation({
      latitude: editedData.latitude,
      longitude: editedData.longitude,
    });
  };

  // Manejador para cerrar el diálogo del mapa
  const handleCloseMapDialog = () => {
    setMapDialogOpen(false);
  };


  // Función asincrónica para obtener registros
  const fetchRecords = async () => {
    try {
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');

      // fetch a paginated records list
      const hospitallist = await pb.collection('hospitals').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"',
        expand: "doctor_assigned, students_assigned"
      });

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

      const flattenedRecords = hospitallist.items.map((item) => ({
        id: item.id,
        name: item.name,
        address: item.address,
        City: item.City,
        doctor_assigned: item.expand.doctor_assigned ? item.expand.doctor_assigned.firstName + ' ' + item.expand.doctor_assigned.lastName : "Sin Asignar",
        students_assigned: item.expand.students_assigned ? item.expand.students_assigned.map((s) => `${s.firstName} ${s.lastName}`).join(", ") : "Sin Asignar",
        phoneNumber: item.phoneNumber,
        coordinates: item.latitude + ' , ' + item.longitude,
      }));

      setRecords(flattenedRecords);
      setStudents(stulist.items);
      setDoctors(doclist.items);
      console.log(flattenedRecords)

      // Log para verificar los datos recuperados
      // console.log('Datos recuperados:', hospitallist);


      // setRecords(hospitallist.items);
      setLoading(false);

      // let data = hospitallist.items
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

  const handleSaveCreate = async (e) => {
    e.preventDefault();

    try {
      // Lógica para guardar el nuevo hospital (adapta según tu implementación de PocketBase)
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');
      const createdHospital = await pb.collection('hospitals').create({
        name: newHospitalData.name,
        address: newHospitalData.address,
        City: newHospitalData.City,
        phoneNumber: newHospitalData.phoneNumber,
        doctor_assigned: newHospitalData.doctor_assigned,
        students_assigned: newHospitalData.students_assigned,
        latitude: newHospitalData.latitude,  // Utilizar las coordenadas del formulario
        longitude: newHospitalData.longitude, // Utilizar las coordenadas del formulario
      });

      console.log(`Hospital creado:`, createdHospital);
      alert(`Hospital creado correctamente.`);

      setIsCreateDialogOpen(false);
      fetchRecords();
    } catch (error) {
      console.error('Error al crear el hospital.', error);
      alert('Hubo un error al crear el hospital.');
    }
  };
  const handleOpenMapDialogCreate = () => {
    setMapDialogOpen(true);
    // Configurar las coordenadas iniciales al abrir el mapa en el formulario de creación
    setClickedLocation({
      latitude: newHospitalData.latitude,
      longitude: newHospitalData.longitude,
    });
  };

  // Manejador para cerrar el diálogo del mapa en el formulario de creación
  const handleCloseMapDialogCreate = () => {
    setMapDialogOpen(false);
  };

  // Manejador para obtener la ubicación al hacer clic en el mapa en el formulario de creación
  const handleGetLocationCreate = (location) => {
    setClickedLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    // Actualizar las coordenadas en el formulario de creación al hacer clic en el mapa
    setNewHospitalData({
      ...newHospitalData,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    console.log("Coordenadas al hacer clic:", location);
  };






  
  const handleEditButtonClick = (id) => {
    const hospitalToEdit = records.find((hospital) => hospital.id === id);
    console.log('hosp to edit:', hospitalToEdit)
    setEditedData({
      name: hospitalToEdit.name,
      address: hospitalToEdit.address,
      City: hospitalToEdit.City,
      phoneNumber: hospitalToEdit.phoneNumber,
      doctor_assigned: hospitalToEdit.doctor_assigned.id,
      students_assigned: [],
      latitude: Number(hospitalToEdit.coordinates.split(',')[0]), // Tomar la latitud del campo "coordinates"
      longitude: Number(hospitalToEdit.coordinates.split(',')[1]), // Tomar la longitud del campo "coordinates"
    });

    setSelectedHospital(hospitalToEdit);
    setIsEditing(true);
  };


  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      // Lógica para guardar los cambios (adapta según tu implementación de PocketBase)
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');
      const updatedHospital = await pb.collection('hospitals').update(selectedHospital.id, {
        name: editedData.name,
        address: editedData.address,
        City: editedData.City,
        phoneNumber: editedData.phoneNumber,
        doctor_assigned: editedData.doctor_assigned,
        students_assigned: editedData.students_assigned,
        latitude: clickedLocation.latitude,
        longitude: clickedLocation.longitude,
      });

      console.log(`Hospital actualizado:`, updatedHospital);
      alert(`Hospital actualizado correctamente.`);

      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el hospital.', error);
      alert('Hubo un error al actualizar el hospital.');
    }
  };

  const handleDeleteButtonClick = async (id) => {
    const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
    if (isConfirmed) {
      try {
        const pb = new PocketBase('https://intervalle-instance.pockethost.io');

        // Fetch the hospital record

        const hospRecord = await pb.collection('hospitals').getOne(id);
        console.log(hospRecord);

        // Delete the hospital record
        await pb.collection('hospitals').delete(id);


        console.log(`El Hospital ${hospRecord.name} fue eliminado correctamente.`);
        alert(`El Hospital ${hospRecord.name} fue eliminado correctamente.`);

      } catch (error) {
        console.error('Error al eliminar records:', error);
        alert('Hubo un error al eliminar los registros.');
      }
    }
  };

  // Manejador para obtener la ubicación al hacer clic en el mapa
  const handleGetLocation = (location) => {
    setClickedLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    console.log("Coordenadas al hacer clic:", location);
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
      field: "name",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "address",
      headerName: "Dirección",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phoneNumber",
      headerName: "Número de Contacto",
      flex: 1,
    },
    {
      field: "City",
      headerName: "Ciudad",
      flex: 1,
    },
    {
      field: "doctor_assigned",
      headerName: "Doctor Asignado",
      flex: 1,
    },
    {
      field: "students_assigned",
      headerName: "Estudiantes Asignados",
      flex: 1,
    },
    {
      field: "coordinates",
      headerName: "Coordenadas de Ubicación",
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
        title="HOSPITALES"
        subtitle="Listado General de los Hospitales"
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
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenCreateDialog}
              sx={{ marginBottom: "20px" }}
            >
              Agregar Hospital
            </Button>

          <DataGrid
            checkboxSelection rows={records}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            csvOptions={{
              fileName: 'Listado_Hospitales(Intervalle)',
              delimiter: ';',
              utf8WithBom: true,
            }}
          />
        </Box>
      )}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
        <DialogTitle>Editar Hospital</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edite la información del hospital a continuación:
          </DialogContentText>
          <form onSubmit={handleSaveEdit}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nombre"
              type="text"
              fullWidth
              required
              value={editedData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="address"
              label="Dirección"
              type="text"
              fullWidth
              required
              value={editedData.address}
              onChange={(e) =>
                setEditedData({ ...editedData, address: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="City"
              label="Ciudad"
              type="text"
              fullWidth
              required
              value={editedData.City}
              onChange={(e) =>
                setEditedData({ ...editedData, City: e.target.value })
              }
            />

            <TextField
              margin="dense"
              id="phoneNumber"
              label="Número de Contacto"
              type="text"
              fullWidth
              required
              value={editedData.phoneNumber}
              onChange={(e) =>
                setEditedData({ ...editedData, phoneNumber: e.target.value })
              }
            />

            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="edit-doctor_assigned-label">Doctor Asignado</InputLabel>
              <Select
                labelId="edit-doctor_assigned-label"
                id="edit-doctor_assigned"
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

            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="edit-students_assigned-label">Estudiantes Asignados</InputLabel>
              <Select
                labelId="edit-students_assigned-label"
                id="edit-students_assigned"
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

            <Button onClick={handleOpenMapDialog} variant="contained" color="success">
              Seleccionar Ubicación
            </Button>

            <Dialog fullScreen open={mapDialogOpen} onClose={handleCloseMapDialog}>
              <DialogTitle>Seleccionar Ubicación en el Mapa</DialogTitle>
              <DialogContent>
                <ReactBingmaps
                  bingmapKey="AkwaUAO1DJ-trQEE3vKtuYE8jH0Q5dRFwTepsp8mFwlGqPK22xDxyRcd-14YYLNK"
                  center={[editedData.latitude, editedData.longitude]}
                  getLocation={{ addHandler: "click", callback: handleGetLocation }}

                />
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleCloseMapDialog} color="primary">
                  Cerrar Mapa
                </Button>
              </DialogActions>
            </Dialog>

            <TextField
              margin="dense"
              id="latitude"
              label="Latitud"
              type="number"
              fullWidth
              required
              value={clickedLocation.latitude}
              onChange={(e) => setClickedLocation({ ...clickedLocation, latitude: Number(e.target.value) })}
              disabled
            />

            <TextField
              margin="dense"
              id="longitude"
              label="Longitud"
              type="number"
              fullWidth
              required
              value={clickedLocation.longitude}
              onChange={(e) => setClickedLocation({ ...clickedLocation, longitude: Number(e.target.value) })}
              disabled
            />
            <DialogActions>
              <Button variant="contained" onClick={() => setIsEditing(false)} color="primary">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="success">
                Guardar Cambios
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogTitle>Agregar Hospital</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Complete la información del nuevo hospital a continuación:
          </DialogContentText>
          <form onSubmit={handleSaveCreate}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nombre"
              type="text"
              fullWidth
              required
              value={newHospitalData.name}
              onChange={(e) =>
                setNewHospitalData({ ...newHospitalData, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="address"
              label="Dirección"
              type="text"
              fullWidth
              required
              value={newHospitalData.address}
              onChange={(e) =>
                setNewHospitalData({ ...newHospitalData, address: e.target.value })
              }
            />
            <TextField
              margin="dense"
              id="City"
              label="Ciudad"
              type="text"
              fullWidth
              required
              value={newHospitalData.City}
              onChange={(e) =>
                setNewHospitalData({ ...newHospitalData, City: e.target.value })
              }
            />

            <TextField
              margin="dense"
              id="phoneNumber"
              label="Número de Contacto"
              type="text"
              fullWidth
              required
              value={newHospitalData.phoneNumber}
              onChange={(e) =>
                setNewHospitalData({ ...newHospitalData, phoneNumber: e.target.value })
              }
            />

            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="create-doctor_assigned-label">Doctor Asignado</InputLabel>
              <Select
                labelId="create-doctor_assigned-label"
                id="create-doctor_assigned"
                value={newHospitalData.doctor_assigned}
                onChange={(e) => setNewHospitalData({ ...newHospitalData, doctor_assigned: e.target.value })}
                label="Doctor Asignado"
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {`${doctor.firstName} ${doctor.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="create-students_assigned-label">Estudiantes Asignados</InputLabel>
              <Select
                labelId="create-students_assigned-label"
                id="create-students_assigned"
                value={newHospitalData.students_assigned}
                onChange={(e) => setNewHospitalData({ ...newHospitalData, students_assigned: e.target.value })}
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

            <Button
              onClick={handleOpenMapDialogCreate}
              variant="contained"
              color="success"
            >
              Seleccionar Ubicación
            </Button>
            <Dialog fullScreen open={mapDialogOpen} onClose={handleCloseMapDialogCreate}>
              <DialogTitle>Seleccionar Ubicación en el Mapa</DialogTitle>
              <DialogContent>
                <ReactBingmaps
                  bingmapKey="AkwaUAO1DJ-trQEE3vKtuYE8jH0Q5dRFwTepsp8mFwlGqPK22xDxyRcd-14YYLNK"
                  center={[-17.3895, -66.1568]}
                  getLocation={{ addHandler: "click", callback: handleGetLocationCreate }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={handleCloseMapDialogCreate}
                  color="primary"
                >
                  Cerrar Mapa
                </Button>
              </DialogActions>
            </Dialog>
            <TextField
              margin="dense"
              id="latitude"
              label="Latitud"
              type="number"
              fullWidth
              required
              value={newHospitalData.latitude}
              onChange={(e) =>
                setNewHospitalData({
                  ...newHospitalData,
                  latitude: Number(e.target.value),
                })
              }
              disabled
            />
            <TextField
              margin="dense"
              id="longitude"
              label="Longitud"
              type="number"
              fullWidth
              required
              value={newHospitalData.longitude}
              onChange={(e) =>
                setNewHospitalData({
                  ...newHospitalData,
                  longitude: Number(e.target.value),
                })
              }
              disabled
            />
            <DialogActions>
              <Button
                variant="contained"
                onClick={handleCloseCreateDialog}
                color="primary"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="success">
                Guardar Hospital
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );

};

export default Invoices;
