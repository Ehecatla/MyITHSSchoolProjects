package com.tfk16eei.su7app;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;


/**
 * Created by Ella on 2016-09-23.
 */

public class FlowerMaker {

    private Paint paint;
    private Paint paintTrunk;
    private Paint paintMiddle;
    private Flower flower;
    private int colorId;

    public FlowerMaker(Flower flower, int colorId) {
        this.flower = flower;
        paint = createPaint(colorId);
        paintTrunk = trunkPaint(flower.getTrunkWidth(),Color.GREEN);
        paintMiddle = createPaint(Color.CYAN);
        this.colorId = colorId;
    }


    public void paintFlower(Canvas canvas) {
        //paint trunk
        canvas.drawLine(flower.getX(),flower.getY(),flower.getX(),flower.getY()+flower.getTrunkLength(), paintTrunk);
        //paint 4 flakes
        canvas.drawCircle(flower.getX()+flower.getRadius(),flower.getY(),flower.getRadius(),paint);
        canvas.drawCircle(flower.getX()- flower.getRadius(),flower.getY(),flower.getRadius(),paint);
        canvas.drawCircle(flower.getX(),flower.getY()+flower.getRadius(),flower.getRadius(),paint);
        canvas.drawCircle(flower.getX(),flower.getY()- flower.getRadius(),flower.getRadius(),paint);
        //paint head
        canvas.drawCircle(flower.getX(),flower.getY(),flower.getRadius(),paintMiddle);

    }

    private static Paint createPaint(int colorId) {
        Paint paint = new Paint();
        paint.setColor(colorId);
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.FILL_AND_STROKE);
        return paint;
    }

    private static Paint trunkPaint(int width, int colorId){    //trunk paint size is different depending on flower
        Paint paint = createPaint(colorId);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(width);
        return paint;
    }

    public Flower getFlower(){
        return flower;
    }


}
