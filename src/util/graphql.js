import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
      id
      postBody
      postOwner
      postOwnerId
      createdAt
      comments {
        id
        commentBody
        commentOwner
        createdAt
      }
      commentsCount
      likes {
        likeOwner
        likedAt
      }
      likesCount
    }
  }
`;
