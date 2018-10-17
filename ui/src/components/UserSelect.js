import React from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

import { withStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";

const UserSelect = withStyles(theme => ({
  select: {
    width: "100%"
  }
}))(({ classes, selected, onSelect = () => {} }) => {
  const ALL_USERS = gql`
    {
      users {
        id
        name
      }
    }
  `;
  return (
    <Query query={ALL_USERS}>
      {({ loading, data: { users } = {}, error }) => {
        if (loading) {
          return "LOADING...";
        } else {
          return (
            <Select
              value={selected || users[0].id}
              className={classes.select}
              onChange={e => onSelect({ value: e.target.value })}
            >
              {users.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
          );
        }
      }}
    </Query>
  );
});

export default UserSelect;