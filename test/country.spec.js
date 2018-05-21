const expect = require('chai').expect
const { testCountry } = require('../index').tests
const countryCodes = require('../objectValues').countries

describe('Post User Info - Country', function () {
  //Generate random number of users information to test against - Range: 1000 - 2500
  const number = Math.floor(Math.random() * 1500 + 1000)

  it('Test results for requests - actionType "CountByCountry": Count', function (done) {
    this.timeout(10000)
    const args = { number, actionType: 'CountByCountry' }

    testCountry(args, function (err, { countryMap, results }) {
      if (!err) {

        //Test: Total number of unique countries returned by randomuser.me equals total number of unique countries returned by census-toy
        const totalRandomCountries = countryMap.size
        const totalCensusCountries = results.length
        expect(totalRandomCountries).to.equal(totalCensusCountries)

        //Test: Total number of users returned by randomuser.me equals total number of users requested
        let totalRandomUserCountries = 0
        for (const [country, value] of countryMap) {
          totalRandomUserCountries += value
        }
        expect(totalRandomUserCountries).to.equal(number)

        //Test: Total number of users returned by census-toy equals total number of users requested
        const totalCensusUsers = results.reduce((sum, obj) => sum + obj.value, 0)
        expect(totalCensusUsers).to.equal(number)

        //Test: User count per country returned by randomuser.me equals total returned by census-toy
        results.forEach(obj => {
          //Test: All country codes returned by randomuser.me also returned by census-toy
          expect(countryMap.has(obj.name)).to.equal(true)
          //Test: Total number of users per country returned by randomuser.me equals number returned per country by census-toy
          expect(countryMap.get(obj.name)).to.equal(obj.value)
        })

        //Test: Values for country codes are returned by census-toy are listed in descending order
        let prevVal = null
        results.forEach(obj => {
          if (prevVal) {
            const bool = prevVal >= obj.value
            expect(bool).to.equal(true)
          }
          prevVal = obj.value
        })
      }
      else console.log(err)
      done()
    })

  })

  it('Test results for requests - actionType "CountByGender": Format', function (done) {
    this.timeout(10000)
    const args = { number, actionType: 'CountByCountry' }

    testCountry(args, function (err, { countryMap, results }) {
      if (!err) {

        //Test: Returned data processed from randomuser.me has been formatted correctly
        expect(countryMap instanceof Object).to.equal(true)

        //Test: Returned data from census-toy is formatted correctly
        expect(Array.isArray(results)).to.equal(true)
        results.forEach(obj => {
          //Each object within the results array contains a 'name' key
          expect('name' in obj).to.equal(true)
          //Each object within the results array contains a 'value' key
          expect('value' in obj).to.equal(true)
          //The value for the 'value' key is an integer
          expect(obj.value).to.be.a('number')
          //The value for the 'name' key is a string
          expect(obj.name).to.be.a('string')
          //The country code is a valid country code
          expect(obj.name in countryCodes).to.equal(true)
        })
      }
      else console.log(err)
      done()
    })
  })
})
