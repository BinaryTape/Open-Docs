[//]: # (title: コネクションポーリングとキャッシュ)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>使用ライブラリ</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>データベースのコネクションポーリングとキャッシュを実装する方法を学びます。</link-summary>

[前回のチュートリアル](db-persistence.md)では、Exposedフレームワークを使用してWebサイトに永続性を追加しました。
このチュートリアルでは、HikariCPとEhcacheライブラリをそれぞれ使用して、データベースのコネクションポーリングとキャッシュを実装する方法を見ていきます。

## 依存関係の追加 {id="add-dependencies"}

まず、HikariCPとEhcacheライブラリの依存関係を追加する必要があります。
`gradle.properties`ファイルを開き、ライブラリのバージョンを指定します：

```kotlin
h2_version = 2.3.232
hikaricp_version = 5.1.0
```

次に、`build.gradle.kts`を開き、以下の依存関係を追加します：

```kotlin

```

`build.gradle.kts`ファイルの右上にある **Load Gradle Changes** アイコンをクリックして、新しく追加された依存関係をインストールします。

## コネクションポーリング {id="connection-pooling"}

Exposedは、`transaction`コールのスコープ内でデータベースの最初の操作を実行する際に、各`transaction`呼び出しの内部で新しいJDBCコネクションを開始します。
しかし、複数のJDBCコネクションを確立するのはリソースの消費が激しいため、既存のコネクションを再利用することでパフォーマンスを向上させることができます。
*コネクションポーリング*（connection pooling）の仕組みがこの問題を解決します。

このセクションでは、HikariCPフレームワークを使用して、アプリケーションでのJDBCコネクションポーリングを管理します。

### 接続設定を設定ファイルに抽出する {id="connection-settings-config"}

[前回のチュートリアル](db-persistence.md#connect_db)では、`com/example/dao/DatabaseSingleton.kt`ファイル内で`driverClassName`と`jdbcURL`をハードコードしてデータベース接続を確立しました：

```kotlin

```

データベース接続設定を[カスタム設定グループ](server-configuration-file.topic)に抽出しましょう。

1. `src/main/resources/application.conf`ファイルを開き、`ktor`グループの外側に以下のように`storage`グループを追加します：

   ```kotlin
   
   ```

2. `com/example/dao/DatabaseSingleton.kt`を開き、設定ファイルからストレージ設定をロードするように`init`関数を更新します：

   ```kotlin
   
   ```
   
   これで、`init`関数は`ApplicationConfig`を受け取り、`config.property`を使用してカスタム設定をロードするようになります。

3. 最後に、`com/example/Application.kt`を開き、アプリケーションの起動時に接続設定をロードするために、`environment.config`を`DatabaseSingleton.init`に渡します：

   ```kotlin
   
   ```

### コネクションポーリングを有効にする {id="enable-connection-pooling"}

Exposedでコネクションポーリングを有効にするには、`Database.connect`関数のパラメータとして[DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html)を渡す必要があります。
HikariCPは、`DataSource`インターフェースを実装する`HikariDataSource`クラスを提供しています。

1. `HikariDataSource`を作成するために、`com/example/dao/DatabaseSingleton.kt`を開き、`DatabaseSingleton`オブジェクトに`createHikariDataSource`関数を追加します：

   ```kotlin
   
   ```

   データソース設定に関する注意事項は以下の通りです：
     - `createHikariDataSource`関数は、ドライバーのクラス名とデータベースURLをパラメータとして受け取ります。
     - `maximumPoolSize`プロパティは、コネクションプールが到達できる最大サイズを指定します。
     - `isAutoCommit`と`transactionIsolation`は、Exposedで使用されるデフォルト設定と同期するように設定されています。

2. `HikariDataSource`を使用するには、それを`Database.connect`関数に渡します：

   ```kotlin
   
   ```

   これで[アプリケーションを実行](db-persistence.md#run_app)し、すべてが以前と同じように動作することを確認できます。

## キャッシュ {id="caching"}

データベースにデータベースキャッシュを補完することができます。 
キャッシュは、頻繁に使用されるデータを一時メモリに保存できるようにする手法であり、データベースの負荷を軽減し、頻繁に必要とされるデータの読み取り時間を短縮できます。

このチュートリアルでは、Ehcacheライブラリを使用してファイル内にキャッシュを構成します。

### キャッシュファイルのパスを設定に追加する {id="cache-file-path"}

`src/main/resources/application.conf`ファイルを開き、`storage`グループに`ehcacheFilePath`プロパティを追加します：

```kotlin

```

このプロパティは、キャッシュデータの保存に使用されるファイルへのパスを指定します。
後で、キャッシュを操作するための`DAOFacade`実装を設定するためにこれを使用します。

### キャッシュの実装 {id="implement-caching"}

キャッシュを実装するには、キャッシュから値を返し、キャッシュされた値がない場合はデータベースインターフェースに委譲する別の`DAOFacade`実装を提供する必要があります。

1. `com.example.dao`パッケージに新しい`DAOFacadeCacheImpl.kt`ファイルを作成し、以下の実装を追加します：

   ```kotlin
   
   ```

   このコードサンプルの簡単な概要：
     - キャッシュの初期化と設定を行うために、Ehcacheの`CacheManager`インスタンスを定義します。ディスクストレージに使用するルートディレクトリとして`storagePath`を指定します。
     - 記事をIDごとに保存するエントリ用のキャッシュを作成します。`articlesCache`は`Int`型のキーを`Article`型の値にマップします。 
     - 次に、ローカルメモリとディスクリソースのサイズ制約を指定します。これらのパラメータの詳細については、[Ehcacheのドキュメント](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)を参照してください。
     - 最後に、指定された名前、キー、値の型を使用して`cacheManager.getCache()`を呼び出すことで、作成されたキャッシュを取得します。

2. キャッシュで使用するために、`Article`クラスはシリアライズ可能であり、`java.io.Serializable`を実装している必要があります。
   `com/example/models/Article.kt`を開き、次のようにコードを更新します：

   ```kotlin
   
   ```

3. これで`DAOFacade`のメンバーを実装する準備が整いました。 
   `DAOFacadeCacheImpl.kt`に戻り、次のメソッドを追加します：

   ```kotlin
   
   ```

   - `allArticles`: すべての記事をキャッシュしようとはせず、これをメインデータベースに委譲します。
   - `article`: 記事を取得する際、まずキャッシュに存在するかどうかを確認し、存在しない場合にのみ、メインの`DAOFacade`に委譲し、その記事をキャッシュにも追加します。
   - `addNewArticle`: 新しい記事を追加する際、メインの`DAOFacade`に委譲しますが、その記事をキャッシュにも追加します。
   - `editArticle`: 既存の記事を編集する際、キャッシュとデータベースの両方を更新します。
   - `deleteArticle`: 削除時には、キャッシュとメインデータベースの両方から記事を削除する必要があります。

### DAOFacadeCacheImpl の初期化 {id="init-dao-facade"}

`DAOFacadeCacheImpl`のインスタンスを作成し、アプリケーションが起動する前にデータベースに挿入されるサンプル記事を追加しましょう：

1. まず、`DAOFacadeImpl.kt`ファイルを開き、ファイルの下部にある`dao`変数の初期化を削除します。

2. 次に、`com/example/plugins/Routing.kt`を開き、`configureRouting`ブロック内で`dao`変数を初期化します：

   ```kotlin
   
   ```

   以上です。 
   これで[アプリケーションを実行](db-persistence.md#run_app)し、すべてが以前と同じように動作することを確認できます。

> コネクションポーリングとキャッシュを含む完全な例は、こちらで見つけることができます：[tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)