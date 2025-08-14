[//]: # (title: コネクションプーリングとキャッシュ)

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

<link-summary>データベースコネクションプーリングとキャッシュの実装方法を学びます。</link-summary>

[前回のチュートリアル](db-persistence.md)では、Exposedフレームワークを使用してウェブサイトに永続化機能を追加しました。
このチュートリアルでは、HikariCPとEhcacheライブラリをそれぞれ使用して、データベースコネクションプーリングとキャッシュを実装する方法を見ていきます。

## 依存関係の追加 {id="add-dependencies"}

まず、HikariCPとEhcacheライブラリの依存関係を追加する必要があります。
`gradle.properties`ファイルを開き、ライブラリのバージョンを指定します。

[object Promise]

次に、`build.gradle.kts`を開き、以下の依存関係を追加します。

[object Promise]

新しく追加された依存関係をインストールするために、`build.gradle.kts`ファイルの右上隅にある**Load Gradle Changes**アイコンをクリックします。

## コネクションプーリング {id="connection-pooling"}

Exposedは、`transaction`スコープ内で初めてデータベースを操作する際に、各`transaction`呼び出し内で新しいJDBC接続を開始します。
しかし、複数のJDBC接続を確立するのはリソースを大量に消費します。既存の接続を再利用することで、パフォーマンスを向上させることができます。
_コネクションプーリング_メカニズムはこの問題を解決します。

このセクションでは、HikariCPフレームワークを使用して、アプリケーションでのJDBCコネクションプーリングを管理します。

### 接続設定を構成ファイルに抽出する {id="connection-settings-config"}

[前回のチュートリアル](db-persistence.md#connect_db)では、データベース接続を確立するために`com/example/dao/DatabaseSingleton.kt`ファイルで`driverClassName`と`jdbcURL`をハードコードしていました。

[object Promise]

データベース接続設定を[カスタム構成グループ](server-configuration-file.topic)に抽出しましょう。

1. `src/main/resources/application.conf`ファイルを開き、`ktor`グループの外に`storage`グループを次のように追加します。

   [object Promise]

2. `com/example/dao/DatabaseSingleton.kt`を開き、設定ファイルからストレージ設定をロードするように`init`関数を更新します。

   [object Promise]
   
   `init`関数は`ApplicationConfig`を受け入れるようになり、`config.property`を使用してカスタム設定をロードします。

3. 最後に、`com/example/Application.kt`を開き、アプリケーション起動時に接続設定をロードするために`environment.config`を`DatabaseSingleton.init`に渡します。

   [object Promise]

### コネクションプーリングを有効にする {id="enable-connection-pooling"}

Exposedでコネクションプーリングを有効にするには、`Database.connect`関数にパラメータとして[DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html)を提供する必要があります。
HikariCPは`DataSource`インターフェースを実装する`HikariDataSource`クラスを提供します。

1. `HikariDataSource`を作成するには、`com/example/dao/DatabaseSingleton.kt`を開き、`DatabaseSingleton`オブジェクトに`createHikariDataSource`関数を追加します。

   [object Promise]

   データソース設定に関する注意事項を以下に示します。
     - `createHikariDataSource`関数は、ドライバークラス名とデータベースURLをパラメータとして受け取ります。
     - `maximumPoolSize`プロパティは、コネクションプールが到達できる最大サイズを指定します。
     - `isAutoCommit`と`transactionIsolation`は、Exposedで使用されるデフォルト設定と同期するように設定されています。

2. `HikariDataSource`を使用するには、それを`Database.connect`関数に渡します。

   [object Promise]

   これで、[アプリケーションを実行](db-persistence.md#run_app)し、すべてが以前と同様に動作することを確認できます。

## キャッシュ {id="caching"}

データベースにデータベースキャッシュを補完することができます。
キャッシュは、頻繁に使用されるデータを一時メモリに保存することを可能にするテクニックであり、
データベースのワークロードを減らし、頻繁に必要とされるデータを読み取る時間を短縮することができます。

このチュートリアルでは、Ehcacheライブラリを使用してファイルにキャッシュを整理します。

### 構成にキャッシュファイルパスを追加する {id="cache-file-path"}

`src/main/resources/application.conf`ファイルを開き、`storage`グループに`ehcacheFilePath`プロパティを追加します。

[object Promise]

このプロパティは、キャッシュデータを保存するために使用されるファイルのパスを指定します。
後でこれを使用して、キャッシュを操作するための`DAOFacade`実装を構成します。

### キャッシュを実装する {id="implement-caching"}

キャッシュを実装するには、キャッシュから値を返し、キャッシュされた値がない場合にデータベースインターフェースに委譲する別の`DAOFacade`実装を提供する必要があります。

1. `com.example.dao`パッケージに新しい`DAOFacadeCacheImpl.kt`ファイルを作成し、以下の実装を追加します。

   [object Promise]

   このコード例の簡単な概要を以下に示します。
     - キャッシュを初期化および構成するために、Ehcacheの`CacheManager`インスタンスを定義します。ディスクストレージに使用されるルートディレクトリとして`storagePath`を提供します。
     - 記事をIDで保存するエントリのキャッシュを作成します:`articlesCache`は`Int`キーを`Article`値にマッピングします。
     - 次に、ローカルメモリとディスクリソースのサイズ制約を提供します。これらのパラメータの詳細については、[Ehcacheドキュメント](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)を参照してください。
     - 最後に、指定された名前、キー、および値の型で`cacheManager.getCache()`を呼び出すことにより、作成されたキャッシュを取得します。

2. キャッシュで使用するために、`Article`クラスはシリアライズ可能であり、`java.io.Serializable`を実装する必要があります。
   `com/example/models/Article.kt`を開き、コードを次のように更新します。

   [object Promise]

3. これで`DAOFacade`のメンバーを実装する準備ができました。
   `DAOFacadeCacheImpl.kt`に戻り、以下のメソッドを追加します。

   [object Promise]

   - `allArticles`: すべての記事をキャッシュしようとはしません。これはメインデータベースに委譲します。
   - `article`: 記事を取得する際、まずキャッシュに存在するかどうかを確認し、存在しない場合にのみメインの`DAOFacade`に委譲し、その記事をキャッシュにも追加します。
   - `addNewArticle`: 新しい記事を追加する際、メインの`DAOFacade`に委譲しますが、この記事もキャッシュに追加します。
   - `editArticle`: 既存の記事を編集する際、キャッシュとデータベースの両方を更新します。
   - `deleteArticle`: 削除時には、キャッシュとメインデータベースの両方から記事を削除する必要があります。

### DAOFacadeCacheImplを初期化する {id="init-dao-facade"}

`DAOFacadeCacheImpl`のインスタンスを作成し、アプリケーションが開始される前にデータベースに挿入されるサンプル記事を追加しましょう。

1. まず、`DAOFacadeImpl.kt`ファイルを開き、ファイルの最下部にある`dao`変数の初期化を削除します。

2. 次に、`com/example/plugins/Routing.kt`を開き、`configureRouting`ブロック内で`dao`変数を初期化します。

   [object Promise]

   これで完了です。
   これで、[アプリケーションを実行](db-persistence.md#run_app)し、すべてが以前と同様に動作することを確認できます。

> コネクションプーリングとキャッシュを備えた完全な例は、こちらで確認できます: [tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。