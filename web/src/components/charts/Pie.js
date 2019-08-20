import React from "react";
import PropTypes from "prop-types";

import { NavLink } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  CardHeader,
  CardBody,
  CardFooter
} from "shards-react";

import axios from "axios";

import Chart from "../../utils/chart";
import "chartjs-plugin-colorschemes";

class Pie extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  getChartData() {
    return axios
      .get(`/api/charts/${this.props.chart._id}/data`)
      .then(this.prepareChartsData);
  }

  prepareChartsData = ({ data }) => {
    const chartData = {
      datasets: [
        {
          hoverBorderColor: "#ffffff",
          data: []
        }
      ],
      labels: []
    };

    data.forEach(row => {
      const { metrics, dimensions } = this.props.chart.spec;
      chartData.datasets[0].data.push(row[metrics[0].field]);
      chartData.labels.push(row._id[dimensions[0].field]);
    });

    return chartData;
  };

  handleDelete = () => {
    const { _id } = this.props.chart;
    axios.delete(`/api/charts/${_id}`).then(() => {
      this.props.removeChart(this.props.index);
    });
  };

  async componentDidMount() {
    const chartData = await this.getChartData();

    const chartConfig = {
      type: "pie",
      data: chartData,
      options: {
        ...{
          legend: {
            position: "bottom",
            labels: {
              padding: 25,
              boxWidth: 20
            }
          },
          cutoutPercentage: 0,
          tooltips: {
            custom: false,
            mode: "index",
            position: "nearest"
          },
          plugins: {
            colorschemes: {
              scheme: "brewer.Paired12"
            }
          }
        },
        ...this.props.chartOptions
      }
    };

    new Chart(this.canvasRef.current, chartConfig);
  }

  render() {
    const { title } = this.props;
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
        </CardHeader>
        <CardBody className="d-flex py-0">
          <canvas
            height="220"
            ref={this.canvasRef}
            className="blog-users-by-device m-auto"
          />
        </CardBody>
        <CardFooter className="border-top">
          <Row>
            <Col className="text-right">
              <NavLink
                to={{ pathname: "/chart", state: { chart: this.props.chart } }}
              >
                <Button type="submit" theme="primary" className="mb-2 mr-1">
                  <i className="material-icons">edit</i>
                </Button>
              </NavLink>
              <Button
                onClick={this.handleDelete}
                theme="danger"
                className="mb-2 mr-1"
              >
                <i className="material-icons">delete</i>
              </Button>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    );
  }
}

Pie.propTypes = {
  /**
   * The chart definiton from the db.
   */
  chart: PropTypes.object,
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart config object.
   */
  chartConfig: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object,
  /**
   * The chart data.
   */
  chartData: PropTypes.object,

  /**
   * The index of the chart on the dashboard.
   */
  index: PropTypes.number,

  /**
   * Remove chart from the dashboard
   */
  removeChart: PropTypes.func
};

export default Pie;
