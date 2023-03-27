const submitBtn = document.getElementById("submitBtn");
const cityName = document.getElementById("cityName");
const city_name = document.getElementById('city_name');
const temp_real_val = document.getElementById('temp_real_val');
const temp_status = document.getElementById('temp_status');

const datahide = document.querySelector(".main_layer")
const getInfo = async (event) => {
    event.preventDefault();
    let cityVal = cityName.value;
    if (cityVal == "") {
        city_name.innerText = `Plz Write The Name Before Search`;
        datahide.classList.add('data_hide');
    } else {
        try {

            let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=f4926a39bd02b8137c1411b11d89d492`;
            const response = await fetch(url);
            const data = await response.json();
            // console.log(data);
            const arrData = [data];
            // console.log(arrData);
            // console.log(response);
            city_name.innerText = `${arrData[0].name},${arrData[0].sys.country}`;
            temp_real_val.innerText = arrData[0].main.temp;
            const tempMood = arrData[0].weather[0].main;

            if (tempMood == "Clear") {
                temp_status.innerHTML = "<i class='fas fa-sun' style='color: #eccc68;'></i>";
            }
            else if (tempMood == "Clouds") {
                temp_status.innerHTML = "<i class='fas fa-cloud' style='color: #f1f2f6;'></i>";
            }
            else if (tempMood == "Rain") {
                temp_status.innerHTML = "<i class='fas fa-cloud-rain' style='color: #a4b0be;'></i>";
            }
            else {
                temp_status.innerHTML = "<i class='fas fa-sun' style='color: #f1f2f6;'></i>";
            }
            datahide.classList.remove('data_hide');
        } catch {
            city_name.innerText = `Plz Enter The City Name Properly`;
            datahide.classList.add('data_hide');
        }
    }
}
submitBtn.addEventListener('click', getInfo)


// if (tempMood == "Clear") {
//     temp_status.innerText = "<i class='fas fa-sun' style='color: #eccc68;'></i>";
// }
// else if (tempMood == "Clouds") {
//     temp_status.innerText = "<i class='fas fa-clouds' style='color: #f1f2f6;'></i>";
// }
// else if (tempMood == "Rain") {
//     temp_status.innerText = "<i class='fas fa-clouds-rain' style='color: #a4b0be;'></i>";
// }
// else {
//     temp_status.innerText = "<i class='fas fa-cloud' style='color: #f1f2f6;'></i>";
// }