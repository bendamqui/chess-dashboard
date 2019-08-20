import React from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Button
} from "shards-react";

import Chart from "chart.js";
import "chartjs-plugin-colorschemes";

class Line extends React.Component {
  constructor(props) {
    super(props);
    this.specMap = {};
    this.setSpecMap();
    this.canvasRef = React.createRef();
  }

  setSpecMap = () => {
    const {
      chart: {
        spec: { metrics, dimensions }
      }
    } = this.props;
    this.specMap = [...metrics, ...dimensions].reduce((map, row) => {
      map[row.field] = row;
      return map;
    }, {});
  };

  handleDelete = () => {
    const { _id } = this.props.chart;
    axios.delete(`/api/charts/${_id}`).then(() => {
      this.props.removeChart(this.props.index);
    });
  };

  getChartData() {
    return axios.get(`/api/charts/${this.props.chart._id}/data`);
  }

  getLabel = (value, field) => {
    const type = this.specMap[field].type;
    if (type === "dateParts") {
      return this.datePartsToDate(value);
    }
    return value;
  };

  datePartsToDate = dateParts => {
    return ["year", "month", "day"]
      .reduce((parts, key) => {
        parts.push(dateParts[key]);
        return parts;
      }, [])
      .filter(value => {
        return value !== undefined;
      })
      .join("/");
  };

  prepareChartsData = ({ data }) => {
    if (data.length === 0) {
      return [];
    }

    // set labels xAxis
    const { metrics, dimensions } = this.props.chart.spec;

    const groupByField = dimensions[0].field;
    const labels = [];
    const datasets = [];
    const namedDatasets = [];

    // reduce ?
    data.forEach((row, rowIndex) => {
      labels.push(this.getLabel(row._id[groupByField], groupByField));
      metrics.forEach(({ field, label }) => {
        const value = row[field];
        if (rowIndex === 0) {
          namedDatasets[field] = {
            label: label,
            data: [],
            fill: false
          };
        }
        namedDatasets[field].data.push(value);
      });
    });

    metrics.forEach(({ field }) => {
      datasets.push(namedDatasets[field]);
    });

    return {
      labels,
      datasets
    };
  };

  async componentDidMount() {
    const data = await this.getChartData().then(this.prepareChartsData);

    const chartConfig = {
      type: "line",
      data,
      options: {
        plugins: {
          colorschemes: {
            scheme: "brewer.Paired12",
            override: true
          }
        }
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
        <CardBody className="pt-0">
          <canvas
            height="120"
            ref={this.canvasRef}
            style={{ maxWidth: "100% !important" }}
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

Line.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart dataset.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object
};

Line.defaultProps = {
  title: "Users Overview",
  chartData: {
    labels: Array.from(new Array(30), (_, i) => (i === 0 ? 1 : i)),
    datasets: [
      {
        label: "Current Month",
        fill: "start",
        data: [
          500,
          800,
          320,
          180,
          240,
          320,
          230,
          650,
          590,
          1200,
          750,
          940,
          1420,
          1200,
          960,
          1450,
          1820,
          2800,
          2102,
          1920,
          3920,
          3202,
          3140,
          2800,
          3200,
          3200,
          3400,
          2910,
          3100,
          4250
        ],
        backgroundColor: "rgba(0,123,255,0.1)",
        borderColor: "rgba(0,123,255,1)",
        pointBackgroundColor: "#ffffff",
        pointHoverBackgroundColor: "rgb(0,123,255)",
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 3
      },
      {
        label: "Past Month",
        fill: "start",
        data: [
          380,
          430,
          120,
          230,
          410,
          740,
          472,
          219,
          391,
          229,
          400,
          203,
          301,
          380,
          291,
          620,
          700,
          300,
          630,
          402,
          320,
          380,
          289,
          410,
          300,
          530,
          630,
          720,
          780,
          1200
        ],
        backgroundColor: "rgba(255,65,105,0.1)",
        borderColor: "rgba(255,65,105,1)",
        pointBackgroundColor: "#ffffff",
        pointHoverBackgroundColor: "rgba(255,65,105,1)",
        borderDash: [3, 3],
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 2,
        pointBorderColor: "rgba(255,65,105,1)"
      }
    ]
  }
};

export default Line;
