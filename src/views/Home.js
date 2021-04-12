import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../util/graphql";
const showPosts = (postsData) => {
  const posts =
    postsData &&
    postsData.map((post) => {
      const postDisplay = (
        <Grid.Column key={post.id} style={{ marginBottom: "20px" }}>
          <PostCard post={post} />
        </Grid.Column>
      );
      return postDisplay;
    });
  return posts;
};

function Home() {
  const { user } = useContext(AuthContext);

  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Posts... </h1>
        ) : (
          <Transition.Group>{showPosts(posts)}</Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
