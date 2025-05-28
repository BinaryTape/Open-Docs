[//]: # (title: Exposedを用いたデータベース永続化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>使用ライブラリ</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>Exposed ORMフレームワークを使用して、ウェブサイトに永続化を追加する方法を学びます。</link-summary>

このチュートリアルシリーズでは、Ktorでシンプルなブログアプリケーションを作成する方法を説明します。
- 最初のチュートリアルでは、画像やHTMLページのような静的コンテンツをホストする方法を示しました。
- 2番目のチュートリアルでは、FreeMarkerテンプレートエンジンを使用してアプリケーションにインタラクティブ性を追加しました。
- **このチュートリアル**では、Exposedフレームワークを使用してウェブサイトに永続化を追加します。記事を保存するためにH2ローカルデータベースを使用します。
- [次のチュートリアル](db-connection-pooling-caching.md)では、HikariCPおよびEhcacheライブラリをそれぞれ使用して、データベース接続プーリングとキャッシングを実装する方法について説明します。

## 依存関係の追加 {id="add-dependencies"}

まず、ExposedおよびH2ライブラリの依存関係を追加する必要があります。`gradle.properties`ファイルを開き、ライブラリのバージョンを指定します。

```kotlin
```
{src="gradle.properties" include-lines="13-14"}

次に、`build.gradle.kts`を開き、以下の依存関係を追加します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/build.gradle.kts" include-lines="2-3,20-21,25-28,32"}

`build.gradle.kts`ファイルの右上にある**Load Gradle Changes**アイコンをクリックして、新しく追加された依存関係をインストールします。

## モデルの更新 {id="model"}

Exposedは、データベーステーブルとして`org.jetbrains.exposed.sql.Table`クラスを使用します。`Article`モデルを更新するには、`models/Article.kt`ファイルを開き、既存のコードを以下に置き換えます。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/models/Article.kt"}

`id`、`title`、`body`列は、記事に関する情報を格納します。`id`列はプライマリキーとして機能します。

> [型を調べると](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info)、`Articles`オブジェクト内のプロパティが`Column`型を持ち、必要な型引数を持っていることがわかります。`id`は`Column<Int>`型であり、`title`と`body`は両方とも`Column<String>`型です。
>
{type="tip"}

## データベースへの接続 {id="connect_db"}

[データアクセスオブジェクト](https://en.wikipedia.org/wiki/Data_access_object)（DAO）は、特定のデータベースの詳細を公開せずに、データベースへのインターフェースを提供するパターンです。後で、データベースへの特定の要求を抽象化するために、`DAOFacade`インターフェースを定義します。

Exposedを使用するすべてのデータベースアクセスは、データベースへの接続を取得することから始まります。そのためには、JDBC URLとドライバークラス名を`Database.connect`関数に渡します。`com.example`内に`dao`パッケージを作成し、新しい`DatabaseSingleton.kt`ファイルを追加します。次に、このコードを挿入します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="1-13,17,21"}

> ここで`driverClassName`と`jdbcURL`がハードコードされていることに注意してください。Ktorでは、これらの設定を[カスタム設定グループ](server-configuration-file.topic)に抽出できます。

### テーブルの作成 {id="create_table"}

接続を取得した後、すべてのSQL文はトランザクション内に配置する必要があります。

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // Statements here
    }
}
```

このコードサンプルでは、デフォルトのデータベースが`transaction`関数に明示的に渡されています。データベースが1つしかない場合は、省略できます。この場合、Exposedはトランザクションに最後に接続されたデータベースを自動的に使用します。

> `Database.connect`関数は、トランザクションを呼び出すまで実際のデータベース接続を確立しないことに注意してください。これは、将来の接続のための記述子を作成するだけです。

`Articles`テーブルが既に宣言されていることを考えると、`init`関数の最後に`transaction`呼び出しで`SchemaUtils.create(Articles)`を呼び出すことで、データベースにこのテーブルが存在しない場合に作成するよう指示できます。

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        SchemaUtils.create(Articles)
    }
}
```

### クエリの実行 {id="queries"}

便宜上、`DatabaseSingleton`オブジェクト内にユーティリティ関数`dbQuery`を作成しましょう。これは、将来のすべてのデータベース要求で使用します。トランザクションを使用してブロック方式でアクセスする代わりに、コルーチンを活用し、各クエリを独自のコルーチンで開始しましょう。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="19-20"}

結果として得られる`DatabaseSingleton.kt`ファイルは次のようになります。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt"}

### 起動時のデータベース設定のロード {id="startup"}

最後に、作成した設定をアプリケーションの起動時にロードする必要があります。`Application.kt`を開き、`Application.module`本体から`DatabaseSingleton.init`を呼び出します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/Application.kt" include-lines="3,8-13"}

## 永続化ロジックの実装 {id="persistence_logic"}

次に、記事を更新するために必要な操作を抽象化するためのインターフェースを作成しましょう。`dao`パッケージ内に`DAOFacade.kt`ファイルを作成し、以下のコードを入力します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacade.kt"}

