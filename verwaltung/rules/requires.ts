export function required(name: string) {
  return (value: any) => !!value || `Das Feld ${name} muss ausgefüllt werden!`;
}
