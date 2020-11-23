import React from "react";
import { useQuery, gql } from "@apollo/client";

const Home = () => {
  const { loading, error, data } = useQuery(allUsersQuery);

  return loading
    ? null
    : data.allUsers.map((u) => (
        <h1 key={u.id}>
          {u.email}
          {u.username}
        </h1>
      ));
};

const allUsersQuery = gql`
  {
    allUsers {
      id
      username
      email
    }
  }
`;
export default Home;
