import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";

import Forecast from "./components/Forecast";

const queryClient = new QueryClient();

interface Coords {
    lat: number;
    lon: number;
}

function Location({ lat, lon }: Coords) {
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ["results"],
        queryFn: async () => {
            const resp = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${process.env.GEOLOCATION_API}`,
            );
            return await resp.json();
        },
    });

    if (isPending) return "Loading...";
    if (error) return "An Error Occured: " + error.message;

    console.log(data.results[0].formatted);
    return (
        <>
            <center>
                <h3 className="pico-color-jade-400">
                    {data.results[0].formatted}
                </h3>
            </center>
            <div>{isFetching ? "Updating..." : ""}</div>
        </>
    );
}

function Weather() {
    let lat = 0;
    let lon = 0;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log(`lat: ${lat}, lon: ${lon}`);
        });
    }

    // THIS IS FOR DEBUGGING PURPOSES ONLY.
    // const lat = 14.2157;
    // const lon = 120.9714;
    // const lat = 55.8204953;
    // const lon = 78.866158;
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: [""],
        queryFn: async () => {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&forecast_days=1&current=is_day`,
            );
            return await response.json();
        },
    });

    if (isPending) return "Loading...";
    if (error) return "An Error Occured: " + error.message;

    const time = data.hourly.time;
    const temp = data.hourly.temperature_2m;
    const code = data.hourly.weather_code;
    const isDay = data.current.is_day;
    const control = new Date();
    console.log();
    let currentDate = "";
    let currentTemp = 0;
    const tempArray = [];
    const dateArray = [];

    for (let i = 0; i < time.length; i++) {
        const dateObject = new Date(time[i]);
        const dateString = dateObject.toDateString();
        dateArray.push(dateString);
        tempArray.push(temp[i]);
        if (control.toDateString() == dateString) {
            currentDate = dateString;
            currentTemp = tempArray[dateArray.indexOf(dateString)];
        }
    }
    const currentCode = code[dateArray.indexOf(currentDate)];
    return (
        <main className="container">
            <center>
                <h4>{currentDate}</h4>
                <h6>
                    As of{" "}
                    <strong className="pico-color-blue-500">
                        {control.toLocaleTimeString()}
                    </strong>
                </h6>
            </center>
            <br />
            <Location lat={lat} lon={lon} />
            <Forecast wmo={currentCode.toString()} day={isDay} />
            <center>
                <h4>
                    {currentTemp} {data.hourly_units.temperature_2m}
                </h4>
            </center>

            <div>{isFetching ? "Updating..." : ""}</div>
            <br />
        </main>
    );
}

function App() {
    return (
        <>
            <header className="container">
                <center>
                    <h1>Basic Weather Site</h1>
                </center>
            </header>
            <main className="container">
                <br />
                <QueryClientProvider client={queryClient}>
                    <Weather />
                </QueryClientProvider>
            </main>
        </>
    );
}

export default App;
