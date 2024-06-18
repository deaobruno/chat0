type User = {
  user_id: string
  email: string
  username: string
  password: string
  logged: boolean
}

export default () => {
  const create = async (): Promise<void> => {}
  const find = async (): Promise<User[]> => {
    return []
  }
  const findOne = async (): Promise<User | null> => {
    return null
  }
  const findOneById = async (): Promise<User | null> => {
    return null
  }
  const findOneByEmail = async (): Promise<User | null> => {
    return null
  }
  const findOneByUsername = async (): Promise<User | null> => {
    return null
  }
  const updateOne = async (): Promise<void> => {}
  const updateMany = async (): Promise<void> => {}
  const deleteOne = async (): Promise<void> => {}
  const deleteMany = async (): Promise<void> => {}

  return {
    create,
    find,
    findOne,
    findOneById,
    findOneByEmail,
    findOneByUsername,
    updateOne,
    updateMany,
    deleteOne,
    deleteMany,
  }
}
