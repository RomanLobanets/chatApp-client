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
import { wsLink } from "../apollo";
const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

const Register = (props) => {
  const [login] = useMutation(loginMutation);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const onSubmit = async () => {
    setEmailError(null);
    setPasswordError(null);
    const {
      data: {
        login: { ok, token, refreshToken, errors },
      },
    } = await login({
      variables: { email, password },
    });

    if (ok) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      wsLink.subscriptionClient.tryReconnect();
      props.history.push("/view-team");
    } else {
      errorSwitch(errors, null, setEmailError, setPasswordError);
    }
  };
  return (
    <Container text>
      <Header as='h2'>Login</Header>
      <Form>
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
      {emailError || passwordError ? (
        <Message
          error
          header='There was some problem with registartion'
          list={[emailError, passwordError]}
        />
      ) : null}
    </Container>
  );
};

export default Register;
