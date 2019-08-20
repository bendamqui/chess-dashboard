import React from "react";
import { Container, Row, Col } from "shards-react";
import PieChart from "../components/charts/Pie";
import LineChart from "../components/charts/Line";
import { NavLink as RouteNavLink } from "react-router-dom";
import axios from "axios";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charts: []
    };
  }

  componentDidMount() {
    this.getChart();
  }

  removeChart(index) {
    const charts = [...this.state.charts];
    charts.splice(index, 1);

    this.setState({ charts });
  }

  createCharts() {
    const charts = [];
    this.state.charts.forEach((chart, key) => {
      if (chart.type === "pie") {
        charts.push(
          <Col key={chart._id} lg="6" md="6" sm="12" className="mb-4">
            <PieChart
              index={key}
              title={chart.title}
              chart={chart}
              removeChart={this.removeChart.bind(this)}
            />
          </Col>
        );
      } else if (chart.type === "line") {
        charts.push(
          <Col key={chart._id} lg="12" md="6" sm="12" className="mb-4">
            <LineChart
              index={key}
              title={chart.title}
              chart={chart}
              removeChart={this.removeChart.bind(this)}
            />
          </Col>
        );
      }
    });
    return charts;
  }

  getChart() {
    axios("/api/charts").then(({ data: charts }) => {
      this.setState({ charts });
    });
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <Col xs="12" sm="4" className="page-title">
            <span> Dashboard </span>
            <RouteNavLink to="/chart" className="text-default">
              <i className="material-icons">add</i>
            </RouteNavLink>
          </Col>
          {/* <PageTitle title="Dashboard" className="text-sm-left mb-3" />               */}
        </Row>

        <Row>
          {this.createCharts()}

          {/* Users Overview */}
          {/* <Col lg="8" md="12" sm="12" className="mb-4">
                <UsersOverview />
              </Col>       */}
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
