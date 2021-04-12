import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";

function Login(props) {
  const context = useContext(AuthContext);
  const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!) {
      login(userName: $username, password: $password) {
        id
        email
        userName
        createdAt
        token
      }
    }
  `;
  const { onChange, onSubmit, values } = useForm(loginUserCb, {
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onCompleted: (data) => {
      console.log("completed: " + JSON.stringify(data));
      setErrors({});
    },
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.errors);
    },
  });
  function loginUserCb() {
    loginUser({ variables: values });
  }
  return (
    <div className="register-form">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1> Login </h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          type="text"
          value={values.username}
          error={errors.userName ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((error, i) => {
              return <li key={i}>{error}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Login;
