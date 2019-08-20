import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  FormCheckbox,
  FormInput,
  FormSelect,
  Button
} from "shards-react";

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: "white",
      pieceCount: 3,
      showNotation: false,
      disabledStart: false
    };
  }

  handleStart = () => {
    this.setState({ disabledStart: true }, () => {
      this.props.onStart(this.state);
    });
  };

  handleShowNotation = ({ target: { checked } }) => {
    this.setState({ showNotation: checked, disabledStart: false });
  };

  handlePieceCount = ({ target: { value } }) => {
    this.setState({ pieceCount: value, disabledStart: false });
  };

  handleOrientation = ({ target: { value } }) => {
    this.setState({ orientation: value, disabledStart: false });
  };

  render() {
    return (
      <Card small className="mb-3">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Settings</h6>
        </CardHeader>
        <CardBody>
          <ListGroup flush>
            <ListGroupItem className="p-0 px-3 pt-3">
              <Row className="form-group">
                <label htmlFor="piece-count">Number of Pieces</label>
                <FormInput
                  value={this.state.pieceCount}
                  min="3"
                  id="piece-count"
                  type="number"
                  onChange={this.handlePieceCount}
                />
              </Row>
              <Row className="form-group">
                <label htmlFor="orientation">Orientation</label>
                <FormSelect onChange={this.handleOrientation} id="orientation">
                  <option>White</option>
                  <option>Black</option>
                </FormSelect>
              </Row>
              <Row className="form-group">
                <FormCheckbox onChange={this.handleShowNotation}>
                  Show Notation
                </FormCheckbox>
              </Row>
              <Row>
                <Button
                  disabled={this.state.disabledStart}
                  onClick={this.handleStart}
                >
                  Start
                </Button>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </CardBody>
        <CardBody className="p-0" />
      </Card>
    );
  }
}

Settings.propTypes = {
  /**
   * Get a specific setting value
   */
  onStart: PropTypes.func
};
