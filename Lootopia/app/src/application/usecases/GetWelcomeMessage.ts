import Message from "@/app/src/domain/entities/Message";
import MessageRepository from "@/app/src/infrastructure/repositories/MessageRepository";

const GetWelcomeMessage = (): Promise<Message> => {
  const repository = new MessageRepository();
  return repository.fetchMessage().then((message) => new Message(message));
};

export default GetWelcomeMessage;