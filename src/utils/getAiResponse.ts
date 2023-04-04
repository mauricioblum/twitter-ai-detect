export function getAIResponse(result: string): 'HUMAN' | 'AI' | 'UNCLEAR' {
  switch (result) {
    case '!':
      return 'HUMAN';
    case '"':
      return 'AI';
    case '\\"':
      return 'UNCLEAR';
    case '"\n\n':
      return 'UNCLEAR';
    case '!"':
      return 'HUMAN';
    default:
      return 'HUMAN';
  }
}
