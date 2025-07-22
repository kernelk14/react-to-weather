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
                `https://api.opencagedata.com/geocode/v1/json?q=${lat},+${lon}&key=${process.env.GEOLOCATION_API}&language=en&pretty=1`,
            );
            return await resp.json();
        },
    });

    if (isPending) return "Loading...";
    if (error) return "An Error Occured: " + error.message;

    console.log(data.results[0].formatted);
    return (
        <>
            <h3 className="pico-color-jade-400" align="center">
                {data.results[0].formatted}
            </h3>
            <div>{isFetching ? "Updating..." : ""}</div>
        </>
    );
}

function Weather() {
    const lat = 14.2157;
    const lon = 120.9714;
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
        <div className="container">
            <Location lat={lat} lon={lon} />
            <Forecast wmo={currentCode.toString()} />
            <h4 align="center">Current Date: {currentDate}</h4>
            <h4 align="center">
                Current Temp: {currentTemp} {data.hourly_units.temperature_2m}
            </h4>

            <div>{isFetching ? "Updating..." : ""}</div>
        </div>
    );
}

function App() {
    return (
        <main className="container">
            <QueryClientProvider client={queryClient}>
                <Weather />
            </QueryClientProvider>
        </main>
    );
}

export default App;
