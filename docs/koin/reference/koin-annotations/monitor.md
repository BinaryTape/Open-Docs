---
title: Koin 内置性能监控与 @Monitor
---

`@Monitor` 注解（自 Koin Annotations 2.2.0 起可用）通过 [Kotzilla Platform](https://kotzilla.io)（Koin 的官方工具平台）为你的 Koin 组件启用自动性能监控和追踪。

## 设置

添加 Kotzilla SDK 依赖项：

```kotlin
dependencies {
    implementation "io.kotzilla:kotzilla-core:latest.version"
}
```

请在 Kotzilla 文档中查看 [最新版本](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)。

配置 `allOpen` 插件以使受监控的类可扩展：

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
        // 启用 Kotzilla 监控
        analytics()
        modules(appModule)
    }
}
```

## 基本用法

只需使用 `@Monitor` 注解你的 Koin 组件：

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

## 生成的代码

编译器会自动生成一个代理类来封装你的组件：

```kotlin
/**
 * 由 @Monitor 生成 - 'UserService' 的 Koin 代理
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

Koin 会自动使用代理而非原始类，透明地捕获：
- 方法执行时间
- 调用频率和模式
- 错误率和类型
- 性能瓶颈

## ViewModel 监控

监控你的 ViewModel 以追踪 UI 性能：

```kotlin
@Monitor
@KoinViewModel
class DetailViewModel(private val repository: Repository) : ViewModel() {
    fun loadData(id: String): StateFlow<Data> = repository.getData(id)
}
```

## Kotzilla Platform 集成

监控数据会自动发送到你的 [Kotzilla Platform](https://kotzilla.io) 工作区，提供：

- **实时性能仪表盘**：查看方法执行时间和趋势
- **错误追踪**：监控异常率和堆栈追踪
- **使用情况分析**：了解哪些组件使用最频繁
- **性能警报**：获取性能退化通知

创建你的免费 Kotzilla 账户，并在 `kotzilla.json` 文件中配置 API 密钥：

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

- 使用 `@Monitor` 注解的类必须是开放的（由 `allOpen` 插件自动处理）
- Kotzilla SDK 依赖项必须在运行时可用
- 有效的 Kotzilla Platform 账户和 API 密钥，用于数据收集

:::info
`@Monitor` 注解仅追踪受监控类自身的方法调用。注入到受监控类中的依赖项不会自动监控，除非它们也使用 `@Monitor` 进行注解。
:::

:::note
有关完整的设置说明和高级配置选项，请访问 [Kotzilla 文档](https://kotzilla.io](https://doc.kotzilla.io/)。
:::