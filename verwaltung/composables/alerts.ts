// TODO: change with implementation in vuetify!

export function useAlert() {
  return {
    async alert(msg: string) {
      alert(msg);
    },
    async confirm(msg: string) {
      return confirm(msg);
    },
    async prompt(msg: string, def = "") {
      return prompt(msg, def);
    },
  };
}
