export function required(name: string) {
  return (value: unknown) =>
    !!value || `Das Feld ${name} muss ausgefüllt werden!`;
}
