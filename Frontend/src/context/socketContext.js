import { createContext } from "react";

// `socket` can legitimately be null (see the provider guard), so consumers must
// always treat it as optional.
export const SocketContext = createContext({ socket: null });