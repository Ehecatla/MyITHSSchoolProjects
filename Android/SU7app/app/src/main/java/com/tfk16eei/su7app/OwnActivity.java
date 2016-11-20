package com.tfk16eei.su7app;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class OwnActivity extends AppCompatActivity {

    public static final String FLOWER_COLOR ="chosen_color";
    private int chosenColor;
    private GardenView gardenView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        gardenView = new GardenView(this);
        setContentView(gardenView);
        getChosenColor();
        gardenView.setFlowerColor(chosenColor);
        gardenView.invalidate();

    }

    //get chosen color in main menu to use it for drawn image
    private void getChosenColor(){
        Intent i = getIntent();
        chosenColor = i.getIntExtra(FLOWER_COLOR, -1);
        if(chosenColor == -1){  //in case something failed and no color was retrieved, set default black
            chosenColor = getResources().getColor(R.color.defaultBlack);
        }
    }


}
