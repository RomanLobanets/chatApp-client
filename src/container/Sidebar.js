import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Channels from "../Routes/components/Channels";
import Team from "../Routes/components/Team";
import findIndex from "lodash/findIndex";

import AddChannelModal from "../Routes/components/AddChannelModal";
import InvitePeopleModal from "../Routes/components/invitePeopleModal";
import DirectMessageModal from "../Routes/components/DirectMessageModal";
import { meQuery } from "../graphql/team";

const SideBar = ({ currentTeamId }) => {
  const [modal, openModal] = useState(false);
  const [invitePeolpemodal, setInvitePeolpemodal] = useState(false);
  const [directMessageModal, setDirectMessageModal] = useState(false);
  const { loading, error, data } = useQuery(meQuery);

  let team;
  let teams;
  let regularChannels = [];
  let dmChannels = [];
  if (!loading) {
    teams = data.me.teams;
    const teamInt = parseInt(currentTeamId, 10);
    const teamIdx = teamInt
      ? findIndex(teams, ["id", parseInt(currentTeamId, 10)])
      : 0;
    team = teamIdx === -1 ? teams[0] : teams[teamIdx];

    team.channels.forEach((ch) => {
      if (!ch.dm) {
        regularChannels.push(ch);
      } else {
        dmChannels.push(ch);
      }
    });
  }

  return loading ? null : (
    <>
      <Team
        teams={teams.map((item) => ({
          id: item.id,
          letter: item.name.substring(0, 1).toUpperCase(),
        }))}
      />

      <Channels
        teamName={team.name}
        username={data.me.username}
        teamId={team.id}
        channels={regularChannels}
        dmChannels={dmChannels}
        isOwner={team.admin}
        onAddChannel={() => openModal(!modal)}
        onInvitePeopleClick={() => setInvitePeolpemodal(!invitePeolpemodal)}
        onDirectMessageClick={() => setDirectMessageModal(!directMessageModal)}
      />
      {modal && (
        <AddChannelModal
          currentUserId={data.me.id}
          teamId={team.id}
          onClose={() => openModal(!modal)}
          key={"sidebar-add-channel-modal"}
        />
      )}
      {invitePeolpemodal && (
        <InvitePeopleModal
          teamId={team.id}
          onClose={() => setInvitePeolpemodal(!invitePeolpemodal)}
          key={"sidebar-add-channel-modal"}
        />
      )}
      {directMessageModal && (
        <DirectMessageModal
          currentUserId={data.me.id}
          teamId={team.id}
          onClose={() => setDirectMessageModal(!directMessageModal)}
          key={"direct-message-modal"}
        />
      )}
    </>
  );
};

export default SideBar;
