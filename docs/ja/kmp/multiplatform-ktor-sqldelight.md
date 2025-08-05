[//]: # (title: Ktor と SQLDelight を使用してマルチプラットフォームアプリを作成する)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>このチュートリアルではIntelliJ IDEAを使用しますが、Android Studioでも同様に実行できます。どちらのIDEもコア機能とKotlin Multiplatformのサポートは共通しています。</p>
</tldr>

このチュートリアルでは、IntelliJ IDEA を使用して、Kotlin Multiplatform で iOS と Android 向けの高度なモバイルアプリケーションを作成する方法を示します。
このアプリケーションは次の機能を持ちます。

*   Ktor を使用して、公開されている [SpaceX API](https://docs.spacexdata.com/?version=latest) からインターネット経由でデータを取得します。
*   SQLDelight を使用して、ローカルデータベースにデータを保存します。
*   SpaceX のロケット打ち上げリストを、打ち上げ日、結果、および詳細な説明とともに表示します。

アプリケーションには、iOS と Android の両プラットフォームで共通のコードを含むモジュールが含まれます。ビジネスロジックとデータ
アクセス層は共通モジュールで一度だけ実装され、両アプリケーションの UI はネイティブになります。

![Emulator and Simulator](android-and-ios.png){width=600}

プロジェクトでは、以下のマルチプラットフォームライブラリを使用します。

*   [Ktor](https://ktor.io/docs/create-client.html): インターネット経由でデータを取得するための HTTP クライアントとして使用します。
*   [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization): JSON レスポンスをエンティティクラスのオブジェクトにデシリアライズするために使用します。
*   [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines): 非同期コードを記述するために使用します。
*   [SQLDelight](https://github.com/cashapp/sqldelight): SQL クエリから Kotlin コードを生成し、型安全なデータベース API を作成するために使用します。
*   [Koin](https://insert-koin.io/): 依存性注入を介してプラットフォーム固有のデータベースドライバを提供するために使用します。

> [テンプレートプロジェクト](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage) と [最終アプリケーション](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) のソースコードは、当社の GitHub リポジトリで確認できます。
>
{style="note"}

## プロジェクトを作成する

1.  [クイックスタート](quickstart.md) で、[Kotlin Multiplatform 開発のための環境をセットアップする](quickstart.md#set-up-the-environment) の手順を完了します。
2.  IntelliJ IDEA で、**File** | **New** | **Project** を選択します。
3.  左側のパネルで **Kotlin Multiplatform** を選択します（Android Studio の場合、このテンプレートは **New Project** ウィザードの **Generic** タブにあります）。
4.  **New Project** ウィンドウで、以下のフィールドを指定します。

    *   **Name**: SpaceTutorial
    *   **Group**: com.jetbrains
    *   **Artifact**: spacetutorial

    ![Create Ktor and SQLDelight Multiplatform project](create-ktor-sqldelight-multiplatform-project.png){width=800}

5.  **Android** と **iOS** のターゲットを選択します。
6.  iOS の場合、**Do not share UI** オプションを選択します。両プラットフォームでネイティブ UI を実装します。
7.  すべてのフィールドとターゲットを指定したら、**Create** をクリックします。

## Gradle 依存関係を追加する

共通モジュールにマルチプラットフォームライブラリを追加するには、`build.gradle.kts` ファイルの該当するソースセットの `dependencies {}` ブロックに依存関係の記述 (`implementation`) を追加する必要があります。

`kotlinx.serialization` と SQLDelight ライブラリの両方も追加の設定が必要です。

必要なすべての依存関係を反映するように、`gradle/libs.versions.toml` ファイルのバージョンカタログの行を変更または追加します。

1.  `[versions]` ブロックで、AGP バージョンを確認し、残りを追加します。

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

2.  `[libraries]` ブロックで、以下のライブラリ参照を追加します。

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

3.  `[plugins]` ブロックで、必要な Gradle プラグインを指定します。

    ```
    [plugins]
    ...
    kotlinxSerialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
    sqldelight = { id = "app.cash.sqldelight", version.ref = "sqlDelight" }
    ```

4.  依存関係を追加すると、プロジェクトの再同期を促されます。**Sync Gradle Changes** ボタンをクリックして Gradle ファイルを同期します。
    ![Synchronize Gradle files](gradle-sync.png){width=50}

5.  `shared/build.gradle.kts` ファイルの冒頭で、`plugins {}` ブロックに以下の行を追加します。

    ```kotlin
    plugins {
        // ...
        alias(libs.plugins.kotlinxSerialization)
        alias(libs.plugins.sqldelight)
    }
    ```

6.  共通ソースセットでは、各ライブラリのコアアーティファクトと、ネットワークリクエストおよびレスポンスの処理に `kotlinx.serialization` を使用するための Ktor の [serialization 機能](https://ktor.io/docs/serialization-client.html) が必要です。
    iOS および Android のソースセットには、SQLDelight と Ktor のプラットフォームドライバも必要です。

    同じ `shared/build.gradle.kts` ファイルに、必要なすべての依存関係を追加します。

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

7.  依存関係を追加したら、**Sync Gradle Changes** ボタンをもう一度クリックして Gradle ファイルを同期します。

Gradle の同期後、プロジェクトの設定は完了し、コードの記述を開始できます。

> マルチプラットフォームの依存関係に関する詳細なガイドについては、[Kotlin Multiplatform ライブラリへの依存関係](multiplatform-add-dependencies.md) を参照してください。
>
{style="tip"}

## アプリケーションデータモデルを作成する

このチュートリアルアプリには、ネットワークおよびキャッシュサービスをラップするファサードとして、公開 `SpaceXSDK` クラスが含まれます。
アプリケーションデータモデルには、以下の3つのエンティティクラスが含まれます。

*   打ち上げに関する一般的な情報
*   ミッションパッチの画像へのリンク
*   打ち上げに関連する記事の URL

> このチュートリアルの終わりまでに、このデータのすべてが UI に表示されるわけではありません。
> データモデルは、シリアライゼーションを示すために使用しています。
> しかし、リンクやパッチを使って、例をより情報豊富なものに拡張することもできます！
>
{style="note"}

必要なデータクラスを作成します。

1.  `shared/src/commonMain/kotlin/com/jetbrains/spacetutorial` ディレクトリに `entity` パッケージを作成し、その中に `Entity.kt` ファイルを作成します。
2.  基本的なエンティティのすべてのデータクラスを宣言します。

    ```kotlin
    ```
    {src="multiplatform-tutorial/Entity.kt" initial-collapse-state="collapsed" collapsible="true" collapsed-title="data class RocketLaunch" include-lines="3-41" }

各シリアライズ可能なクラスは `@Serializable` アノテーションでマークする必要があります。`kotlinx.serialization` プラグインは、アノテーション引数でシリアライザへのリンクを明示的に渡さない限り、`@Serializable` クラスのデフォルトシリアライザを自動的に生成します。

`@SerialName` アノテーションを使用すると、フィールド名を再定義でき、データクラスのプロパティに、より読みやすい識別子を使用してアクセスするのに役立ちます。

## SQLDelight を設定し、キャッシュロジックを実装する

### SQLDelight を設定する

SQLDelight ライブラリを使用すると、SQL クエリから型安全な Kotlin データベース API を生成できます。コンパイル中に、ジェネレータは SQL クエリを検証し、共通モジュールで使用できる Kotlin コードに変換します。

SQLDelight の依存関係はすでにプロジェクトに含まれています。ライブラリを設定するには、`shared/build.gradle.kts` ファイルを開き、末尾に `sqldelight {}` ブロックを追加します。このブロックには、データベースとそのパラメータのリストが含まれます。

```kotlin
sqldelight {
    databases {
        create("AppDatabase") {
            packageName.set("com.jetbrains.spacetutorial.cache")
        }
    }
}
```

`packageName` パラメータは、生成される Kotlin ソースのパッケージ名を指定します。

促されたら Gradle プロジェクトファイルを同期するか、<shortcut>Shift</shortcut> を2回押して **Sync All Gradle, Swift Package Manager projects** を検索します。

> `.sq` ファイルを操作するには、公式の [SQLDelight プラグイン](https://plugins.jetbrains.com/plugin/8191-sqldelight) をインストールすることを検討してください。
>
{style="tip"}

### データベース API を生成する

まず、必要なすべての SQL クエリを含む `.sq` ファイルを作成します。デフォルトでは、SQLDelight プラグインはソースセットの `sqldelight` フォルダーで `.sq` ファイルを検索します。

1.  `shared/src/commonMain` ディレクトリに、新しい `sqldelight` ディレクトリを作成します。
2.  `sqldelight` ディレクトリ内に、`com/jetbrains/spacetutorial/cache` という名前の新しいディレクトリを作成し、パッケージ用のネストされたディレクトリを作成します。
3.  `cache` ディレクトリ内に、`AppDatabase.sq` ファイル（`build.gradle.kts` ファイルで指定したデータベースと同じ名前）を作成します。
    アプリケーションのすべての SQL クエリは、このファイルに保存されます。
4.  データベースには、打ち上げに関するデータを含むテーブルが含まれます。
    テーブルを作成するための以下のコードを `AppDatabase.sq` ファイルに追加します。

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

5.  テーブルにデータを挿入するための `insertLaunch` 関数を追加します。

    ```text
    insertLaunch:
    INSERT INTO Launch(flightNumber, missionName, details, launchSuccess, launchDateUTC, patchUrlSmall, patchUrlLarge, articleUrl)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
    ```

6.  テーブル内のデータをクリアするための `removeAllLaunches` 関数を追加します。

    ```text
    removeAllLaunches:
    DELETE FROM Launch;
    ```

7.  データを取得するための `selectAllLaunchesInfo` 関数を宣言します。

    ```text
    selectAllLaunchesInfo:
    SELECT Launch.*
    FROM Launch;
    ```
8.  対応する `AppDatabase` インターフェース（後でデータベースドライバで初期化します）を生成します。
    これを行うには、ターミナルで次のコマンドを実行します。

    ```shell
    ./gradlew generateCommonMainAppDatabaseInterface
    ```

    生成された Kotlin コードは `shared/build/generated/sqldelight` ディレクトリに保存されます。

### プラットフォーム固有のデータベースドライバのファクトリを作成する

`AppDatabase` インターフェースを初期化するために、`SqlDriver` インスタンスを渡します。
SQLDelight は SQLite ドライバの複数のプラットフォーム固有の実装を提供するため、これらのインスタンスを各プラットフォームで個別に作成する必要があります。

これは [expected と actual のインターフェース](multiplatform-expect-actual.md) で実現できますが、
このプロジェクトでは、Kotlin Multiplatform で依存性注入を試すために [Koin](https://insert-koin.io/) を使用します。

1.  データベースドライバ用のインターフェースを作成します。これを行うには、`shared/src/commonMain/kotlin/com/jetbrains/spacetutorial/` ディレクトリに `cache` パッケージを作成します。
2.  `cache` パッケージ内に `DatabaseDriverFactory` インターフェースを作成します。

    ```kotlin
    package com.jetbrains.spacetutorial.cache
    
    import app.cash.sqldelight.db.SqlDriver

    interface DatabaseDriverFactory {
        fun createDriver(): SqlDriver
    }
    ```

3.  Android 用にこのインターフェースを実装するクラスを作成します。`shared/src/androidMain/kotlin` ディレクトリに `com.jetbrains.spacetutorial.cache` パッケージを作成し、その中に `DatabaseDriverFactory.kt` ファイルを作成します。
4.  Android では、SQLite ドライバは `AndroidSqliteDriver` クラスによって実装されます。`DatabaseDriverFactory.kt` ファイルで、データベース情報とコンテキストリンクを `AndroidSqliteDriver` クラスのコンストラクタに渡します。

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

5.  iOS の場合、`shared/src/iosMain/kotlin/com/jetbrains/spacetutorial/` ディレクトリに `cache` パッケージを作成します。
6.  `cache` パッケージ内に `DatabaseDriverFactory.kt` ファイルを作成し、以下のコードを追加します。

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

これらのドライバのインスタンスは、後でプロジェクトのプラットフォーム固有のコードで実装します。

### キャッシュを実装する

ここまでに、プラットフォームデータベースドライバのファクトリと、データベース操作を実行する `AppDatabase` インターフェースを追加しました。
次に、`AppDatabase` インターフェースをラップし、キャッシュロジックを含む `Database` クラスを作成します。

1.  共通ソースセット `shared/src/commonMain/kotlin` に、`com.jetbrains.spacetutorial.cache` パッケージに新しい `Database` クラスを作成します。これには両プラットフォームに共通のロジックが含まれます。

2.  `AppDatabase` にドライバを提供するには、抽象的な `DatabaseDriverFactory` インスタンスを `Database` クラスのコンストラクタに渡します。

    ```kotlin
    package com.jetbrains.spacetutorial.cache

    internal class Database(databaseDriverFactory: DatabaseDriverFactory) {
        private val database = AppDatabase(databaseDriverFactory.createDriver())
        private val dbQuery = database.appDatabaseQueries
    }
    ```

    このクラスの [可視性](https://kotlinlang.org/docs/visibility-modifiers.html#class-members) は internal に設定されており、これはマルチプラットフォームモジュール内からのみアクセス可能であることを意味します。

3.  `Database` クラス内に、いくつかのデータ処理操作を実装します。
    まず、すべてのロケット打ち上げのリストを返す `getAllLaunches` 関数を作成します。
    `mapLaunchSelecting` 関数は、データベースクエリの結果を `RocketLaunch` オブジェクトにマッピングするために使用されます。

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

4.  データベースをクリアして新しいデータを挿入する `clearAndCreateLaunches` 関数を追加します。

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

## API サービスを実装する

インターネット経由でデータを取得するために、[SpaceX 公開 API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs) と、`v5/launches` エンドポイントからすべての打ち上げリストを取得する単一のメソッドを使用します。

アプリケーションを API に接続するクラスを作成します。

1.  `shared/src/commonMain/kotlin/com/jetbrains/spacetutorial/` ディレクトリに `network` パッケージを作成します。
2.  `network` ディレクトリ内に `SpaceXApi` クラスを作成します。

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

    このクラスはネットワークリクエストを実行し、JSON レスポンスを `com.jetbrains.spacetutorial.entity` パッケージのエンティティにデシリアライズします。
    Ktor の `HttpClient` インスタンスは `httpClient` プロパティを初期化し、格納します。

    このコードは、GET リクエストの結果をデシリアライズするために [Ktor の `ContentNegotiation` プラグイン](https://ktor.io/docs/serialization-client.html) を使用します。このプラグインは、リクエストとレスポンスのペイロードを JSON として処理し、必要に応じてシリアライズおよびデシリアライズします。

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

`getAllLaunches` 関数には `suspend` 修飾子が付いています。これは、`HttpClient.get()` の `suspend` 関数呼び出しが含まれているためです。
    `get()` 関数はインターネット経由でデータを取得する非同期操作を含み、コルーチンまたは別の `suspend` 関数からのみ呼び出すことができます。ネットワークリクエストは HTTP クライアントのスレッドプールで実行されます。

GET リクエストを送信するための URL は、`get()` 関数の引数として渡されます。

## SDK を構築する

iOS および Android アプリケーションは、共有モジュールを介して SpaceX API と通信します。このモジュールは、パブリッククラス `SpaceXSDK` を提供します。

1.  共通ソースセット `shared/src/commonMain/kotlin` の `com.jetbrains.spacetutorial` パッケージに、`SpaceXSDK` クラスを作成します。
    このクラスは、`Database` クラスと `SpaceXApi` クラスのファサードになります。

    `Database` クラスインスタンスを作成するには、`DatabaseDriverFactory` インスタンスを提供します。

    ```kotlin
    package com.jetbrains.spacetutorial
    
    import com.jetbrains.spacetutorial.cache.Database
    import com.jetbrains.spacetutorial.cache.DatabaseDriverFactory
    import com.jetbrains.spacetutorial.network.SpaceXApi

    class SpaceXSDK(databaseDriverFactory: DatabaseDriverFactory, val api: SpaceXApi) { 
        private val database = Database(databaseDriverFactory)
    }
    ```

    `SpaceXSDK` クラスのコンストラクタを介して、プラットフォーム固有のコードに正しいデータベースドライバを注入します。

2.  作成したデータベースと API を使用して起動リストを取得する `getLaunches` 関数を追加します。

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

このクラスには、すべての起動情報を取得するための関数が1つ含まれています。`forceReload` の値に応じて、キャッシュされた値を返すか、インターネットからデータをロードして結果でキャッシュを更新します。キャッシュされたデータがない場合は、`forceReload` フラグの値に関係なくインターネットからデータをロードします。

SDK のクライアントは、`forceReload` フラグを使用して起動に関する最新情報をロードでき、ユーザー向けのプルツーリフレッシュジェスチャを有効にできます。

Kotlin のすべての例外は非チェック例外ですが、Swift にはチェック例外のみがあります（詳細については [Swift/Objective-C との相互運用](https://kotlinlang.org/docs/native-objc-interop.html#errors-and-exceptions) を参照）。したがって、Swift コードが予期される例外を認識できるようにするには、Swift から呼び出される Kotlin 関数は、潜在的な例外クラスのリストを指定する `@Throws` アノテーションでマークする必要があります。

## Android アプリケーションを作成する

IntelliJ IDEA が初期の Gradle 設定を処理してくれるため、`shared` モジュールはすでに Android アプリケーションに接続されています。

UI とプレゼンテーションロジックを実装する前に、必要なすべての UI 依存関係を `composeApp/build.gradle.kts` ファイルに追加します。

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

促されたら Gradle プロジェクトファイルを同期するか、<shortcut>Shift</shortcut> を2回押して **Sync All Gradle, Swift Package Manager projects** を検索します。

### インターネットアクセス許可を追加する

インターネットにアクセスするには、Android アプリケーションに適切な権限が必要です。
`composeApp/src/androidMain/AndroidManifest.xml` ファイルに `<uses-permission>` タグを追加します。

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <!--...-->
</manifest>
```

### 依存性注入を追加する

Koin の依存性注入により、さまざまなコンテキストで使用できるモジュール（コンポーネントのセット）を宣言できます。
このプロジェクトでは、Android アプリケーション用と iOS アプリケーション用に2つのモジュールを作成します。
次に、対応するモジュールを使用して、各ネイティブ UI 用に Koin を起動します。

Android アプリ用のコンポーネントを含む Koin モジュールを宣言します。

1.  `composeApp/src/androidMain/kotlin` ディレクトリに、`com.jetbrains.spacetutorial` パッケージに `AppModule.kt` ファイルを作成します。

    そのファイルで、モジュールを `SpaceXApi` クラスと `SpaceXSDK` クラスの2つの [シングルトン](https://insert-koin.io/docs/reference/koin-core/definitions#defining-a-singleton) として宣言します。

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

    `SpaceXSDK` クラスのコンストラクタには、プラットフォーム固有の `AndroidDatabaseDriverFactory` クラスが注入されます。
    `get()` 関数はモジュール内の依存関係を解決します。`SpaceXSDK()` の `api` パラメータの代わりに、Koin は先に宣言された `SpaceXApi` シングルトンを渡します。

2.  Koin モジュールを起動するカスタム `Application` クラスを作成します。

    `AppModule.kt` ファイルの隣に、`Application.kt` ファイルを以下のコードで作成し、`modules()` 関数呼び出しで宣言したモジュールを指定します。

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

3.  作成した `MainApplication` クラスを `AndroidManifest.xml` ファイルの `<application>` タグに指定します。

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

これで、プラットフォーム固有のデータベースドライバによって提供される情報を使用する UI を実装する準備ができました。

### 打ち上げリストを含むビューモデルを準備する

Jetpack Compose と Material 3 を使用して Android UI を実装します。まず、SDK を使用して打ち上げリストを取得するビューモデルを作成します。次に、Material テーマを設定し、最後に、すべてを統合するコンポーザブル関数を記述します。

1.  `composeApp/src/androidMain` ソースセットの `com.jetbrains.spacetutorial` パッケージに、`RocketLaunchViewModel.kt` ファイルを作成します。

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

    `RocketLaunchScreenState` インスタンスは、SDK から受け取ったデータとリクエストの現在の状態を格納します。

2.  SDK の `getLaunches` 関数をこのビューモデルのコルーチンスコープで呼び出す `loadLaunches` 関数を追加します。

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

3.  次に、`RocketLaunchViewModel` オブジェクトが作成されるとすぐに API からデータを要求するように、`init {}` ブロックに `loadLaunches()` 呼び出しを追加します。

    ```kotlin
    class RocketLaunchViewModel(private val sdk: SpaceXSDK) : ViewModel() {
        // ...

        init {
            loadLaunches()
        }
    }
    ```

4.  次に、`AppModule.kt` ファイルで Koin モジュールのビューモデルを指定します。

    ```kotlin
    import org.koin.core.module.dsl.viewModel
    
    val appModule = module {
        // ...
        viewModel { RocketLaunchViewModel(sdk = get()) }
    }
    ```

### マテリアルテーマを構築する

メインの `App()` コンポーザブルは、Material Theme が提供する `AppTheme` 関数を中心に構築します。

1.  [Material Theme Builder](https://m3.material.io/theme-builder#/custom) を使用して、Compose アプリのテーマを生成できます。
    色とフォントを選択し、右下隅の **Export theme** をクリックします。
2.  エクスポート画面で、**Export** ドロップダウンをクリックし、**Jetpack Compose (Theme.kt)** オプションを選択します。
3.  アーカイブを解凍し、`theme` フォルダーを `composeApp/src/androidMain/kotlin/com/jetbrains/spacetutorial` ディレクトリにコピーします。

    ![theme directory location](theme-directory.png){width=299}

4.  `theme` パッケージ内の各ファイルで、`package` 行を、作成したパッケージを参照するように変更します。

    ```kotlin
    package com.jetbrains.spacetutorial.theme
    ```

5.  `Color.kt` ファイルに、打ち上げの成功と失敗に使用する2つの変数を追加します。

    ```kotlin
    val app_theme_successful = Color(0xff4BB543)
    val app_theme_unsuccessful = Color(0xffFC100D)
    ```

### プレゼンテーションロジックを実装する

アプリケーションのメイン `App()` コンポーザブルを作成し、`ComponentActivity` クラスから呼び出します。

1.  `com.jetbrains.spacetutorial` パッケージの `theme` ディレクトリの隣にある `App.kt` ファイルを開き、デフォルトの `App()` コンポーザブル関数を置き換えます。

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

    ここでは、Android Koin モジュールで宣言した `viewModel` を参照するために、[Koin ViewModel API](https://insert-koin.io/docs/%koinVersion%/reference/koin-compose/compose/#viewmodel-for-composable) を使用しています。

2.  次に、ロード画面、打ち上げ結果の列、プルツーリフレッシュアクションを実装する UI コードを追加します。

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

    <!--3. Remove the `import App` line in the `MainActivity.kt` file in the `com.jetbrains.spacetutorial` package so that
       the `setContent()` function refers to the `App()` composable you just created in that package.-->
3.  最後に、`AndroidManifest.xml` ファイルの `<activity>` タグで `MainActivity` クラスを指定します。

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

4.  Android アプリを実行します。実行構成メニューから **composeApp** を選択し、エミュレータを選択して実行ボタンをクリックします。
    アプリは自動的に API リクエストを実行し、起動リストを表示します（背景色は生成した Material テーマによって異なります）。

    ![Android application](android-application.png){width=350}

これで、ビジネスロジックが Kotlin Multiplatform モジュールで実装され、UI がネイティブの Jetpack Compose を使用して作成された Android アプリケーションが完成しました。

## iOS アプリケーションを作成する

プロジェクトの iOS 部分では、ユーザーインターフェースを構築するために [SwiftUI](https://developer.apple.com/xcode/swiftui/) を利用し、[Model View View-Model](https://en.wikipedia.org/wiki/Model–view–viewmodel) パターンを使用します。

IntelliJ IDEA は、共有モジュールにすでに接続されている iOS プロジェクトを生成します。Kotlin モジュールは `shared/build.gradle.kts` ファイルで指定された名前 (`baseName = "Shared"`) でエクスポートされ、通常の `import` ステートメント (`import Shared`) を使用してインポートされます。

### SQLDelight の動的リンクフラグを追加する

デフォルトでは、IntelliJ IDEA は iOS フレームワークの静的リンク用に設定されたプロジェクトを生成します。

iOS でネイティブの SQLDelight ドライバを使用するには、Xcode ツールがシステム提供の SQLite バイナリを見つけられるようにする動的リンカーフラグを追加します。

1.  IntelliJ IDEA で、**File** | **Open Project in Xcode** オプションを選択して Xcode でプロジェクトを開きます。
2.  Xcode で、プロジェクト名をダブルクリックして設定を開きます。
3.  **Build Settings** タブに切り替えて、**Other Linker Flags** フィールドを検索します。
4.  フィールド値をダブルクリックし、**+** をクリックして `-lsqlite3` 文字列を追加します。

### iOS 依存性注入のための Koin クラスを準備する

Swift コードで Koin クラスと関数を使用するには、特別な `KoinComponent` クラスを作成し、iOS 用の Koin モジュールを宣言します。

1.  `shared/src/iosMain/kotlin/` ソースセットに、`com/jetbrains/spacetutorial/KoinHelper.kt` という名前のファイルを作成します（`cache` フォルダーの隣に表示されます）。
2.  `KoinHelper` クラスを追加します。これは `SpaceXSDK` クラスを遅延 Koin インジェクションでラップします。

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

3.  `KoinHelper` クラスの後に `initKoin` 関数を追加します。これは Swift で iOS Koin モジュールを初期化し、開始するために使用します。

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

これで、iOS アプリで Koin モジュールを開始し、共通の `SpaceXSDK` クラスとネイティブデータベースドライバを使用できます。

### UI を実装する

まず、リストの項目を表示するための `RocketLaunchRow` SwiftUI ビューを作成します。これは `HStack` と `VStack` ビューに基づいています。`RocketLaunchRow` 構造体には、データを表示するための便利なヘルパーを持つ拡張機能が含まれます。

1.  IntelliJ IDEA で、**Project** ビューにいることを確認します。
2.  `iosApp` フォルダー内の `ContentView.swift` の隣に新しい Swift ファイルを作成し、`RocketLaunchRow` という名前を付けます。
3.  `RocketLaunchRow.swift` ファイルを以下のコードで更新します。

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

    打ち上げリストは、すでにプロジェクトに含まれている `ContentView` ビューに表示されます。

4.  データを準備および管理する `ViewModel` クラスを持つ `ContentView` クラスの拡張を作成します。
    以下のコードを `ContentView.swift` ファイルに追加します。

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

    ビューモデル (`ContentView.ViewModel`) は、[Combine フレームワーク](https://developer.apple.com/documentation/combine) を介してビュー (`ContentView`) と接続します。
    *   `ContentView.ViewModel` クラスは `ObservableObject` として宣言されます。
    *   `@Published` 属性は `launches` プロパティに使用されるため、このプロパティが変更されるたびにビューモデルはシグナルを発行します。

5.  `ContentView_Previews` 構造体を削除します。ビューモデルと互換性のあるプレビューを実装する必要はありません。

6.  `ContentView` クラスの本文を更新して、打ち上げリストを表示し、リロード機能を追加します。

    *   これは UI の基礎作業です。`loadLaunches` 関数は、チュートリアルの次のフェーズで実装します。
    *   `viewModel` プロパティは、ビューモデルを購読するために `@ObservedObject` 属性でマークされています。

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

7.  `RocketLaunch` クラスは `List` ビューを初期化するためのパラメータとして使用されるため、[Identifiable プロトコルに準拠](https://developer.apple.com/documentation/swift/identifiable) する必要があります。
    このクラスにはすでに `id` という名前のプロパティがあるため、`ContentView.swift` の末尾に拡張機能を追加するだけで済みます。

    ```Swift
    extension RocketLaunch: Identifiable { }
    ```

### データをロードする

ビューモデルでロケット打ち上げに関するデータを取得するには、Multiplatform ライブラリの `KoinHelper` クラスのインスタンスが必要です。
これにより、正しいデータベースドライバを使用して SDK 関数を呼び出すことができます。

1.  `ContentView.swift` ファイルで、`ViewModel` クラスを展開して `KoinHelper` オブジェクトと `loadLaunches` 関数を含めます。

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

2.  `KoinHelper.getLaunches()` 関数（`SpaceXSDK` クラスへの呼び出しをプロキシします）を呼び出し、結果を `launches` プロパティに保存します。

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

    Kotlin モジュールを Apple フレームワークにコンパイルすると、[停止関数](https://kotlinlang.org/docs/whatsnew14.html#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c) は Swift の `async`/`await` メカニズムを使用して呼び出すことができます。

    `getLaunches` 関数は Kotlin で `@Throws(Exception::class)` アノテーションでマークされているため、`Exception` クラスまたはそのサブクラスのインスタンスである例外はすべて `NSError` として Swift に伝播されます。
    したがって、このような例外はすべて `loadLaunches()` 関数でキャッチできます。

3.  アプリのエントリポイントである `iOSApp.swift` ファイルに移動し、Koin モジュール、ビュー、ビューモデルを初期化します。

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

4.  IntelliJ IDEA で、**iosApp** 構成に切り替え、エミュレータを選択して実行すると、結果が表示されます。

![iOS Application](ios-application.png){width=350}

> プロジェクトの最終バージョンは、[`final` ブランチ](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) で確認できます。
>
{style="note"}

## 次のステップ

このチュートリアルでは、JSON のパースやメインスレッドでのデータベースへのリクエストなど、潜在的にリソースを大量に消費する操作を扱っています。並行コードの書き方やアプリの最適化については、[コルーチンガイド](https://kotlinlang.org/docs/coroutines-guide.html) を参照してください。

その他の学習資料もご確認ください。

*   [マルチプラットフォームプロジェクトで Ktor HTTP クライアントを使用する](https://ktor.io/docs/http-client-engines.html#mpp-config)
*   [Koin と依存性注入について読む](https://insert-koin.io/docs/setup/why)
*   [Android アプリケーションを iOS で動作させる](multiplatform-integrate-in-existing-app.md)
*   [マルチプラットフォームプロジェクト構造の詳細を学ぶ](multiplatform-discover-project.md)