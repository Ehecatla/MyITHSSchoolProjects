package com.tfk16eei.su7app;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class AnimationActivity extends AppCompatActivity {

    private AnimationView animationView;
    private Ticker ticker;
    private boolean running= false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        animationView=new AnimationView(this);
        setContentView(animationView);
        ticker = new Ticker();
        ticker.startTicking();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        ticker.stopTicking();
    }

    private class Ticker implements Runnable {
        public void startTicking() {
            running = true;
            new Thread(this).start();
        }

        public void stopTicking()
        {
            running = false;
        }
        public void run() {
            while (running) {
                try {
                    Thread.sleep(20);
                    animationView.postInvalidate();
                }
                catch (Exception e) {}
            }
        }
    }
}