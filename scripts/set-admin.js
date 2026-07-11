/**
 * Script para definir um usuário como administrador via Firebase Admin SDK.
 *
 * Uso:
 *   node scripts/set-admin.js <uid-do-usuario>
 *
 * Exemplo:
 *   node scripts/set-admin.js abc123def456
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
 *   2. Define a custom claim `admin: true` para o UID fornecido
 *   3. Verifica se a claim foi aplicada corretamente
 */

const admin = require("firebase-admin");

// ── Configuração ──

const SERVICE_ACCOUNT_PATH = "./serviceAccountKey.json";

// ── Validação de argumentos ──

const uid = process.argv[2];

if (!uid) {
  console.error("\n❌ Erro: UID do usuário não fornecido.");
  console.error("\nUso: node scripts/set-admin.js <uid-do-usuario>");
  console.error("Exemplo: node scripts/set-admin.js abc123def456\n");
  process.exit(1);
}

// ── Inicialização do Firebase Admin ──

async function initializeFirebaseAdmin() {
  // Tenta carregar service account do arquivo local
  try {
    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin inicializado via serviceAccountKey.json");
    return;
  } catch {
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
      console.error("   1. Um arquivo serviceAccountKey.json na raiz do projeto, OU");
      console.error(
        "   2. A variável GOOGLE_APPLICATION_CREDENTIALS configurada",
      );
      console.error(`\nDetalhes: ${err}\n`);
      process.exit(1);
    }
  }
}

// ── Função principal ──

async function setAdminClaim() {
  await initializeFirebaseAdmin();

  try {
    // Verifica se o usuário existe
    const userRecord = await admin.auth().getUser(uid);
    console.log(`\n👤 Usuário encontrado:`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Email: ${userRecord.email || "N/A"}`);
    console.log(`   Nome: ${userRecord.displayName || "N/A"}`);

    // Define a custom claim 'admin: true'
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`\n✅ Custom claim 'admin: true' definida com sucesso!`);

    // Verifica se a claim foi aplicada
    const updatedUser = await admin.auth().getUser(uid);
    const claims = updatedUser.customClaims || {};

    if (claims.admin === true) {
      console.log(`\n🔍 Verificação:`);
      console.log(`   Claim 'admin' = ${claims.admin}`);
      console.log(`\n🎉 Usuário agora é ADMINISTRADOR!`);
      console.log(
        `\n⚠️  Nota: O usuário precisará fazer logout e login novamente`,
      );
      console.log(`   para que as novas claims entrem em vigor.`);
    } else {
      console.warn(`\n⚠️  A claim foi definida, mas a verificação falhou.`);
      console.warn(`   Claims atuais:`, JSON.stringify(claims));
    }
  } catch (err) {
    const error = err;

    if (error.code === "auth/user-not-found") {
      console.error(`\n❌ Usuário com UID "${uid}" não encontrado.`);
      console.error(`   Verifique se o UID está correto.\n`);
    } else {
      console.error(`\n❌ Erro ao definir claim de admin:`, error.message);
      console.error(error);
    }
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setAdminClaim();
