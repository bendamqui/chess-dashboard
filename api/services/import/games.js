const got = require("got");
const GameModel = require("./../../models/Game");
const PositionModel = require("./../../models/Position");
const Chess = require("chess.js").Chess;
const chess = new Chess();
const { IMPORT_KEY } = process.env;

const runImport = async (username, importKey) => {
  if (importKey !== IMPORT_KEY) {
    throw new Error("Import is disabled");
  }
  let gameInsertedCount = 0;
  let positionInsertedCount = 0;
  const lastInsert = await GameModel.getMaxFieldValue("end_time");
  const archives = await getValidArchives(username, lastInsert);

  for (url of archives) {
    const games = await getValidGames(url, lastInsert);
    gameInsertedCount += await importGames(games, username.toLowerCase());
    positionInsertedCount += await importPositions(games);
  }

  return {
    gameInsertedCount,
    positionInsertedCount
  };
};

const importPositions = async games => {
  const positions = [];

  for (game of games) {
    positions.push(...getPositions(game));
  }
  const result = await save(positions, PositionModel);
  return result.nInserted || 0;
};

const getPositions = game => {
  const positions = [];
  let fen;
  chess.load_pgn(game.pgn);
  do {
    fen = chess.fen();
    positions.push({
      fen: fen,
      pieceCount: fen.split(" ")[0].match(/[RNBQKBNRP]/gi).length
    });
  } while (chess.undo());
  return positions;
};

const importGames = async (games, username) => {
  const documents = composeMap(
    setDateField,
    setUserAndOpponent(username),
    setResult,
    setDetailedResultMetrics
  )(games);
  const result = await save(documents, GameModel);
  return result.nInserted || 0;
};

const getValidGames = (url, lastInsert) => {
  return getGames(url)
    .then(processGamesResponse)
    .then(filterGames(lastInsert));
};

const getValidArchives = (username, lastInsert) => {
  return getArcihves(username)
    .then(processArchiveResponse)
    .then(filterArchives(lastInsert));
};

const getArcihves = async username => {
  return got(`https://api.chess.com/pub/player/${username}/games/archives`);
};

const processArchiveResponse = ({ body }) => {
  return JSON.parse(body)["archives"];
};

const filterArchives = lastInsert => {
  return archives => {
    return archives.filter(isValidArchive(lastInsert));
  };
};

const isValidArchive = lastInsert => {
  return url => {
    return lastInsert < getFirstOfNextMonthEpoch(url);
  };
};

const getFirstOfNextMonthEpoch = url => {
  const parts = url.split("/");
  const currentMonth = Number(parts[parts.length - 1]);
  const month = currentMonth === 12 ? 1 : currentMonth + 1;
  const year = parts[parts.length - 2];
  return new Date(`${year}/${month}/01`).getTime() / 1000;
};

const getGames = url => {
  return got(url);
};

const filterGames = lastInsert => {
  return games => {
    return games.filter(isValidGame(lastInsert));
  };
};

const composeMap = (...fns) => {
  return array => {
    return array.map(row => {
      return fns.reduce((acc, fn) => {
        return fn(acc);
      }, row);
    });
  };
};

const setResult = game => {
  const map = {
    checkmated: "lost",
    insufficient: "draw",
    agreed: "draw",
    timeout: "lost",
    resigned: "lost",
    win: "win",
    abandoned: "lost",
    "50move": "draw",
    repetition: "draw",
    timevsinsufficient: "draw",
    stalemate: "draw"
  };
  game.result = map[game.user.result];
  return game;
};

const setDetailedResultMetrics = game => {
  const { result } = game;
  let metricField;

  switch (result) {
    case "win":
      metricField = game.opponent.result;
      break;
    case "lost":
    case "draw":
      metricField = game.user.result;
  }
  return {
    ...game,
    metrics: {
      [result]: {
        [metricField]: 1
      }
    }
  };
};

const setDateField = game => {
  game.date = new Date(game.end_time * 1000);
  return game;
};

const setUserAndOpponent = username => {
  return game => {
    game.white.username = game.white.username.toLowerCase();
    game.black.username = game.black.username.toLowerCase();
    if (game.white.username === username) {
      game["user"] = game.white;
      game["opponent"] = game.black;
      game.color = "white";
    } else {
      game["user"] = game.black;
      game["opponent"] = game.white;
      game.color = "black";
    }
    game.detailedResult = game["user"].result;
    delete game.white;
    delete game.black;
    return game;
  };
};

const isValidGame = lastInsert => {
  return game => {
    return game.end_time > lastInsert && game.rated === true;
  };
};

const processGamesResponse = ({ body }) => {
  return JSON.parse(body)["games"];
};

const save = (documents, model) => {
  return model.bulkWrite(documents);
};

module.exports.runImport = runImport;
