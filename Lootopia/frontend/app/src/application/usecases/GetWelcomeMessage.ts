import { Message } from "@/app/src/domain/entities/Message";
import { MessageRepository } from "@/app/src/infrastructure/repositories/MessageRepository";

export const GetWelcomeMessage = async (): Promise<Message> => {
  const repository = new MessageRepository();
  const message = await repository.fetchMessage();
  
  return new Message(message);
};
