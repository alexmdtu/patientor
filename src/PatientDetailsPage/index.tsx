import React from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { useParams } from 'react-router-dom';
import { Patient } from '../types';
import { setPatient, useStateValue } from '../state';
import { Header, Icon, List } from 'semantic-ui-react';
import Entries from './Entries';

const PatientDetailsPage: React.FC = () => {
  const [{ currentPatient }, dispatch] = useStateValue();

  const { id } = useParams<{ id: string }>();

  const getGender = (genderString: string) => {
    switch (genderString) {
      case 'male':
        return 'mars';
      case 'female':
        return 'venus';
      default:
        return 'genderless';
    }
  };

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
        dispatch(setPatient(patientDetailsFromApi));
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
      <Header as="h2">
        {currentPatient.name}
        <Icon name={getGender(currentPatient.gender)} />
      </Header>
      <List>
        <List.Item>ssn: {currentPatient.ssn}</List.Item>
        <List.Item>occupation: {currentPatient.occupation}</List.Item>
      </List>
      <Entries />
    </div>
  );
};

export default PatientDetailsPage;