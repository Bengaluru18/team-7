package monkfox.com.isap;

import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
//import com.firebase.client.Firebase;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;

public class LoginFarmer extends AppCompatActivity {

    private FirebaseAuth auth;
    private Button loginBtn;
    private EditText inputEmail, inputPassword;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loginfarmer);

        //Firebase.setAndroidContext(this);

        auth = FirebaseAuth.getInstance();
        //Start teacher activity
        if (auth.getCurrentUser() != null) {
            startActivity(new Intent(LoginFarmer.this, FarmerWorkspaceActivity.class));
            finish();
        }

        loginBtn=(Button) findViewById(R.id.btn_login_farmer);
        inputEmail=(EditText) findViewById(R.id.farmerphone);
        inputPassword=(EditText) findViewById(R.id.farmerpassword);
        loginBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = inputEmail.getText().toString()+"@gmail.com";
                final String password = inputPassword.getText().toString();

                if (TextUtils.isEmpty(email)) {
                    Toast.makeText(getApplicationContext(), "Enter phone!", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (TextUtils.isEmpty(password)) {
                    Toast.makeText(getApplicationContext(), "Enter password!", Toast.LENGTH_SHORT).show();
                    return;
                }



                //authenticate user
                auth.signInWithEmailAndPassword(email, password)
                        .addOnCompleteListener(LoginFarmer.this, new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                // If sign in fails, display a message to the user. If sign in succeeds
                                // the auth state listener will be notified and logic to handle the
                                // signed in user can be handled in the listener.

                                if (!task.isSuccessful()) {
                                    // there was an error
                                    if (password.length() < 6) {
                                        inputPassword.setError("Password length less than 6");
                                    } else {
                                        Toast.makeText(LoginFarmer.this, "Email or password incorrect", Toast.LENGTH_LONG).show();
                                    }
                                } else {
                                    Log.v("wierd","as");
                                    Intent intent = new Intent(LoginFarmer.this, FarmerWorkspaceActivity.class);
                                    startActivity(intent);
                                    finish();
                                }
                            }
                        });
            }
        });
    }
}
