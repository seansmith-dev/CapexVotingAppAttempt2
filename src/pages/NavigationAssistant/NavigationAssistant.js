"use client";
import "./NavigationAssistant.css"; 

import{
    APIProvider, 
    Map, 
    AdvancedMarker, 
    Pin, 
} from "@vis.gl/react-google-maps";

function NavigationAssistant(){
    const position={ lat:-37.822633658037844, lng:145.03819507328128};
    

    console.log(process.env.REACT_APP_GOOGLE_MAPS_API_ID);

    return(
        <div class="navigation-assistant">
            <h1 class="navigation-assistant__title">Navigation assistant</h1>
            <p class="navigation-assistant__subtitle">Capstone is located at the ATC center highlighted by the icon</p>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <div className="navigation-assistant__map">
                <Map 
                    zoom={19} 
                    defaultCenter={position} 
                    mapId={process.env.REACT_APP_GOOGLE_MAPS_API_ID}
                    restriction={{
                        latLngBounds: {
                            north: position.lat + 0.0015,
                            south: position.lat - 0.0015,
                            east: position.lng + 0.0031,
                            west: position.lng - 0.0031,
                        },
                        strictBounds: true, //Preventing them from navigating out of bounds
                      }}
                    >
                    <AdvancedMarker position={position}>
                        <Pin background={"grey"} borderColor={"green"} glyphColor={"purple"} scale={4}></Pin>
                    </AdvancedMarker>
                    
                    
                </Map>
            </div>
        </APIProvider>
        </div>
    )
}
export default NavigationAssistant;



