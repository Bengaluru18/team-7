package monkfox.com.isap;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

public class BookingActivity extends AppCompatActivity
{
    // Array of strings...
    String[] equipmentArray = {"Tractor", "Spades", "Soil Cultivator", "Rotator",
            "Plough", "Roller", "Seed Drill", "Sprinkler"
};
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_booking);
        ArrayAdapter adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, equipmentArray);
        ListView listView = (ListView) findViewById(R.id.listviewbooking);
        listView.setAdapter(adapter);
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                TextView tv= (TextView) view.findViewById(R.id.listviewbooking);
                //Toast.makeText(BookingActivity.this, "clicked", Toast.LENGTH_SHORT).show();
                Toast.makeText(getApplicationContext(),tv.getText().toString(),Toast.LENGTH_LONG).show();
            }
        });
    }

}