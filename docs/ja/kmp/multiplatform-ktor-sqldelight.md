[//]: # (title: Ktor と SQLDelight を使用してマルチプラットフォームアプリを作成する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に実行できます。どちらのIDEもコア機能とKotlin Multiplatformサポートを共有しています。</p>
</tldr>

このチュートリアルでは、IntelliJ IDEAを使用して、Kotlin MultiplatformでiOSおよびAndroid向けの高度なモバイルアプリケーションを作成する方法を示します。
このアプリケーションは以下を実行します。

*   Ktor を使用して、公開されている [SpaceX API](https://docs.spacexdata.com/?version=latest) からインターネット経由でデータを取得する
*   SQLDelight を使用して、ローカルデータベースにデータを保存する
*   SpaceX ロケットの打ち上げリストを、打ち上げ日、結果、詳細な説明とともに表示する

アプリケーションには、iOSとAndroidの両方のプラットフォームで共有されるコードを含むモジュールが含まれます。ビジネスロジックとデータアクセスレイヤーは共有モジュールで一度だけ実装され、両方のアプリケーションのUIはネイティブになります。

![Emulator and Simulator](android-and-ios.png){width=600}

プロジェクトでは、以下のマルチプラットフォームライブラリを使用します。

*   [Ktor](https://ktor.io/docs/create-client.html) をHTTPクライアントとして使用し、インターネット経由でデータを取得します。
*   [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization) を使用して、JSONレスポンスをエンティティクラスのオブジェクトにデシリアライズします。
*   [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) を使用して、非同期コードを記述します。
*   [SQLDelight](https://github.com/cashapp/sqldelight) を使用して、SQLクエリからKotlinコードを生成し、型安全なデータベースAPIを作成します。
*   [Koin](https://insert-koin.io/) を使用して、依存性注入（DI）を介してプラットフォーム固有のデータベースドライバーを提供します。

> [テンプレートプロジェクト](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage)と[最終アプリケーション](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final)のソースコードは、当社のGitHubリポジトリで確認できます。
>
{style="note"}

## プロジェクトを作成する

1.  [クイックスタート](quickstart.md)で、[Kotlin Multiplatform開発のための環境をセットアップする](quickstart.md#set-up-the-environment)の手順を完了します。
2.  IntelliJ IDEAで、**File** | **New** | **Project**を選択します。
3.  左側のパネルで、**Kotlin Multiplatform**を選択します（Android Studioでは、テンプレートは**New Project**ウィザードの**Generic**タブにあります）。
4.  **New Project**ウィンドウで以下のフィールドを指定します。

    *   **Name**: SpaceTutorial
    *   **Group**: com.jetbrains
    *   **Artifact**: spacetutorial

    ![Create Ktor and SQLDelight Multiplatform project](create-ktor-sqldelight-multiplatform-project.png){width=800}

5.  AndroidおよびiOSターゲットを選択します。
6.  iOSの場合、**Do not share UI**オプションを選択します。両方のプラットフォームでネイティブUIを実装します。
7.  すべてのフィールドとターゲットを指定したら、**Create**をクリックします。

## Gradleの依存関係を追加する

共有モジュールにマルチプラットフォームライブラリを追加するには、`build.gradle.kts`ファイルの関連するソースセットの`dependencies {}`ブロックに依存関係の指示（`implementation`）を追加する必要があります。

`kotlinx.serialization`とSQLDelightの両ライブラリには、追加の設定も必要です。

`gradle/libs.versions.toml`ファイルのバージョンカタログを変更または追加して、必要なすべての依存関係を反映させます。

1.  `[versions]`ブロックで、AGPバージョンを確認し、残りを追加します。

    ```
    [versions]
    agp = "8.7.3"
    ...
    coroutinesVersion = "%coroutinesVersion%"
    dateTimeVersion = "0.6.2"
    koin = "%koinVersion%"
    ktor = "%ktorVersion%"
    sqlDelight = "%sqlDelightVersion%"
    lifecycleViewmodelCompose = "2.9.1"
    material3 = "1.3.2"
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="[versions]"}

2.  `[libraries]`ブロックで、以下のライブラリ参照を追加します。

    ```
    [libraries]
    ...
    android-driver = { module = "app.cash.sqldelight:android-driver", version.ref = "sqlDelight" }
    koin-androidx-compose = { module = "io.insert-koin:koin-androidx-compose", version.ref = "koin" }
    koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
    kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutinesVersion" }
    kotlinx-datetime = { module = "org.jetbrains.kotlinx:kotlinx-datetime", version.ref = "dateTimeVersion" }
    ktor-client-android = { module = "io.ktor:ktor-client-android", version.ref = "ktor" }
    ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor" }
    ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
    ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
    ktor-serialization-kotlinx-json = { module = "io.ktor:ktor-serialization-kotlinx-json", version.ref = "ktor" }
    native-driver = { module = "app.cash.sqldelight:native-driver", version.ref = "sqlDelight" }
    runtime = { module = "app.cash.sqldelight:runtime", version.ref = "sqlDelight" }
    androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleViewmodelCompose" }
    androidx-compose-material3 = { module = "androidx.compose.material3:material3", version.ref="material3" }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="[libraries]"}

3.  `[plugins]`ブロックで、必要なGradleプラグインを指定します。

    ```
    [plugins]
    ...
    kotlinxSerialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
    sqldelight = { id = "app.cash.sqldelight", version.ref = "sqlDelight" }
    ```

4.  依存関係が追加されたら、プロジェクトの再同期を求められます。**Sync Gradle Changes**ボタンをクリックしてGradleファイルを同期します。
    ![Synchronize Gradle files](gradle-sync.png){width=50}

5.  `shared/build.gradle.kts`ファイルの冒頭に、以下の行を`plugins {}`ブロックに追加します。

    ```kotlin
    plugins {
        // ...
        alias(libs.plugins.kotlinxSerialization)
        alias(libs.plugins.sqldelight)
    }
    ```

6.  共通ソースセットには、各ライブラリのコアアーティファクトと、ネットワークリクエストおよびレスポンスを処理するために`kotlinx.serialization`を使用するKtorの[シリアライズ機能](https://ktor.io/docs/serialization-client.html)が必要です。
    iOSおよびAndroidのソースセットには、SQLDelightとKtorのプラットフォームドライバーも必要です。

    同じ`shared/build.gradle.kts`ファイルに、必要なすべての依存関係を追加します。

    ```kotlin
    kotlin {
        // ...
    
        sourceSets {
            commonMain.dependencies {
                implementation(libs.kotlinx.coroutines.core)
                implementation(libs.ktor.client.core)
                implementation(libs.ktor.client.content.negotiation)
                implementation(libs.ktor.serialization.kotlinx.json)
                implementation(libs.runtime)
                implementation(libs.kotlinx.datetime)
                implementation(libs.koin.core)
            }
            androidMain.dependencies {
                implementation(libs.ktor.client.android)
                implementation(libs.android.driver)
            }
            iosMain.dependencies {
                implementation(libs.ktor.client.darwin)
                implementation(libs.native.driver)
            }
        }
    }
    ```

7.  依存関係を追加したら、再度**Sync Gradle Changes**ボタンをクリックしてGradleファイルを同期します。

Gradleの同期後、プロジェクトの設定は完了し、コードを記述し始めることができます。

> マルチプラットフォームの依存関係に関する詳細ガイドについては、[Kotlin Multiplatformライブラリの依存関係](multiplatform-add-dependencies.md)を参照してください。
>
{style="tip"}

## アプリケーションのデータモデルを作成する

チュートリアルアプリには、ネットワーキングサービスとキャッシュサービスのファサードとして公開されている`SpaceXSDK`クラスが含まれます。
アプリケーションのデータモデルには、以下の3つのエンティティクラスが含まれます。

*   打ち上げに関する一般情報
*   ミッションパッチ画像のリンク
*   打ち上げに関する記事のURL

> このデータがすべて最終的にUIに表示されるわけではありません。
> シリアライズをデモンストレーションするためにデータモデルを使用しています。
> しかし、リンクやパッチをいじって、例をより情報量の多いものに拡張することもできます！
>
{style="note"}

必要なデータクラスを作成します。

1.  `shared/src/commonMain/kotlin/com/jetbrains/spacetutorial`ディレクトリに、`entity`パッケージを作成し、その中に`Entity.kt`ファイルを作成します。
2.  基本的なエンティティのすべてのデータクラスを宣言します。

    ```kotlin
    
    ```

各シリアライズ可能なクラスは、`@Serializable`アノテーションでマークする必要があります。`kotlinx.serialization`プラグインは、アノテーション引数にシリアライザへのリンクを明示的に渡さない限り、`@Serializable`クラスのデフォルトのシリアライザを自動的に生成します。

`@SerialName`アノテーションを使用すると、フィールド名を再定義でき、データクラスのプロパティをより読みやすい識別子でアクセスするのに役立ちます。

## SQLDelightを設定し、キャッシュロジックを実装する

### SQLDelightを設定する

SQLDelightライブラリは、SQLクエリから型安全なKotlinデータベースAPIを生成できます。コンパイル中、ジェネレーターはSQLクエリを検証し、共有モジュールで使用できるKotlinコードに変換します。

SQLDelightの依存関係はすでにプロジェクトに含まれています。ライブラリを設定するには、`shared/build.gradle.kts`ファイルを開き、最後に`sqldelight {}`ブロックを追加します。このブロックには、データベースとそのパラメータのリストが含まれています。

```kotlin
sqldelight {
    databases {
        create("AppDatabase") {
            packageName.set("com.jetbrains.spacetutorial.cache")
        }
    }
}
```

`packageName`パラメータは、生成されるKotlinソースのパッケージ名を指定します。

プロンプトが表示されたらGradleプロジェクトファイルを同期するか、ダブル<shortcut>Shift</shortcut>を押して**Sync All Gradle, Swift Package Manager projects**を検索します。

> `.sq`ファイルを操作するために、公式の[SQLDelightプラグイン](https://plugins.jetbrains.com/plugin/8191-sqldelight)をインストールすることを検討してください。
>
{style="tip"}

### データベースAPIを生成する

まず、必要なすべてのSQLクエリを含む`.sq`ファイルを作成します。デフォルトでは、SQLDelightプラグインはソースセットの`sqldelight`フォルダー内で`.sq`ファイルを検索します。

1.  `shared/src/commonMain`ディレクトリに、新しい`sqldelight`ディレクトリを作成します。
2.  `sqldelight`ディレクトリ内に、パッケージのネストされたディレクトリを作成するために`com/jetbrains/spacetutorial/cache`という名前の新しいディレクトリを作成します。
3.  `cache`ディレクトリ内に、`AppDatabase.sq`ファイル（`build.gradle.kts`ファイルで指定したデータベースと同じ名前）を作成します。
    アプリケーションのすべてのSQLクエリはこのファイルに保存されます。
4.  データベースには、打ち上げに関するデータを含むテーブルが含まれます。
    テーブルを作成するための以下のコードを`AppDatabase.sq`ファイルに追加します。

    ```text
    import kotlin.Boolean;
    
    CREATE TABLE Launch (
        flightNumber INTEGER NOT NULL,
        missionName TEXT NOT NULL,
        details TEXT,
        launchSuccess INTEGER AS Boolean DEFAULT NULL,
        launchDateUTC TEXT NOT NULL,
        patchUrlSmall TEXT,
        patchUrlLarge TEXT,
        articleUrl TEXT
    );
    ```

5.  テーブルにデータを挿入するための`insertLaunch`関数を追加します。

    ```text
    insertLaunch:
    INSERT INTO Launch(flightNumber, missionName, details, launchSuccess, launchDateUTC, patchUrlSmall, patchUrlLarge, articleUrl)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
    ```

6.  テーブルのデータをクリアするための`removeAllLaunches`関数を追加します。

    ```text
    removeAllLaunches:
    DELETE FROM Launch;
    ```

7.  データ取得のための`selectAllLaunchesInfo`関数を宣言します。

    ```text
    selectAllLaunchesInfo:
    SELECT Launch.*
    FROM Launch;
    ```
8.  対応する`AppDatabase`インターフェース（後でデータベースドライバーで初期化する）を生成します。
    そのためには、ターミナルで以下のコマンドを実行します。

    ```shell
    ./gradlew generateCommonMainAppDatabaseInterface
    ```

    生成されたKotlinコードは`shared/build/generated/sqldelight`ディレクトリに保存されます。

### プラットフォーム固有のデータベースドライバーのファクトリを作成する

`AppDatabase`インターフェースを初期化するためには、`SqlDriver`インスタンスを渡します。
SQLDelightはSQLiteドライバーの複数のプラットフォーム固有の実装を提供します。そのため、各プラットフォームでこれらのインスタンスを個別に作成する必要があります。

[expectedおよびactualインターフェース](multiplatform-expect-actual.md)でこれを実現できますが、このプロジェクトでは[Koin](https://insert-koin.io/)を使用してKotlin Multiplatformで依存性注入を試します。

1.  データベースドライバー用のインターフェースを作成します。そのためには、`shared/src/commonMain/kotlin/com/jetbrains/spacetutorial/`ディレクトリに、`cache`パッケージを作成します。
2.  `cache`パッケージ内に`DatabaseDriverFactory`インターフェースを作成します。

    ```kotlin
    package com.jetbrains.spacetutorial.cache
    
    import app.cash.sqldelight.db.SqlDriver

    interface DatabaseDriverFactory {
        fun createDriver(): SqlDriver
    }
    ```

3.  Android用にこのインターフェースを実装するクラスを作成します。`shared/src/androidMain/kotlin`ディレクトリに、`com.jetbrains.spacetutorial.cache`パッケージを作成し、その中に`DatabaseDriverFactory.kt`ファイルを作成します。
4.  Androidでは、SQLiteドライバーは`AndroidSqliteDriver`クラスによって実装されます。`DatabaseDriverFactory.kt`ファイルで、データベース情報とコンテキストリンクを`AndroidSqliteDriver`クラスのコンストラクタに渡します。

    ```kotlin
    package com.jetbrains.spacetutorial.cache
    
    import android.content.Context
    import app.cash.sqldelight.db.SqlDriver
    import app.cash.sqldelight.driver.android.AndroidSqliteDriver

    class AndroidDatabaseDriverFactory(private val context: Context) : DatabaseDriverFactory {
        override fun createDriver(): SqlDriver {
            return AndroidSqliteDriver(AppDatabase.Schema, context, "launch.db")
        }
    }
    ```

5.  iOSの場合、`shared/src/iosMain/kotlin/com/jetbrains/spacetutorial/`ディレクトリに、`cache`パッケージを作成します。
6.  `cache`パッケージ内に、`DatabaseDriverFactory.kt`ファイルを作成し、以下のコードを追加します。

    ```kotlin
    package com.jetbrains.spacetutorial.cache
    
    import app.cash.sqldelight.db.SqlDriver
    import app.cash.sqldelight.driver.native.NativeSqliteDriver

    class IOSDatabaseDriverFactory : DatabaseDriverFactory {
        override fun createDriver(): SqlDriver {
            return NativeSqliteDriver(AppDatabase.Schema, "launch.db")
        }
    }
    ```

これらのドライバーのインスタンスは、後でプロジェクトのプラットフォーム固有のコードで実装します。

### キャッシュを実装する

これまで、プラットフォームデータベースドライバーのファクトリと、データベース操作を実行するための`AppDatabase`インターフェースを追加しました。
次に、`AppDatabase`インターフェースをラップし、キャッシングロジックを含む`Database`クラスを作成します。

1.  共通ソースセット`shared/src/commonMain/kotlin`内、`com.jetbrains.spacetutorial.cache`パッケージに、新しい`Database`クラスを作成します。これには、両プラットフォームに共通のロジックが含まれます。

2.  `AppDatabase`のドライバーを提供するために、抽象的な`DatabaseDriverFactory`インスタンスを`Database`クラスのコンストラクタに渡します。

    ```kotlin
    package com.jetbrains.spacetutorial.cache

    internal class Database(databaseDriverFactory: DatabaseDriverFactory) {
        private val database = AppDatabase(databaseDriverFactory.createDriver())
        private val dbQuery = database.appDatabaseQueries
    }
    ```

    このクラスの[可視性](https://kotlinlang.org/docs/visibility-modifiers.html#class-members)は`internal`に設定されており、これはマルチプラットフォームモジュール内からのみアクセス可能であることを意味します。

3.  `Database`クラス内に、いくつかのデータ処理操作を実装します。
    まず、すべてのロケット打ち上げのリストを返す`getAllLaunches`関数を作成します。
    `mapLaunchSelecting`関数は、データベースクエリの結果を`RocketLaunch`オブジェクトにマッピングするために使用されます。

    ```kotlin
    import com.jetbrains.spacetutorial.entity.Links
    import com.jetbrains.spacetutorial.entity.Patch
    import com.jetbrains.spacetutorial.entity.RocketLaunch
    
    internal class Database(databaseDriverFactory: DatabaseDriverFactory) {
        // ...
    
        internal fun getAllLaunches(): List<RocketLaunch> {
            return dbQuery.selectAllLaunchesInfo(::mapLaunchSelecting).executeAsList()
        }
    
        private fun mapLaunchSelecting(
            flightNumber: Long,
            missionName: String,
            details: String?,
            launchSuccess: Boolean?,
            launchDateUTC: String,
            patchUrlSmall: String?,
            patchUrlLarge: String?,
            articleUrl: String?
        ): RocketLaunch {
            return RocketLaunch(
                flightNumber = flightNumber.toInt(),
                missionName = missionName,
                details = details,
                launchDateUTC = launchDateUTC,
                launchSuccess = launchSuccess,
                links = Links(
                    patch = Patch(
                        small = patchUrlSmall,
                        large = patchUrlLarge
                    ),
                    article = articleUrl
                )
            )
        }
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="internal fun getAllLaunches()"}

4.  データベースをクリアし、新しいデータを挿入するための`clearAndCreateLaunches`関数を追加します。

    ```kotlin
    internal class Database(databaseDriverFactory: DatabaseDriverFactory) {
        // ...
    
        internal fun clearAndCreateLaunches(launches: List<RocketLaunch>) {
            dbQuery.transaction {
                dbQuery.removeAllLaunches()
                launches.forEach { launch ->
                    dbQuery.insertLaunch(
                        flightNumber = launch.flightNumber.toLong(),
                        missionName = launch.missionName,
                        details = launch.details,
                        launchSuccess = launch.launchSuccess ?: false,
                        launchDateUTC = launch.launchDateUTC,
                        patchUrlSmall = launch.links.patch?.small,
                        patchUrlLarge = launch.links.patch?.large,
                        articleUrl = launch.links.article
                    )
                }
            }
        }
    }
    ```

## APIサービスを実装する

インターネット経由でデータを取得するため、[SpaceX 公開API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)と、`v5/launches`エンドポイントからすべての打ち上げリストを取得する単一のメソッドを使用します。

アプリケーションをAPIに接続するクラスを作成します。

1.  `shared/src/commonMain/kotlin/com/jetbrains/spacetutorial/`ディレクトリに、`network`パッケージを作成します。
2.  `network`ディレクトリ内に、`SpaceXApi`クラスを作成します。

    ```kotlin
    package com.jetbrains.spacetutorial.network
    
    import io.ktor.client.HttpClient
    import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
    import io.ktor.serialization.kotlinx.json.json
    import kotlinx.serialization.json.Json
    
    class SpaceXApi {
        private val httpClient = HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    useAlternativeNames = false 
                })
            }
        }
    }
    ```

    このクラスは、ネットワークリクエストを実行し、JSONレスポンスを`com.jetbrains.spacetutorial.entity`パッケージのエンティティにデシリアライズします。
    Ktorの`HttpClient`インスタンスは、`httpClient`プロパティを初期化し、格納します。

    このコードは、[Ktorの`ContentNegotiation`プラグイン](https://ktor.io/docs/serialization-client.html)を使用して、GETリクエストの結果をデシリアライズします。このプラグインは、リクエストとレスポンスのペイロードをJSONとして処理し、必要に応じてそれらをシリアライズおよびデシリアライズします。

3.  ロケット打ち上げのリストを返すデータ取得関数を宣言します。

    ```kotlin
    import com.jetbrains.spacetutorial.entity.RocketLaunch
    import io.ktor.client.request.get
    import io.ktor.client.call.body
    
    class SpaceXApi {
        // ...
        
        suspend fun getAllLaunches(): List<RocketLaunch> {
            return httpClient.get("https://api.spacexdata.com/v5/launches").body()
        }
    }
    ```

`getAllLaunches`関数には`suspend`修飾子が付いています。これは、`suspend`関数`HttpClient.get()`の呼び出しが含まれているためです。
`get()`関数には、インターネット経由でデータを取得する非同期操作が含まれており、コルーチンまたは別の`suspend`関数からのみ呼び出すことができます。ネットワークリクエストはHTTPクライアントのスレッドプールで実行されます。

GETリクエストを送信するためのURLは、`get()`関数への引数として渡されます。

## SDKを構築する

iOSおよびAndroidアプリケーションは、共有モジュールを介してSpaceX APIと通信します。このモジュールは、公開クラス`SpaceXSDK`を提供します。

1.  共通ソースセット`shared/src/commonMain/kotlin`内、`com.jetbrains.spacetutorial`パッケージに、`SpaceXSDK`クラスを作成します。
    このクラスは、`Database`および`SpaceXApi`クラスのファサードになります。

    `Database`クラスのインスタンスを作成するには、`DatabaseDriverFactory`インスタンスを提供します。

    ```kotlin
    package com.jetbrains.spacetutorial
    
    import com.jetbrains.spacetutorial.cache.Database
    import com.jetbrains.spacetutorial.cache.DatabaseDriverFactory
    import com.jetbrains.spacetutorial.network.SpaceXApi

    class SpaceXSDK(databaseDriverFactory: DatabaseDriverFactory, val api: SpaceXApi) { 
        private val database = Database(databaseDriverFactory)
    }
    ```

    `SpaceXSDK`クラスのコンストラクタを介して、プラットフォーム固有のコードで正しいデータベースドライバーを注入します。

2.  作成されたデータベースとAPIを使用して打ち上げリストを取得する`getLaunches`関数を追加します。

    ```kotlin
    import com.jetbrains.spacetutorial.entity.RocketLaunch
    
    class SpaceXSDK(databaseDriverFactory: DatabaseDriverFactory, val api: SpaceXApi) {
        // ...
   
        @Throws(Exception::class)
        suspend fun getLaunches(forceReload: Boolean): List<RocketLaunch> {
            val cachedLaunches = database.getAllLaunches()
            return if (cachedLaunches.isNotEmpty() && !forceReload) {
                cachedLaunches
            } else {
                api.getAllLaunches().also {
                    database.clearAndCreateLaunches(it)
                }
            }
        }
    }
    ```

このクラスには、すべての打ち上げ情報を取得するための関数が1つ含まれています。`forceReload`の値に応じて、キャッシュされた値を返すか、インターネットからデータをロードし、その結果でキャッシュを更新します。キャッシュされたデータがない場合、`forceReload`フラグの値に関係なく、インターネットからデータをロードします。

SDKのクライアントは、`forceReload`フラグを使用して、打ち上げに関する最新情報をロードし、ユーザー向けにプルツーリフレッシュジェスチャーを有効にすることができます。

すべてのKotlin例外はチェックされない（unchecked）例外ですが、Swiftにはチェックされるエラー（checked errors）しかありません（詳細については[Swift/Objective-Cとの相互運用性](https://kotlinlang.org/docs/native-objc-interop.html#errors-and-exceptions)を参照）。したがって、Swiftコードが予期される例外を認識できるようにするため、Swiftから呼び出されるKotlin関数は、潜在的な例外クラスのリストを指定して`@Throws`アノテーションでマークされるべきです。

## Androidアプリケーションを作成する

IntelliJ IDEAは初期のGradle設定を自動的に処理するため、`shared`モジュールはAndroidアプリケーションにすでに接続されています。

UIとプレゼンテーションロジックを実装する前に、`composeApp/build.gradle.kts`ファイルに必要なすべてのUI依存関係を追加します。

```kotlin
kotlin {
// ...
    sourceSets {
        androidMain.dependencies {
            implementation(libs.androidx.compose.material3)
            implementation(libs.koin.androidx.compose)
            implementation(libs.androidx.lifecycle.viewmodel.compose)
        }
        // ... 
    }
}
```

プロンプトが表示されたらGradleプロジェクトファイルを同期するか、ダブル<shortcut>Shift</shortcut>を押して**Sync All Gradle, Swift Package Manager projects**を検索します。

### インターネットアクセス許可を追加する

インターネットにアクセスするため、Androidアプリケーションには適切な許可が必要です。
`composeApp/src/androidMain/AndroidManifest.xml`ファイルに、`<uses-permission>`タグを追加します。

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <!--...-->
</manifest>
```

### 依存性注入を追加する

Koinの依存性注入を使用すると、異なるコンテキストで使用できるモジュール（コンポーネントのセット）を宣言できます。
このプロジェクトでは、2つのモジュールを作成します。1つはAndroidアプリケーション用、もう1つはiOSアプリ用です。
次に、対応するモジュールを使用して各ネイティブUIに対してKoinを開始します。

Androidアプリのコンポーネントを含むKoinモジュールを宣言します。

1.  `composeApp/src/androidMain/kotlin`ディレクトリに、`com.jetbrains.spacetutorial`パッケージに`AppModule.kt`ファイルを作成します。

    そのファイルで、`SpaceXApi`クラスと`SpaceXSDK`クラス用の2つの[シングルトン](https://insert-koin.io/docs/reference/koin-core/definitions#defining-a-singleton)としてモジュールを宣言します。

    ```kotlin
    package com.jetbrains.spacetutorial
    
    import com.jetbrains.spacetutorial.cache.AndroidDatabaseDriverFactory
    import com.jetbrains.spacetutorial.network.SpaceXApi
    import org.koin.android.ext.koin.androidContext
    import org.koin.dsl.module
    
    val appModule = module { 
        single<SpaceXApi> { SpaceXApi() }
        single<SpaceXSDK> {
            SpaceXSDK(
                databaseDriverFactory = AndroidDatabaseDriverFactory(
                    androidContext()
                ), api = get()
            )
        }
    }
    ```

    `SpaceXSDK`クラスのコンストラクタには、プラットフォーム固有の`AndroidDatabaseDriverFactory`クラスが注入されます。
    `get()`関数はモジュール内の依存関係を解決します。`SpaceXSDK()`の`api`パラメータの代わりに、Koinは以前に宣言された`SpaceXApi`シングルトンを渡します。

2.  Koinモジュールを開始するカスタム`Application`クラスを作成します。

    `AppModule.kt`ファイルの隣に、`Application.kt`ファイルを以下のコードで作成し、`modules()`関数呼び出しで宣言したモジュールを指定します。

    ```kotlin
    package com.jetbrains.spacetutorial
    
    import android.app.Application
    import org.koin.android.ext.koin.androidContext
    import org.koin.core.context.GlobalContext.startKoin
    
    class MainApplication : Application() {
        override fun onCreate() {
            super.onCreate()
    
            startKoin {
                androidContext(this@MainApplication)
                modules(appModule)
            }
        }
    }
    ```

3.  作成した`MainApplication`クラスを、`AndroidManifest.xml`ファイルの`<application>`タグに指定します。

    ```xml
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
        ...
        <application
            ...
            android:name="com.jetbrains.spacetutorial.MainApplication">
            ...
        </application>
    </manifest>
    ```

これで、プラットフォーム固有のデータベースドライバーによって提供される情報を使用するUIを実装する準備ができました。

### 打ち上げリストを含むビューモデルを準備する

Jetpack ComposeとMaterial 3を使用してAndroid UIを実装します。まず、SDKを使用して打ち上げリストを取得するビューモデルを作成します。次に、マテリアルテーマを設定し、最後に、これらすべてをまとめるコンポーザブル関数を記述します。

1.  `composeApp/src/androidMain`ソースセット、`com.jetbrains.spacetutorial`パッケージに、`RocketLaunchViewModel.kt`ファイルを作成します。

    ```kotlin
    package com.jetbrains.spacetutorial
    
    import androidx.compose.runtime.State
    import androidx.compose.runtime.mutableStateOf
    import androidx.lifecycle.ViewModel
    import com.jetbrains.spacetutorial.entity.RocketLaunch
    
    class RocketLaunchViewModel(private val sdk: SpaceXSDK) : ViewModel() {
        private val _state = mutableStateOf(RocketLaunchScreenState())
        val state: State<RocketLaunchScreenState> = _state
    
    }
    
    data class RocketLaunchScreenState(
        val isLoading: Boolean = false,
        val launches: List<RocketLaunch> = emptyList()
    )
    ```

    `RocketLaunchScreenState`インスタンスは、SDKから受信したデータとリクエストの現在の状態を格納します。

2.  このビューモデルのコルーチンスコープでSDKの`getLaunches`関数を呼び出す`loadLaunches`関数を追加します。

    ```kotlin
    import androidx.lifecycle.viewModelScope
    import kotlinx.coroutines.launch
    
    class RocketLaunchViewModel(private val sdk: SpaceXSDK) : ViewModel() {
        //...
        
        fun loadLaunches() {
            viewModelScope.launch { 
                _state.value = _state.value.copy(isLoading = true, launches = emptyList())
                try {
                    val launches = sdk.getLaunches(forceReload = true)
                    _state.value = _state.value.copy(isLoading = false, launches = launches)
                } catch (e: Exception) {
                    _state.value = _state.value.copy(isLoading = false, launches = emptyList())
                }
            }
        }
    }
    ```

3.  次に、`RocketLaunchViewModel`オブジェクトが作成されるとすぐにAPIからデータを要求するように、クラスの`init {}`ブロックに`loadLaunches()`呼び出しを追加します。

    ```kotlin
    class RocketLaunchViewModel(private val sdk: SpaceXSDK) : ViewModel() {
        // ...

        init {
            loadLaunches()
        }
    }
    ```

4.  次に、`AppModule.kt`ファイルで、Koinモジュールにビューモデルを指定します。

    ```kotlin
    import org.koin.core.module.dsl.viewModel
    
    val appModule = module {
        // ...
        viewModel { RocketLaunchViewModel(sdk = get()) }
    }
    ```

### マテリアルテーマを構築する

メインの`App()`コンポーザブルは、マテリアルテーマが提供する`AppTheme`関数をベースに構築します。

1.  [Material Theme Builder](https://m3.material.io/theme-builder#/custom)を使用して、Composeアプリのテーマを生成できます。
    色とフォントを選択し、右下隅にある**Export theme**をクリックします。
2.  エクスポート画面で、**Export**ドロップダウンをクリックし、**Jetpack Compose (Theme.kt)**オプションを選択します。
3.  アーカイブを解凍し、`theme`フォルダーを`composeApp/src/androidMain/kotlin/com/jetbrains/spacetutorial`ディレクトリにコピーします。

    ![theme directory location](theme-directory.png){width=299}

4.  `theme`パッケージ内の各ファイルで、作成したパッケージを参照するように`package`行を変更します。

    ```kotlin
    package com.jetbrains.spacetutorial.theme
    ```

5.  `Color.kt`ファイルに、成功した打ち上げと失敗した打ち上げに使用する2つの色変数`を追加します。`

    ```kotlin
    val app_theme_successful = Color(0xff4BB543)
    val app_theme_unsuccessful = Color(0xffFC100D)
    ```

### プレゼンテーションロジックを実装する

アプリケーションのメインの`App()`コンポーザブルを作成し、`ComponentActivity`クラスからそれを呼び出します。

1.  `com.jetbrains.spacetutorial`パッケージにある`theme`ディレクトリの隣の`App.kt`ファイルを開き、デフォルトの`App()`コンポーザブル関数を置き換えます。

    ```kotlin
    package com.jetbrains.spacetutorial
    
    import androidx.compose.material3.pulltorefresh.rememberPullToRefreshState
    import androidx.compose.runtime.Composable
    import androidx.compose.runtime.getValue
    import androidx.compose.runtime.mutableStateOf
    import androidx.compose.runtime.remember
    import androidx.compose.runtime.rememberCoroutineScope
    import androidx.compose.runtime.setValue
    import org.jetbrains.compose.ui.tooling.preview.Preview
    import org.koin.androidx.compose.koinViewModel
    import androidx.compose.material3.ExperimentalMaterial3Api
    
    @OptIn(
      ExperimentalMaterial3Api::class
    )
    @Composable
    @Preview
    fun App() {
        val viewModel = koinViewModel<RocketLaunchViewModel>()
        val state by remember { viewModel.state }
        val coroutineScope = rememberCoroutineScope()
        var isRefreshing by remember { mutableStateOf(false) }
        val pullToRefreshState = rememberPullToRefreshState()
    }
    ```

    ここでは、[Koin ViewModel API](https://insert-koin.io/docs/%koinVersion%/reference/koin-compose/compose/#viewmodel-for-composable)を使用して、Android Koinモジュールで宣言した`viewModel`を参照しています。

2.  次に、ローディング画面、打ち上げ結果の列、およびプルツーリフレッシュアクションを実装するUIコードを追加します。

    ```kotlin
    package com.jetbrains.spacetutorial
    
    import androidx.compose.foundation.layout.Arrangement
    import androidx.compose.foundation.layout.Column
    import androidx.compose.foundation.layout.Spacer
    import androidx.compose.foundation.layout.fillMaxSize
    import androidx.compose.foundation.layout.height
    import androidx.compose.foundation.layout.padding
    import androidx.compose.foundation.lazy.LazyColumn
    import androidx.compose.foundation.lazy.items
    import androidx.compose.material3.HorizontalDivider
    import androidx.compose.material3.MaterialTheme
    import androidx.compose.material3.Scaffold
    import androidx.compose.material3.Text
    import androidx.compose.material3.TopAppBar
    import androidx.compose.material3.pulltorefresh.PullToRefreshBox
    import androidx.compose.ui.Alignment
    import androidx.compose.ui.Modifier
    import androidx.compose.ui.unit.dp
    import com.jetbrains.spacetutorial.entity.RocketLaunch
    import com.jetbrains.spacetutorial.theme.AppTheme
    import com.jetbrains.spacetutorial.theme.app_theme_successful
    import com.jetbrains.spacetutorial.theme.app_theme_unsuccessful
    import kotlinx.coroutines.launch
    ...
    
    @OptIn(
        ExperimentalMaterial3Api::class
    )
    @Composable
    @Preview
    fun App() {
        val viewModel = koinViewModel<RocketLaunchViewModel>()
        val state by remember { viewModel.state }
        val coroutineScope = rememberCoroutineScope()
        var isRefreshing by remember { mutableStateOf(false) }
        val pullToRefreshState = rememberPullToRefreshState()
    
        AppTheme {
            Scaffold(
                topBar = {
                    TopAppBar(
                        title = {
                            Text(
                                "SpaceX Launches",
                                style = MaterialTheme.typography.headlineLarge
                            )
                        }
                    )
                }
            ) { padding ->
                PullToRefreshBox(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding),
                    state = pullToRefreshState,
                    isRefreshing = isRefreshing,
                    onRefresh = {
                        isRefreshing = true
                        coroutineScope.launch {
                            viewModel.loadLaunches()
                            isRefreshing = false
                        }
                    }
                ) {
                    if (state.isLoading && !isRefreshing) {
                        Column(
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.fillMaxSize()
                        ) {
                            Text("Loading...", style = MaterialTheme.typography.bodyLarge)
                        }
                    } else {
                        LazyColumn {
                            items(state.launches) { launch: RocketLaunch ->
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Text(
                                        text = "${launch.missionName} - ${launch.launchYear}",
                                        style = MaterialTheme.typography.headlineSmall
                                    )
                                    Spacer(Modifier.height(8.dp))
                                    Text(
                                        text = if (launch.launchSuccess == true) "Successful" else "Unsuccessful",
                                        color = if (launch.launchSuccess == true) app_theme_successful else app_theme_unsuccessful
                                    )
                                    Spacer(Modifier.height(8.dp))
                                    val details = launch.details
                                    if (details != null && details.isNotBlank()) {
                                        Text(details)
                                    }
                                }
                                HorizontalDivider()
                            }
                        }
                    }
                }
            }
        }
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="import com.jetbrains.spacetutorial.theme.AppTheme"}

3.  最後に、`MainActivity`クラスを`AndroidManifest.xml`ファイルの`<activity>`タグに指定します。

    ```xml
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
        ...
        <application
            ...
            <activity
                ...
                android:name="com.jetbrains.spacetutorial.MainActivity">
                ...
            </activity>
        </application>
    </manifest>
    ```

4.  Androidアプリを実行します。実行構成メニューから`composeApp`を選択し、エミュレーターを選んで、実行ボタンをクリックします。
    アプリはAPIリクエストを自動的に実行し、打ち上げリストを表示します（背景色は、生成したMaterial Themeによって異なります）。

    ![Android application](android-application.png){width=350}

これで、ビジネスロジックがKotlin Multiplatformモジュールで実装され、UIがネイティブのJetpack Composeを使用して作成されたAndroidアプリケーションが完成しました。

## iOSアプリケーションを作成する

プロジェクトのiOS部分では、ユーザーインターフェースを構築するために[SwiftUI](https://developer.apple.com/xcode/swiftui/)と、[Model View View-Model（MVVM）](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)パターンを利用します。

IntelliJ IDEAは、共有モジュールにすでに接続されているiOSプロジェクトを生成します。Kotlinモジュールは、`shared/build.gradle.kts`ファイルで指定された名前（`baseName = "Shared"`）でエクスポートされ、通常の`import Shared`ステートメントを使用してインポートされます。

### SQLDelight用の動的リンクフラグを追加する

デフォルトでは、IntelliJ IDEAはiOSフレームワークの静的リンク用に設定されたプロジェクトを生成します。

iOSでネイティブのSQLDelightドライバーを使用するためには、Xcodeツールがシステム提供のSQLiteバイナリを見つけられるようにする動的リンカーフラグを追加します。

1.  IntelliJ IDEAで、**File** | **Open Project in Xcode**オプションを選択してXcodeでプロジェクトを開きます。
2.  Xcodeで、プロジェクト名をダブルクリックして設定を開きます。
3.  **Build Settings**タブに切り替え、**Other Linker Flags**フィールドを検索します。
4.  フィールドの値をダブルクリックし、**+**をクリックして`-lsqlite3`文字列を追加します。

### iOS依存性注入用のKoinクラスを準備する

SwiftコードでKoinのクラスと関数を使用するためには、特別な`KoinComponent`クラスを作成し、iOS用のKoinモジュールを宣言します。

1.  `shared/src/iosMain/kotlin/`ソースセットに、`cache`フォルダーの隣に`com/jetbrains/spacetutorial/KoinHelper.kt`という名前のファイルを作成します。
2.  `SpaceXSDK`クラスを怠惰なKoinインジェクションでラップする`KoinHelper`クラスを追加します。

    ```kotlin
    package com.jetbrains.spacetutorial
   
    import org.koin.core.component.KoinComponent
    import com.jetbrains.spacetutorial.entity.RocketLaunch
    import org.koin.core.component.inject

    class KoinHelper : KoinComponent {
        private val sdk: SpaceXSDK by inject<SpaceXSDK>()

        suspend fun getLaunches(forceReload: Boolean): List<RocketLaunch> {
            return sdk.getLaunches(forceReload = forceReload)
        }
    }
    ```

3.  `KoinHelper`クラスの後ろに、SwiftでiOS Koinモジュールを初期化および開始するために使用する`initKoin`関数を追加します。

    ```kotlin
    import com.jetbrains.spacetutorial.cache.IOSDatabaseDriverFactory
    import com.jetbrains.spacetutorial.network.SpaceXApi
    import org.koin.core.context.startKoin
    import org.koin.dsl.module
    
    fun initKoin() {
        startKoin {
            modules(module {
                single<SpaceXApi> { SpaceXApi() }
                single<SpaceXSDK> {
                    SpaceXSDK(
                        databaseDriverFactory = IOSDatabaseDriverFactory(), api = get()
                    )
                }
            })
        }
    }
    ```

これで、iOSアプリでKoinモジュールを開始し、共通の`SpaceXSDK`クラスでネイティブデータベースドライバーを使用できます。

### UIを実装する

まず、リストから項目を表示するための`RocketLaunchRow` SwiftUIビューを作成します。これは`HStack`ビューと`VStack`ビューに基づいています。データを表示するのに役立つヘルパーを備えた`RocketLaunchRow`構造体に対する拡張機能があります。

1.  IntelliJ IDEAで、**Project**ビューにいることを確認します。
2.  `iosApp`フォルダーに、`ContentView.swift`の隣に新しいSwiftファイルを作成し、`RocketLaunchRow`という名前を付けます。
3.  `RocketLaunchRow.swift`ファイルを以下のコードで更新します。

    ```Swift
    import SwiftUI
    import Shared
    
    struct RocketLaunchRow: View {
        var rocketLaunch: RocketLaunch
    
        var body: some View {
            HStack() {
                VStack(alignment: .leading, spacing: 10.0) {
                    Text("\(rocketLaunch.missionName) - \(String(rocketLaunch.launchYear))").font(.system(size: 18)).bold()
                    Text(launchText).foregroundColor(launchColor)
                    Text("Launch year: \(String(rocketLaunch.launchYear))")
                    Text("\(rocketLaunch.details ?? "")")
                }
                Spacer()
            }
        }
    }
    
    extension RocketLaunchRow {
        private var launchText: String {
            if let isSuccess = rocketLaunch.launchSuccess {
                return isSuccess.boolValue ? "Successful" : "Unsuccessful"
            } else {
                return "No data"
            }
        }
    
        private var launchColor: Color {
            if let isSuccess = rocketLaunch.launchSuccess {
                return isSuccess.boolValue ? Color.green : Color.red
            } else {
                return Color.gray
            }
        }
    }
    ```

    打ち上げリストは`ContentView`ビューに表示されます。これはすでにプロジェクトに含まれています。

4.  データを準備および管理する`ViewModel`クラスを含む`ContentView`クラスへの拡張を作成します。
    `ContentView.swift`ファイルに以下のコードを追加します。

    ```Swift
    extension ContentView {
        enum LoadableLaunches {
            case loading
            case result([RocketLaunch])
            case error(String)
        }
        
        @MainActor
        class ViewModel: ObservableObject {
            @Published var launches = LoadableLaunches.loading
        }
    }
    ```

    ビューモデル（`ContentView.ViewModel`）は、[Combineフレームワーク](https://developer.apple.com/documentation/combine)を介してビュー（`ContentView`）と接続します。
    *   `ContentView.ViewModel`クラスは`ObservableObject`として宣言されます。
    *   `launches`プロパティには`@Published`属性が使用されているため、このプロパティが変更されるたびにビューモデルがシグナルを発行します。

5.  `ContentView_Previews`構造体を削除します。ビューモデルと互換性のあるプレビューを実装する必要はありません。

6.  `ContentView`クラスのボディを更新して、打ち上げリストを表示し、リロード機能を追加します。

    *   これはUIの基礎です。チュートリアルの次のフェーズで`loadLaunches`関数を実装します。
    *   `viewModel`プロパティは、ビューモデルを購読するために`@ObservedObject`属性でマークされています。

    ```swift
    struct ContentView: View {
        @ObservedObject private(set) var viewModel: ViewModel
    
        var body: some View {
            NavigationView {
                listView()
                .navigationBarTitle("SpaceX Launches")
                .navigationBarItems(trailing:
                    Button("Reload") {
                        self.viewModel.loadLaunches(forceReload: true)
                })
            }
        }
    
        private func listView() -> AnyView {
            switch viewModel.launches {
            case .loading:
                return AnyView(Text("Loading...").multilineTextAlignment(.center))
            case .result(let launches):
                return AnyView(List(launches) { launch in
                    RocketLaunchRow(rocketLaunch: launch)
                })
            case .error(let description):
                return AnyView(Text(description).multilineTextAlignment(.center))
            }
        }
    }
    ```

7.  `RocketLaunch`クラスは`List`ビューを初期化するためのパラメータとして使用されるため、[Identifiable`プロトコルに準拠](https://developer.apple.com/documentation/swift/identifiable)する必要があります。
    クラスにはすでに`id`という名前のプロパティがあるため、`ContentView.swift`の最後に拡張機能を追加するだけで済みます。

    ```Swift
    extension RocketLaunch: Identifiable { }
    ```

### データをロードする

ビューモデルでロケット打ち上げに関するデータを取得するためには、Multiplatformライブラリの`KoinHelper`クラスのインスタンスが必要です。
これにより、正しいデータベースドライバーでSDK関数を呼び出すことができます。

1.  `ContentView.swift`ファイルで、`ViewModel`クラスを拡張して、`KoinHelper`オブジェクトと`loadLaunches`関数を含めます。

    ```Swift
    extension ContentView {
        // ...
        @MainActor
        class ViewModel: ObservableObject {
            // ...
            let helper: KoinHelper = KoinHelper()
    
            init() {
                self.loadLaunches(forceReload: false)
            }
    
            func loadLaunches(forceReload: Bool) {
                // TODO: retrieve data
            }
        }
    }
    ```

2.  `KoinHelper.getLaunches()`関数（`SpaceXSDK`クラスへの呼び出しをプロキシする）を呼び出し、結果を`launches`プロパティに保存します。

    ```Swift
    func loadLaunches(forceReload: Bool) {
        Task {
            do {
                self.launches = .loading
                let launches = try await helper.getLaunches(forceReload: forceReload)
                self.launches = .result(launches)
            } catch {
                self.launches = .error(error.localizedDescription)
            }
        }
    }
    ```

    KotlinモジュールをAppleフレームワークにコンパイルすると、[サスペンド関数](https://kotlinlang.org/docs/whatsnew14.html#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)はSwiftの`async`/`await`メカニズムを使用して呼び出すことができます。

    `getLaunches`関数はKotlinで`@Throws(Exception::class)`アノテーションでマークされているため、`Exception`クラスまたはそのサブクラスのインスタンスである例外はすべて、`NSError`としてSwiftに伝播されます。
    したがって、そのような例外はすべて`loadLaunches()`関数で捕捉できます。

3.  アプリのエントリーポイントである`iOSApp.swift`ファイルに移動し、Koinモジュール、ビュー、およびビューモデルを初期化します。

    ```Swift
    import SwiftUI
    import Shared
    
    @main
    struct iOSApp: App {
        init() {
            KoinHelperKt.doInitKoin()
        }
        
        var body: some Scene {
            WindowGroup {
                ContentView(viewModel: .init())
            }
        }
    }
    ```

4.  IntelliJ IDEAで、`iosApp`構成に切り替え、エミュレーターを選択し、実行して結果を確認します。

![iOS Application](ios-application.png){width=350}

> プロジェクトの最終バージョンは、[`final`ブランチ](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final)で確認できます。
>
{style="note"}

## 次は何をしますか？

このチュートリアルでは、メインスレッドでのJSON解析やデータベースへのリクエスト作成など、リソースを大量に消費する可能性のある操作が含まれています。並行コードの書き方やアプリの最適化について学ぶには、[コルーチンガイド](https://kotlinlang.org/docs/coroutines-guide.html)を参照してください。

さらに、以下の学習資料も確認できます。

*   [マルチプラットフォームプロジェクトでKtor HTTPクライアントを使用する](https://ktor.io/docs/http-client-engines.html#mpp-config)
*   [Koinと依存性注入について読む](https://insert-koin.io/docs/setup/why)
*   [AndroidアプリケーションをiOSで動作させる](multiplatform-integrate-in-existing-app.md)
*   [マルチプラットフォームプロジェクトの構造について詳しく学ぶ](multiplatform-discover-project.md)