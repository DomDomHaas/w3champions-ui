import { moduleActionContext } from "..";
import { ChatMessage, ChatState, ChatUser } from "./types";
import { RootState } from "../typings";
import { ActionContext } from "vuex";

const mod = {
  namespaced: true,
  state: {
    apiKey: "",
    canNotSend: true,
    isLoggedIn: false,
    messages: [] as ChatMessage[],
    otherUsers: [] as ChatUser[],
    currentUser: {} as ChatUser,
  } as ChatState,
  actions: {
    async loadChatApiKey(context: ActionContext<ChatState, RootState>) {
      const { commit, rootGetters, rootState } = moduleActionContext(
        context,
        mod
      );

      const response = await rootGetters.chatService.retrieveChatUser(
        rootState.oauth.blizzardVerifiedBtag,
        rootState.oauth.token
      );

      if (response?.apiKey) {
        commit.SET_CHAT_API_KEY(response.apiKey);
      }
    },
    async createApiKey(context: ActionContext<ChatState, RootState>) {
      const { commit, rootGetters, rootState } = moduleActionContext(
        context,
        mod
      );

      const response = await rootGetters.chatService.createApiKey(
        rootState.oauth.blizzardVerifiedBtag,
        rootState.oauth.token
      );

      if (response?.apiKey) {
        commit.SET_CHAT_API_KEY(response.apiKey);
      }
    },
  },
  mutations: {
    SET_CHAT_API_KEY(state: ChatState, key: string) {
      state.apiKey = key;
    },
    POP_USER(state: ChatState, battleTag: string) {
      state.otherUsers = [
        ...state.otherUsers.filter((u) => u.battleTag !== battleTag),
      ];
    },
    PUSH_USER(state: ChatState, user: ChatUser) {
      state.otherUsers = [...state.otherUsers, user];
    },
    PUSH_USERS(state: ChatState, users: ChatUser[]) {
      state.otherUsers = users;
    },
    PUSH_MESSAGE(state: ChatState, message: ChatMessage) {
      state.messages = [...state.messages, message];
    },
  },
} as const;

export default mod;
