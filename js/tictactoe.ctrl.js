function TicTacToeCtrl($scope) {
    var SIZE = 3;
    var EMPTY = ' ';
    $scope.board = new Array(SIZE*SIZE+1).join(EMPTY).split('');
    $scope.board[0] = 1;
    $scope.board[1] = 1;
    $scope.board[2] = 2;


    function Board(board) {
        this.board = board;

        this.getSuccessors = function(player) {
            var successors = [];
            for(var i = 0; i<board.length; ++i) {
                if (board[i] === EMPTY) {
                    var newBoard = _.clone(board);
                    newBoard[i] = player;
                    successors.push(new Board(newBoard));
                }
            }
            return successors;
        };

        this.isWinner = function(player) {
            for(var i = 0; i<SIZE; i++) {
                if (board[i*SIZE] === player && board[i*SIZE + 1] === player && board[i*SIZE + 2] === player)
                    return true;
                if (board[i] === player && board[i + SIZE] === player && board[i + 2*SIZE] === player)
                    return true;
            }
            if (board[0] === player && board[SIZE+1] === player && board[2*SIZE+2] === player)
                return true;

            if (board[2] === player && board[SIZE+1] === player && board[2*SIZE] === player)
                return true;
            return false;
        };
    }

    function minimax(state) {
        var successors = state.getSuccessors(2);

        var max = -Infinity;
        var maxes = [];
        _.forEach(successors, function(state) {
            var value = minValue(state, -Infinity, Infinity);
            if (value > max) {
                maxes = [state];
                console.log(value);
                console.log(state.board);
            } else if (value === max) {
                maxes.push(state);
            }
        });
        return maxes[_.random(0, maxes.length-1)];
    }

    function maxValue(state, alpha, beta) {
        if (state.isWinner(2)) {
            return 1;
        }
        if (state.isWinner(1)) {
            return -1;
        }
        var successors = state.getSuccessors(2);
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
        if (state.isWinner(2)) {
            return 1;
        }
        if (state.isWinner(1)) {
            return -1;
        }
        var successors = state.getSuccessors(1);
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
}