すべての記事を一覧表示し、IDで記事を表示し、新しい記事を追加、編集、または削除する必要があります。これらの関数はすべて内部でデータベースクエリを実行するため、`suspending`関数として定義されています。

`DAOFacade`インターフェースを実装するには、その名前の箇所にカーソルを置き、このインターフェースの横にある黄色の電球アイコンをクリックして、**Implement interface**を選択します。表示されたダイアログで、デフォルト設定のまま**OK**をクリックします。

**Implement Members**ダイアログで、すべての関数を選択し、**OK**をクリックします。

![Implement Members](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEAは`dao`パッケージ内に`DAOFacadeImpl.kt`ファイルを作成します。Exposed DSLを使用してすべての関数を実装しましょう。

### すべての記事を取得 {id="get_all"}

すべてのエントリを返す関数から始めましょう。私たちのリクエストは`dbQuery`呼び出しにラップされています。データベースからすべてのデータを取得するために、`Table.selectAll`拡張関数を呼び出します。`Articles`オブジェクトは`Table`のサブクラスであるため、Exposed DSLメソッドを使用して操作します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="1-18,45"}

`Table.selectAll`は`Query`のインスタンスを返すため、`Article`インスタンスのリストを取得するには、各行のデータを手動で抽出し、データクラスに変換する必要があります。これを実現するために、`ResultRow`から`Article`を構築するヘルパー関数`resultRowToArticle`を使用します。

`ResultRow`は、簡潔な`get`演算子を使用して、指定された`Column`に格納されているデータを取得する方法を提供し、配列やマップと同様にブラケット構文を使用できます。

> `Articles.id`の型は`Column<Int>`であり、これは`Expression`インターフェースを実装しています。そのため、どの列でも式として渡すことができます。

### 記事を取得 {id="get_article"}

次に、1つの記事を返す関数を実装しましょう。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="20-25"}

`select`関数は拡張ラムダを引数に取ります。このラムダ内の暗黙的なレシーバーは`SqlExpressionBuilder`型です。この型を明示的に使用することはありませんが、クエリを構築するために使用する、列に関する多数の便利な操作を定義します。比較（`eq`、`less`、`greater`）、算術演算（`plus`、`times`）、提供された値のリストに値が含まれるか含まれないかのチェック（`inList`、`notInList`）、値がnullか非nullかのチェックなど、多くの操作を使用できます。

`select`は`Query`値のリストを返します。これまでと同様に、それらを記事に変換します。この場合、1つの記事であるはずなので、それを結果として返します。

### 新しい記事の追加 {id="add_article"}

新しい記事をテーブルに挿入するには、ラムダ引数を取る`Table.insert`関数を使用します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="27-33"}

このラムダ内で、どの列にどの値を設定するかを指定します。`it`引数は`InsertStatement`型であり、それに対して列と値を引数に取る`set`演算子を呼び出すことができます。

### 記事の編集 {id="edit_article"}

既存の記事を更新するには、`Table.update`を使用します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="35-40"}

### 記事の削除 {id="delete_article"}

最後に、`Table.deleteWhere`を使用してデータベースから記事を削除します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="42-44"}

### DAOFacadeの初期化 {id="init-dao-facade"}

`DAOFacade`のインスタンスを作成し、アプリケーションが起動する前にデータベースに挿入されるサンプル記事を追加しましょう。
`DAOFacadeImpl.kt`の最後に以下のコードを追加します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DAOFacadeImpl.kt" include-lines="47-53"}

## ルートの更新 {id="update_routes"}

これで、ルーティングハンドラ内で実装されたデータベース操作を使用する準備ができました。
`plugins/Routing.kt`ファイルを開きます。
すべての記事を表示するには、`get`ハンドラ内で`dao.allArticles`を呼び出します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="22-24"}

新しい記事を投稿するには、`post`内で`dao.addNewArticle`関数を呼び出します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="28-34"}

表示および編集用の記事を取得するには、それぞれ`get("{id}")`および`get("{id}/edit")`内で`dao.article`を使用します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="35-42"}

最後に、`post("{id}")`ハンドラに移動し、`dao.editArticle`を使用して記事を更新し、`dao.deleteArticle`を使用して記事を削除します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="43-58"}

> このチュートリアルの完成プロジェクトは、こちらから入手できます: [tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence)。

## アプリケーションの実行 {id="run_app"}

ジャーナルアプリケーションが期待どおりに動作するか確認しましょう。`Application.kt`内の`fun main(...)`の横にある**Run**ボタンを押して、アプリケーションを実行できます。

![Run Server](run-app.png){width="706"}

IntelliJ IDEAがアプリケーションを起動し、数秒後にアプリが実行中であるという確認メッセージが表示されます。

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

ブラウザで[`http://localhost:8080/`](http://localhost:8080/)を開き、記事の作成、編集、削除を試してください。記事は`build/db.mv.db`ファイルに保存されます。IntelliJ IDEAでは、このファイルの内容を[データベースツールウィンドウ](https://www.jetbrains.com/help/idea/database-tool-window.html)で確認できます。

![Database tool window](tutorial_persistence_database_tool_window.png){width="706"}