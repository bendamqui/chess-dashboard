import React, { Component } from "react";
import { Button, ButtonGroup } from "shards-react";

const memorizeMode = "memorize";
const checkAnswerMode = "checkanswer";
const answerMode = "answer";

export default class ActionButtons extends Component {
  buttonDisabled = name => {
    const { mode } = this.props;
    switch (name) {
      case "next":
        return mode !== checkAnswerMode;
      case "ready":
        return mode !== memorizeMode;
      case "submit":
        return mode !== answerMode;
      default:
        return false;
    }
  };

  render() {
    return (
      <ButtonGroup className="col-lg-6">
        <Button
          size={this.props.size}
          disabled={this.buttonDisabled("next")}
          theme="success"
          onClick={this.props.handleNext}
        >
          Next
        </Button>
        <Button
          size={this.props.size}
          disabled={this.buttonDisabled("ready")}
          theme="warning"
          onClick={this.props.handleReady}
        >
          Ready
        </Button>
        <Button
          size={this.props.size}
          disabled={this.buttonDisabled("submit")}
          theme="info"
          onClick={this.props.handleSubmit}
        >
          Submit
        </Button>
      </ButtonGroup>
    );
  }
}
