package com.tfk16eei.su7app;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import java.util.jar.Attributes;

/**
 * Created by Ella on 2016-09-23.
 */

public class AuthorLabel {

    private String author;

    public AuthorLabel(String author){
        this.author = author;

    }

    //creates blue rectangle with author text inside it
    public void paintAuthorLabel(Canvas canvas){

        Paint rectanglePaint= new Paint();
        rectanglePaint.setColor(Color.BLUE);
        rectanglePaint.setStyle(Paint.Style.FILL);

        Paint  textPaint= new Paint();
        textPaint.setColor(Color.WHITE);
        textPaint.setTextSize(60);  //set text size

        float w = textPaint.measureText(author)/2;
        float textSize = textPaint.getTextSize();


        textPaint.setTextAlign(Paint.Align.CENTER);
        canvas.drawRect(0, canvas.getHeight() - textSize, 300 + w, canvas.getHeight(), rectanglePaint);
        canvas.drawText(author, 300-textSize, canvas.getHeight() ,textPaint);
    }


}
