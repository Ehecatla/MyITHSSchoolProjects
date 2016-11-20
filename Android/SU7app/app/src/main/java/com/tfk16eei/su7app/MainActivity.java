package com.tfk16eei.su7app;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;

public class MainActivity extends AppCompatActivity {

    private Button simpleBtn;
    private Button interactionBtn;
    private Button animationBtn;
    private Button ownActivityBtn;

    private String [] colorNames;
    private ArrayAdapter<String> adapter;
    private Spinner colorSpinner;
    private int [] colorValues;
    private int chosenColor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        simpleBtn = (Button)findViewById(R.id.simpleDrawBtn);
        interactionBtn =(Button)findViewById(R.id.interactionBtn);
        animationBtn =(Button)findViewById(R.id.animationBtn);
        ownActivityBtn =(Button)findViewById(R.id.ownActivityBtn);
        colorValues = getResources().getIntArray(R.array.color_array_values);
        colorNames = getResources().getStringArray(R.array.color_array);
        colorSpinner = (Spinner) findViewById(R.id.themeSpinner);
        chosenColor = colorValues[0];   //default black
        setUpThemeSpinner();
    }


    private void setUpThemeSpinner(){
        adapter = new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item, colorNames);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        colorSpinner.setAdapter(adapter);
        colorSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                changeChosenColor(colorValues[position]);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
    }

    //changes buttons color in menu
    private void changeChosenColor(int colorId){
        chosenColor = colorId;
        animationBtn.setTextColor(colorId);
        interactionBtn.setTextColor(colorId);
        ownActivityBtn.setTextColor(colorId);
        simpleBtn.setTextColor(colorId);
    }

    public void startDrawClicked(View view) {
        Intent intent = new Intent(this,SimpleDrawActivity.class);
        startActivity(intent);
    }

    public void startInteractionClicked(View view) {
        Intent intent = new Intent(this,InteractionActivity.class);
        startActivity(intent);
    }

    public void startAnimationClicked(View view) {
        Intent intent = new Intent(this,AnimationActivity.class);
        startActivity(intent);
    }

    //starts own activity with extra color information for flower petals
    public void startOwnActivity(View view) {
        Intent intent = new Intent(this,OwnActivity.class);
        intent.putExtra(OwnActivity.FLOWER_COLOR, chosenColor);
        startActivity(intent);
    }
}
