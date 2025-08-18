[//]: # (title: Exposed を使用したデータベース永続化)

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

<link-summary>Exposed ORM フレームワークを使用して、ウェブサイトに永続化を追加する方法を学びます。</link-summary>

このチュートリアルシリーズでは、Ktor でシンプルなブログアプリケーションを作成する方法を説明します。
- 最初のチュートリアルでは、画像や HTML ページなどの静的コンテンツをホストする方法を説明しました。
- 2番目のチュートリアルでは、FreeMarker テンプレートエンジンを使用してアプリケーションにインタラクティブ性を追加しました。
- **このチュートリアル**では、Exposed フレームワークを使用してウェブサイトに永続化を追加します。記事を保存するために H2 ローカルデータベースを使用します。
- [次のチュートリアル](db-connection-pooling-caching.md)では、HikariCP と Ehcache ライブラリをそれぞれ使用して、データベース接続プーリングとキャッシュを実装する方法を説明します。

## 依存関係を追加する {id="add-dependencies"}

まず、Exposed および H2 ライブラリの依存関係を追加する必要があります。`gradle.properties` ファイルを開き、ライブラリのバージョンを指定します。

```kotlin
exposed_version = 0.53.0
h2_version = 2.3.232
```

次に、`build.gradle.kts` を開き、以下の依存関係を追加します。

```kotlin

```

`build.gradle.kts` ファイルの右上にある **Load Gradle Changes** アイコンをクリックして、新しく追加された依存関係をインストールします。

## モデルを更新する {id="model"}

Exposed は、データベーステーブルとして `org.jetbrains.exposed.sql.Table` クラスを使用します。`Article` モデルを更新するには、`models/Article.kt` ファイルを開き、既存のコードを以下で置き換えます。

```kotlin

```

`id`、`title`、`body` カラムには、記事に関する情報が保存されます。`id` カラムは主キーとして機能します。

> `Articles` オブジェクトのプロパティの[型を調べると](https://www.jetbrains.com/help/idea/viewing-reference-information.html#type-info)、必要な型引数を持つ `Column` 型であることがわかります。`id` は `Column<Int>` 型、`title` と `body` はどちらも `Column<String>` 型です。
>
{type="tip"}

## データベースに接続する {id="connect_db"}

[データアクセスオブジェクト](https://en.wikipedia.org/wiki/Data_access_object) (DAO) は、特定のデータベースの詳細を公開することなく、データベースへのインターフェースを提供するパターンです。後で `DAOFacade` インターフェースを定義し、データベースへの特定の要求を抽象化します。

Exposed を使用したすべてのデータベースアクセスは、データベースへの接続を取得することから始まります。そのためには、JDBC URL とドライバクラス名を `Database.connect` 関数に渡します。`com.example` 内に `dao` パッケージを作成し、新しい `DatabaseSingleton.kt` ファイルを追加します。次に、このコードを挿入します。

```kotlin

```

> `driverClassName` と `jdbcURL` がここにハードコードされていることに注意してください。Ktor を使用すると、このような設定を[カスタム設定グループ](server-configuration-file.topic)に抽出できます。

### テーブルの作成 {id="create_table"}

接続を取得した後、すべての SQL ステートメントはトランザクション内に配置する必要があります。

```kotlin
fun init() {
    // ...
    val database = Database.connect(jdbcURL, driverClassName)
    transaction(database) {
        // Statements here
    }
}
```

このコードサンプルでは、デフォルトのデータベースが `transaction` 関数に明示的に渡されています。データベースが1つしかない場合は、省略できます。この場合、Exposed はトランザクションに最後に接続されたデータベースを自動的に使用します。

> `Database.connect` 関数は、トランザクションを呼び出すまで実際のデータベース接続を確立しません。これは、将来の接続のための記述子を作成するだけであることに注意してください。

`Articles` テーブルがすでに宣言されているため、`init` 関数の最後に `transaction` 呼び出しにラップされた `SchemaUtils.create(Articles)` を呼び出して、データベースにこのテーブルがまだ存在しない場合に作成するように指示できます。

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

便宜上、`DatabaseSingleton` オブジェクト内にユーティリティ関数 `dbQuery` を作成しましょう。これは、データベースへの将来のすべての要求に使用されます。ブロッキング方式でアクセスするためにトランザクションを使用する代わりに、コルーチンを活用し、各クエリを独自のコルーチンで開始しましょう。

```kotlin

```

結果として得られる `DatabaseSingleton.kt` ファイルは次のようになります。

```kotlin

```

### 起動時にデータベース設定をロードする {id="startup"}

最後に、作成した設定をアプリケーションの起動時にロードする必要があります。`Application.kt` を開き、`Application.module` ボディから `DatabaseSingleton.init` を呼び出します。

```kotlin

```

## 永続化ロジックの実装 {id="persistence_logic"}

次に、記事の更新に必要な操作を抽象化するインターフェースを作成しましょう。`dao` パッケージ内に `DAOFacade.kt` ファイルを作成し、以下のコードで埋めます。

```kotlin

```

すべての記事を一覧表示し、ID で記事を表示し、新しい記事を追加、編集、または削除する必要があります。これらの関数はすべて内部でデータベースクエリを実行するため、中断関数として定義されています。

`DAOFacade` インターフェースを実装するには、その名前の上にキャレットを置き、このインターフェースの横にある黄色の電球アイコンをクリックして、**Implement interface** を選択します。表示されるダイアログで、デフォルト設定のまま **OK** をクリックします。

**Implement Members** ダイアログで、すべての関数を選択し、**OK** をクリックします。

![Implement Members](tutorial_persistence_implement_members.png){width="451"}

IntelliJ IDEA は `dao` パッケージ内に `DAOFacadeImpl.kt` ファイルを作成します。Exposed DSL を使用してすべての関数を実装しましょう。

### すべての記事を取得する {id="get_all"}

まず、すべてのエントリを返す関数から始めましょう。要求は `dbQuery` 呼び出しにラップされています。データベースからすべてのデータを取得するために `Table.selectAll` 拡張関数を呼び出します。`Articles` オブジェクトは `Table` のサブクラスであるため、Exposed DSL メソッドを使用して操作します。

```kotlin

```

`Table.selectAll` は `Query` のインスタンスを返します。`Article` インスタンスのリストを取得するには、各行のデータを手動で抽出し、データクラスに変換する必要があります。これは、`ResultRow` から `Article` を構築するヘルパー関数 `resultRowToArticle` を使用して実現します。

`ResultRow` は、簡潔な `get` 演算子を使用して、指定された `Column` に格納されているデータを取得する方法を提供し、配列やマップと同様にブラケット構文を使用できるようにします。

> `Articles.id` の型は `Column<Int>` であり、これは `Expression` インターフェースを実装しています。そのため、任意のカラムを式として渡すことができます。

### 記事を取得する {id="get_article"}

次に、1つの記事を返す関数を実装しましょう。

```kotlin

```

`select` 関数は拡張ラムダを引数として受け取ります。このラムダ内の暗黙的なレシーバーは `SqlExpressionBuilder` 型です。この型を明示的に使用することはありませんが、クエリを構築するために使用するカラム上の多くの便利な操作を定義します。比較（`eq`、`less`、`greater`）、算術演算（`plus`、`times`）、指定された値のリストに値が含まれるか含まれないかのチェック（`inList`、`notInList`）、値が null か null でないかのチェックなど、多くの操作を使用できます。

`select` は `Query` 値のリストを返します。前と同様に、それらを記事に変換します。この場合、1つの記事であるべきなので、それを結果として返します。

### 新しい記事を追加する {id="add_article"}

テーブルに新しい記事を挿入するには、ラムダ引数を受け取る `Table.insert` 関数を使用します。

```kotlin

```

このラムダ内では、どのカラムにどの値を設定するかを指定します。`it` 引数は `InsertStatement` 型であり、これに対してカラムと値を引数として取る `set` 演算子を呼び出すことができます。

### 記事を編集する {id="edit_article"}

既存の article を更新するには、`Table.update` が使用されます。

```kotlin

```

### 記事を削除する {id="delete_article"}

最後に、データベースから記事を削除するには `Table.deleteWhere` を使用します。

```kotlin

```

### DAOFacade を初期化する {id="init-dao-facade"}

`DAOFacade` のインスタンスを作成し、アプリケーションが開始される前にデータベースに挿入されるサンプル記事を追加しましょう。
`DAOFacadeImpl.kt` の最後に以下のコードを追加します。

```kotlin

```

## ルートを更新する {id="update_routes"}

これで、ルートハンドラ内で実装されたデータベース操作を使用する準備ができました。
`plugins/Routing.kt` ファイルを開きます。
すべての記事を表示するには、`get` ハンドラ内で `dao.allArticles` を呼び出します。

```kotlin

```

新しい記事を投稿するには、`post` 内で `dao.addNewArticle` 関数を呼び出します。

```kotlin

```

記事の表示と編集のために記事を取得するには、`get("{id}")` および `get("{id}/edit")` 内で `dao.article` を使用します。

```kotlin

```

最後に、`post("{id}")` ハンドラに移動し、`dao.editArticle` を使用して記事を更新し、`dao.deleteArticle` を使用して記事を削除します。

```kotlin

```

> このチュートリアルの結果のプロジェクトは、こちらで確認できます: [tutorial-website-interactive-persistence](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence)。

## アプリケーションを実行する {id="run_app"}

ジャーナルアプリケーションが期待通りに動作しているか確認しましょう。`Application.kt` の `fun main(...)` の横にある **Run** ボタンを押して、アプリケーションを実行できます。

![Run Server](run-app.png){width="706"}

IntelliJ IDEA がアプリケーションを起動し、数秒後にはアプリが実行中であることの確認が表示されるはずです。

```Bash
[main] INFO  Application - Responding at http://0.0.0.0:8080
```

ブラウザで [`http://localhost:8080/`](http://localhost:8080/) を開き、記事の作成、編集、削除を試してみてください。記事は `build/db.mv.db` ファイルに保存されます。IntelliJ IDEA では、[データベースツールウィンドウ](https://www.jetbrains.com/help/idea/database-tool-window.html)でこのファイルの内容を確認できます。

![Database tool window](tutorial_persistence_database_tool_window.png){width="706"}