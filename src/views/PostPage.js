import React, { useContext, useState, useRef } from "react";
import { Popup } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import {
  Card,
  Grid,
  Icon,
  Label,
  Image,
  Button,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
function PostPage(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);
  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId: postId },
  });

  const [comment, setComment] = useState("");
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: { postId: postId, commentBody: comment },
  });
  //   if (loading) console.log("Loading...");
  //   if (error) console.log(`Error! ${error.message}`);
  //const { getPost } = data;
  //console.log("getPost: " + JSON.stringify(getPost));
  function deletePostCb() {
    props.history.push("/");
  }

  function postComment(user) {
    return (
      user && (
        <Card fluid>
          <Card.Content>
            <p>Post a Comment...</p>
            <Form>
              <div className="ui action input fluid">
                <input
                  type="text"
                  placeholder="Comment..."
                  name="comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  ref={commentInputRef}
                />
                <button
                  type="submit"
                  className="ui button teal"
                  disabled={comment.trim() === ""}
                  onClick={submitComment}
                >
                  Submit
                </button>
              </div>
            </Form>
          </Card.Content>
        </Card>
      )
    );
  }
  function showComments(commentData, postId) {
    const comments = commentData.map((comment) => {
      return (
        <Card fluid key={comment.id}>
          <Card.Content>
            {user && user.userName === comment.commentOwner && (
              <DeleteButton postId={postId} commentId={comment.id} />
            )}
            <Card.Header>{comment.commentOwner}</Card.Header>
            <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
            <Card.Description>{comment.commentBody}</Card.Description>
          </Card.Content>
        </Card>
      );
    });
    return comments;
  }
  let postMarkup;
  let getPost;
  if (data) {
    getPost = data.getPost;
  }
  if (!getPost) {
    postMarkup = <p>Loading Post...</p>;
  } else {
    const {
      id,
      postBody,
      postOwner,
      postOwnerId,
      createdAt,
      comments,
      likes,
      commentsCount,
      likesCount,
    } = getPost;
    console.log("comments: " + JSON.stringify(comments));
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="mini"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{postOwner}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{postBody}</Card.Description>
                <hr />
                <Card.Content extra>
                  <LikeButton user={user} post={{ id, likesCount, likes }} />
                  {/* <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => {
                      console.log("comment on post.");
                    }}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentsCount}
                    </Label>
                  </Button> */}
                  <Popup
                    content="Comment on Post"
                    inverted
                    trigger={
                      <Button
                        as="div"
                        labelPosition="right"
                        onClick={() => {
                          console.log("comment on post.");
                        }}
                      >
                        <Button basic color="blue">
                          <Icon name="comments" />
                        </Button>
                        <Label basic color="blue" pointing="left">
                          {commentsCount}
                        </Label>
                      </Button>
                    }
                  />
                  {user && user.userName === postOwner && (
                    <DeleteButton postId={id} callback={deletePostCb} />
                  )}
                </Card.Content>
              </Card.Content>
            </Card>
            {postComment(user)}
            {showComments(comments, id)}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      postBody
      postOwner
      postOwnerId
      createdAt
      comments {
        id
        commentOwner
        commentBody
        createdAt
      }
      commentsCount
      likes {
        id
        likeOwner
        likedAt
      }
      likesCount
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $commentBody: String!) {
    createComment(postId: $postId, commentBody: $commentBody) {
      id
      comments {
        id
        commentOwner
        commentBody
        createdAt
      }
      commentsCount
    }
  }
`;

export default PostPage;
