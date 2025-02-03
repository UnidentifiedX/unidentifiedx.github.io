const debugging = getComputedStyle(document.body).getPropertyValue("--debug-flag") == 1
let atEndOfPage = false

// go to the top of the page
scroll({
    top: 0,
    left: 0,
    behavior: "instant"
})

function scrollSlowly() {
    if (!atEndOfPage) {
        window.scrollBy(0, 1);
        setTimeout(() => {
            scrollSlowly()
        }, 30);
    }
}

function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("animate")
        }
    })
}, {
    root: null,
    rootMargin: "-30% 0px -50% 0px",
    threshold: 0.5
})

const timelineEvents = document.getElementsByClassName("timeline-event")
for (let e of timelineEvents) {
    observer.observe(e)
}
// timelineEvents[0].classList.add("animate")

const centerTimeline = document.getElementById("center-line")
const maxHeight = 150 // in rem
const contentHeight = 120
let currentHeight = 0 
let duration = remToPx(contentHeight) * 30
let startTime = null

function expandCenterLine(timestamp) {
    if (!startTime) startTime = timestamp

    let elapsed = timestamp - startTime
    let percentageProgress = Math.min(elapsed / duration, 1)
    currentHeight = percentageProgress * contentHeight
    centerTimeline.style.height = `${currentHeight}rem`

    // if animation is not completed
    if (currentHeight < contentHeight) {
        requestAnimationFrame(expandCenterLine);
    } else {
        atEndOfPage = true
    }
}

setTimeout(() => {
    if (debugging) return

    requestAnimationFrame(expandCenterLine)
    scrollSlowly()
}, 2500); 