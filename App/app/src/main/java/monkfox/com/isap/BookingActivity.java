package monkfox.com.isap;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
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
    }
}