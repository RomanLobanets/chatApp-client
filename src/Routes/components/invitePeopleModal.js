import React, { useState } from "react";
import { from, gql, useMutation } from "@apollo/client";
import { allTeamsQuery } from "../../graphql/team";
import findIndex from "lodash/findIndex";
import produce from "immer";
import normalizeErrors from "../../helpers.js/normalizeErrors";

import { Form, Input, Button, Header, Image, Modal } from "semantic-ui-react";

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

const InvitePeopleModal = ({ onClose, teamId }) => {
  const [email, setEmail] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createTeam] = useMutation(addTeamMemberMutation);

  const submit = async () => {
    teamId = parseInt(teamId);
    const {
      data: {
        addTeamMember: { ok, errors },
      },
    } = await createTeam({
      variables: { teamId, email: email },
    });

    if (ok) {
      onClose();
    } else {
      const errorLength = errors.errorLength;
      const filteredErrors = errors.filter(
        (e) => e.message !== "user_id must be unique"
      );
      if (errorLength !== filteredErrors.length) {
        filteredErrors.push({
          path: "email",
          message: "this user is already in team",
        });
      }
      setErrorMessage(normalizeErrors(filteredErrors).email[0]);

      setErrorModal(true);
    }
  };

  return (
    <Modal onClose={onClose} open>
      <Modal.Header>Add people to yuor Team</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fluid
              name='email'
              placeholder='Users email '
            />
          </Form.Field>
          {errorModal ? <p>{errorMessage}</p> : null}
          <Form.Group widths='equal'>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              fluid
            >
              Cancel
            </Button>
            <Button onClick={submit} fluid>
              Add user
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default InvitePeopleModal;
