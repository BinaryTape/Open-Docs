[//]: # (title: Exposedを使用したデータベース永続化)

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
<b>使用されているライブラリ</b>: <a href="https://github.com/JetBrains/Exposed">Exposed</a>, <a href="https://github.com/h2database/h2database">h2database</a>
</p>
</tldr>

<link-summary>Exposed ORMフレームワークを使用して、ウェブサイトに永続化機能を追加する方法を学びます。</link-summary>

この一連のチュートリアルでは、Ktorでシンプルなブログアプリケーションを作成する方法を紹介します。
- 最初のチュートリアルでは、画像やHTMLページなどの静的コンテンツをホストする方法を紹介しました。
- 2番目のチュートリアルでは、FreeMarkerテンプレートエンジンを使用してアプリケーションにインタラクティブ機能を追加しました。
- **このチュートリアル**では、Exposedフレームワークを使用してウェブサイトに永続化機能を追加します。記事の保存にはH2ローカルデータベースを使用します。
- [次のチュートリアル](db-connection-pooling-caching.md)では、HikariCPライブラリとEhcacheライブラリをそれぞれ使用して、データベースの接続プーリングとキャッシングを実装する方法を見ていきます。

## 依存関係の追加 {id="add-dependencies"}

まず、ExposedとH2ライブラリの依存関係を追加する必要があります。`gradle.properties`ファイルを開き、ライブラリのバージョンを指定します。

```kotlin
kotlinx_serialization_version = 1.8.0
kotlin_css_version = 1.0.0-pre.721
```

次に、`build.gradle.kts`を開き、以下の依存関係を追加します。

```kotlin

```

`build.gradle.kts`ファイルの右上隅にある **Load Gradle Changes** アイコンをクリックして、新しく追加された依存関係をインストールします。

## モデルの更新 {id="model"}

Exposedは、`org.jetbrains.exposed.sql.Table`クラスをデータベーステーブルとして使用します。`Article`モデルを更新するには、`models/Article.kt`ファイルを開き、既存のコードを以下に置き換えます。

```kotlin

```

`id`、`title`、`body`カラムは、記事に関する情報を保存します。`id`カラムは主キー（primary key）として機能します。

> `Articles`オブジェクトのプロパティの[型を確認](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info)すると、それらが必要な型引数を持つ`Column`型であることがわかります。`id`は`Column<Int>`型であり、`title`と`body`は両方とも`Column<String>`型です。
> 
{type="tip"}

## データベースへの接続 {id="connect_db"}

[データアクセスオブジェクト](https://en.wikipedia.org/wiki/Data_access_object) (DAO) は、特定のデータベースの詳細を公開せずにデータベースへのインターフェースを提供するパターンです。後で特定のデータベースリクエストを抽象化するために、`DAOFacade`インターフェースを定義します。

Exposedを使用したすべてのデータベースアクセスは、データベースへの接続を取得することから始まります。そのためには、JDBC URLとドライバークラス名を`Database.connect`関数に渡します。`com.example`の中に`dao`パッケージを作成し、新しい`DatabaseSingleton.kt`ファイルを追加します。そして、以下のコードを挿入します。

```kotlin

```

> ここでは`driverClassName`と`jdbcURL`がハードコードされていることに注意してください。Ktorでは、このような設定を[カスタム設定グループ](server-configuration-file.topic)に抽出することができます。

### テーブルの作成 {id="create_table"}

接続を取得した後、すべてのSQLステートメントはトランザクション内に配置する必要があります。

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // ここにステートメントを記述
    }
}
```

このコード例では、デフォルトのデータベースが`transaction`関数に明示的に渡されています。データベースが1つしかない場合は、省略可能です。その場合、Exposedは自動的に最後に接続されたデータベースをトランザクションに使用します。

> `Database.connect`関数は、トランザクションを呼び出すまで実際のデータベース接続を確立しません。将来の接続のための記述子（descriptor）を作成するだけです。

`Articles`テーブルはすでに宣言されているため、`init`関数の最後に`transaction`呼び出しでラップされた`SchemaUtils.create(Articles)`を呼び出すことで、テーブルがまだ存在しない場合に作成するようデータベースに指示できます。

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

利便性のために、`DatabaseSingleton`オブジェクト内にユーティリティ関数`dbQuery`を作成しましょう。これを今後のすべてのデータベースリクエストに使用します。ブロッキングな方法でアクセスするためにトランザクションを使用する代わりに、コルーチンを活用し、各クエリを独自のコルーチンで開始します。

```kotlin

```

結果として得られる`DatabaseSingleton.kt`ファイルは以下のようになります。

```kotlin

```

### 起動時にデータベース設定をロードする {id="startup"}

最後に、作成した設定をアプリケーションの起動時にロードする必要があります。`Application.kt`を開き、`Application.module`のボディから`DatabaseSingleton.init`を呼び出します。

```kotlin

```

## 永続化ロジックの実装 {id="persistence_logic"}

次に、記事を更新するために必要な操作を抽象化するインターフェースを作成しましょう。`dao`パッケージ内に`DAOFacade.kt`ファイルを作成し、以下のコードを記述します。

```kotlin

