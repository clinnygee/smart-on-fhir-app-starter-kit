import React, { useEffect, useState } from 'react';
import './App.css';
import { useForm } from "react-hook-form";
import { Spinner, Container, Button, Form } from "react-bootstrap";
import { FhirResource, fhirVersions } from 'fhir-react';
import 'fhir-react/build/style.css';
import 'fhir-react/build/bootstrap-reboot.min.css';

export default function App(props) {
  const client = props.client;
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    client.patient.read()
      .then((patient) => {
        setPatient(patient);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching patient:', error);
        setLoading(false);
      });
  }, [client]);

  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = data => {
    const updatedPatient = {
      ...patient,
      name: [{
        ...patient.name[0],
        given: [data.fname],
        family: data.lname
      }]
    };
    
    setPatient(updatedPatient);
    client.update(updatedPatient);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div id="app">
      <Container className="mt-4">
        <h2>Patient Information</h2>
        {patient ? (
          <FhirResource 
            fhirResource={patient}
            fhirVersion={fhirVersions.R4}
          />
        ) : (
          <p>No patient data available</p>
        )}
      </Container>
      
      {patient && (
        <Container className="mt-4">
          <h4>Update Patient Name</h4>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formFirst">
              <Form.Label>First Name</Form.Label>
              <Form.Control 
                type="text" 
                {...register("fname", { required: true })} 
                defaultValue={patient.name?.[0]?.given?.join(' ') || ''} 
              />
              {errors.fname && <Form.Text className="text-danger">First name is required</Form.Text>}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formLast">
              <Form.Label>Last Name</Form.Label>
              <Form.Control 
                type="text" 
                {...register("lname", { required: true })} 
                defaultValue={patient.name?.[0]?.family || ''} 
              />
              {errors.lname && <Form.Text className="text-danger">Last name is required</Form.Text>}
            </Form.Group>
            
            <Button variant="primary" type="submit">
              Update Patient
            </Button>
          </Form>
        </Container>
      )}
    </div>
  );
}