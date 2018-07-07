package com.example.administrator.app2;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.firebase.client.Firebase;
import com.google.firebase.auth.FirebaseAuth;

public class LoginFarmerActivity extends AppCompatActivity {

    private FirebaseAuth auth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loginfarmer);

        Firebase.setAndroidContext(this);

        auth = FirebaseAuth.getInstance();
        //Start teacher activity
        if (auth.getCurrentUser() != null) {
            startActivity(new Intent(LoginFarmerActivity.this, FarmerWorkspaceActivity.class));
            finish();
        }


    }
}
