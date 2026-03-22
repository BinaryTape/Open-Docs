---
title: 在 Android 上啟動 Koin
---

`koin-android` 專案致力於將 Koin 的強大功能帶入 Android 世界。如需更多詳細資訊，請參閱 [Android 設定](/docs/setup/koin#android) 章節。

## 從您的 Application 類別啟動

在您的 `Application` 類別中，您可以使用 `startKoin` 函式，並透過 `androidContext` 注入 Android context，如下所示：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // 將 Koin 記錄至 Android 記錄器
            androidLogger()
            // 參照 Android context
            androidContext(this@MainApplication)
            // 載入模組
            modules(myAppModules)
        }
    }
}
```

:::info
如果您不想在 Application 類別中啟動 Koin，也可以從任何地方啟動。
:::

如果您需要從另一個 Android 類別啟動 Koin，可以使用 `startKoin` 函式並提供您的 Android `Context` 執行個體，如下所示：

```kotlin
startKoin {
    // 注入 Android context
    androidContext(/* 您的 android context */)
    // ...
}
```

## 使用註解啟動 Koin

使用 Koin Annotations 時，您可以使用 `startKoin<T>()` 來透過您有註解的模組類別啟動 Koin：

```kotlin
@KoinApplication
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin<MainApplication> {
            androidLogger()
            androidContext(this@MainApplication)
        }
    }
}
```

`startKoin<T>()` 函式會自動載入從您的 `@Module` 註解類別中產生的模組。

對於多個模組：

```kotlin
@Module
@Configuration
@ComponentScan("com.myapp.data")
class DataModule

@Module
@Configuration
@ComponentScan("com.myapp.domain")
class DomainModule

@KoinApplication
class MainApplication

// 使用多個模組啟動
startKoin<MainApplication> {
    androidLogger()
    androidContext(this@MainApplication)
}
```

## 額外配置

在您的 Koin 配置中（在 `startKoin { }` 程式碼區塊內），您還可以配置 Koin 的多個部分。

### 適用於 Android 的 Koin 記錄功能

在您的 `KoinApplication` 執行個體中，我們提供了一個使用 `AndroidLogger()` 類別的擴充功能 `androidLogger`。此記錄器是 Koin 記錄器的 Android 實作。

如果該記錄器不符合您的需求，您可以自行更改。

```kotlin
startKoin {
    // 使用 Android 記錄器 - 預設為 Level.INFO
    androidLogger()
    // ...
}
```

### 載入屬性

您可以使用 `assets/koin.properties` 檔案中的 Koin 屬性來儲存鍵／值：

```kotlin
startKoin {
    // ...
    // 使用來自 assets/koin.properties 的屬性
    androidFileProperties()   
}
```

## 透過 AndroidX Startup (4.0.1) 啟動 Koin

[AndroidX Startup](https://developer.android.com/topic/libraries/app-startup) 是一個提供直觀方式在應用程式啟動時初始化元件的程式庫。它使用單一 `ContentProvider` 來初始化所有相依性，避免了每個需要早期初始化的元件各自使用 `ContentProvider` 所帶來的開銷。

透過使用 Gradle 套件 `koin-androidx-startup`，我們可以使用 `KoinStartup` 介面在您的 Application 類別中宣告 Koin 配置：

```kotlin
class MainApplication : Application(), KoinStartup {

     override fun onKoinStartup() = koinConfiguration {
        androidContext(this@MainApplication)
        modules(appModule)
    }

    override fun onCreate() {
        super.onCreate()
    }
}
```

這取代了通常在 `onCreate` 中使用的 `startKoin` 函式。`koinConfiguration` 函式會回傳一個 `KoinConfiguration` 執行個體。

:::info
`KoinStartup` 與 AndroidX App Startup 整合，在 `Application.onCreate()` 之前透過 `ContentProvider` 初始化 Koin。當您需要管理與其他依賴於 Koin 的 `Initializer` 之間的初始化順序時，這非常有用。
:::

:::warning
`KoinStartup` 在應用程式啟動期間於主執行緒上執行。如果您不使用 AndroidX App Startup 程式庫來管理其他 `Initializer`，則使用 `KoinStartup` 沒有任何好處 — 請改用標準的 `startKoin` 方式。關於將模組載入分派至背景執行緒，請參閱 [Lazy Modules](/docs/reference/koin-core/lazy-modules)。
:::

如果您有其他需要 Koin 的 `Initializer`，請讓它們依賴於 `KoinInitializer`：

```kotlin
class CrashTrackerInitializer : Initializer<Unit>, KoinComponent {
    private val crashTrackerService: CrashTrackerService by inject()

    override fun create(context: Context) {
        crashTrackerService.configure(context)
    }

    override fun dependencies(): List<Class<out Initializer<*>>> {
        return listOf(KoinInitializer::class.java)
    }
}
```

## 後續步驟

- **[JSR-330 相容性](/docs/reference/koin-android/jsr330)** – 使用標準的 `@Inject`、`@Singleton` 註解
- **[在 Android 中進行注入](/docs/reference/koin-android/get-instances)** – 在 Activity、Fragment、Service 中獲取執行個體
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** – ViewModel 注入與作用域限定
- **[Hilt 遷移](/docs/reference/koin-android/hilt-migration)** – 從 Hilt 遷移至 Koin