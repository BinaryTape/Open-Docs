---
title: 使用 @Monitor 進行 Koin 內建效能監控
---

`@Monitor` 註解（自 Koin Annotations 2.2.0 起提供）透過 Koin 的官方工具平台 [Kotzilla Platform](https://kotzilla.io)，為您的 Koin 組件啟用自動效能監控與追蹤 (tracing)。

## Setup

新增 Kotzilla SDK 相依性：

```kotlin
dependencies {
    implementation "io.kotzilla:kotzilla-core:latest.version"
}
```

在 Kotzilla 文件中查看[最新版本](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)。

設定 `allOpen` 外掛程式以使受監控的類別可擴充：

```kotlin
plugins {
    id "org.jetbrains.kotlin.plugin.allopen"
}

allOpen {
    annotation("org.koin.core.annotation.Monitor")
}
```

在您的 Koin 配置中初始化 Kotzilla 分析：

```kotlin
import io.kotzilla.sdk.analytics.koin.analytics

fun initKoin() {
    startKoin {
        // 啟用 Kotzilla 監控
        analytics()
        modules(appModule)
    }
}
```

## Basic Usage

只需在您的 Koin 組件加上 `@Monitor` 註解：

```kotlin
@Monitor
@Single
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
    
    suspend fun createUser(userData: UserData): User {
        return userRepository.save(userData)
    }
}
```

## Generated Code

編譯器會自動產生一個包裝您組件的代理類別：

```kotlin
/**
 * 由 @Monitor 產生 - 'UserService' 的 Koin 代理
 */
class UserServiceProxy(userRepository: UserRepository) : UserService(userRepository) {
    override fun findUser(id: String): User? { 
        return KotzillaCore.getDefaultInstance().trace("UserService.findUser") { 
            super.findUser(id) 
        } 
    }
    
    override suspend fun createUser(userData: UserData): User { 
        return KotzillaCore.getDefaultInstance().suspendTrace("UserService.createUser") { 
            super.createUser(userData) 
        } 
    }
}
```

Koin 會自動使用該代理而非原始類別，透明地擷取：
- 方法執行時間
- 呼叫頻率與模式
- 錯誤率與型別
- 效能瓶頸

## ViewModels Monitoring

監控您的 ViewModel 以追蹤 UI 效能：

```kotlin
@Monitor
@KoinViewModel
class DetailViewModel(private val repository: Repository) : ViewModel() {
    fun loadData(id: String): StateFlow<Data> = repository.getData(id)
}
```

## Kotzilla Platform Integration

監控資料會自動傳送到您的 [Kotzilla Platform](https://kotzilla.io) 工作區，提供：

- **即時效能儀表板**：檢視方法執行時間與趨勢
- **錯誤追蹤**：監控例外率與堆疊追蹤
- **使用分析**：了解哪些組件的使用最為頻繁
- **效能警報**：獲得效能迴歸通知

建立您的免費 Kotzilla 帳戶並在 `kotzilla.json` 檔案中設定 API 金鑰：

```json
{
  "sdkVersion": "latest.version",
  "keys": [
    {
      "appId": "your-app-id",
      "applicationPackageName": "com.example.app",
      "keyId": "your-key-id", 
      "apiKey": "your-api-key"
    }
  ]
}
```

## Requirements

- 加上 `@Monitor` 註解的類別必須為 `open`（由 `allOpen` 外掛程式自動處理）
- Kotzilla SDK 相依性在執行階段必須可用
- 需要有效的 Kotzilla Platform 帳戶與 API 金鑰以進行資料收集

:::info
`@Monitor` 註解僅追蹤受監控類別本身的方法呼叫。除非也加上了 `@Monitor` 註解，否則插入受監控類別中的相依性不會被自動監控。
:::

:::note
如需完整的設定說明與進階配置選項，請瀏覽 [Kotzilla 文件](https://doc.kotzilla.io)。
:::