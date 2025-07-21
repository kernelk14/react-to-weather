import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function Weather() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [""],
    queryFn: async () => {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m",
      );
      return await response.json();
    },
  });

  if (isPending) return "Loading...";
  if (error) return "An Error Occured: " + error.message;

  const time = data.hourly.time;
  const temp = data.hourly.temperature_2m;

  const dateObject = new Date(time[time.length - 1]);
  const isoString = dateObject.toDateString();

  console.log(data.hourly.temperature_2m);
  return (
    <>
      <p>
        {isoString}: {temp[temp.length - 1]}
      </p>
      <div>{isFetching ? "Updating..." : ""}</div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Weather />
    </QueryClientProvider>
  );
}

export default App;
