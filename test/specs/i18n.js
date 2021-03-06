import assert from 'power-assert'
import Vue from 'vue'
import compare from '../../src/compare'
import locales from './fixture/locales'


describe('i18n', () => {
  before(done => {
    Object.keys(locales).forEach(lang => {
      Vue.locale(lang, locales[lang])
    })
    Vue.config.lang = 'en'
    Vue.nextTick(done)
  })

  describe('Vue.t', () => {
    describe('en language locale', () => {
      it('should translate an english', () => {
        assert(Vue.t('message.hello') === locales.en.message.hello)
      })
    })

    describe('ja language locale', () => {
      it('should translate a japanese', () => {
        assert(Vue.t('message.hello', 'ja') === locales.ja.message.hello)
      })
    })

    describe('key argument', () => {
      describe('not specify', () => {
        it('should return empty string', () => {
          assert(Vue.t() === '')
        })
      })

      describe('empty string', () => {
        it('should return empty string', () => {
          assert(Vue.t('') === '')
        })
      })

      describe('not regist key', () => {
        it('should return key string', () => {
          assert(Vue.t('foo.bar') === 'foo.bar')
        })
      })

      describe('sentence fragment', () => {
        it('should translate fragment', () => {
          assert(Vue.t('hello world') === 'Hello World')
        })

        it('should return replaced string if available', () => {
          assert(
            Vue.t('Hello {0}', ['kazupon']),
            'Hello kazupon'
          )
        })

        it('should return key if unavailable', () => {
          assert(Vue.t('Hello') === 'Hello')
        })
      })
    })

    describe('format arguments', () => {
      context('named', () => {
        it('should return replaced string', () => {
          assert(
            Vue.t('message.format.named', { name: 'kazupon' }),
            'Hello kazupon, how are you?'
          )
        })
      })

      context('list', () => {
        it('should return replaced string', () => {
          assert(
            Vue.t('message.format.list', ['kazupon']),
            'Hello kazupon, how are you?'
          )
        })
      })
    })

    describe('language argument', () => {
      it('should return empty string', () => {
        assert(Vue.t('message.hello', 'ja') === locales.ja.message.hello)
      })
    })

    describe('format & language arguments', () => {
      it('should return replaced string', () => {
        assert(
          Vue.t('message.format.list', 'ja', ['kazupon']),
          'こんにちは kazupon, ごきげんいかが？'
        )
      })
    })
  })


  describe('$t', () => {
    describe('en language locale', () => {
      it('should translate an english', () => {
        const vm = new Vue()
        assert(vm.$t('message.hello') === locales.en.message.hello)
      })
    })

    describe('ja language locale', () => {
      it('should translate a japanese', () => {
        const vm = new Vue()
        assert(vm.$t('message.hello', 'ja') === locales.ja.message.hello)
      })
    })

    describe('key argument', () => {
      describe('not specify', () => {
        it('should return empty string', () => {
          const vm = new Vue()
          assert(vm.$t() === '')
        })
      })

      describe('empty string', () => {
        it('should return empty string', () => {
          const vm = new Vue()
          assert(vm.$t('') === '')
        })
      })

      describe('not regist key', () => {
        it('should return key string', () => {
          const vm = new Vue()
          assert(vm.$t('foo.bar') === 'foo.bar')
        })
      })

      describe('sentence fragment', () => {
        it('should translate fragment', () => {
          const vm = new Vue()
          assert(vm.$t('hello world') === 'Hello World')
        })

        it('should return replaced string if available', () => {
          const vm = new Vue()
          assert(
            vm.$t('Hello {0}', ['kazupon']),
            'Hello kazupon'
          )
        })

        it('should return key if unavailable', () => {
          const vm = new Vue()
          assert(vm.$t('Hello') === 'Hello')
        })
      })
    })

    describe('format arguments', () => {
      context('named', () => {
        it('should return replaced string', () => {
          const vm = new Vue()
          assert(
            vm.$t('message.format.named', { name: 'kazupon' }),
            'Hello kazupon, how are you?'
          )
        })
      })

      context('list', () => {
        it('should return replaced string', () => {
          const vm = new Vue()
          assert(
            vm.$t('message.format.list', ['kazupon']),
            'Hello kazupon, how are you?'
          )
        })
      })
    })

    describe('language argument', () => {
      it('should return empty string', () => {
        const vm = new Vue()
        assert(vm.$t('message.hello', 'ja') === locales.ja.message.hello)
      })
    })

    describe('format & language arguments', () => {
      it('should return replaced string', () => {
        const vm = new Vue()
        assert(
          vm.$t('message.format.list', 'ja', ['kazupon']),
          'こんにちは kazupon, ごきげんいかが？'
        )
      })
    })
  })


  describe('reactive translation', () => {
    it('should translate', done => {
      const options = {
        data: () => {
          return { lang: 'en' }
        },
        el: () => {
          const el = document.createElement('div')
          document.body.appendChild(el)
          return el
        }
      }

      if (compare(Vue.version, '2.0.0-alpha') < 0) {
        options.template = '<p>{{ $t("message.hello", lang) }}</p>'
      } else {
        options.render = function () {
          return this.$createElement('p', {}, [this.__toString__(this.$t('message.hello', this.lang))])
        }
      }

      const ViewModel = Vue.extend(options)
      const vm = new ViewModel()

      const el = vm.$el
      Vue.nextTick(() => {
        assert(el.textContent === locales.en.message.hello)

        Vue.set(vm, 'lang', 'ja') // set japanese
        Vue.nextTick(() => {
          assert(el.textContent === locales.ja.message.hello)
          done()
        })
      })
    })
  })


  describe('translate component', () => {
    it('should translate', done => {
      const compOptions = {}
      if (compare(Vue.version, '2.0.0-alpha') < 0) {
        compOptions.template = '<p>{{* $t("message.hoge") }}</p>'
      } else {
        compOptions.render = function () {
          return this.$createElement('p', {}, [this.__toString__(this.$t('message.hoge'))])
        }
      }

      const options = {
        el: () => {
          const el = document.createElement('div')
          document.body.appendChild(el)
          return el
        },
        components: { hoge: compOptions }
      }

      if (compare(Vue.version, '2.0.0-alpha') < 0) {
        options.template = '<div><p>{{ $t("message.hello") }}</p><hoge></hoge></div>'
      } else {
        options.render = function () {
          return this.$createElement('div', {}, [
            this.$createElement('p', {}, [this.__toString__(this.$t('message.hello'))]),
            this.$createElement('hoge', {})
          ])
        }
      }

      const ViewModel = Vue.extend(options)
      const vm = new ViewModel()

      Vue.nextTick(() => {
        const child = vm.$el.children[1]
        assert(child.textContent === locales.en.message.hoge)

        const parent = vm.$el.children[0]
        assert(parent.textContent === locales.en.message.hello)

        done()
      })
    })
  })


  describe('global lang config', () => {
    let vm
    beforeEach(done => {
      vm = new Vue()
      vm.$nextTick(done)
    })

    afterEach(done => {
      vm.$destroy()
      vm = null
      Vue.nextTick(done)
    })

    context('ja', () => {
      it('should translate with japanese', done => {
        Vue.config.lang = 'ja'
        Vue.nextTick(() => {
          assert(vm.$t('message.hello') === locales.ja.message.hello)
          done()
        })
      })

      context('en', () => {
        it('should translate with english', done => {
          Vue.config.lang = 'en'
          Vue.nextTick(() => {
            assert(vm.$t('message.hello') === locales.en.message.hello)
            done()
          })
        })
      })
    })
  })
})
