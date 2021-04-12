import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import MenuBar from "./components/MenuBar";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import PostPage from "./views/PostPage";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

function App() {
  return (
    <AuthProvider>
      <Container>
        <Router>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={PostPage} />
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default App;
