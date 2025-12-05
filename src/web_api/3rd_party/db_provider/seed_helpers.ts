import { Op, QueryInterface, QueryOptions } from 'sequelize';

export async function executeSmartUpsertSeed(
  queryInterface: QueryInterface,
  tableName: string,
  data: object[],
  options?: QueryOptions
): Promise<void> {
  await queryInterface.sequelize.transaction(async t => {
    const allKeys = data.reduce<Set<string>>((acc, d) => {
      Object.keys(d).forEach(k => acc.add(k));

      return acc;
    }, new Set());

    allKeys.delete('id');

    await queryInterface.bulkInsert(tableName, data, {
      transaction: t,
      // @ts-expect-error
      updateOnDuplicate: Array.from(allKeys),
      upsertKeys: ['id'],
      ...options,
    });
  });
}

export async function executeBulkDeleteFromList(
  queryInterface: QueryInterface,
  tableName: string,
  data: any[]
): Promise<void> {
  await queryInterface.bulkDelete(tableName, {
    id: { [Op.in]: data.map(s => s.id) },
  });
}
