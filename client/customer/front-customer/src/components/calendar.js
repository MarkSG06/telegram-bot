class Calendar extends HTMLElement
{
  constructor ()
  {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    const now = new Date()
    this.currentYear = now.getFullYear()
    this.currentMonth = now.getMonth()
  }

  connectedCallback ()
  {
    this.render()
  }

  changeMonth (offset)
  {
    this.currentMonth += offset

    if (this.currentMonth > 11) {
      this.currentMonth = 0
      this.currentYear++
    }

    if (this.currentMonth < 0) {
      this.currentMonth = 11
      this.currentYear--
    }

    this.render()
  }

  render ()
  {
    const today = new Date()
    const todayDay = today.getDate()
    const todayMonth = today.getMonth()
    const todayYear = today.getFullYear()

    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom']
    const monthName = new Date(this.currentYear, this.currentMonth)
      .toLocaleString('es-ES', { month: 'long' })

    let firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay()
    firstDay = firstDay === 0 ? 6 : firstDay - 1

    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate()

    this.shadow.innerHTML = `
          <style>
            .calendar {
            font-family: system-ui, sans-serif;
            width: 100%;
            max-width: 100%;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            background: white;
            }

            .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: #f4f6f8;
            text-transform: capitalize;
            font-weight: 600;
            }

            .header button {
            cursor: pointer;
            background: #e0e0e0;
            border: none;
            border-radius: 2rem;
            }

            .grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            }

            .day {
            padding: 1rem;
            text-align: center;
            font-weight: 600;
            background: #fafafa;
            border-bottom: 1px solid #eee;
            }

            .date {
            height: 80px;
            width: auto;
            padding: 1rem;
            text-align: center;
            border: 1px solid #eee;
            background: #fff;
            position: relative;
            }

            .today {
            background: #2563eb;
            color: #fff;
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
            font-weight: 700;
            border-radius: 1rem;
            }

            .today::after {
            content: 'HOY';
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            opacity: 0.8;
            }

            button svg {
            height: 20px;
            width: auto;
            padding: 1rem 2rem;
            }

            .header button:hover {
                background: #2563eb;
                color: white;
            }
        </style>

        <div class="calendar">
            <div class="header">
                <button id="prev">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path fill="currentColor"
                        d="M609.408 149.376L277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0a30.59 30.59 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.59 30.59 0 0 0 0-42.688a29.12 29.12 0 0 0-41.728 0" />
                    </svg>
                </button>
                <div>${monthName} ${this.currentYear}</div>
                <button id="next">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                    <path fill="currentColor"
                        d="M340.864 149.312a30.59 30.59 0 0 0 0 42.752L652.736 512L340.864 831.872a30.59 30.59 0 0 0 0 42.752a29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z" />
                    </svg>
                </button>
            </div>

            <div class="grid">
            ${days.map(d => `<div class="day">${d}</div>`).join('')}
            ${'<div class="date"></div>'.repeat(firstDay)}
            ${Array.from({ length: daysInMonth }, (_, i) =>
    {
      const day = i + 1
      const isToday =
        day === todayDay &&
        this.currentMonth === todayMonth &&
        this.currentYear === todayYear

      return `<div class="date ${isToday ? 'today' : ''}">${day}</div>`
    }).join('')}
            </div>
        </div>
      `

    this.shadow.getElementById('prev')
      .addEventListener('click', () => this.changeMonth(-1))

    this.shadow.getElementById('next')
      .addEventListener('click', () => this.changeMonth(1))
  }
}

customElements.define('calendar-component', Calendar)
