const expect = require('chai').expect
const { testGender, testPassword } = require('../index').tests

describe('Test Edge Cases / Top Field', function () {
  //Generate random number of users information to test against - Range: 1000 - 2500
  const number = Math.floor(Math.random() * 1500 + 1000)

  it('Misspelled actionType returns error', function (done) {
    this.timeout(10000)
    const args = { number, actionType: 'CountByyGender' }

    testGender(args, ({ status, message }) => {

      //Test whether or not proper error status / message was returned
      expect(status).to.equal(400)
      expect(message).to.equal('Bad Request')
      done()
    })
  })

  it('Empty array passed for "user" field - returns empty array', function (done) {
    this.timeout(10000)
    const args = { number: 0, actionType: 'CountByGender' }

    testGender(args, (err, genderTest) => {
      if (!err) {
        const { results } = genderTest

        //Test: Returned data from census-toy is in correct format
        expect(Array.isArray(results)).to.equal(true)

        //Test: Returned data to ensure length of 0 (no user info passed to API)
        expect(results).to.have.length(0)
      }
      else console.log(err)
      done()
    })
  })

  it('Top value test: CountPasswordComplexity', function (done) {
    this.timeout(10000)
    let top = Math.floor(Math.random() * number)
    const args = { number, actionType: '3', top }

    testPassword(args, (err, { passwords, results }) => {
      if (!err) {

        //Test: Number of users returned from random.me matches total number requested
        expect(passwords).to.have.length(number)

        const bool = results.length <= top
        //Test: Number of results returned from census-toy does not exceed 'top' value
        expect(bool).to.equal(true)
      }
      else console.log(err)
      done()
    })
  })
})
