package com.tfk16eei.currencyconverter;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "TAG";
    private Spinner mFromSpinner;
    private Spinner  mToSpinner;
    private EditText mAmountET;
    private EditText mResultET;

    private ArrayAdapter<String> adapter;
    private String [] currencyArray;
    private String [] valuesArray;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mFromSpinner = (Spinner)findViewById(R.id.fromSpinner);
        mToSpinner = (Spinner)findViewById(R.id.toSpinner);
        mAmountET =(EditText)findViewById(R.id.fromET);
        mResultET =(EditText)findViewById(R.id.resultET);
        valuesArray =getResources().getStringArray(R.array.currency_value_array);
        mAmountET.addTextChangedListener(new AmountChangedListener());
        setUpCurrencySpinners();
    }


    private void countCurrency(){

        if(areAllInputsGiven()){
            try {
                double amount = Double.parseDouble(mAmountET.getText().toString());
                double fromValue = Double.parseDouble(valuesArray[mFromSpinner.getSelectedItemPosition()]);
                double toValue = Double.parseDouble(valuesArray[mToSpinner.getSelectedItemPosition()]);
                double converted = convertCurrency(amount, fromValue, toValue);
                mResultET.setText(formatToDisplayable(converted, currencyArray[mToSpinner.getSelectedItemPosition()]));
            }catch(Exception e){
                Log.v(TAG,"Exception" + e);
            }
        }
    }


    private double convertCurrency(double amount, double fromValue, double toValue){
        return amount*fromValue/toValue;
    }

    private String formatToDisplayable(double value, String currencyName){
        return String.format("%.2f %s",value, currencyName);
    }

    private boolean areAllInputsGiven(){
        return (!mAmountET.getText().toString().isEmpty() && mFromSpinner.getSelectedItemId() != 0
                                                            && mToSpinner.getSelectedItemId() !=0 );
    }

    private void setUpCurrencySpinners(){
        currencyArray = getResources().getStringArray(R.array.currency_name_array);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,android.R.layout.simple_spinner_item, currencyArray);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mFromSpinner.setAdapter(adapter);
        mToSpinner.setAdapter(adapter);
        mFromSpinner.setOnItemSelectedListener(new CurrencySpinnerListener());
        mToSpinner.setOnItemSelectedListener(new CurrencySpinnerListener());
    }

    private class AmountChangedListener implements TextWatcher {
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            countCurrency();

        }
        public void afterTextChanged(Editable s) {
            if(s.length() == 0){
                mResultET.setText("");
            }
        }
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
    }

    private class CurrencySpinnerListener implements AdapterView.OnItemSelectedListener{

        @Override
        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
            countCurrency();
        }

        @Override
        public void onNothingSelected(AdapterView<?> parent) {
        }
    }

}

