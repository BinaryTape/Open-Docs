---
title: Android 與註解
---

> 本教學將帶領您編寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組建。
> 您大約需要 **10 分鐘** 來完成此教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼已發佈於 Github](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle 設定

讓我們如下配置 KSP 外掛程式，以及下列相依性：

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// 編譯期檢查
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
請參閱 `libs.versions.toml` 以了解目前版本
:::

## 應用程式總覽

這個應用程式的概念是管理一個使用者列表，並透過 Presenter 或 ViewModel 將其顯示在我們的 `MainActivity` 類別中：

> Users -> UserRepository -> (Presenter 或 ViewModel) -> MainActivity

## 「User」資料

我們將管理 User 的集合。這是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個「存儲庫」組建來管理使用者列表（新增使用者或按名稱尋找）。下方是 `UserRepository` 介面及其實作：

```kotlin
interface UserRepository {
    fun findUser(name : String): User?
    fun addUsers(users : List<User>)
}

class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUser(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users : List<User>) {
        _users.addAll(users)
    }
}
```

## Koin 模組

讓我們如下宣告一個 `AppModule` 模組類別。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

* 我們使用 `@Module` 將類別宣告為 Koin 模組
* `@ComponentScan("org.koin.sample")` 允許掃描 `"org.koin.sample"` 套件中的任何 Koin 定義

只需在 `UserRepositoryImpl` 類別上加上 `@Single`，即可將其宣告為單例：

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## 使用 Presenter 顯示使用者

讓我們編寫一個 Presenter 組建來顯示使用者：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式中被引用

我們在 Koin 模組中宣告 `UserPresenter`。我們使用 `@Factory` 註解將其宣告為 `factory` 定義，以避免在記憶體中保留任何執行個體（避免 Android 生命週期造成的任何記憶體洩漏）：

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## 在 Android 中注入相依性

將會建立 `UserPresenter` 組建，並隨之解析 `UserRepository` 執行個體。若要在 Activity 中取得它，讓我們使用 `by inject()` 委託函式進行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就是這樣，您的應用程式已準備就緒。

:::info
`by inject()` 函式讓我們能在 Android 組建執行階段（Activity、Fragment、Service...）中取得 Koin 執行個體。
:::

## 啟動 Koin

我們需要在 Android 應用程式中啟動 Koin。只需在應用程式的主要入口點，即我們的 `MainApplication` 類別中呼叫 `startKoin()` 函式：

```kotlin
// 產生的
import org.koin.ksp.generated.*

class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        
        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(AppModule().module)
        }
    }
}
```

Koin 模組是從 `AppModule` 透過 `.module` 擴充產生的：只需使用 `AppModule().module` 運算式，即可從註解中取得 Koin 模組。

:::info
需要 `import org.koin.ksp.generated.*` 才能使用產生的 Koin 模組內容
:::

## 使用 ViewModel 顯示使用者

讓我們編寫一個 ViewModel 組建來顯示使用者：

```kotlin
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserViewModel` 的建構函式中被引用

`UserViewModel` 標記有 `@KoinViewModel` 註解，用以宣告 Koin ViewModel 定義，且不在記憶體中保留任何執行個體（避免 Android 生命週期造成的任何記憶體洩漏）。

## 在 Android 中注入 ViewModel

將會建立 `UserViewModel` 組建，並隨之解析 `UserRepository` 執行個體。若要在 Activity 中取得它，讓我們使用 `by viewModel()` 委託函式進行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## 編譯期檢查

Koin 註解允許在編譯期檢查您的 Koin 配置。這可以透過使用下列 Gradle 選項來實現：

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

## 驗證您的應用程式！

在啟動應用程式之前，我們可以透過一個簡單的 JUnit 測試來驗證 Koin 配置，以確保配置正確。

### Gradle 設定

如下新增 Koin Android 相依性：

```groovy
// 如果需要，將 Maven Central 新增到您的存儲庫
repositories {
	mavenCentral()    
}

dependencies {
    
    // 用於測試的 Koin
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 檢查您的模組

`androidVerify()` 函式允許驗證指定的 Koin 模組：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

只需一個 JUnit 測試，您就可以確保您的定義配置沒有遺漏任何內容！