import React, { useContext } from "react";
import { Card, Image, Button, Icon, Label, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
function PostCard({
  post: {
    id,
    postBody,
    postOwner,
    postOwnerId,
    createdAt,
    comments,
    likes,
    commentsCount,
    likesCount,
  },
}) {
  const { user } = useContext(AuthContext);
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{postOwner}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{postBody}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likesCount }} />
        <Popup
          content="Comment on Post"
          inverted
          trigger={
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentsCount}
              </Label>
            </Button>
          }
        />
        {/* <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
          <Button color="blue" basic>
            <Icon name="comments" />
          </Button>
          <Label basic color="blue" pointing="left">
            {commentsCount}
          </Label>
        </Button> */}
        {user && user.userName === postOwner && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
