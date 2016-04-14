package com.homework.ellaeinarsen.hangmanee;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

/**
 *  Class GameActivity is used to play Hangman game.
 *  @author Ella Einarsen
 *  @version 1.0
 */
public class GameActivity extends AppCompatActivity {

    private Hangman game;
    private TextView hiddenWordView;
    private TextView attemptsView;
    private TextView wrongGuessedView;
    private EditText guessInputField;
    private ImageView gamePictureView;
    private Button guessButton;

    /**
     *Variable HANGMAN_STATE is used by SharedPreferences to create a reference file.
     */
   public static final String HANGMAN_STATE="hangman_state";
   private static SharedPreferences sh;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_game);

        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setIcon(R.mipmap.ic_launcher);
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.back_to_menu_24dp);


        sh = getSharedPreferences(HANGMAN_STATE, MODE_PRIVATE);

        game = new Hangman();
        game.loadGameState(sh);                                                                     //if there is game data saved it will be loaded on object

        gamePictureView = (ImageView) findViewById(R.id.game_picture);
        guessInputField = (EditText) findViewById(R.id.game_input);
        guessButton = (Button) findViewById(R.id.game_button_1);
        attemptsView = (TextView) findViewById(R.id.game_attempts_2);
        wrongGuessedView = (TextView) findViewById(R.id.game_letters_used_2);
        hiddenWordView = (TextView) findViewById(R.id.game_word);

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        getMenuInflater().inflate(R.menu.actionbar_menu, menu);

        MenuItem i1 = menu.findItem(R.id.action_play);      //finding menu button to change
        i1.setVisible(false);                               //making app bars play button hide
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item){
        int id = item.getItemId();
        if(id== R.id.action_about){
            Intent intent = new Intent(this, AboutActivity.class);
            startActivity(intent);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onStart(){
        super.onStart();
        updateGameWindow();                                                                         //sets all window elements to show game state

    }

    /**
     * Listener method startOnGuessButtonClicked is activated when guess button in corresponding
     * GameActivity layout file is clicked.
     * @param view is passed View on button click
     */
    public void startOnGuessButtonClicked(View view) {
        playGame();
    }

    /**
     * Method playGame handles a single Hangman game by controlling game result, starting a game
     * round and resetting input field in layout file. Game result is controlled twice to ensure
     * that game cannot be played when it is already decided (lost or won).
     */
    protected void playGame(){

        controlGameResult();
        playOneRound(guessInputField.getText().toString());
        guessInputField.setText("");
        controlGameResult();

    }

    /**
     * Method updateGameWindow updates activity_game with the chosen game data that is the picture
     * , hidden word, letters that have been used and are not part of the game word and number of
     * tries remaining in the game.
     */
    protected void updateGameWindow(){
        gamePictureView.setImageResource(getResources().getIdentifier(("hangman"
                + game.getTries()), "drawable", getPackageName()));
        hiddenWordView.setText(game.getHiddenWord());
        attemptsView.setText(String.valueOf(game.getTries()));
        wrongGuessedView.setText(game.getWrongLetters());

    }

    /**
     * Method controlGameResult is used by playGame method to control if game is won, lost or still
     * ongoing. If game has been lost or won then this method starts result activity, sends game
     * result information in intent to it and calls method that resets game. Afterwards a finish is
     * called that destroys game activity as it is not supposed to continue playing when game is
     * finished.
     */
   protected void controlGameResult(){
        if (game.hasLost()|| game.hasWon()) {
            Intent resultIntent = new Intent(this, ResultActivity.class);
            if (game.hasWon()){
                resultIntent.putExtra(ResultActivity.GAME_RESULT, true);
            } else {
                resultIntent.putExtra(ResultActivity.GAME_RESULT, false);
            }
            int i = game.getTries();
            resultIntent.putExtra(ResultActivity.GAME_TRIES, i);
            resultIntent.putExtra(ResultActivity.GAME_WORD, game.getGameWord());
            startActivity(resultIntent);
            game.chooseRandomWord();
            finish();
        }
   }

    /**
     * Method playOneRound is used by playGame method to play one round of Hangman which corresponds
     * to choosing a letter and having it checked. This method checks given character and
     * checks if it is letter or not, if it has already been used correctly or incorrectly and if
     * character is shown unused and right type of input (a letter) then a check is made if that
     * letter occurs in game word or not. Game is updated with result and either player looses a try
     * or if letter has been correctly guessed, then hidden word is updated.
     * @param guess is character to be checked during a Hangman game round
     */
    protected void playOneRound(String guess){ // should I use private???
        if(guess.equals("")){
            showToastMessage(getResources().getText(R.string.wrong_input_m_1).toString());
        } else if (guess.length()>1){
            showToastMessage(getResources().getText(R.string.wrong_input_m_2).toString());
        } else {
            char letter = guess.charAt(0);
            if ( (letter>='a' && letter<='z') || (letter>='A' && letter<='Z') ){
                if (game.hasUsedLetter(letter)){
                    showToastMessage(getResources().getText(R.string.wrong_input_m_3).toString());
                } else {
                    game.makeAGuess(letter);
                    updateGameWindow();
                }
            } else {
                showToastMessage(getResources().getText(R.string.wrong_input_m_4).toString());
            }
        }

    }

    /**
     * Method showToastMessage takes a string input that is a message to be displayed and displays
     * a toast message with that input.
     * @param message to be shown in toast message
     */
    protected void showToastMessage(String message){
        Toast.makeText(getApplicationContext(),message,Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onStop(){
        super.onStop();
        game.saveGameState(sh);
    }


}
