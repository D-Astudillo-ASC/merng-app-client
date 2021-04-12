import React from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import gql from "graphql-tag";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { useMutation } from "@apollo/client";
function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCb, {
    postBody: "",
  });
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      console.log(result);
    },
    onError(error) {
      console.log(error);
    },
  });

  function createPostCb() {
    createPost({ variables: values });
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a Post</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hello World!"
            name="postBody"
            onChange={onChange}
            error={error ? true : false}
            value={values.postBody}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: "20px" }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($postBody: String!) {
    createPost(postBody: $postBody) {
      id
      createdAt
      postBody
      postOwner
      postOwnerId
      comments {
        id
        createdAt
        commentBody
        commentOwner
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
export default PostForm;
