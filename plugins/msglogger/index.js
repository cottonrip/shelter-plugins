(function() {
    const Logger = {
        logMessage: (message) => {
            console.log(`[Message] ${message.author.username}: ${message.content}`);
        },
        logEdit: (oldMessage, newMessage) => {
            console.log(`[Edit] ${oldMessage.author.username}: ${oldMessage.content} -> ${newMessage.content}`);
        },
        logDelete: (message) => {
            console.log(`[Delete] ${message.author.username}: ${message.content}`);
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
        console.log("Message Logger Plugin loaded successfully!");
    });
})();