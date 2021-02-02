import React from 'react';
import { Header, List } from 'semantic-ui-react';
import { useStateValue } from '../state';

const Entries: React.FC = () => {
  const [{ currentPatient },] = useStateValue();

  if (!currentPatient) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <Header as="h3">entries</Header>
      {currentPatient.entries.map(entry => {
        return (
          <div key={entry.id}>
            <p>{entry.date} {entry.description}</p>
            <List bulleted>
              {entry.diagnosisCodes?.map(code => <List.Item key={code}>{code}</List.Item>)}
            </List>
          </div>
        );
      })}
    </div>
  );
};

export default Entries;