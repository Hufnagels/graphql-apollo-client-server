import Joi from 'joi'

const firstName = Joi.string().max(255).required().label('firstName')
const lastName = Joi.string().max(255).required().label('lastName')
const email = Joi
  .string()
  .email()
  .required()
  .regex(/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/)
  .label('email')
const password = Joi
  .string()
  .min(6)
  .max(30)
  .required()
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{6,30}/)
  .label('password')
// .options({
//   language: {
//     string:{
//       regex:{
//         base: "Must have at least one lower and one Uppercase and number."
//       }
//     }
//   }
// })
const date_of_birth = Joi.string()

export const loginUserValidator = Joi.object().keys({
  email,
  password
})

export const registerUserValidator = Joi.object().keys({
  firstName,
  lastName,
  email,
  password,
  date_of_birth
})