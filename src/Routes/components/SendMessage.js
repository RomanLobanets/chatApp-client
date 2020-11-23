import styled from "styled-components";
import React, { useState } from "react";
import { Button, Icon, Input } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import FileUpload from "./fileUpload";
import produce from "immer";
import { update } from "lodash";

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  display: grid;
  grid-template-columns: 50px auto;
`;

const SendMessage = ({
  teamId,
  channelName,
  channelId,
  receiverId,
  gqlSchema,
  updateOptions,
}) => {
  const [text, setText] = useState("");
  const [createMessage] = useMutation(gqlSchema);

  const handleSubmit = (e) => {
    if (e.target.value === "") {
      return;
    }

    const responce = createMessage({
      variables: { teamId, receiverId, channelId, text },
      update: updateOptions,
    });
  };

  return (
    <SendMessageWrapper>
      <FileUpload channelId={channelId}>
        <Button icon>
          <Icon name='plus' />
        </Button>
      </FileUpload>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            handleSubmit(e);
            setText("");
          }
        }}
        // fluid
        placeholder={`Message #${channelName}`}
      />
    </SendMessageWrapper>
  );
};
export default SendMessage;
