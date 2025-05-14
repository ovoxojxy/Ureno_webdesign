import * as React from "react";
import ConversationList from "@/pages/Conversation/ConversationList";
import MessageView from "@/components/conversations/MessageView";
import MessageInput from "@/components/conversations/MessageInput";

function MessagePage() {
    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <aside className="w-1/3 border-r overflow-y-auto">
                <ConversationList />
            </aside>

            <main className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <MessageView />
                </div>
                <MessageInput />
            </main>
        </div>
    )
}

export default MessagePage