import { useState, useEffect } from "react";
import * as React from 'react';
import { Box, Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import PocketBase from 'pocketbase';
import FormControl from '@mui/material/FormControl';



const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');


  const fetchRecords = async () => {
    try {
      const pb = new PocketBase('https://intervalle-instance.pockethost.io');

      const hospslist = await pb.collection('hospitals').getList(1, 50, {
        filter: 'created >= "2022-01-01 00:00:00"'
      });

      setHospitals(hospslist.items);
      // Actualizar selectedHospital con el primer hospital en la lista
      if (hospslist.items.length > 0) {
        setSelectedHospital(hospslist.items[0].id);
      }

      console.log('Datos recuperados hospitales:', hospslist);

    } catch (error) {
      console.error('Error fetching records:', error);
      
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    // Validar que las contraseñas coincidan
    if (values.password !== values.passwordConfirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Crear el objeto de datos para PocketBase (user)
    const data = {
      username: values.firstName.toLowerCase() + values.lastName.toLowerCase(),
      email: values.email,
      emailVisibility: true,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
      firstName: values.firstName,
      lastName: values.lastName,
      contact: values.contact,
      address1: values.address1,
      birthdate: values.birthdate,
      rol: values.rol,  
      isActive: true,
    };

    
  

    // Crear una instancia de PocketBase
    const pb = new PocketBase('https://intervalle-instance.pockethost.io');

    try {
      // Crear el usuario utilizando PocketBase
      const record = await pb.collection('users').create(data);
      console.log(record.id);
      // Verificar el rol y crear el registro correspondiente
      if (values.rol === 'estudiante') {

        // Crear el objeto de datos para PocketBase (student)
        const data_student = {
          matricula: values.matricula,
          carreer: values.carreer,
          user_assigned: record.id,
          firstName: values.firstName,
          lastName: values.lastName,
          hospital: selectedHospital,
          isActive: true,
        };
        let student = await pb.collection('students').create(data_student);

        console.log('student: ' + student);


      } else if (values.rol === 'doctor') {
        // Crear el objeto de datos para PocketBase (doctor)
        const data_doctor = {
          speciality: values.speciality,
          user_assigned: record.id,
          firstName: values.firstName,
          lastName: values.lastName,
          hospital: selectedHospital,
          isActive: true,
        };
        let doctor = await pb.collection('doctors').create(data_doctor);
        
        console.log('doctor: ' + doctor);
      }


      // Mostrar alerta de registro exitoso
      alert("Registro exitoso");

      // Reiniciar los valores del formulario
      resetForm({
        values: {
          ...initialValues,
          password: '',  // Establecer la contraseña en una cadena vacía
          passwordConfirm: '',  // Establecer la confirmación de contraseña en una cadena vacía
        },
      });
      
      // Log en la consola para verificar el registro
      console.log('user: ' + record);
      
    } catch (error) {
      // Manejar errores en la creación del usuario
      alert("Oops! No se pudo guardar el registro");
      console.error('Error al crear el usuario:', error);
    }
  };


  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
    console.log(event.target.value)
  };  

  return (
    <Box m="20px">
      <Header title="CREAR USUARIO" subtitle="Crea un Nuevo Usuario" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombres"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helpertext={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Apellidos"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helpertext={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helpertext={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Numero de Teléfono"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helpertext={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Dirección"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helpertext={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha de Nacimiento"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.birthdate}
                name="birthdate"
                error={!!touched.birthdate && !!errors.birthdate}
                helpertext={touched.birthdate && errors.birthdate}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helpertext={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirmar Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.passwordConfirm}
                name="passwordConfirm"
                error={!!touched.passwordConfirm && !!errors.passwordConfirm}
                helpertext={touched.passwordConfirm && errors.passwordConfirm}
                sx={{ gridColumn: "span 4" }}
              />



              <InputLabel id="rol-label">Rol</InputLabel>
                <Select
                  labelId="rol-label"
                  id="rol"
                  name="rol"
                  value={values.rol}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.rol && !!errors.rol}
                  helpertext={touched.rol && errors.rol}
                  sx={{ gridColumn: "span 4" }}
                >
                  <MenuItem value="estudiante">Estudiante</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                </Select>

              {/* Renderizar campos adicionales para el rol seleccionado */}
              {values.rol === "estudiante" && (
                <>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Matrícula"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.matricula}
                    name="matricula"
                    error={!!touched.matricula && !!errors.matricula}
                    helpertext={touched.matricula && errors.matricula}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Carrera"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.carreer}
                    name="carreer"
                    error={!!touched.carreer && !!errors.carreer}
                    helpertext={touched.carreer && errors.carreer}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="hospital-label">Seleccione un Hospital</InputLabel>
                    <Select
                      labelId="hospital-label"
                      id="hospital"
                      value={selectedHospital}
                      onChange={handleHospitalChange}
                      label="Hospital"
                      error={!!touched.hospital && !!errors.hospital}
                      helpertext={touched.hospital && errors.hospital}
                      required
                    >
                      {hospitals.map((hospital) => (
                        <MenuItem key={hospital.id} value={hospital.id}>
                          {`${hospital.name}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}


              {values.rol === "doctor" && (
                <>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Especialidad"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.speciality}
                    name="speciality"
                    error={!!touched.speciality && !!errors.speciality}
                    helpertext={touched.speciality && errors.speciality}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="hospital-label">Seleccione un Hospital</InputLabel>
                    <Select
                      labelId="hospital-label"
                      id="hospital"
                      value={selectedHospital}
                      onChange={handleHospitalChange}
                      label="Hospital"
                      error={!!touched.contact && !!errors.contact}
                      helpertext={touched.contact && errors.contact}
                      required
                    >
                      {hospitals.map((hospital) => (
                        <MenuItem key={hospital.id} value={hospital.id}>
                          {`${hospital.name}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                Crear Nuevo Usuario
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("Campo requerido"),
  lastName: yup.string().required("Campo requerido"),
  email: yup.string().email("Email inválido").required("Campo requerido"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Número inválido")
    .required("Campo requerido"),
  address1: yup.string().required("Campo requerido"),
  birthdate: yup.string().required("Campo requerido"),
  rol: yup.string().required("Campo requerido"),
  password: yup.string().required("Campo requerido").min(8, "La contraseña debe tener al menos 8 caracteres"),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir').required("Campo requerido"),
  
  //Exclusivos de Estudiante
  matricula: yup.string().when('rol', {
    is: 'estudiante',
    then: yup.string().required('Campo requerido para estudiantes'),
    otherwise: yup.string(),
  }),
  carreer: yup.string().when('rol', {
    is: 'estudiante',
    then: yup.string().required('Campo requerido para estudiantes'),
    otherwise: yup.string(),
  }),
  

  //Exclusivos de Doctor
  speciality: yup.string().when('rol', {
    is: 'doctor',
    then: yup.string().required('Campo requerido para doctores'),
    otherwise: yup.string(),
  }),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  birthdate: "",
  rol: "",
  password: "",
  passwordConfirm: "",
  hospital: "",
  //Student Exclusive
  matricula: "",
  carreer: "",
  //Doctor Exclusive
  speciality: "",

};

export default Form;
