import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { useStateValue } from "./state";
import { Patient } from "./types";

import PatientListPage from "./PatientListPage";
import PatientDetailsPage from "./PatientDetailsPage";

import { setPatientList } from './state/reducer';

const App: React.FC = () => {
  const [, dispatch] = useStateValue();
  React.useEffect(() => {
    axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatientList();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/patients" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/patients/:id" render={() => <PatientDetailsPage />} />
            <Route path="/patients" render={() => <PatientListPage />} />
            <Route path="/" render={() => <Redirect to="/patients" />} />
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
