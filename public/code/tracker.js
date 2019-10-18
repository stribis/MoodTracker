fetchData ()
async function fetchData () {
  const response = await fetch('/api')
  const data = await response.json()
  console.log(data)
  console.log(data)
  let counter = 0;
  data.forEach(item => {
    counter++
    const container = document.createElement('div')
    container.classList.add('entry')
    
    console.log(item.air)
   
   
    let airText;
    let airClass;


    if(item.air < 51){
      airText = 'Good'
      airClass = 'aq1'
    }else if(item.air > 50 && item.air < 101){
      airText = 'Moderate'
      airClass = 'aq2'
    }else if(item.air > 100 && item.air < 151){
      airText = 'Unhealthy for Sensitive Groups'
      airClass = 'aq3'
    }else if(item.air > 150 && item.air < 201){
      airText = 'Unhealthy'
      airClass = 'aq4'
    }else if(item.air > 200 && item.air < 301){
      airText = 'Very Unhealthy'
      airClass = 'aq5'
    }else if(item.air > 300){
      airText = 'Hazardous'
      airClass = 'aq6'
    }

    container.innerHTML = `
    <section class="mood_container">
      <p class="counter">${counter}</p>
      <p class="date">${new Date(item.timestamp).toLocaleString()}</p>
      <p class="mood">${item.mood_info.mood}</p>
      <div class="face_container"><img class="face" src="${item.mood_info.face}" alt="Picure of a mood"></div>
      <div class="more_info">
        <div class="weatherDis" >
          <i class="fas fa-thermometer-empty"></i>
          <div>
            <div class="temp">${item.weather_status.temperature}</div>
            <div class="summary">${item.weather_status.summary}</div>
          </div>
        </div>
        <div>
          <i class="fas fa-map-marker-alt"></i>
          <p class="location" title="${item.location.latitude}°, ${item.location.longitude}°" >${item.location.city}</p>
        </div>
        <div class="airDis" >
          <div><i class="fas fa-wind"></i></div>
          <div>
            <div class="aqi">AQI: ${item.air}</div>
            <div class="aqi_text ${airClass}">${airText}</div>
          </div>
          
        </div>
      </div>
    </section>
    `

    document.querySelector('main').append(container)
  }
  )

}
