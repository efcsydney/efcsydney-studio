import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Form, Listing, View } from "./modules/passages";
import { usePassages } from "./modules/passages/hooks";
import { Route, Switch, Redirect } from "react-router";
import { HashRouter } from "react-router-dom";
import { hot } from "react-hot-loader";
import styled from "styled-components";

function App() {
  const {
    passages,
    createPassage,
    updatePassage,
    deletePassage
  } = usePassages();

  const handleAdd = form => {
    createPassage(form);
  };

  const handleDelete = id => {
    deletePassage(id);
  };

  const handleSave = form => {
    const id = form.id;
    if (id) {
      updatePassage(id, form);
    } else {
      createPassage(form);
    }
  };

  return (
    <HashRouter>
      <Container>
        <TransitionGroup>
          <CSSTransition
            key={window.location.href}
            classNames="fade"
            timeout={300}
          >
            <Switch>
              <Route
                exact
                path="/passages"
                render={() => (
                  <Listing
                    data={passages}
                    onDelete={handleDelete}
                    onAdd={handleAdd}
                  />
                )}
              />
              <Route
                exact
                path="/passages/show/:id"
                render={({ match: { params } }) => {
                  const passage = passages.find(p => p.id === params.id);
                  return <View data={passage} />;
                }}
              />
              <Route
                exact
                path="/passages/edit/:id"
                render={({ match: { params } }) => {
                  const passage = passages.find(p => p.id === params.id);
                  return (
                    <Form data={passage} type="edit" onSave={handleSave} />
                  );
                }}
              />
              <Route
                exact
                path="/passages/new"
                render={() => {
                  return <Form type="new" onSave={handleSave} />;
                }}
              />
              <Redirect to="/passages" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </Container>
    </HashRouter>
  );
}

export default hot(module)(App);

const Container = styled.div`
  margin: 0 auto;
  max-width: 1440px;
`;
