---
title: JUnit 测试
---

> 本教程将指导您测试 Kotlin 应用程序，并使用 Koin 注入和检索组件。

:::note
更新 - 2025-01-28
:::

## 获取代码

:::info
[源代码可在 GitHub 上获得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle 设置

首先，如下添加 Koin 依赖项：

```groovy
dependencies {
    // Koin 测试工具
    testImplementation "io.insert-koin:koin-test:$koin_version"
    // 所需的 JUnit 版本
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 声明依赖项

我们重复使用 `koin-core` 快速入门项目，以使用 koin 模块：

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## 验证您的模块

测试 Koin 配置的最简单方法是验证您的模块。`verify()` 函数执行空运行检查，以确保所有依赖项都可以被解析：

```kotlin
class ModuleVerificationTest : AutoCloseKoinTest() {

    @Test
    fun verifyModules() {
        appModule.verify()
    }
}
```

如果任何依赖项定义无效或缺少任何必需的依赖项，此测试将失败。

## 编写使用 KoinTestRule 的测试

要编写注入依赖项的测试，请扩展 `KoinTest` 并使用 `KoinTestRule`：

```kotlin
class UserAppTest : KoinTest {

    val userService by inject<UserService>()
    val userRepository by inject<UserRepository>()

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger()
        modules(appModule)
    }

    @Test
    fun `test user service`() {
        // 通过 service 加载用户
        userService.loadUsers()

        // 验证是否可以找到用户
        val user = userService.getUserOrNull("Alice")
        assertNotNull(user)
        assertEquals("Alice", user?.name)
    }
}
```

> 我们使用 `KoinTestRule` 为每个测试启动/停止 Koin 上下文

## 模拟依赖项

您可以使用 `declareMock` 在测试中模拟依赖项。这会用 mock 替换真实的实现：

```kotlin
class UserMockTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger(Level.DEBUG)
        modules(appModule)
    }

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `mock test`() {
        // 为 UserRepository 声明一个 mock
        val repository = declareMock<UserRepository> {
            given(findUserOrNull(anyString())).willReturn(
                User("Mock", "mock@example.com")
            )
        }

        // 使用带有 mock 仓库的应用程序
        getKoin().get<UserApplication>().sayHello("Mock")

        // 验证 mock 是否被调用
        Mockito.verify(repository, times(1)).findUserOrNull(anyString())
    }
}
```

`MockProviderRule` 将 Mockito 配置为模拟框架，而 `declareMock` 则将真实的 `UserRepository` 替换为返回受控数据的 mock。

## 关键测试概念

| 概念 | 描述 |
|---------|-------------|
| `KoinTest` | 扩展以获得 Koin 测试支持的接口 |
| `AutoCloseKoinTest` | 在每次测试后自动关闭 Koin |
| `KoinTestRule` | 用于启动/停止 Koin 上下文的 JUnit 规则 |
| `MockProviderRule` | 配置模拟框架 |
| `verify()` | 在不运行的情况下验证模块配置 |
| `declareMock<T>()` | 使用 mock 替换定义 |
| `by inject<T>()` | 在测试中延迟注入依赖项 |

## 另请参阅

- **[测试参考](/docs/reference/koin-test/testing)** - 完整的测试文档
- **[模块验证](/docs/reference/koin-test/verify)** - verify() 和 checkModules() 详情