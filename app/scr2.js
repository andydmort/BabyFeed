import document from "document";
import * as fs from "fs";
import * as common from "./common";

let num_list_items = 16;
let data_file_name = "babyfeed_list_data.txt";

let list_items = [];
let list_datas = [];
let data = undefined;

export function init() {

    // Delete option for testing
    // fs.unlinkSync(data_file_name);

    // Gather all the list items
    for (let i = 0; i < num_list_items; i++) {
        console.log(`#listItem${i}`);
       let list_item =  document.getElementById(`#listItem${i}`);
       list_items.push(list_item);
    }

    // Load the data list
    if(fs.existsSync(data_file_name)){
        let data_str = fs.readFileSync(data_file_name, "utf-8");
        data = JSON.parse(data_str);
    }
    else{
        data = [];
    }

    update_ui(data);

}

function update_ui(data){
    console.log(`Update UI: ${data.length} elements`);
    for(let i = 0; i < data.length; i++)
    {
        let date_0 = new Date(0);
        console.log(`${JSON.stringify(list_items)}`);
        // Get the things to update.
        let feed_time = list_items[i].getElementById("feed_time");
        let f_time = new Date(data[i].start_time);
        feed_time.text = `${f_time.getHours()+1}:${f_time.getMinutes()+1}`;
        let day = f_time.getDate();
        let month = f_time.getMonth() + 1;
        let feed_date = list_items[i].getElementById("feed_date");
        feed_date.text = `${month}/${day}`;

        let start_side = list_items[i].getElementById("feed_side");
        start_side.text = data[i].start_side;

        let left_time = list_items[i].getElementById("left_time");
        // let l_time = new Date(data[i].left_time);
        // left_time.text = `${l_time.getHours()+1}:${l_time.getMinutes()+1}`;
        left_time.text = common.get_hrs_mins_from_ms(data[i].left_time);

        let right_time = list_items[i].getElementById("right_time");
        // let r_time = new Date(data[i].right_time);
        // right_time.text = `${r_time.getHours()}:${r_time.getMinutes()}`;
        right_time.text = common.get_hrs_mins_from_ms(data[i].right_time);

        common.show(list_items[i], true);
        console.log(`done editing ${list_items[i]}`);
    }
}

export function add_data(data_) {

    console.log(`Adding Data: ${JSON.stringify(data_,null,2)}`);

    if(!data) data = [];
    
    data.unshift(data_);

    if(data.length > 25) data = data.slice(0,25);

    fs.writeFileSync(data_file_name, JSON.stringify(data), "utf-8");

    update_ui(data);
}