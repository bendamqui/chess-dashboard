import React from "react";

import {
  Container,
  Row,
  Col,
  Card,
  FormInput,
  ListGroup,
  ListGroupItem,
  Button,
  Form
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Select from "react-select";
import axios from "axios";
import { charts as chartTypes } from "./../types/charts";

class ChartForm extends React.Component {
  constructor(props) {
    super(props);
    this.optionsMap = {
      metricOptions: {},
      dimensionOptions: {},
      chartTypeOptions: {}
    };
    this.state = {
      title: "",
      metrics: [],
      chartType: {},
      dimensions: [],
      metricOptions: [],
      dimensionOptions: [],
      chartTypeOptions: [
        { value: "pie", label: "Pie" },
        { value: "line", label: "Line" }
      ]
    };
  }

  optionIsMulti = option => {
    const {
      chartType: { value }
    } = this.state;
    switch (option) {
      case "metrics":
        return value === chartTypes.line;
      case "dimensions":
        return false;
      default:
        return false;
    }
  };

  buildOptionsMap() {
    ["metricOptions", "dimensionOptions", "chartTypeOptions"].forEach(key => {
      this.state[key].forEach(option => {
        this.optionsMap[key][option.value] = option;
      });
    });
  }

  preFillForm() {
    let { chart: { _id, title, type: chartType, spec } = {} } =
      this.props.location.state || {};

    if (_id) {
      this.buildOptionsMap();
      ["metrics", "dimensions"].forEach(key => {
        spec[key] = spec[key].map(({ field: value, label }) => {
          return { value, label };
        });
      });

      chartType = this.optionsMap.chartTypeOptions[chartType];

      this.setState({
        ...{
          _id,
          title,
          chartType,
          metrics: spec.metrics,
          dimensions: spec.dimensions
        }
      });
    }
  }

  async componentDidMount() {
    await this.getSelectOptions();
    this.preFillForm();
  }

  getSelectOptions() {
    return axios
      .get("/api/charts/options")
      .then(async ({ data: { dimensions, metrics } }) => {
        return this.setState({
          metricOptions: metrics,
          dimensionOptions: dimensions
        });
      });
  }

  handleSubmit = e => {
    e.preventDefault();
    const payload = this.preparePayload();
    const verb = this.state._id ? "put" : "post";
    axios[verb]("/api/charts", payload).then(() =>
      this.props.history.push("/dashboard")
    );
  };

  preparePayload = () => {
    let { _id, title, chartType, metrics, dimensions } = this.state;
    metrics = metrics.map(obj => obj.value);
    dimensions = dimensions.map(obj => obj.value);

    return {
      _id,
      title,
      type: chartType.value,
      spec: {
        metrics,
        dimensions
      }
    };
  };

  handleTitleInput = ({ target: { value: title } }) => {
    this.setState({ title });
  };

  handleSelect = (field, defaultValue) => {
    return select => {
      if (["metrics", "dimensions"].indexOf(field) >= 0) {
        select = Array.isArray(select) ? select : [select];
      }
      this.setState({ [field]: select || defaultValue });
    };
  };

  render() {
    return (
      <div>
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle sm="4" title="Chart" className="text-sm-left" />
          </Row>
          <Row>
            <Col lg="12" className="mb-4">
              <Card small>
                <ListGroup flush>
                  <ListGroupItem className="p-3">
                    <Row>
                      <Col>
                        <Form onSubmit={this.handleSubmit}>
                          <Row form>
                            <Col md="12" className="form-group">
                              <label htmlFor="title">Title</label>
                              <FormInput
                                id="title"
                                type="text"
                                placeholder="Title"
                                onChange={this.handleTitleInput}
                                value={this.state.title}
                              />
                            </Col>
                            <Col md="12" className="form-group">
                              <label htmlFor="chartType">Chart Type</label>
                              <Select
                                id="chartType"
                                placeholder="Chart Type"
                                value={this.state.chartType}
                                onChange={this.handleSelect("chartType", "")}
                                options={this.state.chartTypeOptions}
                              />
                            </Col>
                          </Row>

                          <Row form>
                            <Col md="12" className="form-group">
                              <label htmlFor="metrics">Metrics</label>
                              <Select
                                id="metrics"
                                placeholder="Metrics"
                                closeMenuOnSelect={
                                  !this.optionIsMulti("metrics")
                                }
                                onChange={this.handleSelect("metrics", [])}
                                value={this.state.metrics}
                                isMulti={this.optionIsMulti("metrics")}
                                options={this.state.metricOptions}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12" className="form-group">
                              <label htmlFor="dimensions">Dimensions</label>
                              <Select
                                id="dimensions"
                                placeholder="Dimensions"
                                closeMenuOnSelect={
                                  !this.optionIsMulti("dimensions")
                                }
                                onChange={this.handleSelect("dimensions", [])}
                                value={this.state.dimensions}
                                isMulti={this.optionIsMulti("dimensions")}
                                options={this.state.dimensionOptions}
                              />
                            </Col>
                          </Row>

                          <Button
                            onClick={this.props.history.goBack}
                            theme="danger"
                            className="mb-2 mr-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            theme="primary"
                            className="mb-2 mr-1"
                          >
                            Save
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ChartForm;
