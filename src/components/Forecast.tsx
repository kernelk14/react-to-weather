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
        return (
            <>
                <center>
                    <img align="center" src={data[wmo_code].day.image} />
                </center>
                <h4 align="center">{data[wmo_code].day.description}</h4>
            </>
        );
    } else {
        return (
            <>
                <center>
                    <img src={data[wmo_code].night.image} />
                </center>
                <h4 align="center">{data[wmo_code].night.description} </h4>
            </>
        );
    }
}

export default Forecast;
