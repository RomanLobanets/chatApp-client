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

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      user {
        id
        email
        username
      }
      errors {
        path
        message
      }
    }
  }
`;

const Register = (props) => {
  const [register] = useMutation(registerMutation);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const onSubmit = async () => {
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    const {
      data: {
        register: { ok, user, errors },
      },
    } = await register({
      variables: { username, email, password },
    });

    if (ok) {
      props.history.push("/login");
    } else {
      errorSwitch(errors, setUsernameError, setEmailError, setPasswordError);
    }
  };
  return (
    <Container text>
      <Header as='h2'>Register</Header>
      <Form>
        <Form.Field error={usernameError}>
          <Input
            name='username'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder='username'
            fluid
          ></Input>
        </Form.Field>
        <Form.Field error={emailError}>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            name='email'
            value={email}
            placeholder='Email'
            fluid
          ></Input>
        </Form.Field>
        <Form.Field error={passwordError}>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            name='password'
            value={password}
            type='password'
            placeholder='password'
            fluid
          ></Input>
        </Form.Field>
        <Button onClick={() => onSubmit()}>Submit</Button>
      </Form>
      {usernameError || emailError || passwordError ? (
        <Message
          error
          header='There was some problem with registartion'
          list={[usernameError, emailError, passwordError]}
        />
      ) : null}
    </Container>
  );
};

export default Register;
