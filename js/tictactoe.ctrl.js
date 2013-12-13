function TicTacToeCtrl($scope) {

    var SIZE = 3;
    var EMPTY = ' ';
    var HUMAN = 'O';
    var COMPUTER = 'X';
    $scope.board = [];
    for(var i = 0; i<SIZE; i++) {
        $scope.board.push(new Array(SIZE+1).join(EMPTY).split(''));
    }

    function Board(board) {
        this.board = board;

        this.getSuccessors = function(player) {
            var successors = [];
            var flat = _.flatten(board);
            for(var i = 0; i<flat.length; ++i) {
                if (flat[i] === EMPTY) {
                    var newBoard = _.map(board, function(row) {
                        return _.clone(row);
                    });
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
        var maxes = [];
        _.forEach(successors, function(state) {
            var value = minValue(state, -Infinity, Infinity);
            if (value > max) {
                maxes = [state];
                max = value;
            } else if (value === max) {
                maxes.push(state);
            }
        });
        if (max === 1)
            console.log("Bro, jeg har vunnet as");
        return maxes[_.random(0, maxes.length-1)];
    }

    function maxValue(state, alpha, beta) {
        if (state.isWinner(COMPUTER)) {
            return 1;
        }
        if (state.isWinner(HUMAN)) {
            return -1;
        }
        var successors = state.getSuccessors(COMPUTER);
        if (successors.length == 0)
            return 0;
        for(var i = 0; i<successors.length; i++) {
            var state = successors[i];
            alpha = Math.max(alpha, minValue(state, alpha, beta));
            if (beta <= alpha)
                break;
        }
        return alpha;
    }

    function minValue(state, alpha, beta) {
        if (state.isWinner(COMPUTER)) {
            return 1;
        }
        if (state.isWinner(HUMAN)) {
            return -1;
        }
        var successors = state.getSuccessors(HUMAN);
        if (successors.length == 0)
            return 0;
        for(var i = 0; i<successors.length; i++) {
            var state = successors[i];
            beta = Math.min(beta, maxValue(state, alpha, beta));
            if (beta <= alpha)
                break;
        }
        return beta;
    }
    $scope.board = minimax(new Board($scope.board)).board;

    $scope.markCell = function(row, col) {
        $scope.board[row][col] = HUMAN;
        $scope.board = minimax(new Board($scope.board)).board;
    }
}