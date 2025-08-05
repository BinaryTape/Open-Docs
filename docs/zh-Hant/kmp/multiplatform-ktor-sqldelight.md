[//]: # (title: 使用 Ktor 和 SQLDelight 建立多平台應用程式)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教學使用 IntelliJ IDEA，但您也可以在 Android Studio 中進行操作——這兩個 IDE 共享相同的核心功能並支援 Kotlin Multiplatform。</p>
</tldr>

本教學示範如何使用 IntelliJ IDEA 建立一個進階的 iOS 和 Android 行動應用程式，並利用 Kotlin Multiplatform 技術。
此應用程式將會：

*   使用 Ktor 從公開的 [SpaceX API](https://docs.spacexdata.com/?version=latest) 透過網際網路擷取資料。
*   使用 SQLDelight 將資料儲存到本機資料庫中。
*   顯示 SpaceX 火箭發射列表，包含發射日期、結果和詳細的發射描述。

此應用程式將包含一個用於 iOS 和 Android 平台的共享程式碼模組。業務邏輯和資料存取層只會在共享模組中實作一次，而這兩個應用程式的 UI 將是原生的。

![Emulator and Simulator](android-and-ios.png){width=600}

您將在專案中使用以下多平台函式庫：

*   [Ktor](https://ktor.io/docs/create-client.html) 作為 HTTP 客戶端，用於透過網際網路擷取資料。
*   [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization) 用於將 JSON 回應反序列化為實體類別的物件。
*   [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 用於撰寫非同步程式碼。
*   [SQLDelight](https://github.com/cashapp/sqldelight) 用於從 SQL 查詢產生 Kotlin 程式碼並建立類型安全的資料庫 API。
*   [Koin](https://insert-koin.io/) 用於透過依賴注入 (dependency injection) 提供特定平台的資料庫驅動程式。

> 您可以在我們的 GitHub 儲存庫中找到 [範本專案](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage) 以及 [最終應用程式](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 的原始碼。
>
{style="note"}

## 建立專案

1.  在 [快速入門](quickstart.md) 中，完成 [設定 Kotlin Multiplatform 開發環境](quickstart.md#set-up-the-environment) 的指示。
2.  在 IntelliJ IDEA 中，選擇 **File** | **New** | **Project**。
3.  在左側面板中，選擇 **Kotlin Multiplatform**（在 Android Studio 中，此範本可在 **New Project** 精靈的 **Generic** 標籤中找到）。
4.  在 **New Project** 視窗中指定以下欄位：

    *   **Name**: SpaceTutorial
    *   **Group**: com.jetbrains
    *   **Artifact**: spacetutorial

    ![Create Ktor and SQLDelight Multiplatform project](create-ktor-sqldelight-multiplatform-project.png){width=800}

5.  選擇 **Android** 和 **iOS** 目標。
6.  對於 iOS，選擇 **Do not share UI** 選項。您將為兩個平台實作原生 UI。
7.  指定所有欄位和目標後，按一下 **Create**。

## 新增 Gradle 依賴

若要將多平台函式庫新增至共享模組，您需要將依賴指示 (`implementation`) 新增至 `build.gradle.kts` 檔案中相關來源集的 `dependencies {}` 區塊。

`kotlinx.serialization` 和 SQLDelight 函式庫也都需要額外的設定。

變更或新增 `gradle/libs.versions.toml` 檔案中版本目錄的行，以反映所有必要的依賴：

1.  在 `[versions]` 區塊中，檢查 AGP 版本並新增其餘部分：

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

2.  在 `[libraries]` 區塊中，新增以下函式庫引用：

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

3.  在 `[plugins]` 區塊中，指定必要的 Gradle 外掛程式：

    ```
    [plugins]
    ...
    kotlinxSerialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
    sqldelight = { id = "app.cash.sqldelight", version.ref = "sqlDelight" }
    ```

4.  新增依賴後，系統會提示您重新同步專案。按一下 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案： ![Synchronize Gradle files](gradle-sync.png){width=50}

5.  在 `shared/build.gradle.kts` 檔案的最開頭，將以下行新增至 `plugins {}` 區塊：

    ```kotlin
    plugins {
        // ...
        alias(libs.plugins.kotlinxSerialization)
        alias(libs.plugins.sqldelight)
    }
    ```

6.  通用來源集需要每個函式庫的核心構件，以及 Ktor [序列化功能](https://ktor.io/docs/serialization-client.html) 以使用 `kotlinx.serialization` 處理網路請求和回應。iOS 和 Android 來源集也需要 SQLDelight 和 Ktor 平台驅動程式。

    在相同的 `shared/build.gradle.kts` 檔案中，新增所有必要的依賴：

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

7.  新增依賴後，再次按一下 **Sync Gradle Changes** 按鈕以同步 Gradle 檔案。

Gradle 同步後，您已完成專案設定，可以開始撰寫程式碼。

> 有關多平台依賴的深入指南，請參閱 [依賴 Kotlin Multiplatform 函式庫](multiplatform-add-dependencies.md)。
>
{style="tip"}

## 建立應用程式資料模型

本教學應用程式將包含公開的 `SpaceXSDK` 類別，作為網路和快取服務的門面 (facade)。
應用程式資料模型將有三個實體類別，其中包含：

*   有關發射的一般資訊
*   任務徽章圖片的連結
*   與發射相關的文章 URL

> 截至本教學結束，並非所有這些資料都會呈現在 UI 中。
> 我們使用資料模型來展示序列化。
> 但您可以利用連結和徽章來擴展此範例，使其更具資訊性！
>
{style="note"}

建立必要的資料類別：

1.  在 `shared/src/commonMain/kotlin/com/jetbrains/spacetutorial` 目錄中，建立 `entity` 套件，然後在該套件內建立 `Entity.kt` 檔案。
2.  宣告所有基本實體的資料類別：

    ```kotlin
    ```
    {src="multiplatform-tutorial/Entity.kt" initial-collapse-state="collapsed" collapsible="true" collapsed-title="data class RocketLaunch" include-lines="3-41" }

每個可序列化的類別都必須標記有 `@Serializable` 註解。除非您在註解引數中明確傳遞序列化器連結，否則 `kotlinx.serialization` 外掛程式會自動為 `@Serializable` 類別產生預設序列化器。

`@SerialName` 註解允許您重新定義欄位名稱，這有助於使用更具可讀性的識別碼存取資料類別中的屬性。

## 設定 SQLDelight 並實作快取邏輯

### 設定 SQLDelight

SQLDelight 函式庫允許您從 SQL 查詢產生類型安全的 Kotlin 資料庫 API。在編譯期間，產生器會驗證 SQL 查詢並將其轉換為可在共享模組中使用的 Kotlin 程式碼。

SQLDelight 依賴已包含在專案中。若要設定函式庫，請開啟 `shared/build.gradle.kts` 檔案並在末尾新增 `sqldelight {}` 區塊。此區塊包含資料庫清單及其參數：

```kotlin
sqldelight {
    databases {
        create("AppDatabase") {
            packageName.set("com.jetbrains.spacetutorial.cache")
        }
    }
}
```

`packageName` 參數指定了產生 Kotlin 原始碼的套件名稱。

當系統提示時同步 Gradle 專案檔案，或者按兩下 <shortcut>Shift</shortcut> 並搜尋 **Sync All Gradle, Swift Package Manager projects**。

> 考慮安裝官方 [SQLDelight 外掛程式](https://plugins.jetbrains.com/plugin/8191-sqldelight) 以處理 `.sq` 檔案。
>
{style="tip"}

### 產生資料庫 API

首先，使用所有必要的 SQL 查詢建立 `.sq` 檔案。預設情況下，SQLDelight 外掛程式會在來源集的 `sqldelight` 資料夾中尋找 `.sq` 檔案：

1.  在 `shared/src/commonMain` 目錄中，建立一個新的 `sqldelight` 目錄。
2.  在 `sqldelight` 目錄內，建立一個名為 `com/jetbrains/spacetutorial/cache` 的新目錄，以便為套件建立巢狀目錄。
3.  在 `cache` 目錄內，建立 `AppDatabase.sq` 檔案（與您在 `build.gradle.kts` 檔案中指定的資料庫名稱相同）。
    應用程式的所有 SQL 查詢都將儲存在此檔案中。
4.  資料庫將包含一個包含發射資料的表格。
    將以下建立表格的程式碼新增到 `AppDatabase.sq` 檔案中：

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

5.  新增 `insertLaunch` 函數以將資料插入表格：

    ```text
    insertLaunch:
    INSERT INTO Launch(flightNumber, missionName, details, launchSuccess, launchDateUTC, patchUrlSmall, patchUrlLarge, articleUrl)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
    ```

6.  新增 `removeAllLaunches` 函數以清除表格中的資料：

    ```text
    removeAllLaunches:
    DELETE FROM Launch;
    ```

7.  宣告 `selectAllLaunchesInfo` 函數以擷取資料：

    ```text
    selectAllLaunchesInfo:
    SELECT Launch.*
    FROM Launch;
    ```
8.  產生對應的 `AppDatabase` 介面（稍後您將使用資料庫驅動程式來初始化它）。
    為此，請在終端機中執行以下命令：

    ```shell
    ./gradlew generateCommonMainAppDatabaseInterface
    ```

    產生的 Kotlin 程式碼儲存在 `shared/build/generated/sqldelight` 目錄中。

### 建立平台特定資料庫驅動程式的工廠

若要初始化 `AppDatabase` 介面，您需要將 `SqlDriver` 實例傳遞給它。
SQLDelight 提供了 SQLite 驅動程式的多個平台特定實作，因此您需要為每個平台單獨建立這些實例。

雖然您可以使用 [預期和實際介面](multiplatform-expect-actual.md) 來實現此目的，但在此專案中，您將使用 [Koin](https://insert-koin.io/) 來嘗試 Kotlin Multiplatform 中的依賴注入。

1.  為資料庫驅動程式建立介面。為此，在 `shared/src/commonMain/kotlin/com/jetbrains/spacetutorial/` 目錄中，建立 `cache` 套件。
2.  在 `cache` 套件內建立 `DatabaseDriverFactory` 介面：

    ```kotlin
    package com.jetbrains.spacetutorial.cache
    
    import app.cash.sqldelight.db.SqlDriver

    interface DatabaseDriverFactory {
        fun createDriver(): SqlDriver
    }
    ```

3.  為 Android 建立實作此介面的類別：在 `shared/src/androidMain/kotlin` 目錄中，建立 `com.jetbrains.spacetutorial.cache` 套件，然後在其內部建立 `DatabaseDriverFactory.kt` 檔案。
4.  在 Android 上，SQLite 驅動程式由 `AndroidSqliteDriver` 類別實作。在 `DatabaseDriverFactory.kt` 檔案中，將資料庫資訊和 context 連結傳遞給 `AndroidSqliteDriver` 類別建構函式：

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

5.  對於 iOS，在 `shared/src/iosMain/kotlin/com/jetbrains/spacetutorial/` 目錄中，建立 `cache` 套件。
6.  在 `cache` 套件內，建立 `DatabaseDriverFactory.kt` 檔案並新增此程式碼：

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

您稍後將在專案的平台特定程式碼中實作這些驅動程式的實例。

### 實作快取

到目前為止，您已新增平台資料庫驅動程式的工廠和一個用於執行資料庫操作的 `AppDatabase` 介面。
現在，建立一個 `Database` 類別，它將包裝 `AppDatabase` 介面並包含快取邏輯。

1.  在通用來源集 `shared/src/commonMain/kotlin` 中，在 `com.jetbrains.spacetutorial.cache` 套件中建立一個新的 `Database` 類別。它將包含兩個平台通用的邏輯。

2.  若要為 `AppDatabase` 提供驅動程式，請將抽象的 `DatabaseDriverFactory` 實例傳遞給 `Database` 類別建構函式：

    ```kotlin
    package com.jetbrains.spacetutorial.cache

    internal class Database(databaseDriverFactory: DatabaseDriverFactory) {
        private val database = AppDatabase(databaseDriverFactory.createDriver())
        private val dbQuery = database.appDatabaseQueries
    }
    ```

    此類別的 [可見性](https://kotlinlang.org/docs/visibility-modifiers.html#class-members) 設定為 internal，這表示它只能在多平台模組內部存取。

3.  在 `Database` 類別內部，實作一些資料處理操作。
    首先，建立 `getAllLaunches` 函數以回傳所有火箭發射的列表。
    `mapLaunchSelecting` 函數用於將資料庫查詢結果映射到 `RocketLaunch` 物件：

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

4.  新增 `clearAndCreateLaunches` 函數以清除資料庫並插入新資料：

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

## 實作 API 服務

若要透過網際網路擷取資料，您將使用 [SpaceX public API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs) 和一個單一方法從 `v5/launches` 端點擷取所有發射的列表。

建立一個將應用程式連接到 API 的類別：

1.  在 `shared/src/commonMain/kotlin/com/jetbrains/spacetutorial/` 目錄中，建立一個 `network` 套件。
2.  在 `network` 目錄內，建立 `SpaceXApi` 類別：

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

    此類別執行網路請求並將 JSON 回應反序列化為 `com.jetbrains.spacetutorial.entity` 套件中的實體。
    Ktor `HttpClient` 實例會初始化並儲存 `httpClient` 屬性。

    此程式碼使用 [Ktor `ContentNegotiation` 外掛程式](https://ktor.io/docs/serialization-client.html) 來反序列化 `GET` 請求的結果。此外掛程式會處理請求和回應有效負載為 JSON，並根據需要進行序列化和反序列化。

3.  宣告回傳火箭發射列表的資料擷取函數：

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

`getAllLaunches` 函數具有 `suspend` 修飾符，因為它包含 `HttpClient.get()` 懸掛函數的呼叫。
`get()` 函數包含一個透過網際網路擷取資料的非同步操作，只能從協程 (coroutine) 或另一個懸掛函數中呼叫。網路請求將在 HTTP 客戶端的執行緒池中執行。

用於傳送 GET 請求的 URL 作為引數傳遞給 `get()` 函數。

## 建置 SDK

您的 iOS 和 Android 應用程式將透過共享模組與 SpaceX API 通訊，該模組將提供一個公開類別 `SpaceXSDK`。

1.  在通用來源集 `shared/src/commonMain/kotlin` 的 `com.jetbrains.spacetutorial` 套件中，建立 `SpaceXSDK` 類別。
    此類別將作為 `Database` 和 `SpaceXApi` 類別的門面。

    若要建立 `Database` 類別實例，請提供一個 `DatabaseDriverFactory` 實例：

    ```kotlin
    package com.jetbrains.spacetutorial
    
    import com.jetbrains.spacetutorial.cache.Database
    import com.jetbrains.spacetutorial.cache.DatabaseDriverFactory
    import com.jetbrains.spacetutorial.network.SpaceXApi

    class SpaceXSDK(databaseDriverFactory: DatabaseDriverFactory, val api: SpaceXApi) { 
        private val database = Database(databaseDriverFactory)
    }
    ```

    您將透過 `SpaceXSDK` 類別建構函式在平台特定程式碼中注入正確的資料庫驅動程式。

2.  新增 `getLaunches` 函數，該函數使用已建立的資料庫和 API 來獲取發射列表：

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

該類別包含一個用於獲取所有發射資訊的函數。根據 `forceReload` 的值，它會回傳快取的值，或者從網際網路載入資料，然後使用結果更新快取。如果沒有快取資料，無論 `forceReload` 標誌的值如何，它都會從網際網路載入資料。

您的 SDK 客戶端可以使用 `forceReload` 標誌來載入有關發射的最新資訊，為使用者啟用下拉重新整理手勢。

所有 Kotlin 例外都是非檢查 (unchecked) 例外，而 Swift 只有檢查 (checked) 錯誤（有關詳細資訊，請參閱 [與 Swift/Objective-C 的互通性](https://kotlinlang.org/docs/native-objc-interop.html#errors-and-exceptions)）。因此，為了讓您的 Swift 程式碼感知預期的例外，從 Swift 呼叫的 Kotlin 函數應標記為 `@Throws` 註解，指定潛在例外類別的列表。

## 建立 Android 應用程式

IntelliJ IDEA 為您處理初始的 Gradle 設定，因此 `shared` 模組已連接到您的 Android 應用程式。

在實作 UI 和呈現邏輯之前，將所有必要的 UI 依賴新增至 `composeApp/build.gradle.kts` 檔案：

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

當系統提示時同步 Gradle 專案檔案，或者按兩下 <shortcut>Shift</shortcut> 並搜尋 **Sync All Gradle, Swift Package Manager projects**。

### 新增網際網路存取權限

若要存取網際網路，Android 應用程式需要適當的權限。
在 `composeApp/src/androidMain/AndroidManifest.xml` 檔案中，新增 `<uses-permission>` 標籤：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <!--...-->
</manifest>
```

### 新增依賴注入

Koin 依賴注入允許您宣告模組（元件集），您可以在不同的情境中使用它們。
在此專案中，您將建立兩個模組：一個用於 Android 應用程式，另一個用於 iOS 應用程式。
然後，您將為每個原生 UI 使用對應的模組啟動 Koin。

宣告一個 Koin 模組，其中將包含 Android 應用程式的元件：

1.  在 `composeApp/src/androidMain/kotlin` 目錄中，在 `com.jetbrains.spacetutorial` 套件中建立 `AppModule.kt` 檔案。

    在此檔案中，將該模組宣告為兩個 [單例](https://insert-koin.io/docs/reference/koin-core/definitions#defining-a-singleton)，一個用於 `SpaceXApi` 類別，一個用於 `SpaceXSDK` 類別：

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

    `SpaceXSDK` 類別建構函式注入了平台特定的 `AndroidDatabaseDriverFactory` 類別。
    `get()` 函數解析模組內的依賴關係：對於 `SpaceXSDK()` 的 `api` 參數，Koin 將傳遞之前宣告的 `SpaceXApi` 單例。

2.  建立一個自訂的 `Application` 類別，它將啟動 Koin 模組。

    在 `AppModule.kt` 檔案旁邊，建立 `Application.kt` 檔案，其中包含以下程式碼，並在 `modules()` 函數呼叫中指定您宣告的模組：

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

3.  在 `AndroidManifest.xml` 檔案的 `<application>` 標籤中指定您建立的 `MainApplication` 類別：

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

現在，您已準備好實作將使用平台特定資料庫驅動程式所提供資訊的 UI。

### 準備帶有發射列表的視圖模型

您將使用 Jetpack Compose 和 Material 3 實作 Android UI。首先，您將建立使用 SDK 獲取發射列表的視圖模型。然後，您將設定 Material 主題，最後，您將撰寫將所有內容整合在一起的可組合函數。

1.  在 `composeApp/src/androidMain` 來源集，在 `com.jetbrains.spacetutorial` 套件中，建立 `RocketLaunchViewModel.kt` 檔案：

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

    `RocketLaunchScreenState` 實例將儲存從 SDK 接收到的資料以及請求的目前狀態。

2.  新增 `loadLaunches` 函數，該函數將在此視圖模型的協程範圍內呼叫 SDK 的 `getLaunches` 函數：

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

3.  然後將 `loadLaunches()` 呼叫新增到類別的 `init {}` 區塊中，以便在 `RocketLaunchViewModel` 物件建立後立即請求資料：

    ```kotlin
    class RocketLaunchViewModel(private val sdk: SpaceXSDK) : ViewModel() {
        // ...

        init {
            loadLaunches()
        }
    }
    ```

4.  現在，在 `AppModule.kt` 檔案中，在 Koin 模組中指定視圖模型：

    ```kotlin
    import org.koin.core.module.dsl.viewModel
    
    val appModule = module {
        // ...
        viewModel { RocketLaunchViewModel(sdk = get()) }
    }
    ```

### 建置 Material 主題

您將圍繞 Material 主題提供的 `AppTheme` 函數建置主要的 `App()` 可組合項：

1.  您可以使用 [Material Theme Builder](https://m3.material.io/theme-builder#/custom) 為您的 Compose 應用程式產生主題。
    選擇您的顏色、字體，然後按一下右下角的 **Export theme**。
2.  在匯出畫面，按一下 **Export** 下拉式選單並選擇 **Jetpack Compose (Theme.kt)** 選項。
3.  解壓縮檔案並將 `theme` 資料夾複製到 `composeApp/src/androidMain/kotlin/com/jetbrains/spacetutorial` 目錄中。

    ![theme directory location](theme-directory.png){width=299}

4.  在 `theme` 套件內的每個檔案中，將 `package` 行變更為引用您建立的套件：

    ```kotlin
    package com.jetbrains.spacetutorial.theme
    ```

5.  在 `Color.kt` 檔案中，新增兩個變數，用於您將用於成功和不成功發射的顏色：

    ```kotlin
    val app_theme_successful = Color(0xff4BB543)
    val app_theme_unsuccessful = Color(0xffFC100D)
    ```

### 實作呈現邏輯

為您的應用程式建立主要的 `App()` 可組合項，並從 `ComponentActivity` 類別呼叫它：

1.  開啟 `App.kt` 檔案（位於 `com.jetbrains.spacetutorial` 套件的 `theme` 目錄旁邊）並替換預設的 `App()` 可組合函數：

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

    在這裡，您使用 [Koin ViewModel API](https://insert-koin.io/docs/%koinVersion%/reference/koin-compose/compose/#viewmodel-for-composable) 來引用您在 Android Koin 模組中宣告的 `viewModel`。

2.  現在新增將實作載入畫面、發射結果欄和下拉重新整理動作的 UI 程式碼：

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
3.  最後，在 `AndroidManifest.xml` 檔案的 `<activity>` 標籤中指定您的 `MainActivity` 類別：

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

4.  執行您的 Android 應用程式：從執行設定選單中選擇 **composeApp**，選擇模擬器，然後按一下執行按鈕。
    應用程式會自動執行 API 請求並顯示發射列表（背景顏色取決於您產生的 Material 主題）：

    ![Android application](android-application.png){width=350}

您剛剛建立了一個 Android 應用程式，其業務邏輯在 Kotlin Multiplatform 模組中實作，而 UI 則使用原生的 Jetpack Compose 建立。

## 建立 iOS 應用程式

對於專案的 iOS 部分，您將利用 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 來建置使用者介面，並採用 [Model View View-Model](https://en.wikipedia.org/wiki/Model–view–viewmodel) 模式。

IntelliJ IDEA 會產生一個已連接到共享模組的 iOS 專案。Kotlin 模組會以 `shared/build.gradle.kts` 檔案中指定的名稱（`baseName = "Shared"`）匯出，並使用常規的 `import` 語句匯入：`import Shared`。

### 為 SQLDelight 新增動態連結旗標

預設情況下，IntelliJ IDEA 產生的專案是為 iOS 框架的靜態連結設定的。

若要在 iOS 上使用原生的 SQLDelight 驅動程式，請新增動態連結器旗標，允許 Xcode 工具尋找系統提供的 SQLite 二進位檔：

1.  在 IntelliJ IDEA 中，選擇 **File** | **Open Project in Xcode** 選項，以在 Xcode 中開啟您的專案。
2.  在 Xcode 中，雙擊專案名稱以開啟其設定。
3.  切換到 **Build Settings** 標籤並搜尋 **Other Linker Flags** 欄位。
4.  雙擊欄位值，按一下 **+**，然後新增 `-lsqlite3` 字串。

### 為 iOS 依賴注入準備 Koin 類別

若要在 Swift 程式碼中使用 Koin 類別和函數，請建立一個特殊的 `KoinComponent` 類別並宣告用於 iOS 的 Koin 模組。

1.  在 `shared/src/iosMain/kotlin/` 來源集，建立一個名為 `com/jetbrains/spacetutorial/KoinHelper.kt` 的檔案（它將出現在 `cache` 資料夾旁邊）。
2.  新增 `KoinHelper` 類別，它將使用惰性 Koin 注入來包裝 `SpaceXSDK` 類別：

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

3.  在 `KoinHelper` 類別之後，新增 `initKoin` 函數，您將在 Swift 中使用它來初始化和啟動 iOS Koin 模組：

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

現在，您可以在 iOS 應用程式中啟動 Koin 模組，以將原生資料庫驅動程式與通用的 `SpaceXSDK` 類別一起使用。

### 實作 UI

首先，您將建立一個 `RocketLaunchRow` SwiftUI 視圖，用於顯示列表中的項目。它將基於 `HStack` 和 `VStack` 視圖。`RocketLaunchRow` 結構將有擴展，其中包含用於顯示資料的有用輔助函數。

1.  在 IntelliJ IDEA 中，確保您處於 **Project** 視圖。
2.  在 `iosApp` 資料夾中，`ContentView.swift` 旁邊建立一個新的 Swift 檔案，並將其命名為 `RocketLaunchRow`。
3.  使用以下程式碼更新 `RocketLaunchRow.swift` 檔案：

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

    發射列表將顯示在 `ContentView` 視圖中，該視圖已包含在專案中。

4.  為 `ContentView` 類別建立一個擴展，其中包含一個 `ViewModel` 類別，它將準備和管理資料。
    將以下程式碼新增到 `ContentView.swift` 檔案中：

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

    視圖模型 (`ContentView.ViewModel`) 透過 [Combine framework](https://developer.apple.com/documentation/combine) 與視圖 (`ContentView`) 連接：
    *   `ContentView.ViewModel` 類別被宣告為 `ObservableObject`。
    *   `@Published` 屬性用於 `launches` 屬性，因此當此屬性變更時，視圖模型將發出訊號。

5.  移除 `ContentView_Previews` 結構：您不需要實作應與您的視圖模型相容的預覽。

6.  更新 `ContentView` 類別的主體以顯示發射列表並新增重新載入功能。

    *   這是 UI 基礎：您將在教學的下一階段實作 `loadLaunches` 函數。
    *   `viewModel` 屬性標記為 `@ObservedObject` 屬性以訂閱視圖模型。

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

7.  `RocketLaunch` 類別用作初始化 `List` 視圖的參數，因此它需要 [符合 `Identifiable` 協議](https://developer.apple.com/documentation/swift/identifiable)。
    該類別已有名為 `id` 的屬性，因此您只需在 `ContentView.swift` 底部新增一個擴展：

    ```Swift
    extension RocketLaunch: Identifiable { }
    ```

### 載入資料

若要在視圖模型中擷取有關火箭發射的資料，您需要 Multiplatform 函式庫中的 `KoinHelper` 類別實例。
它將允許您使用正確的資料庫驅動程式呼叫 SDK 函數。

1.  在 `ContentView.swift` 檔案中，展開 `ViewModel` 類別以包含 `KoinHelper` 物件和 `loadLaunches` 函數：

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

2.  呼叫 `KoinHelper.getLaunches()` 函數（它將代理呼叫 `SpaceXSDK` 類別）並將結果儲存在 `launches` 屬性中：

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

    當您將 Kotlin 模組編譯為 Apple 框架時，[懸掛函數](https://kotlinlang.org/docs/whatsnew14.html#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
    可以使用 Swift 的 `async`/`await` 機制來呼叫。

    由於 `getLaunches` 函數在 Kotlin 中標記有 `@Throws(Exception::class)` 註解，任何 `Exception` 類別或其子類別的實例例外將作為 `NSError` 傳播到 Swift。
    因此，所有此類例外都可以由 `loadLaunches()` 函數捕獲。

3.  轉到應用程式的進入點，`iOSApp.swift` 檔案，並初始化 Koin 模組、視圖和視圖模型：

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

4.  在 IntelliJ IDEA 中，切換到 **iosApp** 設定，選擇模擬器，然後執行它以查看結果：

![iOS Application](ios-application.png){width=350}

> 您可以在 [`final` 分支](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 上找到專案的最終版本。
>
{style="note"}

## 接下來

本教學介紹了一些潛在的資源密集型操作，例如在主執行緒中解析 JSON 和向資料庫發出請求。若要了解如何撰寫並行程式碼和優化應用程式，請參閱 [協程指南](https://kotlinlang.org/docs/coroutines-guide.html)。

您還可以查看這些額外的學習資料：

*   [在多平台專案中使用 Ktor HTTP 客戶端](https://ktor.io/docs/http-client-engines.html#mpp-config)
*   [閱讀有關 Koin 和依賴注入的資訊](https://insert-koin.io/docs/setup/why)
*   [讓您的 Android 應用程式在 iOS 上運作](multiplatform-integrate-in-existing-app.md)
*   [深入了解多平台專案結構](multiplatform-discover-project.md)。