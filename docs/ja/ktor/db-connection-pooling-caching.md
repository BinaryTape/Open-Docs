[//]: # (title: 接続プールとキャッシュ)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-website-interactive-persistence-advanced"/>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>使用ライブラリ</b>: <a href="https://github.com/brettwooldridge/HikariCP">HikariCP</a>, <a href="https://www.ehcache.org/">Ehcache</a>
</p>
</tldr>

<link-summary>データベース接続プールとキャッシュの実装方法を学びます。</link-summary>

[前回のチュートリアル](db-persistence.md)では、Exposedフレームワークを使用してウェブサイトに永続性を追加しました。
このチュートリアルでは、それぞれHikariCPライブラリとEhcacheライブラリを使用して、データベース接続プールとキャッシュを実装する方法について説明します。

## 依存関係を追加する {id="add-dependencies"}

まず、HikariCPおよびEhcacheライブラリの依存関係を追加する必要があります。
`gradle.properties`ファイルを開き、ライブラリのバージョンを指定します。

```kotlin
```
{src="gradle.properties" include-lines="16-17"}

次に、`build.gradle.kts`を開き、以下の依存関係を追加します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence-advanced/build.gradle.kts" include-lines="5-6,22-23,31-32,36"}

`build.gradle.kts`ファイルの右上にある**Load Gradle Changes**アイコンをクリックして、新しく追加された依存関係をインストールします。

## 接続プール {id="connection-pooling"}

Exposedは、`transaction`スコープ内でデータベースに対して最初の操作を実行する際に、各`transaction`呼び出しの内部で新しいJDBC接続を開始します。
しかし、複数のJDBC接続を確立することはリソースコストが高く、既存の接続を再利用することでパフォーマンスを向上させることができます。
_接続プール_メカニズムがこの問題を解決します。

このセクションでは、アプリケーションでJDBC接続プールを管理するためにHikariCPフレームワークを使用します。

### 接続設定を構成ファイルに抽出する {id="connection-settings-config"}

[前回のチュートリアル](db-persistence.md#connect_db)では、データベース接続を確立するために`com/example/dao/DatabaseSingleton.kt`ファイルで`driverClassName`と`jdbcURL`をハードコードしていました。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="10-12,17"}

データベース接続設定を[カスタム構成グループ](server-configuration-file.topic)に抽出しましょう。

1.  `src/main/resources/application.conf`ファイルを開き、`ktor`グループの外側に`storage`グループを以下のように追加します。

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/resources/application.conf" include-lines="11-14,16"}

2.  `com/example/dao/DatabaseSingleton.kt`を開き、`init`関数を更新して構成ファイルからストレージ設定をロードするようにします。

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="5,10-18,23,39"}
    
    `init`関数は`ApplicationConfig`を受け入れ、`config.property`を使用してカスタム設定をロードするようになりました。

3.  最後に、`com/example/Application.kt`を開き、アプリケーションの起動時に接続設定をロードするために`environment.config`を`DatabaseSingleton.init`に渡します。

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/Application.kt" include-lines="9-13"}

### 接続プールを有効にする {id="enable-connection-pooling"}

Exposedで接続プールを有効にするには、`Database.connect`関数にパラメーターとして[DataSource](https://docs.oracle.com/en/java/javase/19/docs/api/java.sql/javax/sql/DataSource.html)を提供する必要があります。
HikariCPは、`DataSource`インターフェースを実装する`HikariDataSource`クラスを提供します。

1.  `HikariDataSource`を作成するには、`com/example/dao/DatabaseSingleton.kt`を開き、`DatabaseSingleton`オブジェクトに`createHikariDataSource`関数を追加します。

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="4,11-12,25-35,39"}

    データソース設定に関するいくつかの注意点です。
      - `createHikariDataSource`関数は、ドライバクラス名とデータベースURLをパラメーターとして受け取ります。
      - `maximumPoolSize`プロパティは、接続プールが到達できる最大サイズを指定します。
      - `isAutoCommit`と`transactionIsolation`は、Exposedで使用されるデフォルト設定と同期するように設定されています。

2.  `HikariDataSource`を使用するには、`Database.connect`関数に渡します。

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DatabaseSingleton.kt" include-lines="12-13,19,23,39"}

    これで、[アプリケーションを実行](db-persistence.md#run_app)し、すべてが以前と同様に動作することを確認できます。

## キャッシュ {id="caching"}

データベースをデータベースキャッシュで補完できます。
キャッシュとは、頻繁に使用されるデータを一時メモリに保存できるようにする技術であり、データベースのワークロードを軽減し、頻繁に要求されるデータを読み取る時間を短縮できます。

このチュートリアルでは、Ehcacheライブラリを使用してファイルをキャッシュとして編成します。

### 構成にキャッシュファイルパスを追加する {id="cache-file-path"}

`src/main/resources/application.conf`ファイルを開き、`storage`グループに`ehcacheFilePath`プロパティを追加します。

```kotlin
```
{src="snippets/tutorial-website-interactive-persistence-advanced/src/main/resources/application.conf" include-lines="11,15-16"}

このプロパティは、キャッシュデータを保存するために使用されるファイルのパスを指定します。
これは後で、キャッシュを操作するための`DAOFacade`実装を構成するために使用します。

### キャッシュを実装する {id="implement-caching"}

キャッシュを実装するには、キャッシュから値を返し、キャッシュされた値がない場合はデータベースインターフェースに委譲する別の`DAOFacade`実装を提供する必要があります。

1.  `com.example.dao`パッケージに新しい`DAOFacadeCacheImpl.kt`ファイルを作成し、以下の実装を追加します。

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DAOFacadeCacheImpl.kt" include-lines="1-28,51"}

    このコード例の簡単な概要です。
      - キャッシュを初期化および構成するために、Ehcache `CacheManager`インスタンスを定義します。ディスクストレージに使用されるルートディレクトリとして`storagePath`を提供します。
      - IDによって記事を保存するエントリのキャッシュを作成します：`articlesCache`は`Int`キーを`Article`値にマッピングします。
      - 次に、ローカルメモリとディスクリソースのサイズ制約を提供します。これらのパラメーターの詳細については、[Ehcacheドキュメント](https://www.ehcache.org/documentation/2.8/configuration/cache-size.html)を参照してください。
      - 最後に、指定された名前、キー、および値の型を指定して`cacheManager.getCache()`を呼び出すことにより、作成されたキャッシュを取得します。

2.  キャッシュで使用するために、`Article`クラスはシリアライズ可能であり、`java.io.Serializable`を実装する必要があります。
    `com/example/models/Article.kt`を開き、コードを次のように更新します。

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/models/Article.kt" include-lines="4-6"}

3.  これで、`DAOFacade`のメンバーを実装する準備ができました。
    `DAOFacadeCacheImpl.kt`に戻り、以下のメソッドを追加します。

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/dao/DAOFacadeCacheImpl.kt" include-lines="30-50"}

    - `allArticles`: すべての記事をキャッシュしようとはしません。これはメインデータベースに委譲します。
    - `article`: 記事を取得する際、まずキャッシュに存在するかどうかを確認し、存在しない場合にのみメインの`DAOFacade`に委譲し、この記事をキャッシュに追加します。
    - `addNewArticle`: 新しい記事を追加する際、メインの`DAOFacade`に委譲しますが、この記事もキャッシュに追加します。
    - `editArticle`: 既存の記事を編集する際、キャッシュとデータベースの両方を更新します。
    - `deleteArticle`: 削除時、キャッシュとメインデータベースの両方から記事を削除する必要があります。

### DAOFacadeCacheImplを初期化する {id="init-dao-facade"}

`DAOFacadeCacheImpl`のインスタンスを作成し、アプリケーションが起動する前にデータベースに挿入されるサンプル記事を追加しましょう。

1.  まず、`DAOFacadeImpl.kt`ファイルを開き、ファイルの下部にある`dao`変数の初期化を削除します。

2.  次に、`com/example/plugins/Routing.kt`を開き、`configureRouting`ブロック内で`dao`変数を初期化します。

    ```kotlin
    ```
    {src="snippets/tutorial-website-interactive-persistence-advanced/src/main/kotlin/com/example/plugins/Routing.kt" include-lines="11-24,73"}

これで完了です。
これで、[アプリケーションを実行](db-persistence.md#run_app)し、すべてが以前と同様に動作することを確認できます。

> 接続プールとキャッシュを含む完全な例は、こちらで見つけることができます: [tutorial-website-interactive-persistence-advanced](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-website-interactive-persistence-advanced)。