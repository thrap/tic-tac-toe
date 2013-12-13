function TicTacToeCtrl($scope) {

    var SIZE = 3;
    var EMPTY = ' ';
    var HUMAN = 'O';
    var COMPUTER = 'X';
    $scope.board = [];
    for(var i = 0; i<SIZE; i++) {
        $scope.board.push(new Array(SIZE+1).join(EMPTY).split(''));
    }

    var a = 0;
    function Board(board) {
        this.board = board;
        if (++a % 1000 === 0) {
            console.log(a);
        }

        this.getSuccessors = function(player) {
            var successors = [];
            var flat = _.flatten(board);
            for(var i = 0; i<flat.length; ++i) {
                if (flat[i] === EMPTY) {
                    var newBoard = _.map(board, function(row) {return _.clone(row);});
                    newBoard[Math.floor(i/SIZE)][i%SIZE] = player;
                    successors.push(new Board(newBoard));
                }
            }
            return successors;
        };

        this.isWinner = function(player) {
            for(var i = 0; i<SIZE; i++) {
                if (board[i][0] === player && board[i][1] === player && board[i][2] === player)
                    return true;
                if (board[0][i] === player && board[1][i] === player && board[2][i] === player)
                    return true;
            }
            if (board[0][0] === player && board[1][1] === player && board[2][2] === player)
                return true;

            if (board[2][0] === player && board[1][1] === player && board[0][2] === player)
                return true;
            return false;
        };
    }

    function minimax(state) {
        var successors = state.getSuccessors(COMPUTER);

        var max = -Infinity;
        var best = [];
        _.forEach(successors, function(state) {
            var value = state.isWinner(COMPUTER) ? Infinity : minValue(state, -Infinity, Infinity);
            if (value > max) {
                best = [state];
                max = value;
            } else if (value === max) {
                best.push(state);
            }
        });
        if (max === 1)
            console.log("Jeg vinner denne as bro");
        return best[_.random(0, best.length-1)];
    }

    var maxMemoize = {};
    function maxValue(state, alpha, beta) {
        if (state.isWinner(COMPUTER)) {
            return 1;
        }
        if (state.isWinner(HUMAN)) {
            return -1;
        }
        var memo = _.flatten(state.board).join(',');
        if (maxMemoize[memo])
            return maxMemoize[memo];
        var successors = state.getSuccessors(COMPUTER);
        if (successors.length == 0)
            return 0;
        for(var i = 0; i<successors.length; i++) {
            var state = successors[i];
            alpha = Math.max(alpha, minValue(state, alpha, beta));
            if (beta <= alpha)
                break;
        }
        maxMemoize[memo] = alpha;
        return alpha;
    }

    var minMemoize = {};
    function minValue(state, alpha, beta) {
        if (state.isWinner(COMPUTER)) {
            return 1;
        }
        if (state.isWinner(HUMAN)) {
            return -1;
        }
        var memo = _.flatten(state.board).join(',');
        if (minMemoize[memo])
            return minMemoize[memo];
        var successors = state.getSuccessors(HUMAN);
        if (successors.length == 0)
            return 0;
        for(var i = 0; i<successors.length; i++) {
            var state = successors[i];
            beta = Math.min(beta, maxValue(state, alpha, beta));
            if (beta <= alpha)
                break;
        }
        minMemoize[memo] = beta;
        return beta;
    }

    $scope.markCell = function(row, col) {
        if ($scope.gameOver)
            return;
        $scope.board[row][col] = HUMAN;
        var newBoard = minimax(new Board($scope.board));
        $scope.gameOver = !newBoard || newBoard.isWinner(COMPUTER);
        $scope.draw = !newBoard || _.flatten(newBoard).filter(function(num){ return num === EMPTY}).length === 0;
        if (!!newBoard) {
            $scope.lost = newBoard.isWinner(COMPUTER);
            $scope.board = newBoard.board;
        }
    };

    $scope.gameOver = false;
    if (Math.random() > 0.5) {
        $scope.board = minimax(new Board($scope.board)).board;
    }
    console.log(a);

}