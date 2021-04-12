import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";
function Register(props) {
  const context = useContext(AuthContext);
  const REGISTER_USER = gql`
    mutation register(
      $username: String!
      $email: String!
      $password: String!
      $confirmPassword: String!
    ) {
      register(
        registerInput: {
          userName: $username
          email: $email
          password: $password
          confirmPassword: $confirmPassword
        }
      ) {
        id
        email
        userName
        createdAt
        token
      }
    }
  `;
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onCompleted: (data) => {
      setErrors({});
    },
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.errors);
    },
  });
  function registerUser() {
    addUser({ variables: values });
  }
  return (
    <div className="register-form">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1> Register </h1>
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
          label="Email"
          placeholder="Email..."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Button type="submit" primary>
          Register
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

export default Register;
