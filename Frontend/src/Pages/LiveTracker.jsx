import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';
import { FaMapMarkerAlt, FaLocationArrow, FaSpinner, FaTimesCircle, FaCheckCircle, FaSatelliteDish } from 'react-icons/fa';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
};

const LiveTracker = () => {
    const [position, setPosition] = useState({ lat: 27.55, lng: 76.6 }); 
    const [locationStatus, setLocationStatus] = useState("Waiting for GPS data...");
    const [zoom, setZoom] = useState(13);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus("Error: Geolocation is not supported by your browser.");
            return;
        }

        const success = (pos) => {
            const newPos = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            };
            setPosition(newPos);
            setLocationStatus("Location updated successfully!");
            setZoom(17); 
        };

        const error = (err) => {
            setLocationStatus(`Error (${err.code}): ${err.message}. Please enable location services.`);
        };

        const watchId = navigator.geolocation.watchPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    const getStatusIcon = (status) => {
        if (status.includes('Error')) return <FaTimesCircle className="text-red-500" />;
        if (status.includes('updated')) return <FaCheckCircle className="text-green-500" />;
        if (status.includes('Waiting') || status.includes('data')) return <FaSpinner className="animate-spin text-gray-500" />;
        return <FaLocationArrow className="text-blue-500" />;
    };

    const getStatusBarClass = (status) => {
        if (status.includes('Error')) return 'text-red-600';
        if (status.includes('updated')) return 'text-green-600';
        return 'text-gray-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 flex flex-col items-center py-12 px-6">

            <header className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between mb-6 backdrop-blur-lg">
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                    <FaSatelliteDish className="text-gray-700 text-3xl" />
                    <h1 className="text-2xl font-semibold text-gray-800">Live Location Tracker</h1>
                </div>
                <p className={`flex items-center gap-2 font-medium text-sm ${getStatusBarClass(locationStatus)}`}>
                    {getStatusIcon(locationStatus)} {locationStatus}
                </p>
            </header>

            <div className="w-full max-w-5xl h-[500px] rounded-xl overflow-hidden shadow-lg mb-6 border-2 border-gray-300">
                <MapContainer 
                    center={position} 
                    zoom={zoom} 
                    scrollWheelZoom={true}
                    className="w-full h-full rounded-xl"
                >
                    <ChangeView center={position} zoom={zoom} />
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright"></a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            <div className="text-gray-800 text-sm">
                                <h3 className="font-semibold mb-1">Current Coordinates</h3>
                                <p>Lat: {position.lat.toFixed(5)}</p>
                                <p>Lng: {position.lng.toFixed(5)}</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-blue-600">
                    <FaMapMarkerAlt className="text-gray-700 text-2xl mb-1" />
                    <span className="text-gray-500 text-sm">Latitude</span>
                    <strong className="text-gray-800 text-lg">{position.lat.toFixed(5)}</strong>
                </div>
                <div className="flex-1 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-indigo-600">
                    <FaMapMarkerAlt className="text-gray-700 text-2xl mb-1" />
                    <span className="text-gray-500 text-sm">Longitude</span>
                    <strong className="text-gray-800 text-lg">{position.lng.toFixed(5)}</strong>
                </div>
            </div>

            <footer className="mt-6 text-center text-gray-600">
                <p>&copy; 2023 Live Location Tracker. All Rights Reserved.</p>
            </footer>

        </div>
    );
};

export default LiveTracker;