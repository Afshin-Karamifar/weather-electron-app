import React, { useEffect, useState, useRef } from "react";
import cities from "./cities";
import "./App.css";
const { ipcRenderer } = window.require("electron");
const _ = require("lodash");

type Weather = {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: string;
    uv: number;
    air_quality: {};
  };
};

const App = () => {
  const [allCities, setAllCities] = useState<Weather[]>([]);
  const [filteredCities, setFilteredCities] = useState<Weather[]>([]);
  const searchFilter = useRef<HTMLInputElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!isLoaded.current) {
      Promise.all(
        cities.map((location) => {
          return fetch(
            `http://api.weatherapi.com/v1/current.json?key=5c58dd834fe7413fa2391645231001&q=${location.city}&aqi=yes`
          )
            .then((response) => response.json())
            .then((data) => {
              return data;
            });
        })
      ).then((value) => {
        setAllCities(value);
        setFilteredCities(value);
      });
      isLoaded.current = true;
    }
  }, []);

  const onChangeHandler = () => {
    setFilteredCities(
      allCities.filter(
        (city: Weather) =>
          city.location.name
            .toLowerCase()
            .toLowerCase()
            .indexOf(searchFilter.current?.value.toLocaleLowerCase()!) >= 0
      )
    );
  };

  return (
    <div className="home-container">
      <div className="header-container">
        <p
          className="close-button"
          onClick={() => ipcRenderer.send("close-window")}
        >
          &times;
        </p>
        <div className="search-container">
          <input
            className="search-box"
            ref={searchFilter}
            onChange={() => onChangeHandler()}
          ></input>
          <img className="search-icon" src="search.svg" alt="search" />
        </div>
      </div>
      <div className="card-container">
        {_.sortBy(filteredCities, "location.name")?.map((city: Weather) => (
          <div className="weather-card" key={crypto.randomUUID()}>
            <div className="location-container">
              <img className="location" src="location.svg" alt="weather" />
              <p className="c-name">{city.location.name}</p>
            </div>
            <div className="weather-temp-container">
              <img
                className="weather-icon"
                src={city.current.condition.icon}
                alt="weather"
              />
              <>
                <p className="c-temp-f">{city.current.temp_f} &#8457;/</p>
                <p className="c-temp-c">{city.current.temp_c} &#8451;</p>
              </>
            </div>
            <p className="weather-type">{city.current.condition.text}</p>
            <div className="info">
              <div>
                <p>{city.current.wind_kph}km/h</p>
                <p>Wind</p>
              </div>
              <div>
                <p>{city.current.humidity}%</p>
                <p>Humidity</p>
              </div>
              <div>
                <p>
                  {city.current.feelslike_f} &#8457;/{city.current.feelslike_c}{" "}
                  &#8451;
                </p>
                <p>Feels Like</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
