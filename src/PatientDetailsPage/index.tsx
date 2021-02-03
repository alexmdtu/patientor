import React from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { useParams } from 'react-router-dom';
import { Patient } from '../types';
import { addEntry, setPatient, useStateValue } from '../state';
import { Button, Header, Icon, List } from 'semantic-ui-react';
import Entries from './Entries';
import AddEntryModal from '../AddEntryModal';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';

const PatientDetailsPage: React.FC = () => {
  const [{ currentPatient }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

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

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${currentPatient?.id}/entries`,
        values
      );
      dispatch(addEntry(newPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
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
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientDetailsPage;