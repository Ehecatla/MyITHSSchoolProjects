package com.tfk16eei.su7app;

/**
 * Created by Ella on 2016-09-23.
 */

public class Flower {


    private final int trunkWidth;
    private float x;
    private float y;
    private float radius;
    private float trunkLength;

    public Flower(float x, float y, float radius, float trunkLength, int trunkWidth) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.trunkLength = trunkLength;
        this.trunkWidth = trunkWidth;
    }

    public float getX() {
        return x;
    }
    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public float getRadius() {
        return radius;
    }

    public void setRadius(float radius) {
        this.radius = radius;
    }

    public float getTrunkLength() {
        return trunkLength;
    }

    public void setTrunkLength(float trunkLength) {
        this.trunkLength = trunkLength;
    }

    public int getTrunkWidth() {
        return trunkWidth;
    }

    public int setTrunkWidth() {
        return trunkWidth;
    }
}
