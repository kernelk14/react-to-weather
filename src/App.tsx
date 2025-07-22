import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";

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
            <h3>Current Location: {data.results[0].formatted}</h3>
            <div>{isFetching ? "Updating..." : ""}</div>
        </>
    );
}

function Weather() {
    // const lat = 14.2157;
    // const lon = 120.9714;
    const lat = 55.8204953;
    const lon = 78.866158;
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: [""],
        queryFn: async () => {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&forecast_days=1`,
            );
            return await response.json();
        },
    });

    if (isPending) return "Loading...";
    if (error) return "An Error Occured: " + error.message;

    const time = data.hourly.time;
    const temp = data.hourly.temperature_2m;
    const control = new Date();
    let currentDate = "";
    let currentTemp = 0;
    const tempArray = [];
    const dateArray = [];

    // console.log(control.toDateString());
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
    // console.log(dateArray.indexOf(currentDate));

    // console.log(data.hourly.temperature_2m);
    return (
        <div>
            <h3>Latitude: {data.latitude}</h3>
            <h3>Longitude: {data.longitude}</h3>
            <Location lat={lat} lon={lon} />
            <h4>Current Date: {currentDate}</h4>
            <h4>
                Current Temp: {currentTemp} {data.hourly_units.temperature_2m}
            </h4>
            <div>{isFetching ? "Updating..." : ""}</div>
        </div>
    );
}

function App() {
    return (
        <div className="flex items-center content-center justify-center">
            <QueryClientProvider client={queryClient}>
                <Weather />
            </QueryClientProvider>
        </div>
    );
}

export default App;
