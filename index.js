const request = require('superagent')

const testGender = (args, callback) => {
  let { number, actionType, top } = args

  request.get(`https://randomuser.me/api/?results=${number}`)
    .end((err, res) => {
      if (err) {
        callback(err.message)
        return
      }
      const users = !number ? [] : res.body.results
      top = top === undefined ? 0 : top

      request.post('https://census-toy.nceng.net/prod/toy-census', { actionType, users, top })
        .end((error, { body }) => {
          if (top) console.log(body, top, '<<<<<<')
          error ? callback(error) :
            callback(null, {
              femaleUsers: users.reduce((sum, obj) => sum + (obj.gender === 'female'), 0),
              maleUsers: users.reduce((sum, obj) => sum + (obj.gender === 'male'), 0),
              results: body
            })
        })
    })
}

const testCountry = (args, callback) => {
  const { number, actionType } = args

  request.get(`https://randomuser.me/api/?results=${number}`)
    .end((err, res) => {
      if (err) {
        callback(err.message)
        return
      }
      const users = res.body.results
      const countryMap = new Map()
      users.forEach(obj => {
        countryMap.has(obj.nat) ? countryMap.set(obj.nat, countryMap.get(obj.nat) + 1) :
          countryMap.set(obj.nat, 1)
      })

      request.post('https://census-toy.nceng.net/prod/toy-census', { actionType, users })
        .end((error, { body }) => {
          error ? callback(err.message) : callback(null, { countryMap, results: body })
        })
    })
}

const testPassword = (args, callback) => {
  let { number, actionType, top } = args

  request.get(`https://randomuser.me/api/?results=${number}`)
    .end((err, res) => {
      if (err) {
        callback(err.message)
        return
      }
      const users = res.body.results
      top = top === undefined ? 0 : top
      const passwords = users.map(obj => obj.login.password)

      request.post('https://census-toy.nceng.net/prod/toy-census', { actionType, users, top })
        .end((error, { body }) => {
          error ? callback(error.message) : callback(null, { passwords, results: body })
        })
    })
}

module.exports.tests = {
  testGender,
  testCountry,
  testPassword
}
