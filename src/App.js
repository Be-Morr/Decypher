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
  border: 2px solid  ${(props) =>
    props.isCorrect === true
      ? "#5DD39E"
      : props.isCorrect === false
      ? "#DE8F6E"
      : "#5A5353"};
  border-radius: 1px
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;
const SpaceGap = styled.div`
  width: 10px;
  height: 5px;
  display: flex;
`;
const NumberHint = styled.div`
  font-size: 15px;
  color: #5a5353;
  text-align: center;
  margin-top: 2px;
`;
const MyApp = () => {
  //
  const [selectedString, setSelectedString] = useState("");
  const [userInputs, setUserInputs] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [pairs, setPairs] = useState([]);

  // Generates a random string
  const getRandomString = () => {
    const randomIndex = Math.floor(Math.random() * listOfStrings.length);
    setSelectedString(listOfStrings[randomIndex]);
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
  //Gets a new random string  and generates a cypher at refresh. Start Game button or restart would be nice.
  useEffect(() => {
    getRandomString();
    generatePairs();
  }, []);

  //Check if there is an input, makes an array of inputs and checks against phrase. Add Backspace support
  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
    const newResults = [...matchResults];
    newResults[index] =
      value.toUpperCase() === selectedString[index].toUpperCase();
    setMatchResults(newResults);
  };

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
      </Container>
    </div>
  );
};
export default MyApp;

const listOfStrings = [
  "Hello World!",
  "Look Ma I am a puzzle",
  "Follow the clues",
  "Double letters and two letter words",
];
