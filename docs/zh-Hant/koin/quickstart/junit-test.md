---
title: JUnit 測試
---

> 本教學將帶領您測試 Kotlin 應用程式，並使用 Koin 注入與擷取您的組建。

:::note
更新 - 2025-01-28
:::

## 取得程式碼

:::info
[原始碼可於 GitHub 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle 設定

首先，如下所示新增 Koin 相依性：

```groovy
dependencies {
    // Koin 測試工具
    testImplementation "io.insert-koin:koin-test:$koin_version"
    // 所需的 JUnit 版本
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 宣告相依性

我們重複使用 `koin-core` 快速入門專案，以使用 koin 模組：

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## 驗證您的模組

:::tip
Koin 編譯器外掛程式現在提供編譯時期相依性驗證，在建置時期即可捕捉缺少的相依性，無需編寫測試程式碼。請參閱 [編譯時期安全性](/docs/reference/koin-compiler/compile-safety)。
:::

如果您沒有使用編譯器外掛程式，您可以在執行時期驗證模組。`verify()` 函式會進行空載執行（dry-run）檢查，以確保所有相依性都能被解析：

```kotlin
class ModuleVerificationTest : AutoCloseKoinTest() {

    @Test
    fun verifyModules() {
        appModule.verify()
    }
}
```

如果任何相依性定義無效或缺少任何所需的相依性，此測試將會失敗。

## 使用 KoinTestRule 編寫測試

若要編寫注入相依性的測試，請擴充（extend） `KoinTest` 並使用 `KoinTestRule`：

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
        // 透過服務載入使用者
        userService.loadUsers()

        // 驗證是否能找到使用者
        val user = userService.getUserOrNull("Alice")
        assertNotNull(user)
        assertEquals("Alice", user?.name)
    }
}
```

> 我們使用 `KoinTestRule` 為每個測試啟動/停止我們的 Koin 上下文

## 模擬（Mocking）相依性

您可以在測試中使用 `declareMock` 來模擬相依性。這會將實際實作替換為模擬物件（mock）：

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
        // 為 UserRepository 宣告一個模擬物件
        val repository = declareMock<UserRepository> {
            given(findUserOrNull(anyString())).willReturn(
                User("Mock", "mock@example.com")
            )
        }

        // 使用具有模擬存儲庫的應用程式
        getKoin().get<UserApplication>().sayHello("Mock")

        // 驗證模擬物件是否被呼叫
        Mockito.verify(repository, times(1)).findUserOrNull(anyString())
    }
}
```

`MockProviderRule` 將 Mockito 設定為模擬架構，而 `declareMock` 則將真實的 `UserRepository` 替換為回傳受控資料的模擬物件。

## 關鍵測試概念

| 概念 | 說明 |
|---------|-------------|
| `KoinTest` | 擴充以獲得 Koin 測試支援的介面 |
| `AutoCloseKoinTest` | 在每個測試後自動關閉 Koin |
| `KoinTestRule` | 啟動/停止 Koin 上下文的 JUnit 規則 |
| `MockProviderRule` | 設定模擬架構 |
| `verify()` | 在不執行的情況下驗證模組配置 |
| `declareMock<T>()` | 將定義替換為模擬物件 |
| `by inject<T>()` | 在測試中延遲注入相依性 |

## 延伸閱讀

- **[測試參考](/docs/reference/koin-test/testing)** - 完整的測試文件
- **[模組驗證](/docs/reference/koin-test/verify)** - `verify()` 與 `checkModules()` 的詳細資訊