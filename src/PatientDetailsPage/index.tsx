import React from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { useParams } from 'react-router-dom';
import { Patient } from '../types';
import { useStateValue } from '../state';
import { Header, List } from 'semantic-ui-react';

const PatientDetailsPage: React.FC = () => {
  const [{ currentPatient }, dispatch] = useStateValue();

  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {
    const fetchPatientDetails = async () => {
      // no need for refetch if patient already in state
      if (currentPatient?.id && currentPatient.id === id) {
        return;
      }

      try {
        console.log('fetching details from backend');
        const { data: patientDetailsFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch({ type: "SET_PATIENT", payload: patientDetailsFromApi });
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatientDetails();
  }, [dispatch, id, currentPatient]);

  if (!currentPatient) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <Header as="h2">{currentPatient.name}</Header>
      <List>
        <List.Item>ssn: {currentPatient.ssn}</List.Item>
        <List.Item>occupation: {currentPatient.occupation}</List.Item>
        <List.Item>gender: {currentPatient.gender}</List.Item>
      </List>
    </div>
  );
};

export default PatientDetailsPage;