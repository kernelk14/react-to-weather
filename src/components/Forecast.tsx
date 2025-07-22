import descriptions from "./descriptions.json";
const descString = JSON.stringify(descriptions);
const data = JSON.parse(descString);

interface Props {
    day: number;
    wmo: string;
}
function Forecast({ wmo, day }: Props) {
    const wmo_code = wmo;

    if (day == 1) {
        console.log("day");
        return (
            <>
                <center>
                    <img src={data[wmo_code].day.image} />
                </center>
                <center>
                    <h4>{data[wmo_code].day.description}</h4>
                </center>
            </>
        );
    } else {
        console.log("night");
        return (
            <>
                <center>
                    <img src={data[wmo_code].night.image} />
                </center>
                <center>
                    <h4>{data[wmo_code].night.description} </h4>
                </center>
            </>
        );
    }
}

export default Forecast;