```

すべての記事の一覧表示、IDによる記事の表示、新しい記事の追加、編集、削除を行う必要があります。これらの関数はすべて内部でデータベースクエリを実行するため、suspend関数として定義されています。

`DAOFacade`インターフェースを実装するには、インターフェース名にキャレットを置き、インターフェースの横にある黄色の電球アイコンをクリックして **Implement interface** を選択します。表示されたダイアログでデフォルト設定のまま **OK** をクリックします。

**Implement Members** ダイアログで、すべての関数を選択して **OK** をクリックします。

![Implement Members](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEAが`dao`パッケージ内に`DAOFacadeImpl.kt`ファイルを作成します。Exposed DSLを使用してすべての関数を実装しましょう。

### すべての記事を取得する {id="get_all"}

すべてのエントリを返す関数から始めましょう。リクエストは`dbQuery`呼び出しにラップされます。`Table.selectAll`拡張関数を呼び出して、データベースからすべてのデータを取得します。`Articles`オブジェクトは`Table`のサブクラスであるため、Exposed DSLメソッドを使用して操作します。

```kotlin

```

`Table.selectAll`は`Query`のインスタンスを返すため、`Article`インスタンスのリストを取得するには、各行のデータを手動で抽出し、データクラスに変換する必要があります。これは、`ResultRow`から`Article`を構築するヘルパー関数`resultRowToArticle`を使用して行います。

`ResultRow`は、簡潔な`get`演算子を使用して特定の`Column`に保存されたデータを取得する方法を提供し、配列やマップのようにブラケット構文（`[]`）を使用できるようにします。

> `Articles.id`の型は`Column<Int>`であり、これは`Expression`インターフェースを実装しています。そのため、任意のカラムを式（expression）として渡すことができます。

### 記事を取得する {id="get_article"}

次に、1つの記事を返す関数を実装しましょう。

```kotlin

```

`select`関数は拡張ラムダを引数に取ります。このラムダ内の暗黙のレシーバーは`SqlExpressionBuilder`型です。この型を明示的に使用することはありませんが、クエリを構築するために使用するカラムに対する一連の便利な操作が定義されています。比較（`eq`, `less`, `greater`）、算術演算（`plus`, `times`）、値が指定されたリストに含まれているかどうかの確認（`inList`, `notInList`）、値がnullかどうかの確認などが使用できます。

`select`は`Query`値のリストを返します。以前と同様に、それらを記事に変換します。このケースでは1つの記事であるはずなので、それを結果として返します。

### 新しい記事を追加する {id="add_article"}

テーブルに新しい記事を挿入するには、ラムダ引数を取る`Table.insert`関数を使用します。

```kotlin

```

このラムダ内で、どのカラムにどの値を設定するかを指定します。`it`引数は`InsertStatement`型であり、カラムと値を引数に取る`set`演算子を呼び出すことができます。

### 記事を編集する {id="edit_article"}

既存の記事を更新するには、`Table.update`を使用します。

```kotlin

```

### 記事を削除する {id="delete_article"}

最後に、`Table.deleteWhere`を使用してデータベースから記事を削除します。

```kotlin

```

### DAOFacadeの初期化 {id="init-dao-facade"}

`DAOFacade`のインスタンスを作成し、アプリケーションが開始される前にデータベースに挿入されるサンプル記事を追加しましょう。
`DAOFacadeImpl.kt`の最後に以下のコードを追加します。

```kotlin

```

## ルートの更新 {id="update_routes"}

これで、実装したデータベース操作をルートハンドラー内で使用する準備が整いました。
`plugins/Routing.kt`ファイルを開きます。
すべての記事を表示するには、`get`ハンドラー内で`dao.allArticles`を呼び出します。

```kotlin

```

新しい記事を投稿するには、`post`内で`dao.addNewArticle`関数を呼び出します。

```kotlin

```

表示および編集用の記事を取得するには、それぞれ`get("{id}")`および`get("{id}/edit")`内で`dao.article`を使用します。

```kotlin

```

最後に、`post("{id}")`ハンドラーに移動し、`dao.editArticle`を使用して記事を更新し、`dao.deleteArticle`を使用して記事を削除します。

```kotlin

```

> このチュートリアルの最終的なプロジェクトはこちらで確認できます: [tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence)

## アプリケーションの実行 {id="run_app"}

ジャーナルアプリケーションが期待通りに動作するか見てみましょう。`Application.kt`内の`fun main(...)`の横にある **Run** ボタンを押すことでアプリケーションを実行できます。

![Run Server](run-app.png){width="706"}

IntelliJ IDEAがアプリケーションを起動し、数秒後にはアプリが実行中であることを示す確認メッセージが表示されます。

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

ブラウザで [`http://localhost:8080/`](http://localhost:8080/) を開き、記事の作成、編集、削除を試してみてください。記事は `build/db.mv.db` ファイルに保存されます。IntelliJ IDEAでは、[Databaseツールウィンドウ](https://www.jetbrains.com/help/idea/database-tool-window.html)でこのファイルの内容を確認できます。

![Database tool window](tutorial_persistence_database_tool_window.png){width="706"}