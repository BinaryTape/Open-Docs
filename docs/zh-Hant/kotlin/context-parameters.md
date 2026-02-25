[//]: # (title: Context 參數)

<primary-label ref="experimental-general"/>

> Context 參數取代了一項名為 [context receivers](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm) 的舊實驗性功能。
> 您可以在 [Context 參數設計文件](https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md#summary-of-changes-from-the-previous-proposal) 中找到它們的主要差異。
> 若要從 context receivers 遷移到 Context 參數，您可以使用 IntelliJ IDEA 中的輔助支援，如相關的 [部落格文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/) 中所述。
>
{style="tip"}

Context 參數允許函式和屬性宣告在周圍 context 中隱含可用的相依性。

透過 Context 參數，您不需要手動傳遞在多個函式呼叫之間共享且鮮少變動的值，例如服務或相依性。

若要為屬性和函式宣告 Context 參數，請使用 `context` 關鍵字，後跟參數列表，每個參數宣告為 `name: Type`。以下是一個相依於 `UserService` 介面的範例：

```kotlin
// UserService 定義了 context 中所需的相依性 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 宣告一個帶有 Context 參數的函式
context(users: UserService)
fun outputMessage(message: String) {
    // 使用來自 context 的 log
    users.log("Log: $message")
}

// 宣告一個帶有 Context 參數的屬性
context(users: UserService)
val firstUser: String
    // 使用來自 context 的 findUserById    
    get() = users.findUserById(1)
```

您可以使用 `_` 作為 Context 參數名稱。在這種情況下，該參數的值可用於解析，但在區塊內無法透過名稱存取：

```kotlin
// 使用 "_" 作為 Context 參數名稱
context(_: UserService)
fun logWelcome() {
    // 解析仍會從 UserService 中找到適當的 log 函式
    outputMessage("Welcome!")
}
```

#### Context 參數解析

Kotlin 在呼叫點透過在目前作用域中搜尋匹配的 context 值來解析 Context 參數。Kotlin 根據其型別進行匹配。
如果同一作用域層級中存在多個相容的值，編譯器會報告歧義（ambiguity）：

```kotlin
// UserService 定義了 context 中所需的相依性
interface UserService {
    fun log(message: String)
}

// 宣告一個帶有 Context 參數的函式
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // 實作 UserService 
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // 實作 UserService
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // 在呼叫點，serviceA 和 serviceB 都符合預期的 UserService 型別
    context(serviceA, serviceB) {
        // 這會導致歧義錯誤
        outputMessage("This will not compile")
    }
}
```

#### 限制

Context 參數仍在持續改進中，目前的限制包括：

* 建構函式無法宣告 Context 參數。
* 具有 Context 參數的屬性不能有支援欄位或初始設定式。
* 具有 Context 參數的屬性不能使用委託。

儘管有這些限制，Context 參數仍能透過簡化的相依注入、改進的 DSL 設計和限定作用域的操作來簡化相依性管理。

#### 如何啟用 Context 參數

要在您的專案中啟用 Context 參數，請在命令列中使用以下編譯器選項：

```Bash
-Xcontext-parameters
```

或將其新增至 Gradle 組建檔案的 `compilerOptions {}` 區塊中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> 同時指定 `-Xcontext-receivers` 和 `-Xcontext-parameters` 編譯器選項會導致錯誤。
>
{style="warning"}

此功能計畫在未來的 Kotlin 版本中[穩定化](components-stability.md#stability-levels-explained)並進行改進。
我們非常感謝您在問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 中提供意見回饋。