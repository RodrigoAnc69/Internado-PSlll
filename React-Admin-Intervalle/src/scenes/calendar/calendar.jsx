import { useState, useEffect } from "react";
import * as React from 'react';
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import esLocale from '@fullcalendar/core/locales/es';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PocketBase from 'pocketbase';
import CircularProgress from '@mui/material/CircularProgress';

import {
  Box,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";

import Header from "../../components/Header";
import { tokens } from "../../theme";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  
  const [open, setOpen] = React.useState(false);

  const [students, setStudents] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const [currentEvents, setCurrentEvents] = useState([]);

  const fetchRecords = async () => {
    try {
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');

      const doclist = await pb.collection('doctors').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"'
      });

      const stulist = await pb.collection('students').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"'
      });

      const taskslist = await pb.collection('tasks').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"'
      });

      setDoctors(doclist.items);
      setStudents(stulist.items);
      setTasks(taskslist.items);
      setLoading(false);

      console.log('Datos recuperados:', doclist);
      console.log('Datos recuperados:', stulist);
      console.log('Datos recuperados:', taskslist);
    } catch (error) {
      console.error('Error fetching records:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDateClick = (selected) => {
    setOpen(true);
    const title = '';
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };




  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate that required fields are not empty
    if (!title || !description || !selectedStudent || !selectedDoctor) {
      alert("Por favor rellene todos los campos."); // Provide user feedback
      return;
    }
    const data = {
      title: title,
      description: description,
      completed: false,
      student: selectedStudent,
      doctor: selectedDoctor,
      extendedProps: {
        title: title,
        description: description,
        student: selectedStudent,
        doctor: selectedDoctor,
      },
    };

    const pb = new PocketBase('https://intervalle-instance.pockethost.io');

    try {
      const record = await pb.collection('tasks').create(data);

      alert("Registro exitoso");
      console.log(record);
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  // Nuevos estados para la edición de tareas
  const [editing, setEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Estados para campos de edición
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSelectedStudent, setEditSelectedStudent] = useState('');
  const [editSelectedDoctor, setEditSelectedDoctor] = useState('');

  // Función para manejar la apertura del diálogo de edición
  const openEditDialog = (event) => {
    console.log(event.event.extendedProps)
    const { title, description, student, doctor } = event.event.extendedProps;
    setEditTitle(title || ''); // Asegúrate de manejar casos en los que los valores puedan ser nulos
    setEditDescription(description || '');
    setEditSelectedStudent(student || '');
    setEditSelectedDoctor(doctor || '');

    setSelectedTask(event.event);
    setEditing(true);
    setOpen(true);
  };

  // Modificar la función handleEventClick para abrir el diálogo de edición
  const handleEventClick = (selected) => {
    openEditDialog(selected);
  };

  // Nueva función para manejar la edición de la tarea
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    // Validar que los campos requeridos no estén vacíos
    if (!editTitle || !editDescription || !editSelectedStudent || !editSelectedDoctor) {
      alert("Por favor rellene todos los campos."); // Proporcionar retroalimentación al usuario
      return;
    }

    const data = {
      title: editTitle,
      description: editDescription,
      completed: false,
      student: editSelectedStudent,
      doctor: editSelectedDoctor,
    };

    const pb = new PocketBase('https://intervalle-instance.pockethost.io');

    try {
      // Actualizar la tarea existente en lugar de crear una nueva
      await pb.collection('tasks').update(selectedTask.id, data);
      console.log(data)
      alert("Edición exitosa");
      console.log('Registro editado:', selectedTask.id);
      // Recargar la página
      window.location.reload();
    } catch (error) {
      console.error('Error al editar la tarea:', error);
    }

    // Restablecer los estados después de la edición
    setEditing(false);
    setSelectedTask(null);
    setOpen(false);
  };

  const handleDeleteTask = async () => {
    if (window.confirm("¿Seguro que quieres borrar esta tarea?")) {
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');
  
      try {
        // Borrar la tarea
        await pb.collection('tasks').delete(selectedTask.id);
  
        alert("Tarea eliminada exitosamente");
        console.log('Tarea eliminada:', selectedTask.id + selectedTask.items);
  
        // Cerrar el diálogo después de borrar la tarea
        setEditing(false);
        setSelectedTask(null);
        setOpen(false);

        // Recargar la página
        window.location.reload();
      } catch (error) {
        console.error('Error al borrar la tarea:', error);
      }
    }
  };


  return (
    <Box m="20px">
      <Header title="Agendador de Tareas" subtitle="Calendario Interactivo" />
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
        <>
          <Box display="flex" justifyContent="space-between">
            <Box
              flex="1 1 20%"
              backgroundColor={colors.primary[400]}
              p="15px"
              borderRadius="4px"
            >
              <Typography variant="h5">Tareas</Typography>
              <List>
                {currentEvents.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      margin: "10px 0",
                      borderRadius: "2px",
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={<Typography>
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box flex="1 1 100%" ml="15px">
              <FullCalendar
                locale={esLocale}
                height="75vh"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                select={handleDateClick}
                eventClick={handleEventClick}
                eventsSet={(events) => setCurrentEvents(events)}
                initialEvents={[
                  {
                    id: "12315",
                    title: "Aniversario de Cochabamba",
                    date: "2023-09-14",
                  },
                  {
                    id: "5123",
                    title: "Halloween",
                    date: "2023-10-31",
                  },
                  {
                    id: "5153",
                    title: "Todos Santos",
                    date: "2023-11-02",
                  },
                  ...tasks.map((task) => ({
                    id: task.id,
                    title: task.title,
                    date: task.created,
                    extendedProps: {
                      title: task.title,
                      description: task.description,
                      student: task.student,
                      doctor: task.doctor,
                    },
                  })),
                ]} />
            </Box>
          </Box>
          <React.Fragment>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setOpen(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <form onSubmit={handleFormSubmit}>
                <DialogTitle>Nueva Tarea</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Para agregar una nueva tarea, complete los datos requeridos.
                  </DialogContentText>

                  <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Título"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    style={{ marginBottom: "16px" }}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Descripción"
                    type="text"
                    variant="outlined"
                    fullWidth
                    required
                    style={{ marginBottom: "16px" }}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <FormControl fullWidth style={{ marginBottom: "16px" }}>
                    <InputLabel id="student-label">Seleccione un Estudiante</InputLabel>
                    <Select
                      labelId="student-label"
                      id="student"
                      value={selectedStudent}
                      onChange={handleStudentChange}
                      label="Estudiante"
                      required
                    >
                      {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {`${student.firstName} ${student.lastName}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="doctor-label">Seleccione un Doctor</InputLabel>
                    <Select
                      labelId="doctor-label"
                      id="doctor"
                      value={selectedDoctor}
                      onChange={handleDoctorChange}
                      label="Doctor"
                      required
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
                  <Button onClick={() => setOpen(false)} variant="contained">Cancelar</Button>
                  <Button onSubmit={handleFormSubmit} type="submit" variant="contained" color="success">Agregar</Button>
                </DialogActions>
              </form>
            </Dialog>
              <Dialog
                open={editing}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                  setEditing(false);
                  setOpen(false);
                }}
                aria-describedby="alert-dialog-slide-description"
              >
                <form onSubmit={handleEditFormSubmit}>
                  <DialogTitle>Editar Tarea</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Para editar la tarea, actualice los datos requeridos.
                    </DialogContentText>

                    <TextField
                      autoFocus
                      margin="dense"
                      id="edit-title"
                      label="Título"
                      type="text"
                      variant="outlined"
                      fullWidth
                      required
                      style={{ marginBottom: "16px" }}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />

                    <TextField
                      autoFocus
                      margin="dense"
                      id="edit-description"
                      label="Descripción"
                      type="text"
                      variant="outlined"
                      fullWidth
                      required
                      style={{ marginBottom: "16px" }}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />

                    <FormControl fullWidth style={{ marginBottom: "16px" }}>
                      <InputLabel id="edit-student-label">Seleccione un Estudiante</InputLabel>
                      <Select
                        labelId="edit-student-label"
                        id="edit-student"
                        value={editSelectedStudent}
                        onChange={(e) => setEditSelectedStudent(e.target.value)}
                        label="Estudiante"
                        required
                      >
                        {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {`${student.firstName} ${student.lastName}`}
                        </MenuItem>
                      ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel id="edit-doctor-label">Seleccione un Doctor</InputLabel>
                      <Select
                        labelId="edit-doctor-label"
                        id="edit-doctor"
                        value={editSelectedDoctor}
                        onChange={(e) => setEditSelectedDoctor(e.target.value)}
                        label="Doctor"
                        required
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
                    <Button variant="contained" color="error" onClick={handleDeleteTask}>
                      Borrar
                    </Button>
                    <Button onClick={() => {
                      setEditing(false);
                      setOpen(false);
                    }} variant="contained">Cancelar</Button>
                    <Button type="submit" variant="contained" color="success">Guardar cambios</Button>
                  </DialogActions>
                </form>
              </Dialog>
          </React.Fragment>
        </>
      )}
    </Box>
  );
};

export default Calendar;
