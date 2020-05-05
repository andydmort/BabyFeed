import document from "document";
import clock from "clock";
import * as scr1 from "./scr1";
import * as src2 from "./scr2";

clock.granularity = "minutes";


clock.ontick = (evt) => {
    console.log(evt.date.toTimeString());
    let sec = evt.date.getSeconds();
    let min = evt.date.getMinutes();
    let hour = evt.date.getHours();
    console.log(`Min: ${min}`);
    scr1.on_min_tick(evt.date);
}

scr1.init();
src2.init();



