export default class MessageRepository {
  async fetchMessage(): Promise<string> {
    return 'Bienvenue dans l\'architecture hexagonale avec React Native!';
  }
}
