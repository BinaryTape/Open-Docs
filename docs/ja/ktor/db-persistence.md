[//]: # (title: Exposedによるデータベース永続化)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
<p>
<b>使用ライブラリ</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>Exposed ORMフレームワークを使用してウェブサイトに永続化機能を追加する方法を学びます。</link-summary>

このチュートリアルシリーズでは、Ktorでシンプルなブログアプリケーションを作成する方法を説明します。
- 最初のチュートリアルでは、画像やHTMLページのような静的コンテンツをホストする方法を説明しました。
- 2番目のチュートリアルでは、FreeMarkerテンプレートエンジンを使用してアプリケーションにインタラクティブ性を追加しました。
- **このチュートリアル**では、Exposedフレームワークを使用してウェブサイトに永続化機能を追加します。記事を保存するためにH2ローカルデータベースを使用します。
- [次のチュートリアル](db-connection-pooling-caching.md)では、それぞれHikariCPとEhcacheライブラリを使用してデータベース接続プーリングとキャッシュを実装する方法を説明します。

## 依存関係の追加 {id="add-dependencies"}

まず、ExposedとH2ライブラリの依存関係を追加する必要があります。`gradle.properties`ファイルを開き、ライブラリのバージョンを指定します。

[object Promise]

次に、`build.gradle.kts`を開き、以下の依存関係を追加します。

[object Promise]

新しく追加された依存関係をインストールするには、`build.gradle.kts`ファイルの右上隅にある**Load Gradle Changes**アイコンをクリックします。

## モデルの更新 {id="model"}

Exposedは`org.jetbrains.exposed.sql.Table`クラスをデータベーステーブルとして使用します。`Article`モデルを更新するには、`models/Article.kt`ファイルを開き、既存のコードを以下のものに置き換えます。

[object Promise]

`id`、`title`、`body`カラムには、記事に関する情報が保存されます。`id`カラムは主キーとして機能します。

> `Articles`オブジェクト内のプロパティの[型を調べると](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info)、必要な型引数を持つ`Column`型であることがわかります。`id`は`Column<Int>`型であり、`title`と`body`は両方とも`Column<String>`型です。
> 
{type="tip"}

## データベースへの接続 {id="connect_db"}

[データアクセスオブジェクト](https://en.wikipedia.org/wiki/Data_access_object) (DAO) は、特定のデータベースの詳細を公開せずにデータベースへのインターフェースを提供するパターンです。後ほど、データベースへの特定の要求を抽象化するために`DAOFacade`インターフェースを定義します。

Exposedを使用したすべてのデータベースアクセスは、データベースへの接続を取得することから始まります。そのためには、JDBC URLとドライバクラス名を`Database.connect`関数に渡します。`com.example`内に`dao`パッケージを作成し、新しい`DatabaseSingleton.kt`ファイルを追加します。次に、このコードを挿入します。

[object Promise]

> `driverClassName`と`jdbcURL`がここにハードコードされていることに注意してください。Ktorでは、これらの設定を[カスタム設定グループ](server-configuration-file.topic)に抽出できます。

### テーブルの作成 {id="create_table"}

接続を取得した後、すべてのSQLステートメントはトランザクション内に配置する必要があります。

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // Statements here
    }
}
```

このコード例では、デフォルトのデータベースが`transaction`関数に明示的に渡されています。データベースが1つしかない場合は、省略できます。この場合、Exposedはトランザクションに最後に接続されたデータベースを自動的に使用します。

> `Database.connect`関数は、トランザクションを呼び出すまで実際のデータベース接続を確立しないことに注意してください。これは将来の接続のための記述子を作成するだけです。

`Articles`テーブルが既に宣言されているので、`init`関数の下部で`transaction`呼び出し内に`SchemaUtils.create(Articles)`をラップして呼び出すことで、このテーブルがまだ存在しない場合にデータベースに作成するよう指示できます。

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

便宜上、`DatabaseSingleton`オブジェクト内にユーティリティ関数`dbQuery`を作成しましょう。これを今後のデータベースへのすべての要求に使用します。トランザクションを使用してブロックする方法でアクセスする代わりに、コルーチンを活用し、各クエリを独自のコルーチンで開始しましょう。

[object Promise]

結果の`DatabaseSingleton.kt`ファイルは次のようになります。

[object Promise]

### 起動時にデータベース設定を読み込む {id="startup"}

最後に、作成した設定をアプリケーションの起動時に読み込む必要があります。`Application.kt`を開き、`Application.module`のボディから`DatabaseSingleton.init`を呼び出します。

[object Promise]

## 永続化ロジックの実装 {id="persistence_logic"}

次に、記事を更新するために必要な操作を抽象化するためのインターフェースを作成します。`dao`パッケージ内に`DAOFacade.kt`ファイルを作成し、以下のコードを記述します。

[object Promise]

すべての記事をリスト表示し、IDで記事を表示し、新しい記事を追加、編集、または削除する必要があります。これらの関数はすべて内部でデータベースクエリを実行するため、`suspending functions`として定義されています。

`DAOFacade`インターフェースを実装するには、その名前にキャレットを置き、インターフェースの横にある黄色の電球アイコンをクリックして、**Implement interface**を選択します。表示されたダイアログで、デフォルト設定のまま**OK**をクリックします。

**Implement Members**ダイアログで、すべての関数を選択し、**OK**をクリックします。

![Implement Members](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEAは`dao`パッケージ内に`DAOFacadeImpl.kt`ファイルを作成します。Exposed DSLを使用してすべての関数を実装しましょう。

### すべての記事を取得 {id="get_all"}

まず、すべてのエントリを返す関数から始めましょう。要求は`dbQuery`呼び出しにラップされます。`Table.selectAll`拡張関数を呼び出して、データベースからすべてのデータを取得します。`Articles`オブジェクトは`Table`のサブクラスであるため、Exposed DSLメソッドを使用して操作します。

[object Promise]

`Table.selectAll`は`Query`のインスタンスを返すため、`Article`インスタンスのリストを取得するには、各行のデータを手動で抽出し、データクラスに変換する必要があります。これは、`ResultRow`から`Article`を構築するヘルパー関数`resultRowToArticle`を使用して行います。

`ResultRow`は、簡潔な`get`演算子を使用して指定された`Column`に保存されているデータを取得する方法を提供し、配列やマップと同様のブラケット構文を使用できます。

> `Articles.id`の型は`Column<Int>`であり、これは`Expression`インターフェースを実装しています。そのため、どのカラムでも`Expression`として渡すことができます。

### 記事を取得 {id="get_article"}

次に、1つの記事を返す関数を実装しましょう。

[object Promise]

`select`関数は引数として拡張ラムダを取ります。このラムダ内の暗黙のレシーバーは`SqlExpressionBuilder`型です。この型を明示的に使用することはありませんが、クエリを構築するために使用する、カラムに対する多数の便利な操作を定義しています。比較 (`eq`, `less`, `greater`)、算術演算 (`plus`, `times`)、提供された値のリストに値が含まれるか否か (`inList`, `notInList`)、値がnullか非nullかなどを確認できます。

`select`は`Query`値のリストを返します。以前と同様に、それらを記事に変換します。この場合、1つの記事であるべきなので、それを結果として返します。

### 新しい記事の追加 {id="add_article"}

テーブルに新しい記事を挿入するには、ラムダ引数を取る`Table.insert`関数を使用します。

[object Promise]

このラムダ内で、どのカラムにどの値を設定するべきかを指定します。`it`引数は`InsertStatement`型であり、カラムと値を引数にとる`set`演算子を呼び出すことができます。

### 記事の編集 {id="edit_article"}

既存の記事を更新するには、`Table.update`を使用します。

[object Promise]

### 記事の削除 {id="delete_article"}

最後に、`Table.deleteWhere`を使用してデータベースから記事を削除します。

[object Promise]

### `DAOFacade`の初期化 {id="init-dao-facade"}

`DAOFacade`のインスタンスを作成し、アプリケーションが開始される前にデータベースに挿入されるサンプル記事を追加しましょう。
`DAOFacadeImpl.kt`の最後に以下のコードを追加します。

[object Promise]

## ルートの更新 {id="update_routes"}

これで、実装したデータベース操作をルートハンドラー内で使用する準備ができました。
`plugins/Routing.kt`ファイルを開きます。
すべての記事を表示するには、`get`ハンドラー内で`dao.allArticles`を呼び出します。

[object Promise]

新しい記事を投稿するには、`post`内で`dao.addNewArticle`関数を呼び出します。

[object Promise]

表示および編集する記事を取得するには、それぞれ`get("{id}")`および`get("{id}/edit")`内で`dao.article`を使用します。

[object Promise]

最後に、`post("{id}")`ハンドラーに移動し、`dao.editArticle`を使用して記事を更新し、`dao.deleteArticle`を使用して記事を削除します。

[object Promise]

> このチュートリアルの完成したプロジェクトは、こちらで見つけることができます: [tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence)。

## アプリケーションの実行 {id="run_app"}

ジャーナルアプリケーションが期待通りに動作しているか確認しましょう。`Application.kt`の`fun main(...)`の隣にある**Run**ボタンを押してアプリケーションを実行できます。

![Run Server](run-app.png){width="706"}

IntelliJ IDEAがアプリケーションを起動し、数秒後にアプリが実行されていることを示す確認メッセージが表示されるはずです。

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

ブラウザで[`http://localhost:8080/`](http://localhost:8080/)を開き、記事の作成、編集、削除を試してみてください。記事は`build/db.mv.db`ファイルに保存されます。IntelliJ IDEAでは、このファイルの内容を[Database tool window](https://www.jetbrains.com/help/idea/database-tool-window.html)で確認できます。

![Database tool window](tutorial_persistence_database_tool_window.png){width="706"}