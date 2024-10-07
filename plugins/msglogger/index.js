(function() {
    const MESSAGE_LOG_KEY = 'messageLog';

    // Load messages from localStorage
    function loadMessages() {
        const storedMessages = localStorage.getItem(MESSAGE_LOG_KEY);
        return storedMessages ? JSON.parse(storedMessages) : {};
    }

    // Save messages to localStorage
    function saveMessages(messages) {
        localStorage.setItem(MESSAGE_LOG_KEY, JSON.stringify(messages));
    }

    // Log message utility
    const Logger = {
        logMessage: (message) => {
            const messages = loadMessages();
            messages[message.id] = {
                author: message.author.username,
                content: [message.content],
                timestamp: message.timestamp,
                deleted: false,
            };
            saveMessages(messages);
            console.log(`[Message] ${message.author.username}: ${message.content}`);
        },
        logEdit: (oldMessage, newMessage) => {
            const messages = loadMessages();
            if (messages[oldMessage.id]) {
                messages[oldMessage.id].content.push(newMessage.content);
                saveMessages(messages);
                console.log(`[Edit] ${oldMessage.author.username}: ${oldMessage.content} -> ${newMessage.content}`);
            }
        },
        logDelete: (message) => {
            const messages = loadMessages();
            if (messages[message.id]) {
                messages[message.id].deleted = true;
                saveMessages(messages);
                console.log(`%c[Delete] ${message.author.username}: ${message.content}`, 'background: #ffdddd; color: #ff0000');
            }
        },
    };

    function patchMessageEvents() {
        const Dispatcher = BdApi.findModuleByProps("dispatch", "subscribe");

        Dispatcher.subscribe("MESSAGE_CREATE", (event) => {
            const { message } = event;
            Logger.logMessage(message);
        });

        Dispatcher.subscribe("MESSAGE_UPDATE", (event) => {
            const { oldMessage, message } = event;
            Logger.logEdit(oldMessage, message);
        });

        Dispatcher.subscribe("MESSAGE_DELETE", (event) => {
            const { message } = event;
            Logger.logDelete(message);
        });
    }

    BdApi.onPluginLoaded(() => {
        patchMessageEvents();
        console.log("Advanced Message Logger Plugin loaded successfully!");
    });
})();