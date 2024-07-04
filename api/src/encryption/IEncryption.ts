type IEncryption = {
  encrypt(text: string, saltRounds?: number): Promise<string>
  validate(text: string, hash: string): Promise<boolean>
}

export default IEncryption
