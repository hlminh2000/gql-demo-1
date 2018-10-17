import React from "react";
import Component from "react-component-component";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import deepOrange from "@material-ui/core/colors/deepOrange";

import FriendAdder from "./FriendAdder";

const UserEntry = withStyles(theme => ({
  indented: {
    paddingLeft: 40,
    marginRight: -40,
    borderLeft: "solid 2px grey"
  },
  root: {
    overflow: "hidden",
    padding: `0 ${theme.spacing.unit * 3}px`
  },
  wrapper: {
    maxWidth: 400
  },
  paper: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  },
  avatar: {
    backgroundColor: deepOrange[500]
  }
}))(({ userId, classes }) => {
  const USER_QUERY = gql`
    query($userId: ID!) {
      user(id: $userId) {
        id
        name
        age
        friends {
          id
          name
        }
      }
    }
  `;
  return (
    <Query query={USER_QUERY} variables={{ userId }}>
      {({ loading, data: { user } = {} }) => (
        <Component initialState={{ expanded: false, addingFriend: false }}>
          {({ state: { expanded, addingFriend }, setState }) => (
            <div>
              <Paper className={classes.paper}>
                {loading ? (
                  "LOADING..."
                ) : (
                  <Grid container wrap="nowrap" spacing={16}>
                    <Grid item>
                      <Avatar className={classes.avatar}>{user.name[0]}</Avatar>
                    </Grid>
                    <Grid item xs zeroMinWidth>
                      <Typography noWrap variant="h5">{user.name}</Typography>
                      <Typography noWrap>{user.age} years old</Typography>
                      <Typography noWrap>
                        {expanded
                          ? null
                          : `Friends: ${user.friends
                              .map(({ name }) => name)
                              .join()}`}
                      </Typography>
                    </Grid>
                    <Grid item>
                      {addingFriend ? null : (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            setState({
                              addingFriend: !addingFriend
                            })
                          }
                        >
                          Add friend
                        </Button>
                      )}
                    </Grid>
                    <Grid onClick={() => setState({ expanded: !expanded })}>
                      {expanded ? <ExpandMore /> : <ExpandLess />}
                    </Grid>
                  </Grid>
                )}
                {addingFriend ? (
                  <FriendAdder
                    baseUserId={userId}
                    onCancel={() =>
                      setState({
                        addingFriend: false
                      })
                    }
                  />
                ) : null}
              </Paper>
              {!expanded || loading
                ? null
                : user.friends.map(({ id }) => (
                    <div className={classes.indented} key={id}>
                      <UserEntry userId={id} />
                    </div>
                  ))}
            </div>
          )}
        </Component>
      )}
    </Query>
  );
});

export default UserEntry;
