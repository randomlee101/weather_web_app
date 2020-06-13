$(document).ready(function () {
    var checked;
    var url;
    $("input[type='radio']").click(function () {

        checked = $("input[name='search']:checked").val();

        if (checked == "city_name") {
            $("#first_entry").text("City Name");
            $("#second_entry").text("Country Code");
            $("#first").attr("type", "text");
            $("#second").attr("type", "text");
            $("#first").attr("name", checked);
            $("#second").attr("name", "country_code");
            $("#second").attr("pattern", "[A-Z]{2}");
            $("#second").attr("oninvalid", "setCustomValidity(\"Please enter 2 upper case country code\")");
        }
        if (checked == "postal_code") {
            $("#first_entry").text("Postal Code");
            $("#second_entry").text("Country Code");
            $("#first").attr("name", checked);
            $("#second").attr("name", "country_code");
            $("#second").attr("pattern", "[A-Z]{2}");
            $("#second").attr("oninvalid", "setCustomValidity(\"Please enter 2 upper case country code\")");
            $("#first").attr("type", "text");
            $("#second").attr("type", "text");
            $("#first").attr("pattern", "[A-Z][0-9][A-Z]");
            $("#first").attr("oninvalid", "setCustomValidity(\"Please enter a valid postal code (letter, number, letter)\")");
        }
        if (checked == "lat_long") {
            $("#first_entry").text("Longitude");
            $("#second_entry").text("Latitude");
            $("#first").attr("name", "longitude");
            $("#second").attr("name", "latitude");
            $("#first").attr("type", "number");
            $("#first").attr("min", "-180");
            $("#first").attr("max", "180");
            $("#first").attr("oninvalid", "setCustomValidity(\"Please enter longitude between -180 to +180\")");
            $("#first").attr("step","0.01");
            $("#second").attr("type", "number");
            $("#second").attr("min", "-90");
            $("#second").attr("max", "90");
            $("#second").attr("oninvalid", "setCustomValidity(\"Please enter latitude between -90 t0 +90\")");
            $("#second").attr("step","0.01");
        }
    });


    $("button").click(function (e) {

        if (checked == "city_name") {
            url = 'https://api.openweathermap.org/data/2.5/weather?q=' + $("#first").val() + ',' + $("#second").val() + '&appid=fc289847a14124c5af252354efe842ec';
        }

        if (checked == "postal_code") {
            url = 'https://api.openweathermap.org/data/2.5/weather?zip=' + $("#first").val() + ',' + $("#second").val() + '&appid=fc289847a14124c5af252354efe842ec';
        }

        if (checked == "lat_long") {
            url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + $("#second").val() + '&lon=' + $("#first").val() + '&appid=fc289847a14124c5af252354efe842ec';
        }

        if ($("#myForm")[0].checkValidity() == true) {
            $(".output").empty();
            $(".output").append("<h2>Current Weather</h2>");
            $(".output").append("<p id=\"city\">City</p>");
            $(".output").append("<p id=\"country\">Country</p>");

            $.each($("input[name='show']:checked"), function () {
                var show = $(this).val();
                switch (show) {
                    case "longitude": $(".output").append("<p id=\"lon\">" + show.toUpperCase() + "</p>"); break;
                    case "latitude": $(".output").append("<p id=\"lat\">" + show.toUpperCase() + "</p>"); break;
                    case "weather": $(".output").append("<p id=\"weather\">" + show.toUpperCase() + "</p>"); break;
                    case "temperature": $(".output").append("<p id=\"temp\">" + show.toUpperCase() + "</p>"); break;
                    case "pressure": $(".output").append("<p id=\"pressure\">" + show.toUpperCase() + "</p>"); break;
                    case "humidity": $(".output").append("<p id=\"humidity\">" + show.toUpperCase() + "</p>"); break;
                    case "wind speed": $(".output").append("<p id=\"wind_speed\">" + show.toUpperCase() + "</p>"); break;
                    case "wind direction": $(".output").append("<p id=\"wind_direction\">" + show.toUpperCase() + "</p>"); break;
                    case "sunrise": $(".output").append("<p id=\"sunrise\">" + show.toUpperCase() + "</p>"); break;
                    case "sunset": $(".output").append("<p id=\"sunset\">" + show.toUpperCase() + "</p>"); break;
                }
            });

            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'json',
                success: function (result, status, xhr) {

                    var sunrise = new Date(result["sys"]["sunrise"] * 1000);
                    var sunset = new Date(result["sys"]["sunset"] * 1000);
                    $(".output #city").append(": " + result["name"]);
                    $(".output #country").append(": " + result["sys"]["country"]);
                    $(".output #lon").append(": " + result["coord"]["lon"]);
                    $(".output #lat").append(": " + result["coord"]["lat"]);
                    $(".output #weather").append(": " + result["weather"][0]["description"]);
                    $(".output #temp").append(": " + (result["main"]["temp"] - 273.15).toFixed(2) + " degrees celsius");
                    $(".output #pressure").append(": " + result["main"]["pressure"]);
                    $(".output #humidity").append(": " + result["main"]["humidity"]);
                    $(".output #wind_speed").append(": " + result["wind"]["speed"]);
                    $(".output #wind_direction").append(": " + result["wind"]["deg"]);
                    $(".output #sunrise").append(": " + sunrise.toLocaleTimeString());
                    $(".output #sunset").append(": " + sunset.toLocaleTimeString());


                    var data;
                    if (localStorage.getItem("weather_log") === null) {
                        data = {
                            weather:
                                [
                                    {
                                        id: $.now().toString(),
                                        city: result["name"],
                                        country: result["sys"]["country"],
                                        lon: result["coord"]["lon"],
                                        lat: result["coord"]["lat"],
                                        weather: result["weather"][0]["description"],
                                        temp: (result["main"]["temp"] - 273.15).toFixed(2),
                                        pressure: result["main"]["pressure"],
                                        humidity: result["main"]["humidity"],
                                        wind_speed: result["wind"]["speed"],
                                        wind_direction: result["wind"]["deg"],
                                        sunrise: sunrise.toLocaleTimeString(),
                                        sunset: sunset.toLocaleTimeString()
                                    },
                                ]
                        }


                        var data2 = JSON.stringify(data);

                        localStorage.setItem("weather_log", data2);
                    }
                    else {
                        var data3 = localStorage.getItem("weather_log");

                        var data4 = JSON.parse(data3);

                        data4.weather.push({
                            id: $.now().toString(),
                            city: result["name"],
                            country: result["sys"]["country"],
                            lon: result["coord"]["lon"],
                            lat: result["coord"]["lat"],
                            weather: result["weather"][0]["description"],
                            temp: (result["main"]["temp"] - 273.15).toFixed(2),
                            pressure: result["main"]["pressure"],
                            humidity: result["main"]["humidity"],
                            wind_speed: result["wind"]["speed"],
                            wind_direction: result["wind"]["deg"],
                            sunrise: sunrise.toLocaleTimeString(),
                            sunset: sunset.toLocaleTimeString()
                        });


                        var data2 = JSON.stringify(data4);

                        localStorage.setItem("weather_log", data2);

                    }




                },
                error: function (xhr, status, error) {
                    alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                }
            });
            console.log('true');
            e.preventDefault();
            $("#myForm")[0].reset();

        }
        else {
            console.log('false');
        }

    }

    )

    if (localStorage.getItem("weather_log") === null) {

    }
    else {
        var data3 = localStorage.getItem("weather_log");

        var data4 = JSON.parse(data3);

        for (var i = 0; i < data4.weather.length; i++) {
            console.log(data4.weather[i].id, data4.weather[i].city);
            $("tbody").append("<tr id=\"" + data4.weather[i].id + "\"></tr>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].city + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].country + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].lon + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].lat + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].weather + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].temp + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].pressure + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].humidity + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].wind_speed + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].wind_direction + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].sunrise + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td>" + data4.weather[i].sunset + "</td>");
            $("tbody #" + data4.weather[i].id).append("<td><button onclick=\"delete_row(" + data4.weather[i].id + "," + i + ")\">delete row</button></td>");
        }
    }

});

function updateMessage() {
    $("#first")[0].setCustomValidity("");
    $("#second")[0].setCustomValidity("");
}

function deleteAll() {
    localStorage.clear();
    $("tbody").empty();
}

function delete_row(row, i) {
    $("#" + row).remove();
    var data3 = localStorage.getItem("weather_log");

    var data4 = JSON.parse(data3);

    data4.weather.splice(i, 1);

    var data2 = JSON.stringify(data4);

    localStorage.setItem("weather_log", data2);
}