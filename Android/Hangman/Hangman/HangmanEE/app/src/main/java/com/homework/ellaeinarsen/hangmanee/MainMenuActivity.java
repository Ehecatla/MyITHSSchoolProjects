package com.homework.ellaeinarsen.hangmanee;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

/**
 * Class MainMenuActivity is used as starting point of Hangman game application.
 * @author Ella Einarsen
 * @version 1.0
 */
public class MainMenuActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_menu);

        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setIcon(R.mipmap.ic_launcher);
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
            showAboutActivity();
            return true;
        }
        if(id== R.id.action_play){
            showGameActivity();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    /**
     * Starts new game when menu button play is clicked by invoking showGameActivity method.
     * @param view is parameter passed on when respective play button is clicked
     */
    public void startGame(View view) {
        showGameActivity();
    }

    /**
     * Starts about activity showing game information by invoking showAboutActivity method.
     * @param view is parameter passed on when respective button is clicked
     */
    public void startAbout(View view) {
        showAboutActivity();
    }

    /**
     * Method showAboutActivity starts activity AboutActivity.
     */
    private void showAboutActivity(){
        Intent activityAbout = new Intent(this, AboutActivity.class);
        startActivity(activityAbout);
    }

    /**
     * Method showGameActivity starts activity GameActivity.
     */
    private void showGameActivity(){
        Intent i = new Intent(this, GameActivity.class);
        startActivity(i);
    }

}
