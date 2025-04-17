import React, { useState, useEffect, useRef, useCallback } from "react";
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
  gap: 40px;
  margin-top: 20px;
  margin-bottom 20px;
  
`;
const WordContainer = styled.div`
display: flex;
flex-wrap: wrap;
gap: 10px;
justify-content: center;
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
const PunctuationBox = styled.div`
  width: 40px;
  height: 40px;
  border: none
  color: #2ea8d0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
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

// TODO:
// Remove focus it isn't how people solve puzzle,
// Reveal punctuation & Clean-up CSS
// onKeyDown?
// Ability to change difficulty
// Hint Button
// Improve Win Screen, Quote origin?

const MyApp = () => {
  //
  const [selectedString, setSelectedString] = useState("");
  const [userInputs, setUserInputs] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [usedNumberTries, setUsedNumberTries] = useState(0);
  const inputRefs = useRef([]);
  // const [challenge, setChallenge] = useState(0);

  // Generates a random string
  const getRandomString = () => {
    const randomIndex = Math.floor(Math.random() * listOfStrings.length);
    setSelectedString(listOfStrings[randomIndex]);
  };
  const revealRandomTiles = useCallback((stringToReveal) => {
    const actualCharacters = stringToReveal.replace(/\s/g, "");
    const tilesToReveal = Math.floor(actualCharacters.length * difficulty);
    const newInputs = [];
    const newResults = [];
    const validChar = [];

    for (let i = 0; i < stringToReveal.length; i++) {
      if (!letterChecker(stringToReveal[i])) {
        newInputs[i] = stringToReveal[i];
        newResults[i] = true;
      }
    }

    for (let i = 0; i < stringToReveal.length; i++) {
      if (stringToReveal[i] !== " " && letterChecker(stringToReveal[i])) {
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
  },[]);
  //Gets a new random string, generates a cypher, and sets the focus reference at refresh.
  useEffect(() => {
    getRandomString();
    generatePairs();
    setUserInputs([]);
    setMatchResults([]);
    setUsedNumberTries(0);
    setTimeout(() => revealRandomTiles(selectedString), 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Restart Button
  const resetGame = useCallback(() => {
    // Clear existing inputs
    getRandomString();
    generatePairs();
    setUserInputs([]);
    setMatchResults([]);
    setUsedNumberTries(0);
    revealRandomTiles(selectedString);
  },[revealRandomTiles, selectedString])

  // Set the number of fails and the amount revealed. Should go in a function so that we can set it.
  const numberOfTries = 4;
  const difficulty = 0.25;

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
  const letterChecker = (char) => {
    return /[a-zA-Z]/.test(char);
  };

  // Randomly Reveal Tiles. Add function to change difficulty.


  //Check if there is an input, makes an array of inputs and checks against phrase. Add Backspace support
  const handleInputChange = (index, value,) => {
 
    if (
      value.toUpperCase() !== selectedString[index].toUpperCase() &&
      value !== ""
    ) {
      if (usedNumberTries < numberOfTries + 1) {
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
    // if (value && index < selectedString.length - 1) {
    //   inputRefs.current[index + 1].focus();
    // }
  };

  // const onKeyDown = (event, index) => {
  //   if (event.key === "Backspace") {
  //     inputRefs.current[index - 1].focus();
  //   }
  // };

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

  // Take the selected string and split it into words, sets up an index of the words. Splits each word by character and indexes it, adds to index as long as the word isn't the last in the string.
  const renderWords = () => {
    const words = selectedString.split(" ");
    let globalIndex = 0;
    return words.map((word, wordIndex) => {
      const wordChars = word.split("").map((char, charIndex) => {
        const currentIndex = globalIndex;
        globalIndex++;
        return { char, index: currentIndex, notAChar: !letterChecker(char) };
      });
      if (wordIndex < words.length - 1) {
        globalIndex++;
      }
      return (
        <WordContainer key={wordIndex}>
          {wordChars.map(({ char, index, notAChar }) => (
            <BoxWrapper key={index}>
              {notAChar ? (
                <PunctuationBox>{userInputs[index] || ""}</PunctuationBox>
              ) : (
                <Box
                  type="text"
                  value={userInputs[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  isCorrect={matchResults[index]}
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              )}
              <NumberHint>
                {getLetterCypher(char) !== null ? getLetterCypher(char) : ""}
              </NumberHint>
            </BoxWrapper>
          ))}
        </WordContainer>
      );
    });
  };

  return (
    <div>
      <Header>
        <PageTitle>D_Cyph_r</PageTitle>
      </Header>
      <Container>
        <BoxesContainer>{renderWords()}</BoxesContainer>
        <Text allCorrect={allCorrect}>
          {allCorrect
            ? "All Correct, You Win!"
            : "Use the clues to uncover the message"}
        </Text>
        <ErrorCounter>
          {usedNumberTries > numberOfTries
            ? "GAME OVER"
            : `Mistakes remaining:  ${numberOfTries - usedNumberTries}`}
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
  // "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
  "Be yourself; everyone else is already taken.",
  // "As he read, I fell in love the way you fall asleep: slowly, and then all at once.",
  // "I love deadlines. I love the whooshing noise they make as they go by.",
  // "If you can't explain it to a six year old, you don't understand it yourself.",
  // "All you need is love. But a little chocolate now and then doesn't hurt.",
  // "Logic will get you from A to Z; imagination will get you everywhere.",
];
