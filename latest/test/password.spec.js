const expect = require('chai').expect
const { testPassword } = require('../index').tests
const alphaValues = require('../objectValues').alpha

describe('Post User Info - Password', function () {
  //Generate random number of users information to test against - Range: 1000 - 2500
  const number = Math.floor(Math.random() * 1500 + 1000)

  it('Test results for requests - actionType "CountPasswordComplexity": Count', function (done) {
    this.timeout(10000)
    const args = { number, actionType: 'CountPasswordComplexity' }

    testPassword(args, (err, { passwords, results }) => {
      if (!err) {

        const totalRandomUserPasswords = passwords.length
        const totalCensusPasswords = results.length

        //Test: Number of passwords received from randomeuser.me equals total number of users requested
        expect(totalRandomUserPasswords).to.equal(number)

        //Test: Number of passwords received from census-toy equals total number of users requested
        expect(totalCensusPasswords).to.equal(number)

        //Test: Number of passwords received from randomuser.me equals total received from census-toy
        expect(totalCensusPasswords).to.equal(totalRandomUserPasswords)

        //Test: All passwords received from randomuser.me were also received from census-toy
        const censusSet = new Set(results.map(obj => obj.name))
        const randomUserSet = new Set(passwords)
        randomUserSet.forEach(password => expect(censusSet.has(password)).to.equal(true))

        //Test: Values associated with individual passwords returned from census-toy correctly account for number of non‐alphanumeric characters
        results.forEach(password => {
          let nonAlpha = 0
          for (const letter of password.name) {
            if (!alphaValues.has(letter)) nonAlpha++
          }
          expect(password.value).to.equal(nonAlpha)
        })

        //Test: Values for passwords are returned by census-toy in descending order
        let prevVal = null
        results.forEach(password => {
          if (prevVal) expect(prevVal >= password.value).to.equal(true)
          prevVal = password.value
        })
      }
      else console.log(err)
      done()
    })
  })

  it('Test results for requests - actionType "CountPasswordComplexity": Format', function (done) {
    this.timeout(10000)
    const args = { number, actionType: 'CountPasswordComplexity' }

    testPassword(args, (err, { passwords, results }) => {
      if (!err) {

        //Test: Returned data from randomuser.me has been formatted correctly
        expect(Array.isArray(passwords)).to.equal(true)

        //Testing data from census-toy is formatted correctly
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
        })
      }
      else console.log(err)
      done()
    })
  })
})
