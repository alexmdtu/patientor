import React from 'react';
import { EntryForm, EntryType } from '../types';
import { Field, Formik, Form } from "formik";
import { DiagnosisSelection, NumberField, SelectField, TextField, TypeOption } from '../AddPatientModal/FormField';
import { Button, Grid } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { isDate } from '../utils';

export type EntryFormValues = EntryForm;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: EntryType.HealthCheck, label: EntryType.HealthCheck },
  { value: EntryType.Hospital, label: EntryType.Hospital },
  { value: EntryType.OccupationalHealthcare, label: EntryType.OccupationalHealthcare, },
];

const ConditionalForm = (type: { type: string }) => {
  switch (type.type) {
    case "HealthCheck":
      return (
        <Field
          label="Health Check Rating"
          name="healthCheckRating"
          component={NumberField}
          min={0}
          max={3}
        />
      );
    case "Hospital":
      return (
        <>
          <Field
            label="Discharge Date"
            placeholder="Date"
            name="dischargeDate"
            component={TextField}
          />
          <Field
            label="Discharge Criteria"
            placeholder="Criteria"
            name="dischargeCriteria"
            component={TextField}
          />
        </>
      );
    case "OccupationalHealthcare":
      return (
        <>
          <Field
            label="Employer Name"
            placeholder="Employer Name"
            name="employerName"
            component={TextField}
          />
          <Field
            label="Sick Leave Start Date"
            placeholder="Date"
            name="sickLeaveStartDate"
            component={TextField}
          />
          <Field
            label="Sick Leave End Date"
            placeholder="Date"
            name="sickLeaveEndDate"
            component={TextField}
          />
        </>
      );
    default:
      console.log('no valid type recognized in switch: ' + type);
      return <p>`no valid type recognized in switch:  ${type}`</p>;
  }
};

const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        id: '',
        date: "",
        type: "HealthCheck",
        specialist: "",
        diagnosisCodes: [""],
        description: "",
        healthCheckRating: 0,
        dischargeDate: "",
        dischargeCriteria: "",
        employerName: "",
        sickLeaveStartDate: "",
        sickLeaveEndDate: ""
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = "Field is required";
        const invalidInput = "Input is invalid";
        const errors: { [field: string]: string } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!isDate(values.date)) {
          errors.date = invalidInput;
        } else if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.diagnosisCodes) {
          errors.diagnosisCodes = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (values.type === "HealthCheck") {
          if ((values.healthCheckRating !== 0 && !values.healthCheckRating) || values.healthCheckRating < 0 || values.healthCheckRating > 3) {
            errors.healthCheckRating = requiredError;
          }
        }
        if (values.type === "Hospital") {
          if (!values.dischargeCriteria) {
            errors.dischargeCriteria = requiredError;
          }
          if (!values.dischargeDate) {
            errors.dischargeDate = requiredError;
          } else if (!isDate(values.dischargeDate)) {
            errors.dischargeDate = invalidInput;
          }
        }
        if (values.type === "OccupationalHealthcare") {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          if (!values.sickLeaveStartDate) {
            errors.sickLeaveStartDate = requiredError;
          } else if (!isDate(values.sickLeaveStartDate)) {
            errors.sickLeaveStartDate = invalidInput;
          }
          if (!values.sickLeaveEndDate) {
            errors.sickLeaveEndDate = requiredError;
          } else if (!isDate(values.sickLeaveEndDate)) {
            errors.sickLeaveEndDate = invalidInput;
          }
        }
        return errors;
      }}
    >

      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form className="form ui">
            <SelectField
              label="Type"
              name="type"
              options={typeOptions}
            />
            <Field
              label="Date"
              placeholder="Date"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <ConditionalForm type={values.type} />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;