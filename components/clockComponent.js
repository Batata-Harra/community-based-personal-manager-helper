const template = document.createElement("template");

template.innerHTML = `
<style>
.clock-container {
    display: grid;
    grid-gap: 24px;
}
.clock {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: var(--accent-light);
    margin: auto;
    position: relative;
    border: 14px solid var(--color);
    display: inline-block;
}

.center {
    background-color: #000;
    position: absolute;
    left: calc(50% - 8px);
    top:  calc(50% - 8px);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    z-index: 20;
}

.hourHand {
    width: 7px;
    height: 50px;
    background-color: #000;
    transform-origin: bottom center;
    border-radius: 4px;
    position: absolute;
    top: 50px;
    left: 97px;
    z-index: 10;
    transition-timing-function: cubic-bezier(0.1, 2.7, 0.58, 1);
    transform: rotate(360deg);
}

.minuteHand{
    width: 3px;
    height: 80px;
    background-color: #000;
    transform-origin: bottom center;
    border-radius: 4px;
    position: absolute;
    top: 20px;
    left: 98px;
    z-index: 9;
    transition-timing-function: cubic-bezier(0.1, 2.7, 0.58, 1);
      transform: rotate(90deg);

}

.secondHand{
    width: 1px;
    height: 80px;
    background-color:red;
    transform-origin: bottom center;
    border-radius: 4px;
    position: absolute;
    top: 20px;
    left: 100px;
    transition: all 0.06s;
    transition-timing-function: cubic-bezier(0.1, 2.7, 0.58, 1);
    z-index: 8;
      transform: rotate(360deg);

}
.time-container {
    display: grid;
}
.time {
    border: 1px solid #fff8dc;
    background-color: var(--background-color);
    padding: 5px;
    display: inline-block;
    margin: auto;
    box-shadow: inset 0 2px 5px rgba(0,0,0,.4);
    border-radius: 5px;
    min-width: 47px;
    height: 10px;

}
.time small{
    color:red;
    transition: all 0.05s;
    transition-timing-function: cubic-bezier(0.1, 2.7, 0.58, 1);
}

.clock ul{
    list-style: none;
    padding: 0;

}

.clock ul li{
    position: absolute;
    width:14px;
    height:14px;
    text-align: center;
    line-height: 14px;
    font-size: 7px;
    color:red;
}

.clock ul li:nth-child(1){
    right: 22%;
    top:6.5%;
}

.clock ul li:nth-child(2){
    right: 6%;
    top:25%;
}

.clock ul li:nth-child(3){
    right: 1%;
    top:calc(50% - 7px);
    color:#000;
    font-size: 14px;
    font-weight: bold;
}

.clock ul li:nth-child(4){
    right: 6%;
    top:69%;
}

.clock ul li:nth-child(5){
    right: 22%;
    top:84%;
}

.clock ul li:nth-child(6){
    right: calc(50% - 7px);
    top:calc(99% - 14px);
    color:#000;
    font-size: 14px;
    font-weight: bold;
}

.clock ul li:nth-child(7){
    left: 22%;
    top:84%;
}

.clock ul li:nth-child(8){
    left: 6%;
    top:69%;
}
.clock ul li:nth-child(9){
    left: 1%;
    top:calc(50% - 7px);
    color:#000;
    font-size: 14px;
    font-weight: bold;
}
.clock ul li:nth-child(10){
    left: 6%;
    top:25%;
}

.clock ul li:nth-child(11){
    left: 22%;
    top:6.5%;
}

.clock ul li:nth-child(12){
    right: calc(50% - 7px);
    top:1%;
    color: #000;
    font-size: 14px;
    font-weight: bold;
}

</style>
<div class="clock-container">
  <div class="clock">
    <div class="hourHand"></div>
    <div class="minuteHand"></div>
    <div class="secondHand"></div>
    <div class="center"></div>
    <ul>
      <li><span>1</span></li>
      <li><span>2</span></li>
      <li><span>3</span></li>
      <li><span>4</span></li>
      <li><span>5</span></li>
      <li><span>6</span></li>
      <li><span>7</span></li>
      <li><span>8</span></li>
      <li><span>9</span></li>
      <li><span>10</span></li>
      <li><span>11</span></li>
      <li><span>12</span></li>
    </ul>
  </div>
  <div class="time-container">
      <div class="time"></div>
  </div>
</div>
<audio src="/click-audio.mp3" class="audio"   ></audio>
`;

class ClockItem extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    
    const hourHand = this.shadowRoot.querySelector('.hourHand');
    const minuteHand = this.shadowRoot.querySelector('.minuteHand');
    const secondHand = this.shadowRoot.querySelector('.secondHand');
    const time = this.shadowRoot.querySelector('.time');
    const clock = this.shadowRoot.querySelector('.clock');
    const audio = this.shadowRoot.querySelector('.audio')
    const timeZone = this.getAttribute('timezone')
    function setDate() {
      const today = new Date()
      const formatter = new Intl.DateTimeFormat([], {
        timeZone: timeZone,
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
      const timeString = formatter.format(today)
      // Get second from string "HH:MM:SS"
      const second = timeString.slice(6, 8)
      const secondDeg = ((second / 60) * 360) + 360
      secondHand.style.transform = `rotate(${secondDeg}deg)`
  
      // Get minute from string "HH:MM:SS"
      const minute = timeString.slice(3, 5)
      const minuteDeg = ((minute / 60) * 360)
      minuteHand.style.transform = `rotate(${minuteDeg}deg)`
  
      // Get hour from string "HH:MM:SS"
      const hour = timeString.slice(0, 2)
      const hourDeg = ((hour / 12) * 360)
      hourHand.style.transform = `rotate(${hourDeg}deg)`
  
      console.log({
        hour, minute, time, timeString,
      })
      if (minute === 0 && second === 0) {
        audio.play()
      }
      time.innerHTML = '<span>' + '<strong>' + hour + '</strong>' + ' : ' + minute + ' : ' + '<small>' + second + '</small>' + '</span>'
  
    }
  
    setInterval(setDate, 1000);
  
  }
}

window.customElements.define("clock-item", ClockItem);
