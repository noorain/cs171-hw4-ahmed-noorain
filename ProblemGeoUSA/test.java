package game;

import java.util.Scanner;

public class game {
	public static Scanner in = new Scanner(System.in);
	public static int[][] Board = new int[3][3];
	public static boolean WINNER_FOUND = false;
	public static int current_player = 0;
	public static boolean game_winner = false;
	public static boolean is_draw = false;
	public static void main(String[] args) {	
		System.out.println(
			"Welcome to Tic Tac Toe Game, Player one is human(x), Player 2 is Comp(o).");

		// InitializeBoard();
		PrintBoard();
		current_player = 1;
		do {
			if (current_player == 1)
				PromptInputandSet(current_player);
			else
				ComputerPromptInputandSet(current_player);
			System.out.println("Begin Checking Board");
			game_winner = CheckWinner(current_player);
			if (game_winner == true && is_draw == false) {
				System.out.println("Congrats Player " + current_player);
				System.exit(0);
			}
			if (is_draw == true){
				System.out.println("Its a Draw,Play Again.");
				System.exit(0);
			}
			// Switch Player
			if (current_player == 1)
				current_player = 2;
			else if (current_player == 2)
				current_player = 1;
		} while (WINNER_FOUND != true);
	}

private static void ComputerPromptInputandSet(int current_player2) {
// First check possiblity to win self
// Second check possibility for human to win, whch means block
// Thirdly, randomly pick a location
	System.out.println("Computers Chance");
	int possible_row = -1;
	int possible_col = -1;
	int col_correctness = 0;
	int row_correctness = 0;
	int i;
	int j;
	int opp_current_player = 1;
	for (i = 0; i < 3; i++) {
		row_correctness = 0;
		for (j = 0; j < 3; j++) {
			System.out.println(
				"Is this 1? Board[i][j]:" + i + "," + j
				+ "," + Board[i][j]);
			if (Board[i][j] != opp_current_player) {
				System.out.println(
					"No but it is marked as yes:"
					+ row_correctness);
				possible_row = i;
				possible_col = j;
			}
			else {
				row_correctness++;
			}
		}
		System.out.println("Final row_correctness:" + row_correctness);
if (row_correctness == 2
	&& Board[possible_row][possible_col] != current_player2) {
	System.out.println("CompMove:Row to block Human");
	UpdateBoard(possible_row, possible_col, current_player2);
	return;
	}
}

System.out.println("DoneHumanrowcheck");
possible_row = -1;
possible_col = -1;
for (i = 0; i < 3; i++) {
	col_correctness = 0;
	for (j = 0; j < 3; j++) {
		if (Board[j][i] != opp_current_player) {
			possible_row = j;
			possible_col = i;
		}else {
			col_correctness++;
		}
	}

if (col_correctness == 2
	&& Board[possible_row][possible_col] != current_player2) {
	System.out.println("CompMove:Column to block Human");
	UpdateBoard(possible_row, possible_col, current_player2);
	return;
}
}
System.out.println("DoneHumanColcheck");

// CHECK LEFT TO RIGHT DIAGONAL

int left_diagonal_count = 0;
if (Board[0][0] == opp_current_player)
	left_diagonal_count++;
else
{
	System.out.println("possible p0");
	possible_row = 0;
	possible_col = 0;
}

if (Board[1][1] == opp_current_player)
	left_diagonal_count++;
else{
	System.out.println("possible p1");
	possible_row = 1;
	possible_col = 1;
}

if (Board[2][2] == opp_current_player)
	left_diagonal_count++;
else{

System.out.println("possible p2");

possible_row = 2;

possible_col = 2;

}

if (left_diagonal_count == 2
&& Board[possible_row][possible_col] != current_player2) {

System.out.println("***CompMove:Left Diagonal to block Human");

UpdateBoard(possible_row, possible_col, current_player2);

// System.exit(0);

return;

}

// CHECK RIGHT TO LEFT DIAGONAL

int right_diagonal_count = 0;

if (Board[2][0] == opp_current_player)

right_diagonal_count++;

else

{

possible_row = 2;

possible_col = 0;

}

if (Board[1][1] == opp_current_player)

right_diagonal_count++;

else

{

possible_row = 1;

possible_col = 1;

}

if (Board[0][2] == opp_current_player)

right_diagonal_count++;

else

{

possible_row = 0;

possible_col = 2;

}

if (right_diagonal_count == 2
&& Board[possible_row][possible_col] != current_player2) {

System.out.println("CompMove:Right Diagonal to block Human");

UpdateBoard(possible_row, possible_col, current_player2);

return;

}

// /SLEF

row_correctness = 0;

// int i; int j ;

for (i = 0; i < 3; i++) {

// possible_row_win = true;

for (j = 0; j < 3; j++) {

// System.out.println("Board[i][j]:" + Board[i][j]);

if (Board[i][j] != current_player) {

// System.out.println("Board[i][j]:" + Board[i][j]+
// "didnt match" + current_player);

// row_check = false;

possible_row = i;

possible_col = j;

}

else {

row_correctness++;

}

}

// System.out.println("J:" + j );

if (row_correctness == 2) {

System.out.println("CompMove:Row to Comp win");

UpdateBoard(possible_row, possible_col, current_player2);

return;

}

}

System.out.println("DoneSelfrowcheck");

// :::::COLUMN CHECK

possible_row = -1;

possible_col = -1;

col_correctness = 0;

// int i; int j ;

for (i = 0; i < 3; i++) {

// possible_row_win = true;

for (j = 0; j < 3; j++) {

// System.out.println("Board[i][j]:" + Board[i][j]);

if (Board[j][i] != current_player) {

// System.out.println("Board[i][j]:" + Board[i][j]+
// "didnt match" + current_player);

// row_check = false;

possible_row = j;

possible_col = i;

}

else {

col_correctness++;

}

}

// System.out.println("J:" + j );

if (col_correctness == 2) {

System.out.println("CompMove:Column to Comp win");

UpdateBoard(possible_row, possible_col, current_player2);

return;

}

}

System.out.println("DoneSelfcolumncheck");

// CHECK LEFT TO RIGHT DIAGONAL

left_diagonal_count = 0;

if (Board[0][0] == current_player2)

left_diagonal_count++;

else

{

possible_row = 0;

possible_col = 0;

}

if (Board[1][1] == current_player2)

left_diagonal_count++;

else

{

possible_row = 1;

possible_col = 1;

}

if (Board[2][2] == current_player2)

left_diagonal_count++;

else

{

possible_row = 2;

possible_col = 2;

}

if (left_diagonal_count == 2) {

System.out.println("CompMove:Left Diagonal to self score");

UpdateBoard(possible_row, possible_col, current_player2);

return;

}

// CHECK RIGHT TO LEFT DIAGONAL

right_diagonal_count = 0;

if (Board[2][0] == current_player2)

right_diagonal_count++;

else

{

possible_row = 2;

possible_col = 0;

}

if (Board[1][1] == current_player2)

right_diagonal_count++;

else

{

possible_row = 1;

possible_col = 1;

}

if (Board[0][2] == current_player2)

right_diagonal_count++;

else

{

possible_row = 0;

possible_col = 2;

}

if (right_diagonal_count == 2) {

System.out.println("CompMove:Right Diagonal to self score");

UpdateBoard(possible_row, possible_col, current_player2);

return;

}

// IF NO GOOD CHOICES:

for (i = 0; i < 3; i++) {

for (j = 0; j < 3; j++) {

if (Board[i][j] != 1 && Board[i][j] != 2) {

System.out.println("CompMove:Random Move");

UpdateBoard(i, j, current_player2);

return;

}

}

}

System.out.println("***** PLayer 2 didnt move*****");

}

private static boolean CheckWinner(int current_player) {

System.out.println("Check Winner");

// TODO Auto-generated method stub

// CHECK ROW

boolean row_check = true;

int i;
int j;

for (i = 0; i < 3; i++) {

row_check = true;

for (j = 0; j < 3; j++) {

// System.out.println("Board[i][j]:" + Board[i][j]);

if (Board[i][j] != current_player) {

// System.out.println("Board[i][j]:" + Board[i][j]+
// "didnt match" + current_player);

row_check = false;

}

}

// System.out.println("J:" + j );

if (row_check != false && j == 3) {// row strike

System.out.println("Row Strike");

WINNER_FOUND = true;

return true;

}

// System.out.println("Check Next row");

}

System.out.println("Done checking row");

// CHECK COLUMNS

for (i = 0; i < 3; i++) {

row_check = true;

for (j = 0; j < 3; j++) {

// System.out.println("Board[j][i]:" + j + "," + i + "," +
// Board[j][i]);

if (Board[j][i] != current_player) {

// System.out.println("Board[j][i]:" + Board[j][i]+
// "didnt match" + current_player);

row_check = false;

}

}

// System.out.println("J:" + j );

if (row_check != false) {// row strike

System.out.println("Column Strike");

WINNER_FOUND = true;

return true;

}

// System.out.println("Check Next row");

}

// CHECK LEFT TO RIGHT DIAGONAL

if (Board[0][0] == current_player && Board[1][1] == current_player
&& Board[2][2] == current_player) {

System.out.println("Left Diagonal Strike");

WINNER_FOUND = true;

return true;

}

// CHECK RIGHT TO LEFT DIAGONAL

if (Board[2][0] == current_player && Board[1][1] == current_player
&& Board[0][2] == current_player) {

System.out.println("Right Diagonal Strike");

WINNER_FOUND = true;

return true;

}

for (int row = 0; row < 3; row++) {

for (int col = 0; col < 3; col++) {

if (Board[row][col] != 1 || Board[row][col] != 2) { // empty
// cell
// available

return false; // an empty cell found, not draw, exit

}

}

if (row == 2)

is_draw = true;

return true;

}

System.out.println("Returning False");
return false;
}

private static void PromptInputandSet(int cp) {

// TODO Auto-generated method stub

System.out.print("Chance: Player " + cp
+ " , enter the row and col as number 1 to 3:");
boolean valid_entry = false;
do {
int row = in.nextInt() - 1; // array index starts at 0 instead of 1
int col = in.nextInt() - 1;
if (row >= 0 && row < 3 && col >= 0 && col < 3
&& Board[row][col] == 0) {
valid_entry = true;
UpdateBoard(row, col, cp);
} else {
System.out.print("Reenter Chance: Player " + cp
+ " , enter the row and col as number 1 to 3:");
}
} while (valid_entry == false);
}

private static void UpdateBoard(int row, int col, int cpr) {
// TODO Auto-generated method stub
if (cpr == 1)
Board[row][col] = 1;
if (cpr == 2)
Board[row][col] = 2;
PrintBoard();
}

private static void InitializeBoard() {
// TODO Auto-generated method stub
for (int i = 0; i < 3; i++) {
for (int j = 0; j < 3; j++) {
Board[i][j] = 0;
}
System.out.println();
}
}

private static void PrintBoard() {
// TODO Auto-generated method stub

for (int i = 0; i < 3; i++) {
for (int j = 0; j < 3; j++) {
if (Board[i][j] == 1)
System.out.print('x');
if (Board[i][j] == 2)
System.out.print('0');
if (Board[i][j] != 2 && Board[i][j] != 1)
System.out.print('-');
}
System.out.println();
}
}

}