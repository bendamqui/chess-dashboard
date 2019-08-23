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
import { periods as periodTypes } from "./../types/periods";
import { filterOperators as filterOperatorTypes } from "./../types/filterOperators";

class ChartForm extends React.Component {
  constructor(props) {
    super(props);
    this.optionsMap = {
      metricOptions: {},
      dimensionOptions: {},
      chartTypeOptions: {},
      periodOptions: {},
      filterOperatorsOptions: {}
    };
    this.state = {
      title: "",
      filterValue: "",
      chartType: {},
      metrics: [],
      dimensions: [],
      period: {},
      metricOptions: [],
      dimensionOptions: [],
      filterOperatorsOptions: [
        { value: filterOperatorTypes.eq, label: "=" },
        { value: filterOperatorTypes.neq, label: "!=" }
      ],
      periodOptions: [
        { value: periodTypes.today, label: "Today" },
        { value: periodTypes.currentWeek, label: "This Week" },
        { value: periodTypes.currentMonth, label: "This Month" },
        { value: periodTypes.currentYear, label: "This Year" },
        { value: periodTypes.all, label: "All" }
      ],
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
    [
      "metricOptions",
      "dimensionOptions",
      "chartTypeOptions",
      "periodOptions",
      "filterOperatorsOptions"
    ].forEach(key => {
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
      let { metrics, dimensions, filters, period } = spec;
      let dimensionfilter = {},
        filterOperator = {},
        filterValue = "";
      metrics = metrics.map(({ field: value, label }) => {
        return { value, label };
      });
      dimensions = dimensions.map(({ field: value, label }) => {
        return { value, label };
      });

      chartType = this.optionsMap.chartTypeOptions[chartType];
      period = this.optionsMap.periodOptions[period];
      if (filters.length > 0) {
        dimensionfilter = this.optionsMap.dimensionOptions[filters[0].field];
        filterOperator = this.optionsMap.filterOperatorsOptions[
          filters[0].operator
        ];
        filterValue = filters[0].value;
      }

      this.setState({
        ...{
          _id,
          title,
          chartType,
          metrics: metrics,
          dimensions: dimensions,
          period,
          dimensionfilter,
          filterOperator,
          filterValue
        }
      });
    }
  }

  async componentDidMount() {
    await this.getSelectOptions();
    this.preFillForm();
  }

  handleRemoveFilter = e => {
    e.preventDefault();
    this.setState({
      dimensionfilter: {},
      filterOperator: {},
      filterValue: ""
    });
  };

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

  hasSomeEmpty = (...values) => {
    return values.some(value => {
      if (typeof value === "string") {
        return value.length === 0;
      } else if (typeof value === "object") {
        return Object.keys(value).length === 0;
      }
      return true;
    });
  };

  preparePayload = () => {
    let {
      _id,
      title,
      chartType,
      period,
      metrics,
      dimensions,
      dimensionfilter,
      filterOperator,
      filterValue
    } = this.state;

    metrics = metrics.map(obj => obj.value);
    dimensions = dimensions.map(obj => obj.value);
    const filters = [];
    if (!this.hasSomeEmpty(dimensionfilter, filterOperator, filterValue)) {
      filters.push({
        field: dimensionfilter.value,
        operator: filterOperator.value,
        value: filterValue
      });
    }
    return {
      _id,
      title,
      type: chartType.value,
      spec: {
        metrics,
        dimensions,
        period: period.value,
        filters
      }
    };
  };

  handleTitleInput = ({ target: { value: title } }) => {
    this.setState({ title });
  };

  handleFilterValueInput = ({ target: { value: filterValue } }) => {
    this.setState({ filterValue });
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

                          <Row>
                            <Col md="12" className="form-group">
                              <label htmlFor="period">Period</label>
                              <Select
                                id="period"
                                placeholder="Period"
                                closeMenuOnSelect
                                onChange={this.handleSelect(
                                  "period",
                                  periodTypes.all
                                )}
                                value={this.state.period}
                                options={this.state.periodOptions}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col md="12">
                              <label>
                                Filter
                                <button
                                  className="btn btn-link"
                                  onClick={this.handleRemoveFilter}
                                >
                                  delete
                                </button>
                              </label>
                            </Col>
                            <Col md="4" className="form-group">
                              <Select
                                placeholder="Dimension"
                                closeMenuOnSelect
                                onChange={this.handleSelect("dimensionfilter")}
                                value={this.state.dimensionfilter}
                                options={this.state.dimensionOptions}
                              />
                            </Col>
                            <Col md="4" className="form-group">
                              <Select
                                placeholder="Operator"
                                closeMenuOnSelect
                                onChange={this.handleSelect("filterOperator")}
                                value={this.state.filterOperator}
                                options={this.state.filterOperatorsOptions}
                              />
                            </Col>
                            <Col md="4" className="form-group">
                              <FormInput
                                type="text"
                                placeholder="Value"
                                onChange={this.handleFilterValueInput}
                                value={this.state.filterValue}
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
