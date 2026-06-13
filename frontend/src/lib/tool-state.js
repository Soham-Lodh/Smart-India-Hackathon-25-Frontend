const aiState = {
  pendingMessages: [],
  completedMessages: [],
};

const scanState = {
  preview: "",
  scan: null,
  loading: false,
  error: "",
};

const listeners = {
  ai: new Set(),
  scan: new Set(),
};

function notify(channel) {
  listeners[channel].forEach((listener) => listener());
}

export function subscribeAiState(listener) {
  listeners.ai.add(listener);
  return () => listeners.ai.delete(listener);
}

export function getAiState() {
  return {
    pendingMessages: [...aiState.pendingMessages],
    completedMessages: [...aiState.completedMessages],
  };
}

export function addPendingAiMessage(message) {
  aiState.pendingMessages = [...aiState.pendingMessages, message];
  notify("ai");
}

export function removePendingAiMessage(id) {
  aiState.pendingMessages = aiState.pendingMessages.filter((message) => message._id !== id);
  notify("ai");
}

export function completePendingAiMessage(pendingId, message) {
  aiState.pendingMessages = aiState.pendingMessages.filter((item) => item._id !== pendingId);
  aiState.completedMessages = [
    ...aiState.completedMessages.filter((item) => item._id !== message._id),
    message,
  ].slice(-20);
  notify("ai");
}

export function subscribeScanState(listener) {
  listeners.scan.add(listener);
  return () => listeners.scan.delete(listener);
}

export function getScanState() {
  return { ...scanState };
}

export function setScanState(nextState) {
  Object.assign(scanState, nextState);
  notify("scan");
}
