<template>
  <div>
    <div v-if="name === '' || !isShown" class="flex items-center p-4">
      <input v-model="name" type="text" placeholder="Type your name..."
        class="w-full rounded-lg border border-gray-300 px-4 py-2" />
      <button @click="toggleShow" class="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white">Save</button>
    </div>

    <div v-else class="flex h-screen flex-col bg-gray-100">
      <div class="bg-gradient-to-r from-blue-500 to-purple-500 py-4">
        <h1 class="text-center text-2xl font-bold text-white">Chat App - Archipelago</h1>
      </div>
      <div class="flex-grow overflow-y-auto">
        <div v-for="message, key in messages" :key="key">
          <div class="flex flex-col space-y-2 p-4">
            <div v-if="message.userId === userId"
              class="flex items-center self-end rounded-xl rounded-tr bg-blue-500 py-2 px-3 text-white">
              <p>{{ message.text }}</p>
            </div>
            <div v-else class="flex items-start">
              <div class="self-start rounded-xl rounded-tl bg-gray-300 py-2 px-3">
                <p class="text-gray-600 text-sm" v-html="message.name"></p>
                <!-- <br> Add a new line here -->
                <p>{{ message.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center p-4">
        <input v-model="newMessage" type="text" :placeholder="`[${name}] Type your message...`"
          class="w-full rounded-lg border border-gray-300 px-4 py-2" @keyup.enter="sendMessage" />
        <button @click="sendMessage" class="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white">Send</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Socket, io } from 'socket.io-client';

export default Vue.extend({
  data() {
    return {
      messages: [] as { userId: string, id: number; text: string, name: string }[],
      otherMessages: [] as { id: number; text: string }[],
      newMessage: '',
      name: '',
      isShown: false,
      socket: null as Socket | null,
      userId: (Math.random() + 1).toString(36).substring(7),
    };
  },
  created() {
    this.socket = io('http://localhost:3000');
    if (this.socket) {
      this.socket.on('message', (message: { userId: string, id: number; text: string, name: string }) => {
        this.messages.push(message);
      });
    }
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  },
  methods: {
    sendMessage() {
      // Send the message to the WebSocket server
      if (this.socket) {
        this.socket.emit('message', { userId: this.userId, id: Date.now(), text: this.newMessage, name: this.name });

        // Clear the input field
        this.newMessage = '';
      }
    },
    toggleShow() {
      this.isShown = !this.isShown;
    }
  }
});
</script>