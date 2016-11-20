package com.tfk16eei.su7app;

import android.content.Context;
import android.graphics.Canvas;
import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;
import java.util.Random;

/**
 * Created by Ella on 2016-09-22.
 */

public class AnimationView extends View {

    private ArrayList<BallMover> ballMoverList = new ArrayList<BallMover>();
    private ArrayList<BallPainter> ballPainterList = new ArrayList<BallPainter>();

    private static final Random random = new Random();

    public AnimationView(Context context) {
        super(context);
        init();
    }
    private void init() {
        this.setOnTouchListener(new OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event)
            {
                createAndInsertBall(event.getX(), event.getY());
            return true;
            }
        });
    }
    private void createAndInsertBall(float x, float y) {
        float dir = (float) (random.nextFloat() * 2.0 * Math.PI);
        float speed = (float) (1.0 + random.nextFloat() * 20.0);
        float size = (float) (5.0 + random.nextFloat() * 40.0);
        Ball ball = new Ball(x, y, size);
        BallPainter painter = new BallPainter(ball);
        ballPainterList.add(painter);
        BallMover ballMover = new BallMover(ball, dir, speed);
        ballMoverList.add(ballMover);
    }
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        for (BallPainter ballPainter : ballPainterList)
            ballPainter.paintBall(canvas);
        for (BallMover ballMover : ballMoverList)
            ballMover.moveBallWithin(0, 0, getWidth(), getHeight());
    }
}