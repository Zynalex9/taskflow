import { createContext, ReactNode } from "react";
import socketIOClient, { Socket } from "socket.io-client";

const WS = "http://localhost:3000";

export const socketContext = createContext<Socket | null>(null);
const ws = socketIOClient(WS);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FunctionComponent<SocketProviderProps> = ({ children }) => {
    return (
        <socketContext.Provider value={ws}>
            {children}
        </socketContext.Provider>
    );
};