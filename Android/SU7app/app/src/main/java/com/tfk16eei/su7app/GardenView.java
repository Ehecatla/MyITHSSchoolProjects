package com.tfk16eei.su7app;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;
import java.util.Random;

/**
 * Created by Ella on 2016-09-23.
 */

public class GardenView extends View {


    private ArrayList<FlowerMaker> flowerMakerArrayList = new ArrayList<FlowerMaker>();
    private float width;
    private float height;
    private int colorId = -1;
    private static final Random r = new Random();
    private AuthorLabel nameRecMover;

    public GardenView(Context context) {
        super(context);
        init();
    }

    private void init()
    {
        this.setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event)
            {
                createFlowerOnTouch(event.getX(), event.getY());
                invalidate();
                return true;
            }
        });
    }

    @Override
    protected void onDraw(Canvas canvas) {

        super.onDraw(canvas);
        width = canvas.getWidth();
        height = canvas.getHeight();

        drawBackground(canvas);
        drawSun(canvas);
        drawFlowers(canvas, this.flowerMakerArrayList);
        createNamePlate();
        nameRecMover.paintAuthorLabel(canvas);
    }

    //creates yellow sun in view
    private void drawSun(Canvas canvas){
        float radius = width/5;
        Paint sunPainter = createPaint(Color.YELLOW, true, 3);
        canvas.drawCircle(0,0,radius,sunPainter);
    }

    //creates green grass line
    private void drawBackground(Canvas canvas){
        canvas.drawRect(0,height-30,width,height,createPaint(Color.GREEN,true,3));
    }

    //goes through list of made flowers by user and draws them
    private void drawFlowers(Canvas canvas, ArrayList<FlowerMaker> flowerMakerArray){
        for(FlowerMaker flowerMaker: flowerMakerArray){
                flowerMaker.paintFlower(canvas);
        }
    }

    //creates Paint object with given arguments
    private static Paint createPaint(int colorId, boolean isFilled, int strokeWidth){

        Paint paint = new Paint();
        paint.setAntiAlias(true);
        paint.setColor(colorId);
        if(isFilled){
            paint.setStyle(Paint.Style.FILL_AND_STROKE);
        } else {
            paint.setStyle(Paint.Style.STROKE);
        }
        paint.setStrokeWidth(strokeWidth);  //3
        return paint;
    }

    //sets color to be used by flowers
    public void setFlowerColor(int colorId){
        this.colorId = colorId;
    }

    //creates new Flower object at position where user touched screen
    private void createFlowerOnTouch(float x, float y) {

        if(flowerMakerArrayList.size() > 0){
            Flower previousFlower = flowerMakerArrayList.get(flowerMakerArrayList.size()-1).getFlower();
            FlowerTask taskE = new FlowerTask(x,y,previousFlower);
            taskE.run();
        } else {
            float flowerSize = (r.nextInt(80-15)+15);
            float trunkLength = height-y;
            int trunkWidth = (int)flowerSize/4;
            Flower f = new Flower(x,y,flowerSize,trunkLength,trunkWidth);
            flowerMakerArrayList.add( new FlowerMaker(f, colorId));
        }
    }



    //creates rectangle with app author name in it
    private void createNamePlate(){
         nameRecMover = new AuthorLabel(getContext().getString(R.string.app_author));
    }


    private class FlowerTask implements Runnable{

        private float x;
        private float y;
        private Flower previousFlower;

        public FlowerTask(float x, float y, Flower pFlower){
            this.x = x;
            this.y = y;
            this.previousFlower = pFlower;
        }

        @Override
        public void run() {
            //compare to avoid spamming flowers at exactly same position
            float minX = previousFlower.getX() - previousFlower.getRadius();
            float maxX = previousFlower.getX() + previousFlower.getRadius();
            float minY = previousFlower.getY() - previousFlower.getRadius();
            float maxY = previousFlower.getY() +previousFlower.getRadius();

            if((x >maxX || x<minX) || (y> maxY || y<minY)){
                float flowerSize = (r.nextInt(80-15)+15);
                float trunkLength = height-y;
                int trunkWidth = (int)flowerSize/4;
                Flower f = new Flower(x,y,flowerSize,trunkLength,trunkWidth);
                flowerMakerArrayList.add( new FlowerMaker(f, colorId));
            }
            postTask(this);
        }
    }

    private void postTask(FlowerTask task){
        invalidate();
    }





}
