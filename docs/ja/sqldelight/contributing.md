# 貢献する

このプロジェクトにコードを貢献したい場合は、GitHubを通じてリポジトリをフォークし、プルリクエストを送信することで行うことができます。

コードを提出する際は、可能な限りコードの可読性を保つため、既存の規約とスタイルに従うよう最大限努力してください。

あなたのコードがプロジェクトに受け入れられる前に、[個人コントリビューターライセンス契約 (CLA)][1] にも署名する必要があります。

 [1]: https://spreadsheets.google.com/spreadsheet/viewform?formkey=dDViT2xzUHAwRkI3X3k5Z0lQM091OGc6MQ&ndplr=1
 
## SQLDelight 

貢献を始めたい場合は、SQLDelightのどの部分に貢献したいかに応じて、以下の特定のガイドを参照してください。まだ不明な点がある場合は、調査中のIssueにコメントで詰まっている箇所を記入していただければ、そこで返信いたします。または、行おうとしていることについてIssueを作成し、議論を開始してください。

### IDEプラグイン

IDEのバグを修正したり、IDEを拡張したい場合、コード変更は`sqldelight-idea-plugin`モジュールで行われる可能性が高いです。変更は`./gradlew runIde`タスクを使用してテストでき、`./gradlew runIde --debug-jvm`を使用してライブデバッグを行うことができます。

