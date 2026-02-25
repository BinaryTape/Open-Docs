# マイグレーション

`.sq` ファイルは、常に空のデータベースに最新のスキーマを作成する方法を記述します。データベースが現在古いバージョンである場合、マイグレーションファイルによってそのデータベースを最新の状態に更新します。マイグレーションファイルは、`.sq` ファイルと同じ `sqldelight` フォルダに保存されます。

```
src
└─ main
   └─ sqdelight
      ├─ com/example/hockey
      |  ├─ Team.sq
      |  └─ Player.sq
      └─ migrations
         ├─ 1.sqm
         └─ 2.sqm
```

ドライバーがサポートしている場合、マイグレーションはトランザクション内で実行されます。マイグレーションを `BEGIN/END TRANSACTION` で囲まないでください。一部のドライバーでクラッシュの原因となる可能性があります。

## バージョニング

スキーマの最初のバージョンは 1 です。マイグレーションファイルの名前は `<アップグレード元のバージョン>.sqm` となります。バージョン 2 に移行するには、`1.sqm` にマイグレーション文を記述します。

```sql
ALTER TABLE hockeyPlayer ADD COLUMN draft_year INTEGER;
ALTER TABLE hockeyPlayer ADD COLUMN draft_order INTEGER;
```

これらの SQL 文は `Database.Schema.migrate()` メソッドによって実行されます。マイグレーションファイルは、`.sq` ファイルと同じソースセットに配置します。

## マイグレーションの検証

`verifySqlDelightMigration` タスクが Gradle プロジェクトに追加され、`check` タスクの一部として実行されます。SqlDelight ソースセット（例：`src/main/sqldelight`）内にある `<バージョン番号>.db` という名前のすべての `.db` ファイルに対して、`<バージョン番号>.sqm` から始まるすべてのマイグレーションを適用し、そのマイグレーションの結果が最新のスキーマのデータベースと一致することを確認します。

最新のスキーマから `.db` ファイルを生成するには、[gradle.md](gradle.md) で説明されているように `schemaOutputDirectory` を指定した後に利用可能になる `generate<ソースセット名><データベース名>Schema` タスクを実行します。これは、最初のマイグレーションを作成する前に行うのが一般的です。例えば、プロジェクトで `main` ソースセットを使用し、カスタム名が `"MyDatabase"` である場合、`generateMainMyDatabaseSchema` タスクを実行する必要があります。

ほとんどのユースケースでは、初期バージョンのスキーマを表す `1.db` ファイルのみを保持するのが最適です。複数の `.db` ファイルを持つことも可能ですが、それぞれの `.db` ファイルに対して各マイグレーションが適用されることになり、不要な作業が多く発生します。

## コードによるマイグレーション

コードからマイグレーションを実行し、データマイグレーション（データの移行）を行いたい場合は、`Database.Schema.migrate` API を使用できます。

```kotlin
Database.Schema.migrate(
    driver = database,
    oldVersion = 0,
    newVersion = Database.Schema.version,
    AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) },
)
```

上記の例において、1.sqm、2.sqm、3.sqm、4.sqm、5.sqm というマイグレーションが存在する場合、上記のコールバックは、データベースがバージョン 4 のときに 3.sqm が完了した直後に発生します。コールバックの後、4.sqm から再開して残りのマイグレーション（この場合は 4.sqm と 5.sqm）を完了します。つまり、最終的なデータベースのバージョンは 6 になります。