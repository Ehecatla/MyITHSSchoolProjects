package com.tfk16eei.su7app;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.MotionEvent;
import android.view.View;

/**
 * Created by Ella on 2016-09-22.
 */

public class InteractiveView extends View{


    private Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private float x,y;
    private boolean touched = false;

    public InteractiveView(Context context) {
        super(context);
        init();
    }


    private void init(){
        this.setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                x = event.getX();
                y = event.getY();
                touched = true;
                invalidate();
                return true;
            }
        });
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        if(touched){
            float radius = 25;
            paint.setColor(Color.BLUE);
            paint.setStyle(Paint.Style.FILL);
            canvas.drawCircle(x,y,radius,paint);
            paint.setColor(Color.RED);
            paint.setStyle(Paint.Style.STROKE);
            canvas.drawCircle(x,y,2*radius,paint);
            canvas.drawRect(x-radius,y-radius,x+radius,y+radius,paint); //own addition, a rectangle around inner circle
        }
    }
}
