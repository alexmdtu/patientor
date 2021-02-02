import React from 'react';
import { Header, SegmentGroup } from 'semantic-ui-react';
import { useStateValue } from '../state';
import EntryDetails from './EntryDetails';

const Entries: React.FC = () => {
  const [{ currentPatient },] = useStateValue();

  if (!currentPatient) {
    return <p>Loading</p>;
  }

  if (currentPatient.entries.length === 0) {
    return <p>No entries present for this patient.</p>;
  }

  console.log(currentPatient.entries);
  return (
    <div>
      <Header as="h3">entries</Header>
      <SegmentGroup>
        {currentPatient.entries.map(entry => <EntryDetails key={entry.id} entry={entry} />)}
      </SegmentGroup>
    </div>
  );
};

export default Entries;