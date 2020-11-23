import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { meQuery } from "../../graphql/team";
import findIndex from "lodash/findIndex";
import produce from "immer";
import { withRouter } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Header,
  Image,
  Modal,
  Dropdown,
} from "semantic-ui-react";
import { getTeamMembersQuery } from "../../graphql/team";

// getOrCreateChannel(members:[Int!], teamId: Int!):Int!
const getOrCreateChannelMutation = gql`
  mutation($members: [Int!], $teamId: Int!) {
    getOrCreateChannel(members: $members, teamId: $teamId) {
      id
      name
    }
  }
`;

const DirectMessageModal = ({ onClose, teamId, currentUserId, history }) => {
  const [privateTeam, setPrivateTeam] = useState([]);
  const { loading, error, data } = useQuery(getTeamMembersQuery, {
    variables: { teamId },
  });
  const [createDMChannel] = useMutation(getOrCreateChannelMutation);

  const submit = async (e) => {
    e.preventDefault();
    teamId = parseInt(teamId);
    const {
      data: {
        getOrCreateChannel: { id },
      },
    } = await createDMChannel({
      variables: { teamId, members: privateTeam },
      update: (store, { data: { getOrCreateChannel } }) => {
        const { id, name } = getOrCreateChannel;

        const allTeamsData = store.readQuery({ query: meQuery });
        const teamIdx = findIndex(allTeamsData.me.teams, ["id", teamId]);
        const notInChannelList = allTeamsData.me.teams[teamIdx].channels.every(
          (c) => c.id !== id
        );
        if (notInChannelList) {
          store.writeQuery({
            query: meQuery,
            data: produce(allTeamsData, (x) => {
              x.me.teams[teamIdx].channels.push({ id, name, dm: true });
            }),
          });
        }
      },
    });

    history.push(`/view-team/${teamId}/${id}`);
    onClose();
  };

  return (
    <>
      {!loading && (
        <Modal onClose={onClose} open>
          <Modal.Header>Direct message</Modal.Header>
          <Modal.Content>
            <Form>
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
      )}
    </>
  );
};

export default withRouter(DirectMessageModal);
