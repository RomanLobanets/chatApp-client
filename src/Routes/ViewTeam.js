import React from "react";
import { Redirect } from "react-router-dom";
import SideBar from "../container/Sidebar";
import Header from "./components/Header";
import { gql, useMutation } from "@apollo/client";
import SendMessage from "./components/SendMessage";
import MessageContainer from "../container/MessageContainer";
import AppLayout from "./components/AppLayout";
import { useQuery } from "@apollo/client";
import { meQuery } from "../graphql/team";
import findIndex from "lodash/findIndex";

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

const ViewTeam = ({ match: { params } }) => {
  const { loading, error, data } = useQuery(meQuery, {
    fetchPolicy: "network-only",
  });
  if (loading || !data) {
    return null;
  }

  const teams = data.me.teams;

  if (!teams.length) {
    return <Redirect to='/team' />;
  }
  const teamInt = parseInt(params.teamId, 10);
  const teamIdx = teamInt
    ? findIndex(teams, ["id", parseInt(params.teamId)])
    : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  const channelInt = parseInt(params.channelId, 10);
  const channelIdx = channelInt
    ? findIndex(team.channels, ["id", parseInt(params.channelId)])
    : 0;
  const currentChannel =
    channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    <AppLayout>
      <SideBar currentTeamId={params.teamId} />
      <Header channelName={currentChannel.name} />
      <MessageContainer channelId={currentChannel.id} />

      <SendMessage
        gqlSchema={createMessageMutation}
        channelId={currentChannel.id}
        channelName={currentChannel.name}
      />
    </AppLayout>
  );
};
export default ViewTeam;
