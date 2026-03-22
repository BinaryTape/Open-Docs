---
title: 上下文隔離
---

上下文隔離允許 SDK 製作人員在不與宿主應用程式的 Koin 執行個體（instance）產生衝突的情況下使用 Koin。

:::info
關於一般的 Koin 設定，請參閱 **[啟動 Koin](/docs/reference/koin-core/starting-koin)**。
:::

## 何時使用上下文隔離

- **SDK/程式庫開發** - 你的程式庫在內部使用 Koin
- **避免衝突** - 宿主應用程式可能也使用了 Koin
- **封裝** - 保持你的 DI 容器私有

## 建立隔離的上下文

不要使用 `startKoin`（它會在 `GlobalContext` 中註冊），而是使用 `koinApplication`：

```kotlin
// 為你的 SDK 建立隔離的 Koin 上下文
object MySdkKoinContext {

    private val koinApp = koinApplication {
        modules(sdkModule)
    }

    val koin = koinApp.koin
}

val sdkModule = module {
    single<SdkService>()
    single<SdkRepository>()
}
```

## 自訂 KoinComponent

建立一個使用你隔離上下文的自訂 `KoinComponent`：

```kotlin
internal interface SdkKoinComponent : KoinComponent {
    // 覆寫以使用隔離的上下文
    override fun getKoin(): Koin = MySdkKoinContext.koin
}

// 在你的 SDK 類別中使用
class MySdkClass : SdkKoinComponent {
    private val service: SdkService by inject()  // 使用隔離的上下文
}
```

## 測試隔離的上下文

在測試中覆寫 `getKoin()` 以使用隔離的上下文：

```kotlin
class SdkTest : KoinTest {
    override fun getKoin(): Koin = MySdkKoinContext.koin

    @Before
    fun setUp() {
        val testModule = module {
            single<SdkService> { MockSdkService() }
        }
        koin.loadModules(listOf(testModule))
    }

    @After
    fun tearDown() {
        koin.unloadModules(listOf(testModule))
    }
}
```

## 延伸閱讀

- **[啟動 Koin](/docs/reference/koin-core/starting-koin)** - 標準 Koin 設定
- **[Compose 隔離上下文](/docs/reference/koin-compose/isolated-context)** - Compose 應用程式中的隔離