package com.tfk16eei.su7app;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.View;

/**
 * Created by Ella on 2016-09-22.
 */

public class SimpleDrawView extends View {

    private Paint paint;

    public SimpleDrawView(Context context) {
        super(context);
        init();
    }


    private void init(){
        paint = new Paint();
        paint.setAntiAlias(true);
        paint.setColor(Color.BLUE);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(3);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        float width = getWidth();
        float height = getHeight();
        float radius = Math.min(height,width)/2;

        canvas.drawLine(0,0,width,height,paint);
        canvas.drawLine(0,height,width,0,paint);
        canvas.drawCircle(width/2, height/2, radius, paint);
        canvas.drawRect(0,0,width,height,paint);
        for(int i = 20;i< radius;i=i+20){       //own addition, draw lots of circles with +20 radius each until biggest one
            canvas.drawCircle(width/2, height/2, i, paint);
        }

    }
}
