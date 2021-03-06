import document from "document";
import * as fs from "fs";
import * as common from "./common";
import * as scr2 from "./scr2";

let current_side_text = document.getElementById("#current_side_text");
let current_side_label = document.getElementById("#current_side_label");
let last_feed_text = document.getElementById("#last_feed_text");
let last_side_text = document.getElementById("#last_side_text");

let btn_right = document.getElementById("#btn-tr");
let btn_left = document.getElementById("#btn-tl");
let btn_stop = document.getElementById("#btn-bl");

let data = undefined;
let data_file_name = "data.txt";

let enum_state = {
    left: "left",
    right: "right",
    not_running: "not_running"
}
let curr_state = undefined;

let enum_side = {
    left: "left",
    right: "right"
}
let enum_PmAm = {
    am: "am",
    pm: "pm"
}
let running = false;


function show_running(to_show) {
    common.show(current_side_label, to_show);
    common.show(current_side_text, to_show);
    common.show(btn_stop, to_show);
}

function get_last_feed_text(start_time_in_milliseconds) {
    if (!curr_time)
        curr_time = new Date();
    let start_tim = new Date(start_time_in_milliseconds);

    let time_delta = curr_time.getTime() - start_tim.getTime();

    return common.get_hrs_mins_from_ms(time_delta);
}

// Note: Curr_state must be update before calling this function
function udpate_ui(in_data) {
    console.log(`Updating UI...`);
    console.log(`data: ${JSON.stringify(in_data)}`);
    
    if (in_data.curr_state == enum_state.left) {
        show_running(true);
    }
    else if (in_data.curr_state == enum_state.right) {
        show_running(true);
    }
    else {
        show_running(false);
    }

    current_side_text.text = in_data.curr_side;
    last_side_text.text = in_data.start_side;
    last_feed_text.text = get_last_feed_text(in_data.start_time);

}

export function init() {

    console.log("init scr1...");
    console.log("Loading Data...");

    //Delete option for testing
    // fs.unlinkSync(data_file_name);

    if (!curr_time)
        curr_time = new Date();
    // Yes file
    if (fs.existsSync(data_file_name)) {
        let data_str = fs.readFileSync(data_file_name, "utf-8");
        data = JSON.parse(data_str);
        // Set state
        curr_state = data.curr_state;
        //update_ui
        udpate_ui(data);
        //Set display

    }
    // no file
    else {
        console.log("No File found");
        // Set state
        curr_state = enum_state.not_running;
        // Set ui
        last_feed_text.text = `0hr 0m ago`;
        last_side_text.text = "";
        common.show(current_side_label, false);
        common.show(current_side_text, false);
    }


}

let curr_time = undefined;
export function on_min_tick(curr_time_) {
    curr_time = curr_time_;
    if (data)
        udpate_ui(data);
}

btn_right.onactivate = function (evt) {
    console.log("Clicked Right");
    if (curr_state == enum_state.not_running) {
        console.log("changing from not_running to right");
        data = {
            start_side: enum_side.right,
            left_time: 0, //Saved in milliseconds
            right_time: 0, //Saved in milliseconds
            start_time: curr_time.getTime(),
            prev_time: curr_time.getTime(),
            curr_side: enum_side.right,
            curr_state: enum_state.right
        }

        fs.writeFileSync(data_file_name, JSON.stringify(data), "utf-8");
    }
    else if (curr_state == enum_state.left) {
        data = {
            start_side: data.start_side,
            left_time: data.left_time + (curr_time.getTime() - data.prev_time), //saved in milliseconds
            right_time: data.right_time, //Saved in milliseconds
            start_time: data.start_time, // Set to the same
            prev_time: curr_time.getTime(),
            curr_side: enum_side.right, //Set to new right side 
            curr_state: enum_state.right
        }
        fs.writeFileSync(data_file_name, JSON.stringify(data), "utf-8");

    }
    else {
        // DO nothing
    }
    //change state
    curr_state = enum_state.right;

    //update UI
    udpate_ui(data);
}
btn_left.onactivate = function (evt) {
    console.log("Clicked Left");
    if (curr_state == enum_state.not_running) {
        data = {
            start_side: enum_side.left,
            left_time: 0, //Saved in milliseconds
            right_time: 0, //Saved in milliseconds
            start_time: curr_time.getTime(),
            prev_time: curr_time.getTime(),
            curr_side: enum_side.left,
            curr_state: enum_state.left
        }

        fs.writeFileSync(data_file_name, JSON.stringify(data), "utf-8");
    }
    else if (curr_state == enum_state.right) {
        data = {
            start_side: data.start_side,
            left_time: data.left_time, //Saved in milliseconds
            right_time: data.right_time + (curr_time.getTime() - data.prev_time), //Saved in milliseconds
            start_time: data.start_time, // Set to the same
            prev_time: curr_time.getTime(),
            curr_side: enum_side.left, //Set to new right side 
            curr_state: enum_state.left
        }
        fs.writeFileSync(data_file_name, JSON.stringify(data), "utf-8");
    }
    else {
        // DO nothing
    }

    //change state
    curr_state = enum_state.left;
    // udpate ui
    udpate_ui(data);
}
btn_stop.onactivate = function (evt) {
    if (curr_state == enum_state.right) {
        data = {
            start_side: data.start_side,
            left_time: data.left_time, //Saved in milliseconds
            right_time: data.right_time + (curr_time.getTime() - data.prev_time), //Saved in milliseconds
            start_time: data.start_time, // Set to the same
            prev_time: curr_time.getTime(),
            curr_side: data.curr_side, //Set to new right side 
            curr_state: enum_state.not_running
        }
        fs.writeFileSync(data_file_name, JSON.stringify(data), "utf-8");
        scr2.add_data(data);
    }
    else if (curr_state == enum_state.left) {
        data = {
            start_side: data.start_side,
            left_time: data.left_time + (curr_time.getTime() - data.prev_time), //Saved in milliseconds
            right_time: data.right_time, //Saved in milliseconds
            start_time: data.start_time, // Set to the same
            prev_time: curr_time.getTime(),
            curr_side: data.curr_side, //Set to new right side 
            curr_state: enum_state.not_running
        }
        fs.writeFileSync(data_file_name, JSON.stringify(data), "utf-8");
        scr2.add_data(data);
    }
    else {
        // do nothing
    }
    console.log("Clicked stop");

    //change state
    curr_state = enum_state.not_running;
    // update ui
    udpate_ui(data);
}
