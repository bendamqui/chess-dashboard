import React, { Component } from "react";
import Chessboard from "chessboardjsx";
import { Container, Card, Row, Col } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import Settings from "../components/visualization/Settings";
import ActionButtons from "../components/visualization/ActionButtons";
import axios from "axios";

const memorizeMode = "memorize";
const checkAnswerMode = "checkanswer";
const loadingMode = "loading";
const answerMode = "answer";

export default class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      mode: loadingMode,
      position: "",
      draggable: false,
      squareStyles: {}
    };
  }

  handleNext = async () => {
    const position = await this.getRandomPosition();
    this.setMemorizeMode(position);
  };

  setMemorizeMode = position => {
    return this.setState({
      position,
      mode: memorizeMode,
      draggable: false,
      squareStyles: {}
    });
  };

  setAnswerMode = () => {
    this.setState({
      mode: answerMode,
      position: "",
      draggable: true,
      sparePieces: true
    });
  };

  setCheckAnswerMode = squareStyles => {
    this.setState({
      mode: checkAnswerMode,
      squareStyles
    });
  };

  getRandomPosition = () => {
    return axios
      .get("/api/positions/random", {
        params: {
          pieceCount: this.state.settings.pieceCount
        }
      })
      .then(({ data: { fen } }) => {
        return fen;
      });
  };

  handleOnStart = state => {
    this.setState({ settings: state }, async () => {
      const position = await this.getRandomPosition();
      this.setMemorizeMode(position);
    });
  };

  handleSubmit = () => {
    const solution = this.getFullBoardPosition(this.solution);
    const answer = this.getFullBoardPosition(this.answer);
    const squareStyles = this.getSquareStyles(solution, answer);
    this.setCheckAnswerMode(squareStyles);
  };

  getSquareStyles = (solution, answer) => {
    const squareStyles = {};
    Object.keys(solution).forEach(square => {
      if (solution[square] === answer[square]) {
        if (solution[square] !== null) {
          squareStyles[square] = { backgroundColor: "green" };
        }
      } else {
        squareStyles[square] = { backgroundColor: "red" };
      }
    });
    return squareStyles;
  };

  getFullBoardPosition = position => {
    const fullBoardPosition = {};
    ["a", "b", "c", "d", "e", "f", "g", "h"].forEach(column => {
      for (let rank = 1; rank < 9; rank++) {
        const key = `${column}${rank}`;
        fullBoardPosition[key] = position[key] || null;
      }
    });
    return fullBoardPosition;
  };

  getCurrentPosition = position => {
    if (this.state.mode === memorizeMode) {
      this.solution = position;
    } else {
      this.answer = position;
      this.setState({ position });
    }
  };

  render() {
    return (
      <Container>
        <Row noGutters className="page-header py-4">
          <PageTitle lg="4" title="Visualization" className="text-sm-left" />
        </Row>

        <Row>
          <Col lg="4">
            <Settings onStart={this.handleOnStart} />
          </Col>
          <Col lg="8">
            <Card>
              <Row>
                <Col className="row justify-content-md-center">
                  <Chessboard
                    width={460}
                    orientation={this.state.settings.orientation}
                    showNotation={this.state.settings.showNotation}
                    draggable={this.state.draggable}
                    squareStyles={this.state.squareStyles}
                    position={this.state.position}
                    sparePieces={true}
                    getPosition={this.getCurrentPosition}
                  />
                </Col>
              </Row>
              <Row className="mt-3 pb-3">
                <Col lg="12" className="justify-content-md-center d-flex">
                  <ActionButtons
                    size="md"
                    mode={this.state.mode}
                    handleReady={this.setAnswerMode}
                    handleNext={this.handleNext}
                    handleSubmit={this.handleSubmit}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
