import React, { useState } from "react";
import {
  Form,
  Message,
  Button,
  Input,
  Container,
  Header,
} from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import errorSwitch from "../helpers.js/errorLoginRegSwitch";
const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

const CreateTeam = (props) => {
  const [createTeam] = useMutation(createTeamMutation);

  const [name, setName] = useState("");

  const [nameError, setNameError] = useState(null);

  const onSubmit = async () => {
    try {
      setNameError(null);
      const {
        data: {
          createTeam: { ok, errors, team },
        },
      } = await createTeam({
        variables: { name },
      });

      if (ok) {
        props.history.push(`/view-team/${team.id}`);
      } else {
        errorSwitch(errors, null, null, null, setNameError);
      }
    } catch (err) {
      props.history.push("/login");
      return;
    }
  };
  return (
    <Container text>
      <Header as='h2'>Create TEam</Header>
      <Form>
        <Form.Field error={nameError}>
          <Input
            onChange={(e) => setName(e.target.value)}
            name='name'
            value={name}
            placeholder='Name'
            fluid
          ></Input>
        </Form.Field>

        <Button onClick={() => onSubmit()}>Submit</Button>
      </Form>
      {nameError ? (
        <Message
          error
          header='There was some problem with registartion'
          list={[nameError]}
        />
      ) : null}
    </Container>
  );
};

export default CreateTeam;
