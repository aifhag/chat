import { __decorate } from "tslib";
import { Component } from '@angular/core';
let Chat = class Chat {
    constructor() {
        this.draft = '';
        this.searchTerm = '';
        this.isTyping = signal(false);
        this.activeId = signal(1);
        this.nextMessageId = 10;
        this.nextConversationId = 2;
        this.conversations = signal([
            {
                id: 1,
                name: 'Charte Assistente',
                initials: 'Ch',
                color: 'violet',
                status: 'Assistente online',
                messages: [
                    { id: 1, text: 'Esse é um chat interativo teste para aplicar no charte', sender: 'bot', time: this.now() },
                    { id: 2, text: 'Voce digitou algo e recebi essa mensagem', sender: 'bot', time: this.now() }
                ]
            }
        ]);
    }
    get activeConversation() {
        return this.conversations().find(c => c.id === this.activeId()) ?? this.conversations()[0];
    }
    get filteredConversations() {
        const term = this.searchTerm.trim().toLowerCase();
        return this.conversations().filter(c => c.name.toLowerCase().includes(term));
    }
    selectConversation(id) {
        this.activeId.set(id);
        this.scrollToBottom();
    }
    startNewChat() {
        const id = this.nextConversationId++;
        const newConversation = {
            id,
            name: `Conversa ${id}`,
            initials: 'VC',
            color: 'random color',
            status: 'online',
            messages: [{
                    id: this.nextMessageId++,
                    text: 'Nova conversa iniciada, essa é uma mensagem padrao',
                    sender: 'bot',
                    time: this.now()
                }]
        };
        this.conversations.update(items => [newConversation, ...items]);
        this.activeId.set(id);
        this.draft = '';
    }
    sendMessage() {
        const text = this.draft.trim();
        if (!text || !this.activeConversation)
            return;
        const userMessage = {
            id: this.nextMessageId++,
            text,
            sender: 'user',
            time: this.now()
        };
        this.updateActiveMessages(userMessage);
        this.draft = '';
        this.isTyping.set(true);
        this.scrollToBottom();
        window.setTimeout(() => {
            const reply = {
                id: this.nextMessageId++,
                text: this.createReply(text),
                sender: 'bot',
                time: this.now()
            };
            this.updateActiveMessages(reply);
            this.isTyping.set(false);
            this.scrollToBottom();
        }, 850);
    }
    handleKeydown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
    updateActiveMessages(message) {
        const id = this.activeId();
        this.conversations.update(items => items.map(conversation => conversation.id === id
            ? { ...conversation, messages: [...conversation.messages, message] }
            : conversation));
    }
    createReply(message) {
        const text = message.toLowerCase();
        if (/(oi|olá|ola|bom dia|boa tarde|boa noite)/.test(text)) {
            return 'Ola, saudaçoes essa é uma mensagem padrao';
        }
        if (/(obrigad|valeu)/.test(text)) {
            return 'adeus';
        }
        if (/(seu nome|quem é você|quem e voce)/.test(text)) {
            return 'Eu sou Charte, uma mensageiro padrao criado para conversar com você!';
        }
        if (/(ajuda|ajudar)/.test(text)) {
            return 'Claro!Aqui devem ser colocadas informaçoes sobre o funcionamento do charte.';
        }
        return 'Entendi! 😊 Me conte mais sobre isso. Estou aqui para conversar com você.';
    }
    now() {
        return new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date());
    }
    scrollToBottom() {
        setTimeout(() => {
            const element = this.messageArea?.nativeElement;
            if (element)
                element.scrollTop = element.scrollHeight;
        }, 50);
    }
    trackByConversation(_index, conversation) {
        return conversation.id;
    }
    trackByMessage(_index, message) {
        return message.id;
    }
};
__decorate([
    ViewChild('messageArea')
], Chat.prototype, "messageArea", void 0);
Chat = __decorate([
    Component({
        selector: 'app-chat',
        imports: [],
        templateUrl: './chat.html',
        styleUrl: './chat.css',
    })
], Chat);
export { Chat };
