---
title: "Android 與註解 (Annotations)"
---
> 本教學將引導您編寫一個 Android 應用程式，並使用 Koin 依賴注入來取得您的元件。
> 完成本教學約需 __10 分鐘__。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle 設定

讓我們像這樣配置 KSP 外掛程式 (KSP Plugin)，以及以下相依性：

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// 編譯時檢查 (Compile time check)
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
請參閱 `libs.versions.toml` 以取得目前版本
:::

## 應用程式概觀

此應用程式的想法是管理使用者列表，並在我們的 `MainActivity` 類別中用 Presenter 或 ViewModel 顯示它：

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## "User" 資料

我們將管理一個 User 的集合。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個 "Repository" 元件來管理使用者列表（新增使用者或依名稱尋找使用者）。以下是 `UserRepository` 介面及其實現：

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

## Koin 模組 (module)

讓我們宣告一個如下的 `AppModule` 模組類別 (module class)。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

* 我們使用 `@Module` 將我們的類別宣告為 Koin 模組 (module)
* `@ComponentScan("org.koin.sample")` 允許掃描 `"org.koin.sample"` 套件 (package) 中的任何 Koin 定義

讓我們簡單地在 `UserRepositoryImpl` 類別上新增 `@Single`，將其宣告為單例 (singleton)：

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## 使用 Presenter 顯示 User

讓我們編寫一個 presenter 元件來顯示使用者：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserPresenter 的建構函式中被引用

我們在 Koin 模組 (module) 中宣告 `UserPresenter`。 我們使用 `@Factory` 註解將其宣告為 `factory` 定義，以不在記憶體中保留任何實例（避免 Android 生命週期中的任何洩漏）：

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## 在 Android 中注入依賴 (Dependencies)

`UserPresenter` 元件將被建立，並解析 `UserRepository` 實例。為了在我們的 Activity 中取得它，讓我們用 `by inject()` 委託函式 (delegate function) 注入它：

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
`by inject()` 函式允許我們在 Android 元件執行時 (runtime) （Activity, fragment, Service...）中檢索 Koin 實例
:::

## 啟動 Koin

我們需要使用我們的 Android 應用程式啟動 Koin。只需在應用程式的主要進入點 `MainApplication` 類別中呼叫 `startKoin()` 函式：

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

Koin 模組 (module) 是從 `AppModule` 中使用 `.module` 擴展名產生的：只需使用 `AppModule().module` 表達式從註解中取得 Koin 模組 (module)。

:::info
需要 `import org.koin.ksp.generated.*` 導入 (import) 才能使用產生的 Koin 模組 (module) 內容
:::

## 使用 ViewModel 顯示 User

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

> UserRepository 在 UserViewModel 的建構函式中被引用

`UserViewModel` 使用 `@KoinViewModel` 註解進行標記，以宣告 Koin ViewModel 定義，以不在記憶體中保留任何實例（避免 Android 生命週期中的任何洩漏）。

## 在 Android 中注入 ViewModel

`UserViewModel` 元件將被建立，並解析 `UserRepository` 實例。為了在我們的 Activity 中取得它，讓我們用 `by viewModel()` 委託函式 (delegate function) 注入它：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## 編譯時檢查 (Compile Time Checks)

Koin Annotations 允許在編譯時檢查您的 Koin 配置。 這可以透過使用以下 Gradle 選項來實現：

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

## 驗證您的應用程式！

我們可以透過使用一個簡單的 JUnit 測試來驗證我們的 Koin 配置來確保其良好，然後再啟動我們的應用程式。

### Gradle 設定

如下所示新增 Koin Android 依賴：

```groovy
// 如果需要，將 Maven Central 新增到您的儲存庫 (repositories)
repositories {
	mavenCentral()    
}

dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 檢查您的模組 (modules)

`androidVerify()` 函式允許驗證給定的 Koin 模組 (modules)：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

只需一個 JUnit 測試，您就可以確保您的定義配置沒有遺漏任何內容！