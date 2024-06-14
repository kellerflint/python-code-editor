const rooms = {};

export const createRoom = (data) => {
    const { code, output } = data;
    const roomId = Math.random().toString(36).substring(7);
    rooms[roomId] = { code, output };
    return roomId;
}

export const getRoom = (roomId) => {
    return rooms[roomId];
}

export const updateRoomCode = (roomId, code) => {
    rooms[roomId].code = code;
}

export const updateRoomOutput = (roomId, output) => {
    rooms[roomId].output = output;
}

export const getRooms = () => {
    return rooms;
}