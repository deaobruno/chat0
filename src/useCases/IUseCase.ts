type IUseCase<T, U> = (input: T) => U | Promise<U>

export default IUseCase
