let hobbyIndex = 0
let activeYearSection = null
let filters = []
const onDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches

function changeHobbyText() {
    const hobbiesLocales = {
        "en": [
            "programmer",
            "STEM enjoyer",
            "research enthusiast",
            "Valorant addict"
        ],
        "de": [
            "Programmierer",
            "MINT-Enthusiast",
            "Forschungsbegeisterter",
            "Valorant-Fanatiker"
        ],
        "zh": [
            "程序员",
            "STEM爱好者",
            "研究爱好者",
            "无畏契约迷"
        ]
    }
    const hobbies = hobbiesLocales[localStorage.getItem("language") || "en"]
    const hobbyElement = document.getElementById("hobby-text")

    if (!hobbyElement) return

    hobbyElement.style.opacity = 0

    setTimeout(() => {
        hobbyElement.innerText = hobbies[hobbyIndex]
        hobbyElement.style.opacity = 1

        hobbyIndex = (hobbyIndex + 1) % hobbies.length // loop back to 0 if length is exceeded
    }, 500); // matches in-out fade of css
}

function updateAgeText() {
    const ageElement = document.getElementById("age-text")
    const age = new Date().getFullYear() - 2008

    if (!ageElement) return
    if (!age) return

    ageElement.innerText = age
}

function updateCurrentYearText() {
    const currentYearElement = document.getElementById("current-year-text")

    if (!currentYearElement) return

    currentYearElement.innerText = new Date().getFullYear()
}

function toggleLanguageOptions() {
    document.getElementById("language-options")?.classList.toggle("active")
}

function toggleLanguage(language) {
    toggleLanguageOptions()

    const locale = language.id
    setLanguage(locale).then(() => {
        updateFiltersAfterLanguageChange()
    })
}

async function setLanguage(locale) {
    // underline current language
    const languageOptionElement = document.getElementById("language-options")
    const selectedLanguage = document.getElementById(locale)
    if (languageOptionElement) {
        for (let child of languageOptionElement.children) {
            child.style.textDecoration = "none"
        }
        selectedLanguage.style.textDecoration = "underline"
    }

    localStorage.setItem("language", locale)
    const response = await fetch(`/locales/${locale}.json`)
    const localeJSON = await response.json()
    const translations = localeJSON.translations

    translations.forEach(translation => {
        const id = translation.id
        const className = translation.class
        const content = translation.content

        if (id) {
            const element = document.getElementById(id)
            if (!element) return
            element.innerHTML = content
        } else {
            const elements = document.getElementsByClassName(className)
            for (let element of elements) {
                element.innerHTML = content
            }
        }
    })
}

function toggleFilters() {
    document.getElementById("category-filters")?.classList.toggle("active")
}

function toggleHamburgerMenu(x) {
    const overlay = document.getElementById("overlay")
    const menuItems = document.getElementById("menu-items")

    if (!overlay) return
    if (!menuItems) return

    x.classList.toggle("change")
    overlay.classList.toggle("change")
    for (let i = 0; i <= menuItems.childElementCount; i++) {
        menuItems.children[i]?.classList.toggle("change")
    }
}

function updateCurrentYearIndicator() {
    const sections = document.querySelectorAll(".achievement, .experience")
    const links = document.querySelectorAll(".years p")

    if (!sections) return
    if (!links) return

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 400 && rect.bottom >= 320) {
            if (section.classList[1] !== activeYearSection) {
                activeYearSection = section.classList[1]
            }
        }
    });

    links.forEach(link => {
        if (`${link.innerText}-achievement` === activeYearSection ||
            `${link.innerText}-experience` === activeYearSection
        ) {
            link.classList.add("current-year-active")
        } else {
            link.classList.remove("current-year-active")
        }
    })
}

function jumpToSection(year) {
    const section =
        document.getElementsByClassName(`${year.innerText}-achievement`)[0] ||
        document.getElementsByClassName(`${year.innerText}-experience`)[0]

    if (section) {
        section.scrollIntoView()
    }
}

function updateFiltersAfterLanguageChange() {
    filters = [...document.getElementsByClassName("checkbox")]
        .filter(el => el.offsetParent !== null && el.classList.contains("active"))
        .map(c => c.parentElement.innerText.trim())
}

