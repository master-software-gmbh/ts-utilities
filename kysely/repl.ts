import readline from 'node:readline';
import { CompiledQuery, type Kysely } from 'kysely';

async function executeQuery(db: Kysely<unknown>, query: string): Promise<string> {
  try {
    const result = await db.executeQuery(CompiledQuery.raw(query));

    const rows = JSON.stringify(result.rows, null, 2);

    return rows;
  } catch (error) {
    return `Error: ${error}`;
  }
}

export function startRepl(db: Kysely<any>) {
  console.log("Type your SQL queries. Type '.exit' to quit.\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
    historySize: 20,
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    if (input.toLowerCase() === '.exit') {
      rl.close();
      return;
    }

    console.log(await executeQuery(db, input));

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Goodbye!');
  });
}
