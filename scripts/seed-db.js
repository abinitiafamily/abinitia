const fs = require('fs');
const { Client } = require('pg');

const dotenv = fs.readFileSync('.env.local', 'utf8');
const env = {};
dotenv.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      env[key] = val;
    }
  }
});

async function seed() {
  console.log('Iniciando seed dos dados iniciais no Supabase...');
  const client = new Client({
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.ucvicxjvcsojpbwkydkf',
    password: env.abinitia_POSTGRES_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  // Inserir Família Ferraro
  const famQuery = `
    INSERT INTO public.families (id, name, surname, description, origin, symbol, motto, is_public)
    VALUES 
      ('d0100000-0000-0000-0000-000000000001', 'Ferraro', 'Ferraro', 'Família italiana com raízes em Nápoles, chegou ao Brasil em 1888.', 'Nápoles, Itália', '🌿', 'Ferro e esperança', true),
      ('d0100000-0000-0000-0000-000000000002', 'Silva', 'Silva', 'Família mineira com séculos de história no Brasil.', 'Minas Gerais, Brasil', '🌳', 'União e fé', true),
      ('d0100000-0000-0000-0000-000000000003', 'Costa', 'Costa', 'Família com raízes em Portugal e no Rio de Janeiro.', 'Porto, Portugal · Rio de Janeiro, Brasil', '🔒', 'Honra e perseverança', false)
    ON CONFLICT (id) DO NOTHING;
  `;
  await client.query(famQuery);
  console.log('Famílias inseridas com sucesso!');

  // Inserir Pessoas
  const personsQuery = `
    INSERT INTO public.persons (id, family_id, first_name, last_name, birth_date, birth_place, death_date, death_place, gender, occupation, nationality, evidence_status)
    VALUES
      ('e0100000-0000-0000-0000-000000000001', 'd0100000-0000-0000-0000-000000000001', 'Giovanni', 'Ferraro', '1865-04-12', 'Nápoles, Itália', '1942-11-03', 'São Paulo, SP', 'M', 'Carpinteiro', 'Italiano', 'CONFIRMED'),
      ('e0100000-0000-0000-0000-000000000002', 'd0100000-0000-0000-0000-000000000001', 'Maria', 'Ferraro (nascida Rossi)', '1868-09-22', 'Nápoles, Itália', '1950-02-18', 'São Paulo, SP', 'F', 'Costureira', 'Italiana', 'CONFIRMED'),
      ('e0100000-0000-0000-0000-000000000003', 'd0100000-0000-0000-0000-000000000001', 'Antonio', 'Ferraro', '1892-07-15', 'Campinas, SP', '1971-08-30', 'São Paulo, SP', 'M', 'Comerciante', 'Brasileiro', 'CONFIRMED'),
      ('e0100000-0000-0000-0000-000000000004', 'd0100000-0000-0000-0000-000000000001', 'Helena', 'Ferraro (nascida Santos)', '1895-12-03', 'Santos, SP', '1983-04-14', 'São Paulo, SP', 'F', 'Professora', 'Brasileira', 'CONFIRMED'),
      ('e0100000-0000-0000-0000-000000000005', 'd0100000-0000-0000-0000-000000000001', 'Rosa', 'Ferraro', '1895-03-20', 'Campinas, SP', '1968-10-12', 'Campinas, SP', 'F', 'Bordadeira', 'Brasileira', 'CONFIRMED'),
      ('e0100000-0000-0000-0000-000000000006', 'd0100000-0000-0000-0000-000000000001', 'Carlos Alberto', 'Ferraro', '1925-06-18', 'São Paulo, SP', '2005-09-02', 'São Paulo, SP', 'M', 'Engenheiro', 'Brasileiro', 'CONFIRMED'),
      ('e0100000-0000-0000-0000-000000000007', 'd0100000-0000-0000-0000-000000000001', 'Beatriz', 'Ferraro', '1928-11-25', 'São Paulo, SP', NULL, NULL, 'F', 'Artista Plástica', 'Brasileira', 'CONFIRMED')
    ON CONFLICT (id) DO NOTHING;
  `;
  await client.query(personsQuery);
  console.log('Pessoas da árvore genealógica inseridas com sucesso!');

  // Inserir Relacionamentos
  const relQuery = `
    INSERT INTO public.relationships (family_id, person_a_id, person_b_id, type, evidence_status)
    VALUES
      ('d0100000-0000-0000-0000-000000000001', 'e0100000-0000-0000-0000-000000000001', 'e0100000-0000-0000-0000-000000000002', 'SPOUSE', 'CONFIRMED'),
      ('d0100000-0000-0000-0000-000000000001', 'e0100000-0000-0000-0000-000000000001', 'e0100000-0000-0000-0000-000000000003', 'PARENT_CHILD', 'CONFIRMED'),
      ('d0100000-0000-0000-0000-000000000001', 'e0100000-0000-0000-0000-000000000001', 'e0100000-0000-0000-0000-000000000005', 'PARENT_CHILD', 'CONFIRMED'),
      ('d0100000-0000-0000-0000-000000000001', 'e0100000-0000-0000-0000-000000000003', 'e0100000-0000-0000-0000-000000000004', 'SPOUSE', 'CONFIRMED'),
      ('d0100000-0000-0000-0000-000000000001', 'e0100000-0000-0000-0000-000000000003', 'e0100000-0000-0000-0000-000000000006', 'PARENT_CHILD', 'CONFIRMED'),
      ('d0100000-0000-0000-0000-000000000001', 'e0100000-0000-0000-0000-000000000003', 'e0100000-0000-0000-0000-000000000007', 'PARENT_CHILD', 'CONFIRMED')
    ON CONFLICT DO NOTHING;
  `;
  await client.query(relQuery);
  console.log('Relacionamentos familiares inseridos!');

  // Inserir Timeline Events
  const eventsQuery = `
    INSERT INTO public.timeline_events (family_id, title, description, date, type, location, evidence_status, is_historical_context)
    VALUES
      ('d0100000-0000-0000-0000-000000000001', 'Emigração da Itália', 'Giovanni e Maria deixam o porto de Gênova a bordo do navio Il Piemonte rumo ao porto de Santos.', '1888-10-15', 'MIGRATION', 'Gênova, Itália -> Santos, Brasil', 'CONFIRMED', false),
      ('d0100000-0000-0000-0000-000000000001', 'Abolição da Escravidão no Brasil', 'Promulgação da Lei Áurea impulsiona a imigração europeia para as lavouras paulistas.', '1888-05-13', 'HISTORICAL', 'Brasil', 'CONFIRMED', true),
      ('d0100000-0000-0000-0000-000000000001', 'Nascimento de Antonio Ferraro', 'Primeiro filho brasileiro do casal nasce em Campinas.', '1892-07-15', 'BIRTH', 'Campinas, SP', 'CONFIRMED', false),
      ('d0100000-0000-0000-0000-000000000001', 'Abertura da Primeira Mercearia', 'Antonio abre a Casa Ferraro no bairro da Mooca.', '1920-03-01', 'PROFESSION', 'Mooca, São Paulo, SP', 'CONFIRMED', false)
    ON CONFLICT DO NOTHING;
  `;
  await client.query(eventsQuery);
  console.log('Eventos da linha do tempo inseridos!');

  // Inserir Investigação Exemplo
  const invQuery = `
    INSERT INTO public.investigations (family_id, title, person_target, status, hypotheses, findings, sources)
    VALUES
      ('d0100000-0000-0000-0000-000000000001', 'Certidão de Batismo de Giovanni Ferraro em Nápoles', 'Giovanni Ferraro', 'IN_PROGRESS', 'Nascido na paróquia de San Gennaro ou Santa Maria em Nápoles entre 1864 e 1866.', 'Encontrado registro homônimo em 1865 com pais Pasquale Ferraro e Filomena De Luca.', 'Arquivo Diocesano de Nápoles, Portale Antenati')
    ON CONFLICT DO NOTHING;
  `;
  await client.query(invQuery);
  console.log('Investigação genealógica inserida!');

  await client.end();
  console.log('Seed finalizado com 100% de sucesso!');
}

seed().catch(err => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