IDEでバグに遭遇しているものの、サンプルプロジェクトで再現できない場合は、IDEをライブデバッグすることができます。これには、IntelliJの2番目のインストールが必要です。これを行うには、[Toolbox](https://www.jetbrains.com/toolbox-app/)を使用して、IDEリストの一番下までスクロールし、異なるバージョンのIntelliJを選択します。

デバッガを使用したいIDEで、SQLDelightのリポジトリをチェックアウトし、新しい`Remote`実行構成を作成します。これにより、「リモートJVMのコマンドライン引数」が自動的に入力されます。例えば、`-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005`のようになります。その値をコピーし、デバッグしたいIDEを開きます。`Help -> Edit Custom VM Options`を選択し、コピーした行を開かれたファイルの最後に貼り付けます。デバッグしたいIDEを再起動し、起動したら構成を作成したIDEを開き、作成したリモート構成を使用してデバッガをアタッチします。

IDEプラグインとその機能の構築に関する詳細については、[Jetbrains公式ドキュメント](https://jetbrains.org/intellij/sdk/docs/reference_guide/custom_language_support.html)を参照するか、[Jetbrains Platform Slack](https://blog.jetbrains.com/platform/2019/10/introducing-jetbrains-platform-slack-for-plugin-developers/)に参加してください。

### ドライバー

独自のドライバーを作成したい場合、SQLDelightリポジトリの外部で`runtime`アーティファクトを使用して作成できます。ドライバーをテストするには、`driver-test`に依存し、`DriverTest`と`TransactionTest`を拡張して、SQLDelightが期待するように動作することを確認できます。

#### 非同期ドライバー

非同期呼び出しを行うドライバーは、`runtime-async`アーティファクトを使用することで実装できます。

### Gradle

Gradleの問題に遭遇している場合は、`sqldelight-gradle-plugin/src/test`に、他のフォルダーと同様に、問題を再現するテストフィクスチャを作成することから始めてください。修正方法が分からなくても、この失敗するテストを含むPRを開いてください！テストケースは大変ありがたいです。
統合テストは、SQLite/MySQL/PostgreSQLなどを実行し、それぞれの実行環境とSQLDelightを使用してSQLクエリを実行するGradleプロジェクト全体をセットアップする方法を示しています。SQLDelightでランタイムの問題に遭遇している場合は、これらの既存の統合テストにテストを追加することを検討してください。

### コンパイラ

SQLDelightのコンパイラには多くの層があります。コード生成（codegen）に厳密に興味がある（SQLのパースには興味がない）場合は、`sqldelight-compiler`モジュールで貢献することになります。パーサーに興味がある場合は、[sql-psi](https://github.com/alecstrong/sql-psi)に貢献する必要があります。SQLDelightはKotlinコードの生成に[kotlinpoet](https://github.com/square/kotlinpoet)を使用しているため、Kotlin型を参照するためにそのAPIを必ず使用し、インポートが正しく機能するようにしてください。コード生成を何らかの方法で変更した場合は、プルリクエストを開く前に`./gradlew build`を実行してください。これにより、`sqldelight-compiler:integration-tests`の統合テストが更新されます。統合テスト（つまり、実行環境でSQLクエリを実行するテスト）を記述したい場合は、`sqldelight-compiler:integration-tests`にテストを追加してください。

---

## SQL PSI

次のセクションでは、パーサーとPSIレイヤーへの貢献方法を説明しますが、その前に[multiple dialects](https://www.alecstrong.com/posts/multiple-dialects/)に関するブログ記事を読み、[sql-psi](https://github.com/AlecStrong/sql-psi)のさまざまな構成要素を理解しておく必要があります。SQLDelightと同様に、問題に遭遇したものの修正方法が分からない場合や、支援が必要な場合は、GitHub Issueにコメントするか、新しいIssueを作成して議論を開始してください。

SQL-PSIの変更については、対応する`core/src/test/fixtures_*`フォルダーにテストフィクスチャを追加する必要があります。`fixtures`フォルダー（サフィックスなし）はすべてのダイアレクトで実行されます。sql-psiに変更がマージされた後、SQLDelightでも変更を行う必要がある場合は、SQLDelightの`sql-psi-dev`ブランチをチェックアウトし、そのブランチをターゲットとしてPRを作成してください。sql-psiのスナップショットリリースを使用するため、sql-psiの変更がマージされてからおよそ10分後にはSQLDelightの変更をビルドできます。

### 文法

文法に新しいルールを追加する場合は、まずそれが既存の文法に追加する新しいルールなのか、それともANSI SQL（[sql.bnf](https://github.com/AlecStrong/sql-psi/blob/master/core/src/main/kotlin/com/alecstrong/sql/psi/core/sql.bnf)にある）からオーバーライドしたいルールなのかを判断してください。
どちらの場合でも、新しい文法でそのルールを定義する必要がありますが、ANSI SQLルールをオーバーライドする場合は、それをオーバーライドリストに追加し、ルールにオーバーライド属性を設定してください。

```bnf
overrides ::= my_rule

my_rule ::= SOME_TOKEN {
  override = true
}
```

ルールの定義は、ANSI-SQLのルールを正確にコピー/ペーストすることから始めるべきです。ANSI-SQLのルールを参照するには、それを`{}`で囲む必要があるため、オーバーライドするルール内のすべての外部ルールを`{}`で囲む必要があります。

```bnf
my_rule ::= internal_rule {external_rule} {
  override = true
}
internal_rule ::= SOME_TOKEN
```

1つの注意点として、ANSI-SQLの`expr`ルールを参照する場合は、特別でオーバーライドできないため、`<<expr '-1'>>`のように記述する必要があります。

ANSI SQLから使用したいトークンは、手動でインポートする必要もあります。

```bnf
{
  parserImports = [
    "static com.alecstrong.sql.psi.core.psi.SqlTypes.DELETE"
    "static com.alecstrong.sql.psi.core.psi.SqlTypes.FROM"
  ]
}
overrides ::= delete

delete ::= DELETE FROM {table_name} {
  override = true
}
```

ダイアレクトは独自のトークンを追加できませんが、""で囲むことで正確なテキストを要求できます。

```bnf
my_rule ::= "SOME_TOKEN"
```

オーバーライドするルールは、元のルールの型に準拠するコードを生成する必要があるため、元のルールに対して既存の型を`implement`および`extend`するようにしてください。

```bnf
my_rule ::= internal_rule {external_rule} {
  extends = "com.alecstrong.sql.psi.core.psi.impl.SqlMyRuleImpl"
  implements = "com.alecstrong.sql.psi.core.psi.SqlMyRule"
  overrides = true
}
```

文法におけるルールオーバーライドの例については、PostgreSQLに`RETURNING`構文を追加する[このPR](https://github.com/AlecStrong/sql-psi/pull/163/files)を確認してください。

### ルール動作

多くの場合、PSIレイヤーの動作を変更したいことがあります（例えば、コンパイルを失敗させたい状況でエラーをスローするなど）。これを行うには、ルールに`extends`の代わりに`mixin`を使用させます。これは、新しいロジックを含む自分で記述するクラスです。

```bnf
my_rule ::= interal_rule {external_rule} {
  mixin = "com.alecstrong.sql.psi.MyRuleMixin"
  implements = "com.alecstrong.sql.psi.core.psi.SqlMyRule"
  overrides = true
}
```

そして、そのクラスが元のANSI SQL型とSQL-PSIの基底クラス`SqlCompositeElementImpl`を実装していることを確認します。

```
class MyRule(
  node: ASTNode
) : SqlCompositeElementImpl(node),
    SqlMyRule {
  fun annotate(annotationHolder: SqlAnnotationHolder) {
    if (internal_rule.text == "bad_text") {
      annotationHolder.createErrorAnnotation("Invalid text value", internal_rule)
    }
  }
}
```

例えば、[DropIndexMixin](https://github.com/AlecStrong/sql-psi/blob/f1137ff82dd0aa77f741a09d88855fbf9b751c00/core/src/main/kotlin/com/alecstrong/sql/psi/core/psi/mixins/DropIndexMixin.kt)は、削除されるインデックスがスキーマに存在することを確認します。

---

このドキュメントでカバーされていない貢献に関する質問がある場合は、SqlDelightでIssueを開くか、改善に取り組めるようにPRを開いてください！