export function show(doc_el, show) {
    if (show) {
        console.log(`Showing Element ${doc_el.id}`);
        // doc_el.class = doc_el.class.replace(" hidden", "");
        doc_el.class = doc_el.class.replace("hidden", "");
    }
    else {
        console.log(`class: ${doc_el.class}`);
        if(doc_el.class.indexOf("hidden") == -1)
            doc_el.class += " hidden";
        console.log(`class: ${doc_el.class}`);
    }
}


export function get_hrs_mins_from_ms(milliseconds)
{
    let hr_in_ms = 3600000;
    let min_in_ms = 60000;

    let hours = Math.floor(milliseconds/hr_in_ms);
    let mins = Math.floor((milliseconds - (hours*hr_in_ms))/min_in_ms);

    return `${hours > 1 || hours == 0 ? `${hours}hrs`: `${hours}hr`} ${mins > 1 || mins == 0 ? `${mins}mins`:`${mins}min`}`;
}