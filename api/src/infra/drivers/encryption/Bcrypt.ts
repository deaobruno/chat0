import { hash, compare } from 'bcrypt'

export default () => {
  const encrypt = async (password: string, saltRounds = 10) => hash(password, saltRounds)
  const validate = compare

  return {
    encrypt,
    validate,
  }
}
