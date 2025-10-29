---
title: Koin 內建效能監控與 @Monitor
---

`@Monitor` 註解（自 Koin Annotations 2.2.0 起可用）透過 [Kotzilla 平台](https://kotzilla.io)（Koin 的官方工具平台）為你的 Koin 元件實現自動化的效能監控與追蹤。

## 設定

新增 Kotzilla SDK 依賴項：

```kotlin
dependencies {
    implementation "io.kotzilla:kotzilla-core:latest.version"
}
```

請在 Kotzilla 文件中查閱 [最新版本](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)。

設定 `allOpen` 外掛程式，使受監控的類別可擴展：

```kotlin
plugins {
    id "org.jetbrains.kotlin.plugin.allopen"
}

allOpen {
    annotation("org.koin.core.annotation.Monitor")
}
```

在你的 Koin 配置中初始化 Kotzilla 分析功能：

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

## 基本用法

只需使用 `@Monitor` 註解你的 Koin 元件：

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

## 生成的程式碼

編譯器會自動生成一個代理類別來包裝你的元件：

```kotlin
/**
 * 由 @Monitor 生成 - Koin 對於 'UserService' 的代理
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

Koin 會自動使用此代理而非原始類別，透明地捕捉以下資訊：
- 方法執行時間
- 呼叫頻率與模式
- 錯誤率與類型
- 效能瓶頸

## ViewModels 監控

監控你的 ViewModels 以追蹤 UI 效能：

```kotlin
@Monitor
@KoinViewModel
class DetailViewModel(private val repository: Repository) : ViewModel() {
    fun loadData(id: String): StateFlow<Data> = repository.getData(id)
}
```

## Kotzilla 平台整合

監控資料會自動傳送到你的 [Kotzilla 平台](https://kotzilla.io) 工作區，提供以下功能：

- **實時效能儀表板**：檢視方法執行時間與趨勢
- **錯誤追蹤**：監控異常率與堆疊追蹤
- **使用分析**：了解哪些元件被最頻繁使用
- **效能警報**：收到效能退化的通知

建立你的免費 Kotzilla 帳戶並在 `kotzilla.json` 檔案中配置 API 金鑰：

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

## 要求

- 標註了 `@Monitor` 的類別必須是 open 的（由 `allOpen` 外掛程式自動處理）
- Kotzilla SDK 依賴項必須在執行時可用
- 用於資料收集的有效 Kotzilla 平台帳戶和 API 金鑰

:::info
`@Monitor` 註解只追蹤受監控類別本身上的方法呼叫。注入到受監控類別的依賴項不會自動被監控，除非它們也標註了 `@Monitor`。
:::

:::note
有關完整的設定說明和進階配置選項，請造訪 [Kotzilla 文件](https://doc.kotzilla.io)。
:::