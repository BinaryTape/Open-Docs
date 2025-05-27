---
title: Android 與註解
---

> 本教學課程將引導您編寫一個 Android 應用程式，並使用 Koin 依賴注入來取得您的元件。
> 完成本教學課程約需 __10 分鐘__。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可於 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle 設定

我們將像這樣設定 KSP 插件，並加入以下依賴項：

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// Compile time check
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
請參閱 `libs.versions.toml` 以了解當前版本
:::

## 應用程式概覽

此應用程式的構想是管理一個使用者列表，並在我們的 `MainActivity` 類別中透過 Presenter 或 ViewModel 顯示它：

> 使用者 -> UserRepository -> (Presenter 或 ViewModel) -> MainActivity

## 「使用者」資料

我們將管理一個使用者集合。這是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」元件來管理使用者列表（添加使用者或依名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

*   我們使用 `@Module` 將我們的類別宣告為 Koin 模組。
*   `@ComponentScan("org.koin.sample")` 允許掃描 `"org.koin.sample"` 套件中的任何 Koin 定義。

讓我們簡單地在 `UserRepositoryImpl` 類別上添加 `@Single`，將其宣告為單例：

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## 使用 Presenter 顯示使用者

讓我們編寫一個呈現器 (Presenter) 元件來顯示使用者：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserPresenter 的建構子中被引用

我們在 Koin 模組中宣告 `UserPresenter`。我們使用 `@Factory` 註解將其宣告為一個 `factory` 定義，以避免在記憶體中保留任何實例（避免 Android 生命週期引起的任何洩漏）：

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## 在 Android 中注入依賴項

`UserPresenter` 元件將被建立，同時解析 `UserRepository` 實例。為了將其取得至我們的 Activity 中，讓我們使用 `by inject()` 委託函數進行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就是這樣，您的應用程式已經準備就緒。

:::info
`by inject()` 函數允許我們在 Android 元件執行時（Activity、fragment、Service...）取得 Koin 實例。
:::

## 啟動 Koin

我們需要隨我們的 Android 應用程式一起啟動 Koin。只需在應用程式的主要進入點，即我們的 `MainApplication` 類別中呼叫 `startKoin()` 函數：

```kotlin
// generated
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

Koin 模組是從 `AppModule` 透過 `.module` 擴充功能生成的：只需使用 `AppModule().module` 表達式即可從註解中取得 Koin 模組。

:::info
需要 `import org.koin.ksp.generated.*` 匯入才能使用生成的 Koin 模組內容
:::

## 使用 ViewModel 顯示使用者

讓我們編寫一個 ViewModel 元件來顯示使用者：

```kotlin
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserViewModel 的建構子中被引用

`UserViewModel` 被標記為 `@KoinViewModel` 註解，以宣告 Koin ViewModel 定義，避免在記憶體中保留任何實例（避免 Android 生命週期引起的任何洩漏）。

## 在 Android 中注入 ViewModel

`UserViewModel` 元件將被建立，同時解析 `UserRepository` 實例。為了將其取得至我們的 Activity 中，讓我們使用 `by viewModel()` 委託函數進行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## 編譯時期檢查

Koin 註解允許您在編譯時期檢查您的 Koin 配置。這可以透過使用以下 Gradle 選項來實現：

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

## 驗證您的應用程式！

我們可以在啟動應用程式之前，透過簡單的 JUnit 測試來驗證我們的 Koin 配置是否良好。

### Gradle 設定

如下所示添加 Koin Android 依賴項：

```groovy
// Add Maven Central to your repositories if needed
repositories {
	mavenCentral()    
}

dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 檢查您的模組

`androidVerify()` 函數允許驗證給定的 Koin 模組：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

只需一個 JUnit 測試，您就可以確保您的定義配置沒有遺漏任何東西！