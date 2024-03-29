package monkfox.com.isap;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;

public class RegistrationActivity extends AppCompatActivity
{
    private FirebaseAuth auth;
    private Button registerBtn;
    private EditText inputEmail,inputPassword,inputPhone,inputTaluk,inputDistrict,inputCrops;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registration);
        android.app.ActionBar actionBar=getActionBar();
        actionBar.hide();


        auth = FirebaseAuth.getInstance();
        registerBtn=(Button) findViewById(R.id.regsiterfarmerbt);
        inputEmail=findViewById(R.id.farmeremail);
        inputPassword=findViewById(R.id.farmerpassword);
        inputPhone=findViewById(R.id.farmerphone);
        inputTaluk=findViewById(R.id.farmertaluk);
        inputDistrict=findViewById(R.id.farmerdistrict);
        inputCrops=findViewById(R.id.farmermajorcrops);

        registerBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String email = inputEmail.getText().toString().trim();
                final String password = inputPassword.getText().toString().trim();
                final String number = inputPhone.getText().toString().trim();

                if (TextUtils.isEmpty(email)) {
                    Toast.makeText(getApplicationContext(), "Enter email address!", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (TextUtils.isEmpty(number)) {
                    Toast.makeText(getApplicationContext(), "Enter phone number!", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (TextUtils.isEmpty(password)) {
                    Toast.makeText(getApplicationContext(), "Enter password!", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (password.length() < 6) {
                    Toast.makeText(getApplicationContext(), "Password too short, enter minimum 6 characters!", Toast.LENGTH_SHORT).show();
                    return;
                }

                //progressBar.setVisibility(View.VISIBLE);
                //create user
                auth.createUserWithEmailAndPassword(email, password)
                        .addOnCompleteListener(RegistrationActivity.this, new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                Toast.makeText(RegistrationActivity.this, "createUserWithEmail:onComplete:" + task.isSuccessful(), Toast.LENGTH_SHORT).show();
                                //progressBar.setVisibility(View.GONE);
                                // If sign in fails, display a message to the user. If sign in succeeds
                                // the auth state listener will be notified and logic to handle the
                                // signed in user can be handled in the listener.
                                if (!task.isSuccessful()) {

                                    Toast.makeText(RegistrationActivity.this, "Authentication failed." + task.getException(),
                                            Toast.LENGTH_SHORT).show();
                                } else {

                                    auth.signInWithEmailAndPassword(email, password);
                                    String uid = FirebaseAuth.getInstance().getCurrentUser().getUid();
                                    //Firebase ref = new Firebase(Config.FIREBASE_URL);
                                    //User person = new User(email, number);

                                    Toast.makeText(RegistrationActivity.this, email,
                                            Toast.LENGTH_SHORT).show();

                                    //ref.child(uid).setValue(person);
                                    Toast.makeText(RegistrationActivity.this, "Database added",
                                            Toast.LENGTH_SHORT).show();
                                    startActivity(new Intent(RegistrationActivity.this, MainActivity.class));
                                    finish();
                                }
                            }
                        });
            }
        });

    }
}
