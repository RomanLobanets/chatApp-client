import React, { useEffect, useState, useRef } from "react";

import { Button, Comment } from "semantic-ui-react";
import { useQuery, gql } from "@apollo/client";
import FileUpload from "../Routes/components/fileUpload";
import RenderText from "../Routes/components/renderText";
const messageQuery = gql`
  query($cursor: String, $channelId: Int!) {
    messages(cursor: $cursor, channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      filetype
      createdAt
    }
  }
`;
const subscriptionMeassageQuery = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      filetype
      createdAt
    }
  }
`;
const Message = ({ message: { url, text, filetype } }) => {
  if (url) {
    if (filetype && filetype.startsWith("image/")) {
      return <img src={url} alt='' />;
    } else if (filetype === "text/plain") {
      return <RenderText url={url} />;
    } else if (filetype && filetype.startsWith("audio/")) {
      return (
        <div>
          <audio controls>
            <source src={url} type={filetype} />
          </audio>
        </div>
      );
    }
  }
  return <Comment.Text>{text}</Comment.Text>;
};

const MessageContainer = ({ channelId }) => {
  const [fetchLength, setFetchLength] = useState(10);
  const myRef = useRef(null);

  const { loading, data, subscribeToMore, fetchMore } = useQuery(messageQuery, {
    variables: { channelId },
  });

  const onScroll = () => {
    if (
      myRef.current.scrollHeight +
        myRef.current.scrollTop -
        myRef.current.clientHeight ===
        0 &&
      fetchLength >= 10
    ) {
      fetchMore({
        variables: {
          cursor: data.messages[data.messages.length - 1].createdAt,
          channelId,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          setFetchLength(fetchMoreResult.messages.length);
          if (prev.messages === fetchMoreResult.messages) {
            return;
          }
          if (!fetchMoreResult) {
            return prev;
          }

          return {
            ...prev,
            messages: [...prev.messages, ...fetchMoreResult.messages],
          };
        },
      });
    }
  };

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: subscriptionMeassageQuery,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        myRef.current.scrollTo(0, 0);
        if (!subscriptionData) {
          return prev;
        }
        return {
          ...prev,
          messages: [subscriptionData.data.newChannelMessage, ...prev.messages],
        };
      },
    });
    return () => {
      return unsubscribe();
    };
  }, [channelId]);

  return loading ? null : (
    <div
      style={{
        gridColumn: 3,
        gridRow: 2,
        paddingLeft: "20px",
        paddingRight: "20px",
        display: "flex",
        flexDirection: "column-reverse",
        overflowY: "auto",
      }}
      ref={myRef}
      onScroll={onScroll}
    >
      <FileUpload
        style={{
          display: "flex",
          flexDirection: "column-reverse",
        }}
        channelId={channelId}
        disableClick
      >
        <Comment>
          <Comment.Group>
            {[...data.messages].reverse().map((m) => (
              <Comment key={`message-${m.id}`}>
                <Comment.Content>
                  <Comment.Author as='a'>{m.user.username}</Comment.Author>
                  <Comment.Metadata>
                    <div>{m.createdAt}</div>
                  </Comment.Metadata>
                  <Message message={m} />
                </Comment.Content>
              </Comment>
            ))}
          </Comment.Group>
        </Comment>
      </FileUpload>
    </div>
  );
};
export default MessageContainer;
