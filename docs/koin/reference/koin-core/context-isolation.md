---
title: 上下文隔离
---

上下文隔离允许 SDK 开发者在不与宿主应用程序的 Koin 实例冲突的情况下使用 Koin。

:::info
有关一般 Koin 设置，请参阅 **[启动 Koin](/docs/reference/koin-core/starting-koin)**。
:::

## 何时使用上下文隔离

- **SDK/库开发** —— 你的库在内部使用 Koin
- **避免冲突** —— 宿主应用也可能使用 Koin
- **封装** —— 保持你的 DI 容器为私有

## 创建隔离上下文

不要使用 `startKoin`（它会在 `GlobalContext` 中注册），而是使用 `koinApplication`：

```kotlin
// 针对你的 SDK 的隔离 Koin 上下文
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

## 自定义 KoinComponent

创建一个使用你隔离上下文的自定义 `KoinComponent`：

```kotlin
internal interface SdkKoinComponent : KoinComponent {
    // 重写以使用隔离上下文
    override fun getKoin(): Koin = MySdkKoinContext.koin
}

// 在你的 SDK 类中使用
class MySdkClass : SdkKoinComponent {
    private val service: SdkService by inject()  // 使用隔离上下文
}
```

## 测试隔离上下文

在测试中重写 `getKoin()` 以使用隔离上下文：

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

## 另请参阅

- **[启动 Koin](/docs/reference/koin-core/starting-koin)** —— 标准 Koin 设置
- **[Compose 上下文隔离](/docs/reference/koin-compose/isolated-context)** —— Compose 应用中的隔离