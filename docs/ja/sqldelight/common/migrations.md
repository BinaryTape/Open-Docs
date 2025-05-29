# マイグレーション

`.sq`ファイルは、空のデータベースで最新のスキーマを作成する方法を常に記述します。データベースが現在古いバージョンである場合、マイグレーションファイルはそれらのデータベースを最新の状態に更新します。マイグレーションファイルは、`.sq`ファイルと同じ`sqldelight`フォルダーに保存されます。

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

ドライバがサポートしている場合、マイグレーションはトランザクション内で実行されます。一部のドライバではクラッシュの原因となる可能性があるため、マイグレーションを`BEGIN/END TRANSACTION`で囲むべきではありません。

## バージョニング

スキーマの最初のバージョンは1です。マイグレーションファイルは`<version to upgrade from>.sqm`という名前で付けられます。バージョン2にマイグレーションするには、マイグレーションステートメントを`1.sqm`に記述します。

```sql
ALTER TABLE hockeyPlayer ADD COLUMN draft_year INTEGER;
ALTER TABLE hockeyPlayer ADD COLUMN draft_order INTEGER;
```

これらのSQLステートメントは、`Database.Schema.migrate()`メソッドによって実行されます。マイグレーションファイルは、`.sq`ファイルと同じソースセットに配置されます。

## マイグレーションの検証

`verifySqlDelightMigration`タスクがGradleプロジェクトに追加され、`check`タスクの一部として実行されます。SqlDelightのソースセット（例: `src/main/sqldelight`）にある`<version number>.db`という名前の`.db`ファイルに対して、`<version number>.sqm`から始まるすべてのマイグレーションが適用され、そのマイグレーションが最新のスキーマを持つデータベースを生成することを確認します。

最新のスキーマから`.db`ファイルを生成するには、[gradle.md](gradle.md)で説明されているように`schemaOutputDirectory`を指定すると利用可能になる`generate<source set name><database name>Schema`タスクを実行します。これは、最初のマイグレーションを作成する前に行うのが良いでしょう。例えば、プロジェクトが`main`ソースセットと`"MyDatabase"`というカスタム名を使用している場合、`generateMainMyDatabaseSchema`タスクを実行する必要があります。

ほとんどのユースケースでは、データベースの初期バージョンのスキーマを表す`1.db`ファイルのみを持つことが有利です。複数の`.db`ファイルを持つことは可能ですが、その場合、各`.db`ファイルにそれぞれのマイグレーションが適用されることになり、多くの不要な作業が発生します。

## コードマイグレーション

コードからマイグレーションを実行し、データマイグレーションを実行したい場合は、`Database.Schema.migrate` APIを使用できます。

```kotlin
Database.Schema.migrate(
    driver = database,
    oldVersion = 0,
    newVersion = Database.Schema.version,
    AfterVersion(3) { driver -> driver.execute(null, "INSERT INTO test (value) VALUES('hello')", 0) },
)
```

以下の例では、1.sqm、2.sqm、3.sqm、4.sqm、5.sqmをマイグレーションとして持っている場合、上記のコールバックはデータベースがバージョン4のときに3.sqmが完了した後に発生します。コールバックの後、4.sqmから再開し、残りのマイグレーション（このケースでは4.sqmと5.sqm）を完了し、最終的なデータベースバージョンは6となります。