package com.example.administrator.app2;

import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Toast;

import com.example.administrator.app2.fragments.StatusFragment;

public class FarmerWorkspaceActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_famer_workspace);

        loadFragment(new StatusFragment());
        //getting the bottom navigation view and attaching it to the listener
        BottomNavigationView navigation = findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment fragment = null;
                switch (item.getItemId())
                {
                    case R.id.fragment_Status:
                        fragment = new StatusFragment();
                        Toast.makeText(getApplicationContext(),"Welcome to Home",Toast.LENGTH_LONG).show();
                        break;

                    case R.id.fargment_booking:
                        fragment = new D();
                        Toast.makeText(getApplicationContext(),"Welcome to DashBoard",Toast.LENGTH_LONG).show();
                        break;

                    case R.id.navigation_notifications:
                        fragment = new NotificationsFragment();
                        Toast.makeText(getApplicationContext(),"Welcome to Notification",Toast.LENGTH_LONG).show();
                        break;

                    case R.id.navigation_profile:
                        fragment = new PersonFragment();
                        Toast.makeText(getApplicationContext(),"Welcome to Profile",Toast.LENGTH_LONG).show();
                        break;
                }
                return loadFragment(fragment);
            }
        });
    }

    private boolean loadFragment(Fragment fragment)
    {
        if(fragment!=null)
        {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragmentContainer,fragment)
                    .commit();
            return  true;
        }
        return false;
    }
}

    }
}
