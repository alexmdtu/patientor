import React from 'react';
import { Header, Icon, List, Segment } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { Diagnosis, Entry } from '../types';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [{ diagnoses },] = useStateValue();

  const findDiagnosis = (code: string): Diagnosis | undefined => {
    return diagnoses.find(d => d.code === code);
  };

  const HospitalEntry: React.FC<{ entry: Entry }> = ({ entry }) => {
    return (
      <Segment>
        <Header as='h3'>
          {entry.date}
          <Icon name='hospital' />
        </Header>
        {entry.description}
        <List bulleted>
          {entry.diagnosisCodes?.map(code =>
            <List.Item key={code}>
              {code}: {findDiagnosis(code)?.name}
            </List.Item>)}
        </List>
      </Segment>
    );
  };

  const OccupationalHealthcareEntry: React.FC<{ entry: Entry }> = ({ entry }) => {
    return (
      <Segment>
        <Header as='h3'>
          {entry.date}
          <Icon name='stethoscope' />
        </Header>
        {entry.description}
        <List bulleted>
          {entry.diagnosisCodes?.map(code =>
            <List.Item key={code}>
              {code}: {findDiagnosis(code)?.name}
            </List.Item>)}
        </List>
      </Segment>
    );
  };

  const HealthCheckEntry: React.FC<{ entry: Entry }> = ({ entry }) => {
    return (
      <Segment>
        <Header as='h3'>
          {entry.date}
          <Icon name='doctor' />
        </Header>
        {entry.description}
        <List bulleted>
          {entry.diagnosisCodes?.map(code =>
            <List.Item key={code}>
              {code}: {findDiagnosis(code)?.name}
            </List.Item>)}
        </List>
      </Segment>
    );
  };

  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntry entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntry entry={entry} />;
    case 'HealthCheck':
      return <HealthCheckEntry entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;