function filterListByCategory(checkbox) {
    if (!checkbox) return

    let entriesExist = false
    const nothingHereDiv = document.getElementById("achievements-nothing-here") ||
                            document.getElementById("experiences-nothing-here")

    if (!checkbox.className.includes("active")) {
        filters.push(checkbox.parentNode.innerText.trim())
    } else {
        filters = filters.filter(filter => filter !== checkbox.parentNode.innerText.trim())
    }

    let entries = document.querySelectorAll(".achievement, .experience")
    for (let entry of entries) {
        let categoryElements = entry.querySelectorAll(".category p")
        let categoryList = []

        categoryElements.forEach(element => {
            categoryList.push(element.innerHTML)
        })

        if (!filters.every(value => categoryList.includes(value))) {
            entry.style.display = "none"
        } else {
            entry.style.display = "block"
            entriesExist = true
        }
    }

    nothingHereDiv.style.display = !entriesExist ? "block" : "none"
    checkbox.classList.toggle("active")
}

function hideMenus(event) {
    const categoryFiltersElement = document.getElementById("category-filters")
    const categoryFilterButton = document.querySelector(".filter-menu img")
    const languageOptionsElement = document.getElementById("language-options")
    const languageOptionsButton = document.querySelector(".translate-menu img")

    if (categoryFiltersElement &&
        categoryFiltersElement.classList.contains("active") &&
        !categoryFiltersElement.contains(event.target) &&
        !categoryFilterButton.contains(event.target)
    ) {
        categoryFiltersElement.classList.remove("active")
    }

    if (languageOptionsElement &&
        languageOptionsElement.classList.contains("active") &&
        !languageOptionsElement.contains(event.target) &&
        !languageOptionsButton.contains(event.target)
    ) {
        languageOptionsElement.classList.remove("active")
    }
}

function showHighlightImage(directory, descriptionCode) {
    const descriptionCodes = {
        "shibaura-presentation": {
            "en": "Presentation at the Shibaura Institute of Technology (2024)",
            "zh": "在芝浦工业大学演讲 (2024)",
            "de": "Präsentation am Shibaura Institute of Technology (2024)"
        },
        "jsrc": {
            "en": "Junior Science Research Camp (2024)",
            "zh": "青少年科学研究营 (2024)",
            "de": "Junior Science Research Camp (2024)"
        },
        "dhs-hci": {
            "en": "Buddies from Dominion High School, Virginia, USA (2024)",
            "zh": "来自美国弗吉尼亚州多米尼恩高中的伙伴 (2024)",
            "de": "Freunde von der Dominion High School, Virginia, USA (2024)"
        }
    }
    let description = descriptionCodes[descriptionCode][localStorage.getItem("language")]

    if (onDesktop) {
        const imageElement = document.getElementById("event-image")
        const descriptionElement = document.getElementById("event-image-description")
    
        imageElement.setAttribute("src", directory)
        descriptionElement.innerText = description
        imageElement.parentElement.classList.add("active")
    } else {
        const overlay = document.getElementById("image-overlay")
        const imageElement = document.getElementById("image-overlay-image")
        const descriptionElement = document.getElementById("image-overlay-description")

        imageElement.setAttribute("src", directory)
        descriptionElement.innerText = description
        overlay.classList.add("active")

        setTimeout(() => {
            overlay.onclick = () => hideImageOverlay();
        }, 100);
    }
}

function clearImageBottomRight() {
    const imageElement = document.getElementById("event-image")
    imageElement.parentElement.classList.remove("active")
}

function hideImageOverlay() {
    const overlay = document.getElementById("image-overlay")
    overlay.classList.remove("active")

    overlay.onclick = null // prevent conflicts
}

setLanguage(localStorage.getItem("language") || "en").then(() => {
    changeHobbyText()
    updateAgeText()
    updateCurrentYearText()
    updateCurrentYearIndicator()
    filterListByCategory([...document.getElementsByClassName("checkbox-highlight")].find(el => el.offsetParent !== null))

    setInterval(changeHobbyText, 3000) // every 3 seconds
    window.addEventListener('scroll', updateCurrentYearIndicator); // Listen for scroll events
    window.addEventListener("click", hideMenus)
})