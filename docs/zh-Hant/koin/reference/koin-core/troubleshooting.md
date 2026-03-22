---
title: 疑難排解
---

# 疑難排解

本指南涵蓋了偵錯、常見錯誤以及應避免的反面模式。

## 循環相依性

### 問題

```kotlin
// 循環相依性 - 會在執行階段失敗
class ServiceA(val serviceB: ServiceB)
class ServiceB(val serviceA: ServiceA)

module {
    single { ServiceA(get()) }
    single { ServiceB(get()) }  // 錯誤：循環相依性！
}
```

### 解決方案 1：延遲注入

使用延遲解析來打破循環：

```kotlin
class ServiceA : KoinComponent {
    val serviceB: ServiceB by inject()  // 延遲
}

class ServiceB : KoinComponent {
    val serviceA: ServiceA by inject()  // 延遲
}

module {
    single { ServiceA() }
    single { ServiceB() }
}
```

### 解決方案 2：提取共用相依性

透過重構移除循環（建議做法）：

```kotlin
// 提取共用邏輯
@Singleton
class SharedService

@Singleton
class ServiceA(private val shared: SharedService)

@Singleton
class ServiceB(private val shared: SharedService)
```

### 解決方案 3：使用介面

```kotlin
interface ServiceBContract {
    fun doSomething()
}

@Singleton
class ServiceA(private val serviceB: ServiceBContract)

@Singleton
class ServiceB(private val serviceA: ServiceA) : ServiceBContract
```

## 偵錯

### 啟用記錄

```kotlin
startKoin {
    // 設定記錄層級
    printLogger(Level.DEBUG)  // DEBUG, INFO, ERROR, NONE

    modules(appModule)
}
```

### 使用 `verify()` 驗證模組

驗證所有定義是否都能被解析：

```kotlin
// 在測試中
@Test
fun `verify all modules`() {
    appModule.verify()  // 如果缺少任何相依性，則會失敗
}
```

:::info
`verify()` 和 `checkModules()` 都將被 Koin 編譯器外掛程式中的原生編譯期安全性取代。詳情請參閱 [Module Verification](/docs/reference/koin-test/verify)。
:::

## 常見錯誤

**遺失定義：**
```
No definition found for class 'UserRepository'
```
修正：將遺失的定義新增至模組

**循環相依性：**
```
Circular dependency detected
```
修正：使用延遲注入或重構（見上文）

**找不到作用域：**
```
No scope definition found for 'MyScope'
```
修正：確保在存取作用域相依性之前已建立作用域

**多個定義：**
```
Multiple definitions found for type 'ApiClient'
```
修正：使用限定詞區分不同定義

## 常見的反面模式

### 1. 過度使用服務定位器 (Service Locator)

```kotlin
// 差 - 服務定位器模式
class UserViewModel : ViewModel(), KoinComponent {
    fun loadUser() {
        val repository = get<UserRepository>()  // 手動解析
        // ...
    }
}

// 好 - 建構函式注入
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {
    fun loadUser() {
        // 相依性已被注入
    }
}
```

### 2. 全能模組 (God Modules)

```kotlin
// 差 - 所有內容都在同一個模組
val appModule = module {
    // 這裡有超過 100 個定義
}

// 好 - 有組織的模組
val databaseModule = module { /* ... */ }
val networkModule = module { /* ... */ }
val homeModule = module { /* ... */ }
```

### 3. 過度使用限定詞

```kotlin
// 差 - 為不同型別使用限定詞
module {
    single(named("user_repository")) { UserRepository() }
    single(named("order_repository")) { OrderRepository() }
}

// 好 - 由型別本身進行區分
module {
    singleOf(::UserRepository)
    singleOf(::OrderRepository)
}
```

### 4. 混合關注點

```kotlin
// 差 - 模組中的副作用
module {
    single {
        println("Loading database...")  // 副作用
        Database()
    }
}

// 好 - 純粹的相依性建立
module {
    single { Database() }
}
```

### 5. 隱藏相依性

```kotlin
// 差 - 相依性隱藏在內部
class UserService {
    private val api = ApiClient()  // 隱藏相依性
}

// 好 - 明確的相依性
class UserService(private val api: ApiClient)
```

## 最佳實務摘要

1. **優先使用建構函式注入** - 避免在類別內部呼叫 `get()`
2. **在測試中使用 `verify()`** - 及早發現遺失的定義
3. **保持模組專注** - 每個模組單一職責
4. **避免循環相依性** - 重構或使用延遲注入
5. **謹慎使用限定詞** - 僅當同一型別有多個執行個體時使用

## 後續步驟

- **[Modules](/docs/reference/koin-core/modules)** - 模組組織
- **[Testing](/docs/reference/koin-test/testing)** - 使用 Koin 進行測試
- **[Scopes](/docs/reference/koin-core/scopes)** - 管理生命週期