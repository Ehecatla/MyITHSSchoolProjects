package com.homework.ellaeinarsen.hangmanee;


import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

/**
 * Class AboutActivity contains information about the Hangman game.
 * @author Ella Einarsen
 * @version 1.0
 */
public class AboutActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);

        getSupportActionBar().setDisplayShowHomeEnabled(true);                                      //change app icon to be visible on appbar menu
        getSupportActionBar().setIcon(R.mipmap.ic_launcher);                                        //setting icon for application to show on menu
        getSupportActionBar().setDisplayHomeAsUpEnabled(false);                                     //hides back to main menu button

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu){
        getMenuInflater().inflate(R.menu.actionbar_menu, menu);

        MenuItem i1 = menu.findItem(R.id.action_play);
        i1.setVisible(false);                                                                       //hide play button
        i1 = menu.findItem(R.id.action_about);
        i1.setVisible(false);                                                                       // hide about button

        return true;
    }

}
