import "./Loading.css"; 

function Loading(){

    const navigate = useNavigate();
    const [loadingMessage, setLoadingMessage] = useState("Loading....");

    useEffect(() => {
        if (!navigator.geolocation) {
            setLoadingMessage("Geolocation is not supported by your browser.");
            setTimeout(() => navigate("/not-allowed"), 2000);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch("/api/check-location", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ latitude, longitude }),
                    });

                    const data = await response.json();
                    if (data.allowed) {
                        setLoadingMessage("You are on campus. Processing your vote...");
                        setTimeout(() => navigate("/vote-successful"), 2000);
                    } else {
                        setLoadingMessage("You are not on campus. Voting is not allowed.");
                        setTimeout(() => navigate("/vote-unsuccessful"), 2000);
                    }
                } catch (error) {
                    setLoadingMessage("Error checking location.");
                    setTimeout(() => navigate("/vote-unsuccessful"), 2000);
                }
            },
            () => {
                setLoadingMessage("Unable to retrieve your location.");
                setTimeout(() => navigate("/vote-unsuccessful"), 2000);
            }
        );
    }, [navigate]);

    return(
        <div class="loading">
            <h1 class="loading__title">{loadingMessage}</h1>
            <h2 className="loading__subtitle">Give us one moment</h2>
            <div class="spinner">
                
            </div>
        </div>
    )
}
export default Loading;