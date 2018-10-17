import React from "react";
import Component from "react-component-component";
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import UserSelect from "./UserSelect";

const LocalStateContainer = ({ children }) => (
  <Component initialState={{ selectedUserId: 0 }}>
    {({ state: { selectedUserId }, setState }) => {
      const selectUserId = value => setState({ selectedUserId: value });
      return children({ selectedUserId, selectUserId });
    }}
  </Component>
);

const FriendAdder = withStyles(theme => ({
  input: {
    width: "100%"
  },
  row: {
    display: "flex"
  }
}))(({ baseUserId, classes, onCancel = () => {} }) => {
  const ADD_FRIEND = gql`
    mutation($uid1: ID!, $uid2: ID!) {
      newFriendship(uid1: $uid1, uid2: $uid2) {
        user1 {
          id
          friends {
            id
          }
        }
        user2 {
          id
          friends {
            id
          }
        }
      }
    }
  `;
  return (
    <Mutation mutation={ADD_FRIEND}>
      {registerNewFriendship => {
        const addFriend = friendId =>
          registerNewFriendship({
            variables: {
              uid1: baseUserId,
              uid2: friendId
            }
          });
        return (
          <LocalStateContainer>
            {({ selectedUserId, selectUserId }) => (
              <div className={classes.row}>
                <UserSelect
                  selected={selectedUserId}
                  onSelect={({ value }) => selectUserId(value)}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => addFriend(selectedUserId)}
                >
                  ADD
                </Button>
                <Button variant="outlined" onClick={onCancel}>
                  CANCEL
                </Button>
              </div>
            )}
          </LocalStateContainer>
        );
      }}
    </Mutation>
  );
});

export default FriendAdder;
