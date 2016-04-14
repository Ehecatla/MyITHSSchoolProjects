package com.homework.ellaeinarsen.hangmanee;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

/**
 * Class ResultActivity shows result of Hangman game and activates when a Hangman game was finished.
 * @author Ella Einarsen
 * @version 1.0
 */
public class ResultActivity extends AppCompatActivity {

    /**
     * Variable GAME_RESULT is key used to pass result of Hangman game in a GameActivity intent
     * key-value pair.
     */
    public static final String GAME_RESULT="game result";

    /**
     * Variable GAME_WORD is key used to pass game word in Hangman game to be used as part of
     * key-value pair in an intent from GameActivity.
     */
    public static final String GAME_WORD="game word";

    /**
     * Variable GAME_TRIES is key to pass tries remaining after finished Hangman game. The variable
     * is used as part of key-value pair passed by an intent from GameActivity.
     */
    public static final String GAME_TRIES=" game tries remaining";

    private TextView resultTV;
    private TextView gameWordTV;
    private TextView triesLeftTV;
    private ImageView resultPictureTV;
    private boolean result;
    private int triesLeft;
    private String gameWord;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_result);

        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setIcon(R.mipmap.ic_launcher);
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.back_to_menu_24dp);                   // sets the back to menu button icon

        resultTV = (TextView) findViewById(R.id.result_title);
        gameWordTV = (TextView) findViewById(R.id.result_word_2);
        triesLeftTV = (TextView) findViewById(R.id.result_tries_2);
        resultPictureTV = (ImageView) findViewById(R.id.result_picture);
        Intent intent = getIntent();
        result = intent.getExtras().getBoolean(GAME_RESULT, false);
        triesLeft = intent.getExtras().getInt(GAME_TRIES, 10);
        gameWord = intent.getExtras().getString(GAME_WORD, "word is hidden");

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        getMenuInflater().inflate(R.menu.actionbar_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item){
        int id = item.getItemId();
        if(id== R.id.action_about){
            Intent i1 = new Intent(this, AboutActivity.class);
            startActivity(i1);
            return true;
        }
        if(id== R.id.action_play){
            Intent i1 = new Intent(this, GameActivity.class);
            startActivity(i1);
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onStart(){

        if(result){                                                                                 // display result title
            resultTV.setText(getResources().getText(R.string.win_message));
        } else {
            resultTV.setText(getResources().getText(R.string.lost_message));
        }

        gameWordTV.setText(gameWord);
        triesLeftTV.setText(String.valueOf(triesLeft));
        resultPictureTV.setImageResource(getResources().getIdentifier(("hangman"
                + triesLeft), "drawable", getPackageName()));

        SharedPreferences sh = getSharedPreferences(GameActivity.HANGMAN_STATE, MODE_PRIVATE);
        Hangman.removeSavedState(sh);                                                               // remove Hangman game save

        super.onStart();
    }

    /**
     * Method goToMainMenuActivated is activated when menu button is clicked. This listener method
     * takes View as parameter.
     * @param view is View passed on when menu button is clicked
     */
    public void goToMainMenuActivated(View view) {
        Intent i = new Intent(this, MainMenuActivity.class);
        startActivity(i);
        finish();
    }


}
