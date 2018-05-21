const expect = require('chai').expect
const { testGender, testPassword } = require('../index').tests

describe('Test Edge Cases', function () {
  //Generate random number of users information to test against - Range: 1000 - 2500
  const number = Math.floor(Math.random() * 1500 + 1000)

  it('Misspelled actionType returns error', function (done) {
    this.timeout(10000)
    const args = { number, actionType: 'CountByyGender' }

    testGender(args, ({ status, message }) => {

      //Testing whether or not proper error status / message was returned
      expect(status).to.equal(400)
      expect(message).to.equal('Bad Request')
      done()
    })
  })

  it('0 users information passed to API - returns empty array', function (done) {
    this.timeout(10000)
    const args = { number: 0, actionType: 'CountByGender' }

    testGender(args, (err, genderTest) => {
      if (!err) {
        const { results } = genderTest

        //Test: Returned data from census-toy is in correct format
        expect(Array.isArray(results)).to.equal(true)

        //Test: Returned data to ensure length of 0 (no user info passed to API)
        expect(results).to.have.length(results)
      }
      else console.log(err)
      done()
    })
  })

  it('Top value test: CountPasswordComplexity', function (done) {
    this.timeout(10000)
    let top = Math.floor(Math.random() * 500)
    const args = { number, actionType: 'CountPasswordComplexity', top }

    testPassword(args, (err, { results }) => {
      if (!err) {

        //Test: Returned number of results vs 'top' value passed in as argument
        expect(results).to.have.length(top)
      }
      else console.log(err)
      done()
    })
  })

  it('Top value test: CountByGender', function (done) {
    this.timeout(10000)
    const top = Math.floor(Math.random() * 500)
    const args = { number, actionType: 'CountByGender', top }

    testPassword(args, (err, { results }) => {
      if (!err) {
        const totalResults = results.reduce((sum, obj) => sum + obj.value, 0)

        //Test: Returned number of results vs 'top' value passed in as argument
        expect(totalResults).to.equal(top)
      }
      else console.log(err)
      done()
    })
  })
})
