class WorkingTimelines extends HTMLElement {
  connectedCallback () {
    this.attachShadow({ mode: 'open' })
    const template = this.#getTemplate()
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    
  }
  
  #getStyle () {
    const workingHours = this.#getWorkingHours() // [17, 18, 19, 20, 21, 22, 23, 0]
    
    return (
      `
        <style>
        .timelines__container {
            display: grid;
            grid-gap: 8px;
        }
        .timeline__item {
            display: grid;
            grid-template-columns: 250px 1fr;
            grid-gap: 16px;
        }
        .timeline__label {
            padding: 16px;
            background: var(--accent-bg);
        }
        .timeline__hours {
            display: grid;
            grid-template-columns: repeat(${workingHours.length}, 1fr);
            grid-gap: 8px;
            text-align: center;
        }
        .timeline__hours > div {
            background: var(--accent-bg);
            color: var(--focus);
            font-size: 32px;
            font-weight: 600;
            display: grid;
            align-items: center;
        }
        </style>
      `
    )
  }
  
  #getWorkingHours () {
    const workingTimeStart = parseInt(this.getAttribute('working-time-start')) // 17
    const workingTimeEnd = parseInt(this.getAttribute('working-time-end')) // 0
    const workingHours = [] // [17, 18, 19, 20, 21, 22, 23, 0]
    
    for (let hour = 0; hour <= 24; hour++) {
      let time = (hour + workingTimeStart) > 24 ? (hour + workingTimeStart) % 24 : hour + workingTimeStart
      if (time === (workingTimeEnd + 1)) {
        break
      }
      workingHours.push(time)
    }
    
    return workingHours
  }
  #getTemplate () {
    const template = document.createElement('template')
    const timezones = this.getAttribute('timezones')
      .split(',')
      .map(timezone => timezone.trim().split('=>').map(timezoneItem => timezoneItem.trim()))
    const workingHours = this.#getWorkingHours() // [17, 18, 19, 20, 21, 22, 23, 0]
  
    template.innerHTML = `
    ${this.#getStyle()}

    <div class="working-timelines">
      <div class="timelines__container">
        ${
      timezones.map(timezone => {
        return (
          `
          <div class="timeline__item">
            <div class="timeline__label">
                <h2>${timezone[0]}</h2>
            </div>
            <div class="timeline__hours" data-timezone="${timezone}">
              ${
            workingHours.map(workingHour => {
              const today = (new Date()).setHours(workingHour)
              const formatter = new Intl.DateTimeFormat([], {
                timeZone: timezone[1],
                hour12: true,
                hour: 'numeric',
              })
              const timeString = formatter.format(today)
              return (
                `
                  <div data-time="${workingHour}">
                    ${timeString}
                  </div>
                `
              )
            }).join('')
          }
            </div>
          </div>
          `
        )
      }).join('')
    }
      </div>
    </div>
    `
    
    return template
  }
}

window.customElements.define('working-timelines', WorkingTimelines)
