/**
 * Script para definir a role (admin ou writer) de um usuário via Firebase Admin SDK.
 *
 * Uso:
 *   node scripts/set-admin.js <uid-do-usuario> --role admin|writer
 *
 * Exemplo:
 *   node scripts/set-admin.js abc123def456 --role admin
 *   node scripts/set-admin.js abc123def456 --role writer
 *
 * Pré-requisitos:
 *   1. Ter um arquivo de service account do Firebase em:
 *      - `serviceAccountKey.json` na raiz do projeto, OU
 *      - Definir a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS
 *   2. Ter o Firebase Admin SDK instalado:
 *      npm install firebase-admin
 *
 * Funcionamento:
 *   1. Inicializa o Firebase Admin SDK com a service account
 *   2. Define a custom claim correspondente (`admin: true` ou `writer: true`)
 *   3. Verifica se a claim foi aplicada corretamente
 */

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── Configuração ──

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVICE_ACCOUNT_PATH = path.resolve(
  process.cwd(),
  "serviceAccountKey.json",
);

// ── Validação de argumentos ──

const uid = process.argv[2];
const roleArg = process.argv[3];

if (!uid) {
  console.error("\n❌ Erro: UID do usuário não fornecido.");
  console.error(
    "\nUso: node scripts/set-admin.js <uid-do-usuario> --role admin|writer",
  );
  console.error(
    "Exemplo: node scripts/set-admin.js abc123def456 --role admin\n",
  );
  process.exit(1);
}

let role = "admin"; // default

if (roleArg) {
  if (roleArg === "--role" && process.argv[4]) {
    role = process.argv[4];
  } else if (roleArg.startsWith("--role=")) {
    role = roleArg.split("=")[1];
  }
}

if (!["admin", "writer"].includes(role)) {
  console.error(
    `\n❌ Erro: Role inválida: "${role}". Use "admin" ou "writer".`,
  );
  console.error(
    "\nUso: node scripts/set-admin.js <uid-do-usuario> --role admin|writer\n",
  );
  process.exit(1);
}

// ── Inicialização do Firebase Admin ──

async function initializeFirebaseAdmin() {
  // Tenta carregar service account do arquivo local
  if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    try {
      const rawJson = fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf-8");
      const serviceAccount = JSON.parse(rawJson);

      console.log(`\n🔧 Caminho do service account: ${SERVICE_ACCOUNT_PATH}\n`);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin inicializado via serviceAccountKey.json");
      return;
    } catch (err) {
      console.error(
        `\n❌ Erro ao carregar serviceAccountKey.json: ${err.message}`,
      );
      console.error(
        "   Verifique se o arquivo JSON está válido e é uma service account do Firebase.",
      );
      process.exit(1);
    }
  }

  // Tenta usar a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log(
      "✅ Firebase Admin inicializado via GOOGLE_APPLICATION_CREDENTIALS",
    );
    return;
  } catch (err) {
    console.error(
      "\n❌ Erro ao inicializar Firebase Admin. Certifique-se de ter:",
    );
    console.error(
      "   1. Um arquivo serviceAccountKey.json na raiz do projeto, OU",
    );
    console.error(
      "   2. A variável GOOGLE_APPLICATION_CREDENTIALS configurada",
    );
    console.error(`\nDetalhes: ${err}\n`);
    process.exit(1);
  }
}

// ── Função principal ──

async function setRoleClaim() {
  await initializeFirebaseAdmin();

  try {
    // Verifica se o usuário existe
    const userRecord = await admin.auth().getUser(uid);
    console.log(`\n👤 Usuário encontrado:`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Email: ${userRecord.email || "N/A"}`);
    console.log(`   Nome: ${userRecord.displayName || "N/A"}`);

    // Define a custom claim preservando claims existentes
    const existingClaims = userRecord.customClaims || {};
    const claims = { ...existingClaims, [role]: true };

    await admin.auth().setCustomUserClaims(uid, claims);
    console.log(`\n✅ Custom claim '${role}: true' definida com sucesso!`);

    // Verifica se a claim foi aplicada
    const updatedUser = await admin.auth().getUser(uid);
    const updatedClaims = updatedUser.customClaims || {};

    if (updatedClaims[role] === true) {
      console.log(`\n🔍 Verificação:`);
      console.log(`   Claim '${role}' = ${updatedClaims[role]}`);
      console.log(`\n🎉 Usuário agora é ${role.toUpperCase()}!`);
      console.log(
        `\n⚠️  Nota: O usuário precisará fazer logout e login novamente`,
      );
      console.log(`   para que as novas claims entrem em vigor.`);
    } else {
      console.warn(`\n⚠️  A claim foi definida, mas a verificação falhou.`);
      console.warn(`   Claims atuais:`, JSON.stringify(updatedClaims));
    }
  } catch (err) {
    const error = err;

    if (error.code === "auth/user-not-found") {
      console.error(`\n❌ Usuário com UID "${uid}" não encontrado.`);
      console.error(`   Verifique se o UID está correto.\n`);
    } else {
      console.error(`\n❌ Erro ao definir claim de ${role}:`, error.message);
      console.error(error);
    }
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setRoleClaim();
