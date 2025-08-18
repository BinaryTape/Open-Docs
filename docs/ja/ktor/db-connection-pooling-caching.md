[//]: # (title: コネクションプーリングとキャッシング)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>使用ライブラリ</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>データベースコネクションプーリングとキャッシングの実装方法を学びます。</link-summary>

[前のチュートリアル](db-persistence.md)では、Exposedフレームワークを使用してウェブサイトに永続性を追加しました。
このチュートリアルでは、それぞれHikariCPライブラリとEhcacheライブラリを使用して、データベースコネクションプーリングとキャッシングを実装する方法について見ていきます。

## 依存関係の追加 {id="add-dependencies"}

まず、HikariCPライブラリとEhcacheライブラリの依存関係を追加する必要があります。
`gradle.properties`ファイルを開き、ライブラリのバージョンを指定します。

```kotlin
ehcache_version = 3.10.8
logback_version = 1.5.18
```

次に、`build.gradle.kts`を開き、以下の依存関係を追加します。

```kotlin

```

`build.gradle.kts`ファイルの右上にある**Load Gradle Changes**アイコンをクリックして、新しく追加された依存関係をインストールします。

## コネクションプーリング {id="connection-pooling"}

Exposedは、`transaction`スコープ内でデータベースの最初の操作を実行するときに、各`transaction`呼び出し内で新しいJDBC接続を開始します。
しかし、複数のJDBC接続を確立するのはリソースコストが高く、既存の接続を再利用することでパフォーマンスを向上させることができます。
_コネクションプーリング_メカニズムがこの問題を解決します。

このセクションでは、アプリケーションでJDBCコネクションプーリングを管理するためにHikariCPフレームワークを使用します。

### 接続設定を構成ファイルに抽出する {id="connection-settings-config"}

[前のチュートリアル](db-persistence.md#connect_db)では、データベース接続を確立するために、`com/example/dao/DatabaseSingleton.kt`ファイルで`driverClassName`と`jdbcURL`をハードコードしていました。

```kotlin

```

データベース接続設定を[カスタム設定グループ](server-configuration-file.topic)に抽出しましょう。

1. `src/main/resources/application.conf`ファイルを開き、`ktor`グループの外に`storage`グループを以下のように追加します。

   ```kotlin
   
   ```

2. `com/example/dao/DatabaseSingleton.kt`を開き、`init`関数を更新して、設定ファイルからストレージ設定をロードするようにします。

   ```kotlin
   
   ```
   
   `init`関数は`ApplicationConfig`を受け入れるようになり、`config.property`を使用してカスタム設定をロードします。

3. 最後に、`com/example/Application.kt`を開き、アプリケーション起動時に接続設定をロードするために`environment.config`を`DatabaseSingleton.init`に渡します。

   ```kotlin
   
   ```

### コネクションプーリングを有効にする {id="enable-connection-pooling"}

Exposedでコネクションプーリングを有効にするには、`Database.connect`関数にパラメータとして[DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html)を提供する必要があります。
HikariCPは、`DataSource`インターフェースを実装する`HikariDataSource`クラスを提供します。

1. `HikariDataSource`を作成するには、`com/example/dao/DatabaseSingleton.kt`を開き、`DatabaseSingleton`オブジェクトに`createHikariDataSource`関数を追加します。

   ```kotlin
   
   ```

   データソース設定に関するいくつかの注意点です。
     - `createHikariDataSource`関数は、ドライバークラス名とデータベースURLをパラメータとして受け取ります。
     - `maximumPoolSize`プロパティは、コネクションプールが到達できる最大サイズを指定します。
     - `isAutoCommit`と`transactionIsolation`は、Exposedで使用されるデフォルト設定と同期するように設定されています。

2. `HikariDataSource`を使用するには、`Database.connect`関数に渡します。

   ```kotlin
   
   ```

   これで[アプリケーションを実行](db-persistence.md#run_app)し、すべてが以前と同様に動作することを確認できます。

## キャッシング {id="caching"}

データベースをデータベースキャッシュで補完できます。
キャッシングは、頻繁に使用されるデータを一時メモリに保存することを可能にし、データベースのワークロードと頻繁に必要とされるデータの読み取り時間を削減できる技術です。

このチュートリアルでは、Ehcacheライブラリを使用してファイルをキャッシュとして整理します。

### 構成にキャッシュファイルパスを追加する {id="cache-file-path"}

`src/main/resources/application.conf`ファイルを開き、`ehcacheFilePath`プロパティを`storage`グループに追加します。

```kotlin

```

このプロパティは、キャッシュデータを保存するために使用されるファイルのパスを指定します。
後で、キャッシュを操作するための`DAOFacade`実装を設定するためにこれを使用します。

### キャッシングを実装する {id="implement-caching"}

キャッシングを実装するには、キャッシュから値を返し、キャッシュされた値がない場合はデータベースインターフェースに委譲する別の`DAOFacade`実装を提供する必要があります。

1. `com.example.dao`パッケージに新しい`DAOFacadeCacheImpl.kt`ファイルを作成し、以下の実装を追加します。

   ```kotlin
   
   ```

   このコード例の簡単な概要を説明します。
     - キャッシュを初期化および設定するために、Ehcache `CacheManager`インスタンスを定義します。`storagePath`をディスクストレージに使用されるルートディレクトリとして提供します。
     - IDで記事を保存するエントリのキャッシュを作成します。`articlesCache`は`Int`キーを`Article`値にマッピングします。
     - 次に、ローカルメモリとディスクリソースのサイズ制約を提供します。これらのパラメータの詳細については、[Ehcacheドキュメント](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)を参照してください。
     - 最後に、提供された名前、キー、および値の型を指定して`cacheManager.getCache()`を呼び出すことにより、作成されたキャッシュを取得します。

2. キャッシュで使用されるには、`Article`クラスはシリアライズ可能であり、`java.io.Serializable`を実装している必要があります。
   `com/example/models/Article.kt`を開き、コードを次のように更新します。

   ```kotlin
   
   ```

3. さて、`DAOFacade`のメンバーを実装する準備ができました。
   `DAOFacadeCacheImpl.kt`に戻り、以下のメソッドを追加します。

   ```kotlin
   
   ```

   - `allArticles`: すべての記事をキャッシュしようとはしません。これはメインデータベースに委譲します。
   - `article`: 記事を取得する際、まずキャッシュに存在するかどうかを確認し、存在しない場合にのみメインの`DAOFacade`に委譲し、その記事をキャッシュにも追加します。
   - `addNewArticle`: 新しい記事を追加する際、メインの`DAOFacade`に委譲しますが、この記事をキャッシュにも追加します。
   - `editArticle`: 既存の記事を編集する際、キャッシュとデータベースの両方を更新します。
   - `deleteArticle`: 削除時には、キャッシュとメインデータベースの両方から記事を削除する必要があります。

### DAOFacadeCacheImplを初期化する {id="init-dao-facade"}

`DAOFacadeCacheImpl`のインスタンスを作成し、アプリケーションが起動する前にデータベースに挿入されるサンプル記事を追加しましょう。

1. まず、`DAOFacadeImpl.kt`ファイルを開き、ファイルの最後にある`dao`変数の初期化を削除します。

2. 次に、`com/example/plugins/Routing.kt`を開き、`configureRouting`ブロック内で`dao`変数を初期化します。

   ```kotlin
   
   ```

   これで完了です。
   これで[アプリケーションを実行](db-persistence.md#run_app)し、すべてが以前と同様に動作することを確認できます。

> コネクションプーリングとキャッシングを含む完全な例はこちらで見つけることができます: [tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。