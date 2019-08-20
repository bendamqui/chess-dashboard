import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import Dashboard from "./views/Dashboard";
import ChartForm from "./views/ChartForm";
import Visualization from "./views/Visualization";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/dashboard" />
  },
  {
    path: "/dashboard",
    layout: DefaultLayout,
    component: Dashboard
  },
  {
    path: "/visualization",
    layout: DefaultLayout,
    component: Visualization
  },
  {
    path: "/chart",
    layout: DefaultLayout,
    component: ChartForm
  }
];
