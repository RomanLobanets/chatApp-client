import React, { useState, useEffect } from "react";

const RenderText = ({ url }) => {
  useEffect(async () => {
    const responce = await fetch(url);
    const plaintext = await responce.text();

    setText(plaintext);
  }, []);

  const [text, setText] = useState("");

  return (
    <div>
      <div>------</div>
      <p>{text}</p>
      <div>------</div>
    </div>
  );
};
export default RenderText;
