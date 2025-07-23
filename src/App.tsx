import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";

import Forecast from "./components/Forecast";
import { useState } from "react";

interface Coords {
    lat: number;
    lon: number;
}

function Location({ lat, lon }: Coords) {
    console.log("Location lat:", lat);
    console.log("Location lon:", lon);
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ["results"],
        queryFn: async () => {
            const resp = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${process.env.GEOLOCATION_API}&language=en&pretty=1`,
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

function Weather({ lat, lon }: Coords) {
    // THIS IS FOR DEBUGGING PURPOSES ONLY.
    // const lat = 14.2157;
    // const lon = 120.9714;
    // const lat = 55.8204953;
    // const lon = 78.866158;
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: [""],
        queryFn: async () => {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&current=is_day&timezone=auto`,
            );
            return await response.json();
        },
    });

    if (isPending) return "Loading...";
    if (error) return "An Error Occured: " + error.message;

    const time = data.hourly.time;
    const temp = data.hourly.temperature_2m;
    const code = data.hourly.weather_code;
    const isDay: number = data.current.is_day;
    console.log(data);
    const control = new Date();
    let currentDate = "";
    let currentTemp = 0;
    const tempArray = [];
    const dateArray = [];
    let currentCode = 0;

    for (let i = 0; i < time.length; i++) {
        const dateObject = new Date(time[i]);
        const dateString = dateObject.toDateString();
        dateArray.push(dateString);
        tempArray.push(temp[i]);
        // console.log("Control date: ", control.toDateString());
        // console.log("Output date: ", dateString);
        if (control.toDateString() == dateString) {
            // currentDate = dateString;
            currentDate = control.toDateString();
            currentTemp = tempArray[dateArray.indexOf(currentDate)];
            currentCode = code[dateArray.indexOf(currentDate)];
        }
    }

    return (
        <>
            <header className="container">
                <center>
                    <h1>Weather for {isDay ? "Today" : "Tonight"}</h1>
                </center>
            </header>
            <br />
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
                <center>
                    <h4>
                        <Location lat={lat} lon={lon} />
                    </h4>
                </center>
                <Forecast wmo={currentCode.toString()} day={isDay} />
                <center>
                    <h4>
                        {currentTemp} {data.hourly_units.temperature_2m}
                    </h4>
                </center>

                <div>{isFetching ? "Updating..." : ""}</div>
                <br />
            </main>
        </>
    );
}
const queryClient = new QueryClient();

function App() {
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(`lat: ${lat}, lon: ${lon}`);
            setLat(position.coords.latitude);
            setLon(position.coords.longitude);
            // lat = position.coords.latitude;
            // lon = position.coords.longitude;
            console.log(`lat: ${lat}, lon: ${lon}`);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }

    console.log(navigator.geolocation);
    console.log("Latitude passed on navigator.geolocation: ", lat);
    console.log("Longitude passed on navigator.geolocation: ", lon);
    return (
        <>
            <main className="container">
                <QueryClientProvider client={queryClient}>
                    <Weather lat={lat} lon={lon} />
                </QueryClientProvider>
            </main>
        </>
    );
}

export default App;
