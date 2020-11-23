import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { meQuery, getTeamMembersQuery } from "../../graphql/team";
import findIndex from "lodash/findIndex";
import produce from "immer";

import {
  Checkbox,
  Form,
  Input,
  Button,
  Modal,
  Dropdown,
} from "semantic-ui-react";

const createTeamMutation = gql`
  mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int]) {
    createChannel(
      teamId: $teamId
      name: $name
      public: $public
      members: $members
    ) {
      ok
      channel {
        id
        name
        dm
      }
    }
  }
`;

const AddChannelModal = ({ onClose, teamId, currentUserId }) => {
  const [name, setName] = useState("");
  const [publicCheck, setPublicCheck] = useState(true);
  const [privateTeam, setPrivateTeam] = useState([]);
  const [createTeam] = useMutation(createTeamMutation);
  const { loading, error, data } = useQuery(getTeamMembersQuery, {
    variables: { teamId },
  });

  const submit = (e) => {
    e.preventDefault();
    teamId = parseInt(teamId);
    const responce = createTeam({
      variables: { teamId, name, public: publicCheck, members: privateTeam },
      // refetchQueries: [{ query: allTeamsQuery }],//will make double request

      update: (store, responseData) => {
        const { ok, channel } = responseData.data.createChannel;

        if (!ok) {
          return;
        }
        const allTeamsData = store.readQuery({ query: meQuery });
        const teamIdx = findIndex(allTeamsData.me.teams, ["id", teamId]);
        store.writeQuery({
          query: meQuery,
          data: produce(allTeamsData, (x) => {
            x.me.teams[teamIdx].channels.push(channel);
          }),
        });
      },
    });

    onClose();
  };

  return (
    <Modal onClose={onClose} open>
      <Modal.Header>Select a Channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              fluid
              placeholder='Channel name'
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label='Private'
              toggle
              onChange={() => setPublicCheck(!publicCheck)}
            />
          </Form.Field>
          {!publicCheck && (
            <Form.Field>
              <Dropdown
                placeholder='Select Friend'
                fluid
                multiple
                selection
                onChange={(e, { value }) => setPrivateTeam(value)}
                options={data.getTeamMembers
                  .filter((tm) => tm.id !== currentUserId)
                  .map((tm) => ({
                    key: tm.id,
                    value: tm.id,
                    text: tm.username,
                  }))}
              />
            </Form.Field>
          )}

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
            <Button onClick={(e) => submit(e)} fluid>
              Create Channel
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddChannelModal;
