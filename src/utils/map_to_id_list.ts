export default function mapToIdList<T extends { id: string }>(items: T[]): string[] {
  return items.map(i => i.id);
}
