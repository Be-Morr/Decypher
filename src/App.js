import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Header = styled.header`
  background: #2ea8d0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px 0;
`;
const PageTitle = styled.h1`
  text-align: center: 
  font-weight: bold;
  font-size 20px;
  margin: 0, auto; 
`;
const Text = styled.h3`
text-align: center;
font size :15px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;
const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 2px;
`;
const BoxesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom 20px;
  
`;

const Box = styled.input`
  width: 40px;
  height: 40px;
  border: 2px solid ${(props) => (props.isCorrect ? "#4C5760" : "#000000")};
  border-top: none;
  border-left: none;
  border-right: none;
  color: ${(props) => (props.isCorrect ? "#2ea8d0" : "#941B0C")};
  border-radius: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
`;
const SpaceGap = styled.div`
  width: 20px;
  height: 5px;
  display: flex;
`;
const NumberHint = styled.div`
  font-size: 15px;
  color: #5a5353;
  text-align: center;
  margin-top: 2px;
`;
const ErrorCounter = styled.h3`
text-align: left;
font size: 15px;
text-color: Red
`;

const RestartButton = styled.button`
  background-color: #2ea8d0;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;

  &:hover {
    background-color: #1c8eb3;
  }
`;

const MyApp = () => {
  //
  const [selectedString, setSelectedString] = useState("");
  const [userInputs, setUserInputs] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [usedNumberTries, setUsedNumberTries] = useState(0);
  const inputRefs = useRef([]);
  // const [challange, setChallenge] = useState(0);

  // Generates a random string
  const getRandomString = () => {
    const randomIndex = Math.floor(Math.random() * listOfStrings.length);
    setSelectedString(listOfStrings[randomIndex]);
  };

  //Restart Button
  const resetGame = () => {
    setUserInputs([]);
    setMatchResults([]);
    setUsedNumberTries(0);
    getRandomString();
    generatePairs();
  };

  // Generates 2 arrays with numbers and letters, shuffles them and then pairs them up.
  const generatePairs = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const numbers = [];
    for (let i = 0; i < 26; i++) {
      numbers.push(i);
    }

    const shuffledNumbers = [...numbers];
    for (let i = shuffledNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledNumbers[i], shuffledNumbers[j]] = [
        shuffledNumbers[j],
        shuffledNumbers[i],
      ];
    }
    const newPairs = alphabet.map((letter, index) => ({
      letter,
      number: shuffledNumbers[index],
    }));
    setPairs(newPairs);
  };

  // Randomly Reveal Tiles
  const revealRandomTiles = (stringToReveal) => {
    const actualCharacters = stringToReveal.replace(/\s/g, "");
    const tilesToReveal = Math.ceil(actualCharacters.length * 0.4);

    const newInputs = [...userInputs];
    const newResults = [...matchResults];

    const validChar = [];
    for (let i = 0; i < stringToReveal.length; i++) {
      if (stringToReveal[i] !== " ") {
        validChar.push(i);
      }
    }

    for (let i = validChar.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [validChar[i], validChar[j]] = [validChar[j], validChar[i]];
    }

    for (let i = 0; i < tilesToReveal; i++) {
      if (i < validChar.length) {
        const index = validChar[i];
        newInputs[index] = stringToReveal[index];
        newResults[index] = true;
      }
    }

    setUserInputs(newInputs);
    setMatchResults(newResults);
  };

  //Gets a new random string, generates a cypher, and sets the focus reference at refresh.
  useEffect(() => {
    getRandomString();
    generatePairs();
    inputRefs.current = Array(selectedString.length)
      .fill()
      .map((_, i) => inputRefs.current[i] || React.createRef());

    setUserInputs([]);
    setMatchResults([]);
    setTimeout(() => revealRandomTiles(selectedString), 200);
  }, [selectedString]);

  //Check if there is an input, makes an array of inputs and checks against phrase. Add Backspace support
  const handleInputChange = (index, value,) => {
 
    if (
      value.toUpperCase() !== selectedString[index].toUpperCase() &&
      value.key !== "Backspace"
    ) {
      if (usedNumberTries < 10) {
        setUsedNumberTries(usedNumberTries + 1);
      } else {
        return;
      }
    }

    if (value.length > 1) {
      return;
    }
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
    const newResults = [...matchResults];
    newResults[index] =
      value.toUpperCase() === selectedString[index].toUpperCase();
    setMatchResults(newResults);
    // Currently broken
    if (value && index < selectedString.length - 1) {
      inputRefs.current[index + 1].focus();
    // }
  };
const onKeyDown = (event, index) => {
  if (event.key === "Backspace"){
    inputRefs.current[index-1].focus();
  }
}
  // Checking if the string is solved. Accounts for spaces,  Need to account of punctuation.
  const actualCharacters = selectedString.replace(/\s/g, "").length;
  const correctAnswers = matchResults.filter(
    (result, index) => selectedString[index] !== " " && result === true
  ).length;
  const allCorrect =
    correctAnswers === actualCharacters && actualCharacters > 0;

  const getLetterCypher = (letter) => {
    const pair = pairs.find((p) => p.letter === letter.toUpperCase());
    return pair ? pair.number : null;
  };
  // Boxes shouldnt seperate mid word
  return (
    <div>
      <Header>
        <PageTitle>D_Cyph_r</PageTitle>
      </Header>
      <Container>
        <BoxesContainer>
          {selectedString.split("").map((char, index) =>
            char === " " ? (
              <SpaceGap key={`space-${index}`} />
            ) : (
              <BoxWrapper key={index}>
                <Box
                  type="text"
                  value={userInputs[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  isCorrect={matchResults[index]}
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
                <NumberHint>
                  {getLetterCypher(char) !== null ? getLetterCypher(char) : ""}
                </NumberHint>
              </BoxWrapper>
            )
          )}
        </BoxesContainer>
        <Text allCorrect={allCorrect}>
          {allCorrect
            ? "All Correct, You Win!"
            : "Use the clues to uncover the message"}
        </Text>
        <ErrorCounter>
          Mistakes remaining: {10 - usedNumberTries}
        </ErrorCounter>
        <RestartButton onClick={resetGame}>
          {allCorrect ? "Play Again!" : "Reset Game"}
        </RestartButton>
      </Container>
    </div>
  );
};
export default MyApp;

const listOfStrings = [
  "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best. World!",
  "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
  "You've gotta dance like there's nobody watching,Love like you'll never be hurt,Sing like there's nobody listening,And live like it's heaven on earth.",
  "You know you're in love when you can't fall asleep because reality is finally better than your dreams.",
];
