---
title: 模組
---

# 模組

Koin 模組是組織相依注入配置的建置區塊。

## 什麼是模組？

模組是群組相關定義的邏輯容器：

```kotlin
val appModule = module {
    single<Database>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

模組可以協助您：
- 依功能或層級**組織**定義
- **封裝**相關的相依性
- 跨內容**重複使用**配置
- 在模組化專案中**控制可見性**

## 建立模組

### 使用編譯器外掛程式 DSL

```kotlin
import org.koin.plugin.module.dsl.*

val networkModule = module {
    single<ApiClient>()
    single<TokenManager>()
}

val databaseModule = module {
    single<Database>()
    single<UserDao>()
}
```

### 使用註解

```kotlin
@Module
@ComponentScan("com.myapp.network")
class NetworkModule

@Module
@ComponentScan("com.myapp.database")
class DatabaseModule
```

### 使用經典 DSL

```kotlin
val networkModule = module {
    singleOf(::ApiClient)
    singleOf(::TokenManager)
}
```

## 使用多個模組

相依性可以參考來自其他模組的定義：

```kotlin
// 資料層
val dataModule = module {
    single<Database>()
    single<UserRepository>()  // 可以使用此模組中的 Database
}

// 表現層
val viewModelModule = module {
    viewModel<UserViewModel>()  // 可以使用來自 dataModule 的 UserRepository
}

// 載入兩者
startKoin {
    modules(dataModule, viewModelModule)
}
```

:::info
Koin 會自動解析所有已載入模組間的相依性。不需要明確匯入。
:::

:::note
雖然直接列出模組是可行的，但建議考慮使用 [`includes()`](#使用-includes-組合模組) 將您的模組組織成階層結構，以獲得更好的結構與最佳化載入。
:::

## 使用 `includes()` 組合模組

`includes()` 函式是組織模組的**推薦方式**。它提供：

- **模組階層結構** - 以清晰的父子關係建構您的模組
- **最佳化載入** - Koin 會對包含的模組進行去重，防止冗餘註冊
- **更簡潔的啟動** - 載入單一根模組，而非一長串清單
- **封裝** - 內部模組可以隱藏在公開 API 模組之後

:::tip
**最佳實務：** 使用 `includes()` 建置模組階層結構，而不是在 `startKoin` 中列出所有模組。這可以改善組織並確保高效的模組載入。
:::

```kotlin
val networkModule = module {
    single<ApiClient>()
}

val storageModule = module {
    single<Database>()
}

// 父模組包含子模組
val dataModule = module {
    includes(networkModule, storageModule)
    single<UserRepository>()
}

// ✅ 推薦：載入具有 includes 的根模組
startKoin {
    modules(dataModule)
}

// ❌ 避免：扁平的模組清單
startKoin {
    modules(networkModule, storageModule, dataModule)
}
```

### `includes()` 如何最佳化載入

當模組被多次包含時，Koin 僅會載入它們一次：

```kotlin
val commonModule = module {
    single<Logger>()
}

val featureAModule = module {
    includes(commonModule)
    single<FeatureA>()
}

val featureBModule = module {
    includes(commonModule)  // 同樣包含了 commonModule
    single<FeatureB>()
}

val appModule = module {
    includes(featureAModule, featureBModule)
}

// commonModule 僅會被載入一次，即使它被包含了兩次
startKoin {
    modules(appModule)
}
```

### 多模組專案

使用可見性修飾詞來控制公開的內容：

```kotlin
// :feature:user 模組

// 私有 - 對其他模組隱藏
private val userDataModule = module {
    single<UserDao>()
    single<UserCache>()
}

// 公開 API
val userFeatureModule = module {
    includes(userDataModule)
    viewModel<UserViewModel>()
}
```

```kotlin
// :app 模組
startKoin {
    modules(userFeatureModule)  // 只有此模組可被存取
}
```

## 模組覆寫

### 預設行為

預設情況下，**最後載入的定義優先**：

```kotlin
val productionModule = module {
    single<ApiService> { ProductionApi() }
}

val debugModule = module {
    single<ApiService> { DebugApi() }
}

startKoin {
    modules(productionModule, debugModule)  // DebugApi 優先
}
```

### 嚴格模式

在生產環境中停用覆寫：

```kotlin
startKoin {
    allowOverride(false)  // 嘗試覆寫時會拋出例外
    modules(productionModule)
}
```

### 明確覆寫

在嚴格模式下允許特定覆寫：

```kotlin
val testModule = module {
    single<ApiService> { MockApi() }.override()  // 允許
}

startKoin {
    allowOverride(false)
    modules(productionModule, testModule)
}
```

## 立即模組建立

在啟動時立即建立單例（Singleton）：

```kotlin
val coreModule = module(createdAtStart = true) {
    single<ConfigManager>()
    single<LoggingSystem>()
}
```

## 參數化模組

動態建立模組：

```kotlin
fun featureModule(debug: Boolean) = module {
    single<Logger> {
        if (debug) DebugLogger() else ProductionLogger()
    }
}

startKoin {
    modules(featureModule(debug = BuildConfig.DEBUG))
}
```

## 策略模式

使用模組來交換實作：

```kotlin
val repositoryModule = module {
    single<UserRepository>()  // 相依於 Datasource
}

// 策略選項
val localDatasourceModule = module {
    single<Datasource> { LocalDatasource() }
}

val remoteDatasourceModule = module {
    single<Datasource> { RemoteDatasource() }
}

// 生產環境
startKoin {
    modules(repositoryModule, remoteDatasourceModule)
}

// 離線模式
startKoin {
    modules(repositoryModule, localDatasourceModule)
}
```

## 註解式模組

Koin 支援基於註解的模組配置，作為 DSL 的替代方案。

```kotlin
@Module
@ComponentScan("com.myapp.data")
class DataModule

@Module
@ComponentScan("com.myapp.network")
class NetworkModule

// 包含其他模組
@Module(includes = [DataModule::class, NetworkModule::class])
class AppModule
```

關鍵特性：
- `@Module` 將類別標記為 Koin 模組
- `@ComponentScan` 自動發現套件中帶有註解的類別
- `@Configuration` 在啟動時啟用自動發現
- 模組函式提供外部程式庫執行個體

:::info
如需完整的註解式模組文件，請參閱 [註解參考 - 模組](/docs/reference/koin-annotations/modules)。
:::

## 最佳實務

### 組織

1. **依功能/層級群組**
   ```kotlin
   val authModule = module { /* auth 功能 */ }
   val networkModule = module { /* 網路層 */ }
   ```

2. **使用 `includes()` 建置模組階層結構** (推薦)
   ```kotlin
   // 建立一個包含所有功能的根模組
   val appModule = module {
       includes(
           coreModule,
           networkModule,
           featureAModule,
           featureBModule
       )
   }

   // 使用單一模組進行簡潔的啟動
   startKoin {
       modules(appModule)
   }
   ```

3. **保持模組專注** - 每個模組僅負擔單一職責

### 命名

- 使用描述性名稱：`networkModule`、`userFeatureModule`
- 將相關內容群組：`authDataModule`、`authDomainModule`

### 多模組專案

1. **每個功能一個公開模組**
2. **實作模組使用 `private`/`internal`**
3. **將共享模組置於 `:core`**

## 後續步驟

- **[定義](/docs/reference/koin-core/definitions)** - 建立定義
- **[限定符](/docs/reference/koin-core/qualifiers)** - 具名與型別限定符
- **[作用域](/docs/reference/koin-core/scopes)** - 使用作用域管理生命週期
- **[疑難排解](/docs/reference/koin-core/troubleshooting)** - 偵錯並修正常見問題