# Swiss-Tournament-Manager

[![Clean install and build](https://github.com/KAFKA2306/Swiss-Tournament-Manager/actions/workflows/ci.yml/badge.svg)](https://github.com/KAFKA2306/Swiss-Tournament-Manager/actions/workflows/ci.yml)

JoinWars at VRChat用のスイス式トーナメント管理ツールです。

## 開発環境

- Node.js 22（`.nvmrc` が正準）
- npm
- MongoDB（実サーバー起動時のみ。CI smoke testは外部DB不要）

## package境界

- `swiss-tournament-manager/client/`: React frontendの独立package。`package.json` / `package-lock.json` / `public/` / `src/` を同じdirectoryに置きます。
- `swiss-tournament-manager/server/`: Express/Mongoose backendの独立package。専用`package.json` / `package-lock.json`を持ちます。
- `swiss-tournament-manager/`: 2 packageをまとめるproject directoryで、package manifestは置きません。

`node_modules/` は生成物でありGit管理しません。依存関係は各lockfileから`npm ci`で復元します。

## clean install

```bash
git clone https://github.com/KAFKA2306/Swiss-Tournament-Manager.git
cd Swiss-Tournament-Manager
nvm use
npm --prefix swiss-tournament-manager/client ci
npm --prefix swiss-tournament-manager/server ci
```

`npm ci`はpackage-lockとpackage.jsonが一致しない場合に失敗するため、clean checkout/CIの正準install commandとして使います。

## 検証

```bash
CI=true npm --prefix swiss-tournament-manager/client run test:ci
NODE_OPTIONS=--openssl-legacy-provider npm --prefix swiss-tournament-manager/client run build
npm --prefix swiss-tournament-manager/server run smoke
```

server smoke testはExpress appだけを一時portで起動して終了し、MongoDBへ接続しません。これによりclean CIで外部DBを要求しません。

## 起動

MongoDB URIとportは環境変数で指定できます。

```bash
MONGODB_URI=mongodb://localhost/tournament PORT=5000 npm --prefix swiss-tournament-manager/server start
npm --prefix swiss-tournament-manager/client start
```

未指定時は`MONGODB_URI=mongodb://localhost/tournament`、`PORT=5000`です。frontendは通常`http://localhost:3000`で起動します。

## CI

`.github/workflows/ci.yml` はclean checkoutで以下を検証します。

1. tracked `node_modules/` が存在しないこと
2. frontend/server双方がlockfile固定の`npm ci`で復元できること
3. frontend regression testとproduction buildが成功すること
4. MongoDB不要のserver startup smoke testが成功すること
5. install/buildがtracked fileを書き換えないこと

## 主な機能

- 参加者登録
- トーナメントダッシュボード
- 予選ラウンドの管理
- 決勝ラウンドの管理
- 準決勝・決勝の管理
- 観戦者向けダッシュボード

## プロジェクト構成

```text
Swiss-Tournament-Manager/
├── .github/workflows/ci.yml
├── .gitignore
├── .nvmrc
├── README.md
└── swiss-tournament-manager/
    ├── client/
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── public/
    │   └── src/
    └── server/
        ├── app.js
        ├── index.js
        ├── package.json
        ├── package-lock.json
        ├── models/
        └── routes/
```

## データベース境界

`server/app.js`はHTTP app構築だけを担当します。`server/index.js`だけが`MONGODB_URI`を読み、MongoDB接続後にlistenerを開始します。この分離により、CIはDB接続なしでstartup契約を検証できます。
