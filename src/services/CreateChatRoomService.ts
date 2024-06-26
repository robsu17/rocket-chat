import { ChatRoom } from "../schemas/ChatRoom"

class CreateChatRoomService {
  async execute(idUsers: string[]) {
    const room = await ChatRoom.create({
      idUsers
    })

    return room
  }
}

export { CreateChatRoomService }