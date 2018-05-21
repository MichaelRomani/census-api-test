const expect = require('chai').expect
const { testGender } = require('../index').tests

describe('Post User Info - Gender', function () {
  //Generate random number of users information to test against - Range: 1000 - 2500
  const number = Math.floor(Math.random() * 1500 + 1000)

  it('Tests results for requests - actionType "CountByGender": Count', function (done) {
    this.timeout(10000)
    const args = { number, actionType: 'CountByGender' }

    testGender(args, (err, { femaleUsers, maleUsers, results }) => {
      if (!err) {

        //Test: Total value of all male / female users returned by radomuser.me equals total number of users requested
        const totalRandomUsers = femaleUsers + maleUsers
        expect(totalRandomUsers).to.equal(number)

        //Test: Total value of all male / female users returned by census-toy equals total number of users requested
        const totalValue = results.reduce((sum, obj) => sum + obj.value, 0)
        expect(totalValue).to.equal(number)

        //Test: Male /female totals from randomeuser.me equals totals from census-toy
        results.forEach(obj => {
          obj.name === 'female' ?
            expect(obj.value === femaleUsers) :
            expect(obj.value === maleUsers)
        })

        //Test: Values for gender count are returned by census-toy listed in descending order
        let prevVal = null
        results.forEach(obj => {
          if (prevVal) {
            const bool = prevVal >= obj.value
            expect(bool).to.equal(true)
          }
          prevVal = obj.value
        })
      }
      else console.log('first', err)
      done()
    })
  })

  it('Test results for requests -actionType "CountByGender": Format', function (done) {
    this.timeout(10000)
    const args = { number, actionType: 'CountByGender' }

    testGender(args, (err, { femaleUsers, maleUsers, results }) => {
      if (!err) {

        //Test: Returned data processed from randomuser.me has been formatted correctly
        expect(femaleUsers).to.be.a('number')
        expect(maleUsers).to.be.a('number')

        //Test: Returned data from census-toy is formatted correctly
        expect(Array.isArray(results)).to.equal(true)
        expect(results).to.have.length(2)
        results.forEach(obj => {
          //Each object within the results array contains a 'name' key
          expect('name' in obj).to.equal(true)
          //Each object within the results array contains a 'value' key
          expect('value' in obj).to.equal(true)
          //The value for the 'value' key is an integer
          expect(obj.value).to.be.a('number')
          //The value for the 'name' key is a string
          expect(obj.name).to.be.a('string')
          //The value for the 'name' key equals either 'male' or 'female'
          expect(obj.name).to.satisfy(name => name === 'male' || name === 'female')
        })
      }
      else console.log('first', err)
      done()
    })
  })
})
