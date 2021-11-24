//import react 
import React from 'react';
import ReactDOM from 'react-dom';
//import css file
import './index.css';

//square is a react function component, components that only contain a render method and don't have their own state (state of each square is observed by the game component)
function Square(props) {
    //rendered html goes in here
    return(
        //takes on the onClick method of the parameter passed as props
        <button className="square" onClick={props.onClick}>
            {props.value /*squares[i] from renderSquare(i) in Board*/}
        </button>
    );
}

//board is a react component class that takes in parameters called props (short for "properties") and returns
//a hierarchy of views to display via the render method
class Board extends React.Component {
    renderSquare(i) {
        //html to render a square with value i
        return (
            <Square 
                value={this.props.squares[i] /*sets value to the square at index i*/}
                onClick={() => this.props.onClick(i) /*takes on the onClick method of that of props*/}
            />
        );
    }

    //render board
    render() {
        //html for board goes in here
        //render 3 rows with 3 squares each
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

//Game is a react component class that takes in parameters called props (short for "properties") and returns
//a hierarchy of views to display via the render method
class Game extends React.Component {
    //constructor allows us to define and later modify state
    constructor(props) {
        //constructor of a react component must start with super(props)
        super(props);
        
        //initialize state
        this.state = {
            history: [{
                squares: Array(9).fill(null) //history is an array of 9 squares
            }],
            stepNumber: 0, //stepNumber is default to 0
            xIsNext: true //x goes first
        }
    }

    //handle click of square i
    handleClick(i) {
        //copies moves from 0 to stepNumber + 1 to history, ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future"
        //history that would now become in correct
        const history = this.state.history.slice(0, this.state.stepNumber + 1);

        //current move
        const current = history[history.length - 1];

        //copy squares array
        const squares = current.squares.slice();

        //return early (ignore the click) if there is already a winner or if squares[i] is not null
        //prevents changing the state of a square that's already been filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        //set the square at index i to X or O depending on who's turn it is
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        //update the state of the game
        this.setState({
            //concatenate new history entries onto history (concat() doesn't mutate the original array)
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length, //updates stepNumber to ensure we don't get stuck showing the same move after a new one has been made
            xIsNext: !this.state.xIsNext //change next player
        });
    }

    //jump to step
    jumpTo(step) {
        //update state of the game
        this.setState({
            stepNumber: step, //set stepNumber to step
            xIsNext: (step % 2) === 0, //xIsNext if step is even
        });
    }

    //render the game
    render() {
        const history = this.state.history; //get current state of history
        const current = history[this.state.stepNumber]; //render the currently selected move according to stepNumber
        const winner = calculateWinner(current.squares); //get winner

        //map history of moves to react elements representing buttons on the screen
        const moves = history.map((step, move) => {
            //desc of button is 'go to game start' if move is 0 (i.e. read as false) otherwise desc is 'go to move #' + move
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            //display a list of buttons to "jump" to past moves
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })

        //update status
        let status;
        if (winner) {
            status = 'Winner:' + winner; //display winner if there is one
        } else {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O'); //display next player, X if xIsNext is true or O if xIsNext is false
        }

        //display the game
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares /*display the current state of the squares*/}
                        onClick={(i) => this.handleClick(i) /*call handleClick(i) when the i square is clicked*/}
                    />
                </div>
                <div className="game-info">
                    <div>{status /*display status*/}</div>
                    <ol>{moves /*display list of moves*/}</ol>
                </div>
            </div>
        );
    }
}

// ==================================

//render the game react element into the root DOM node
//even though there is no html file for this application, if there was, this is what it would look like:
//<div id="root"></div>
//you usually just have a single root DOM node that contains your web application, but you could have as
//many isolated root DOM nodes as you like, just change the id when calling render on ReactDOM
ReactDOM.render(<Game />, document.getElementById("root"));

//helper method to calculate winner, takes an array of squares
function calculateWinner(squares) {
    //array of each possible winning "line" in the board
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    //loop through winning lines
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]; //return winner
        }
    }

    //return null if there is no winner
    return null;
}
