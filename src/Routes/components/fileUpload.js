import React from "react";
import Dropzone from "react-dropzone";
import { gql, useMutation } from "@apollo/client";

const createFileMessageMutation = gql`
  mutation($channelId: Int!, $file: File) {
    createMessage(channelId: $channelId, file: $file)
  }
`;

const FileUpload = ({ children, disableClick, channelId, style = {} }) => {
  const [createFile] = useMutation(createFileMessageMutation);
  return (
    <Dropzone
      style={style}
      className='ignore'
      onDrop={async ([file]) => {
        const responce = createFile({ variables: { channelId, file } });
      }}
      disableClick={disableClick}
    >
      {children}
    </Dropzone>
  );
};

export default FileUpload;
