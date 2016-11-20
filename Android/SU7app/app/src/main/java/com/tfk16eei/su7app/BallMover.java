package com.tfk16eei.su7app;

/**
 * Created by Ella on 2016-09-22.
 */

public class BallMover {

    private float dx;
    private float dy;
    private Ball ball;

    public BallMover(Ball ball, float angleRadians, float speedFactor) {
        this.ball = ball;
        dx = (float) (speedFactor * Math.cos(angleRadians));
        dy = (float) (speedFactor * Math.sin(angleRadians));
    }

    public void moveBallWithin(float xMin, float yMin, float xMax, float yMax) {

        checkForBounce(xMin, yMin, xMax, yMax);
        float x = ball.getX();
        float y = ball.getY();
        ball.setX(x + dx);
        ball.setY(y + dy);
    }

    private void checkForBounce(float xMin, float yMin, float xMax, float yMax) {
        float rightEdge = ball.getX() + ball.getRadius();
        float leftEdge = ball.getX() - ball.getRadius();
        float upperEdge = ball.getY() - ball.getRadius();
        float lowerEdge = ball.getY() + ball.getRadius();
        if ((rightEdge > xMax && dx > 0) || (leftEdge < xMin && dx < 0))
            dx = -dx;
        if ((lowerEdge > yMax && dy > 0) || (upperEdge < yMin && dy < 0))
            dy = -dy;
    }
}