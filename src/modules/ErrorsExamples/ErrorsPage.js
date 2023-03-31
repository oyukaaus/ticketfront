import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";

export default function ErrorsPage() {
  return (
    <Switch>
      <Redirect from="/error" to="/error/index" />
      <Route path="/error/index" component={ErrorPage} />
    </Switch>
  );
}
