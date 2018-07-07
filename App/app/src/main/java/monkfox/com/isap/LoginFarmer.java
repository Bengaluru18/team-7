package monkfox.com.isap;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class LoginFarmer extends AppCompatActivity {

    Button btnlogfarmer;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loginfarmer);

        btnlogfarmer = findViewById(R.id.btn_login_farmer);
        btnlogfarmer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i =new Intent(getApplicationContext(),BookingActivity.class);
                startActivity(i);
            }
        });
    }

}
