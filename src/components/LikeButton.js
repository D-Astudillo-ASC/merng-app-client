import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Button, Icon, Label, Popup } from "semantic-ui-react";
import gql from "graphql-tag";

function LikeButton({ user, post: { id, likesCount, likes } }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => like.likeOwner === user.userName)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError(error) {
      console.log("error liking post: " + error);
    },
  });
  const likeButton = user ? (
    liked ? (
      <>
        <Button color="teal">
          <Icon name="heart" />
        </Button>
        <Label basic color="teal" pointing="left">
          {likesCount}
        </Label>
      </>
    ) : (
      <>
        <Button color="teal" basic>
          <Icon name="heart" />
        </Button>
        <Label basic color="teal" pointing="left">
          {likesCount}
        </Label>
      </>
    )
  ) : (
    <>
      <Button as={Link} to="/login" color="teal">
        <Icon name="heart" />
      </Button>
      <Label basic color="teal" pointing="left">
        {likesCount}
      </Label>
    </>
  );
  return (
    <Popup
      content={liked ? "Unlike Post" : "Like Post"}
      inverted
      trigger={
        <Button as="div" labelPosition="right" onClick={likePost}>
          {likeButton}
        </Button>
      }
    />
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        likeOwner
        likedAt
      }
      likesCount
    }
  }
`;

export default LikeButton;
