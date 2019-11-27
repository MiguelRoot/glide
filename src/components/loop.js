import { define } from '../utils/object'
import { isNumber } from '../utils/unit'

export default function (Glide, Components, Events) {
  const Loop = {
    mount() {
      var observerOptions = {
        attributes: true,
        attributeFilter: ["style"]
      }

      var observer = new MutationObserver((mutations) => {
        let regrex = /-?\d+(.\d+)?px/g
        let values = regrex.exec(mutations[0].target.style.transform)
        let value = values[0].replace('px', '')

        console.log(value, Components.Sizes.slideWidth * Glide.settings.perView)

        Loop.reset(Loop.slidesEnd, Loop.indexesEnd)
        Loop.reset(Loop.slidesStart, Loop.indexesStart)

        if ((value >= Components.Sizes.slideWidth * Glide.settings.perView) || (value >= 0)) {
            Loop.setEndSlides()
            // Loop.reset(Loop.slideWsStart, Loop.indexesStart)
        } else if (
          value
          <=
          -(Components.Sizes.wrapperSize
            - (Components.Sizes.slideWidth * (
                Glide.settings.perView - (Glide.settings.focusAt + 1)
              )
            )
            - Components.Gaps.value * (
                Glide.settings.perView - (Glide.settings.focusAt + 1)
              )
            ).toFixed(2)
        ) {
              Loop.setStartSlides()
            // Loop.reset(Loop.slidesEnd, Loop.indexesEnd)
        }
      })

      observer.observe(Components.Html.wrapper, observerOptions);
    },

    setEndSlides() {
      let { slideWidth } = Components.Sizes

      this.slidesEnd.forEach((slide, i) => {
        slide.style.left = `-${(slideWidth * (i + 1)) + (Components.Gaps.value * (i + 1))}px`
      })
    },

    setStartSlides() {
      let { slideWidth } = Components.Sizes

      this.slidesStart.forEach((slide, i) => {
        slide.style.left = `${((slideWidth * (i + 1)) + (slideWidth * Components.Run.length)) + ((Components.Gaps.value * (i + 1)) + (Components.Run.length * Components.Gaps.value))}px`
      })
    },

    reset (slides, indexes) {
      for (let i = 0; i < slides.length; i++) {
        let index = indexes[i]

        slides[i].style.position = 'absolute'
        slides[i].style.top = '0px'
        slides[i].style.left = `${(Components.Sizes.slideWidth * indexes[i]) + (Components.Gaps.value * indexes[i])}px`
      }
    }
  }

  define(Loop, 'number', {
    get () {
      let { focusAt, perView } = Glide.settings

      if (focusAt === 'center') {
        return perView + Math.floor(perView / 2)
      }

      if ((focusAt + 1) >= Math.round(perView / 2)) {
        return perView + focusAt
      }

      return perView + (perView - (focusAt + 1))
    }
  })

  define(Loop, 'slidesEnd', {
    get () {
      return Components.Html.slides.slice(`-${Loop.number}`).reverse()
    }
  })

  define(Loop, 'slidesStart', {
    get () {
      return Components.Html.slides.slice(0, Loop.number)
    }
  })

  define(Loop, 'indexesEnd', {
    get () {
      let indexes = []

      for (let i = 0; i < Loop.number; i++) {
        indexes.push((Components.Html.slides.length - 1) - i)
      }

      return indexes
    }
  })

  define(Loop, 'indexesStart', {
    get () {
      let indexes = []

      for (let i = 0; i < Loop.number; i++) {
        indexes.push(i)
      }

      return indexes
    }
  })

  return Loop
}
