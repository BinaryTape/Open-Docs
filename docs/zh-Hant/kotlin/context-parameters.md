[//]: # (title: 上下文參數)

<primary-label ref="experimental-general"/>

> 上下文參數取代了舊有的實驗性功能，稱為 [上下文接收器](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)。
> 您可以在[上下文參數的設計文件](https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md#summary-of-changes-from-the-previous-proposal)中找到它們的主要差異。
> 若要從上下文接收器遷移到上下文參數，您可以使用 IntelliJ IDEA 中的輔助支援，如相關[部落格文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)所述。
>
{style="tip"}

上下文參數允許函數和屬性宣告在周圍上下文中隱式可用的依賴項。

藉由上下文參數，您無需手動傳遞在函數呼叫集合之間共享且很少更改的值，例如服務或依賴項。

若要宣告屬性與函數的上下文參數，請使用 `context` 關鍵字，後接一個參數列表，其中每個參數宣告為 `name: Type`。這是一個依賴於 `UserService` 介面的範例：

```kotlin
// UserService 定義了在上下文所需的依賴項 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 宣告一個帶有上下文參數的函數
context(users: UserService)
fun outputMessage(message: String) {
    // 從上下文中調用 log
    users.log("Log: $message")
}

// 宣告一個帶有上下文參數的屬性
context(users: UserService)
val firstUser: String
    // 從上下文中調用 findUserById    
    get() = users.findUserById(1)
```

您可以使用 `_` 作為上下文參數名稱。在此情況下，參數的值可用於解析，但無法在區塊內部透過名稱存取：

```kotlin
// 使用 "_" 作為上下文參數名稱
context(_: UserService)
fun logWelcome() {
    // 解析仍然會從 UserService 中找到適當的 log 函數
    outputMessage("Welcome!")
}
```

#### 上下文參數解析

Kotlin 在呼叫站點透過在當前作用域中搜尋匹配的上下文值來解析上下文參數。Kotlin 根據其類型進行匹配。
如果在相同作用域級別存在多個相容值，編譯器會報告歧義：

```kotlin
// UserService 定義了在上下文所需的依賴項
interface UserService {
    fun log(message: String)
}

// 宣告一個帶有上下文參數的函數
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

    // serviceA 和 serviceB 都與呼叫站點預期的 UserService 類型匹配
    context(serviceA, serviceB) {
        // 這會導致歧義錯誤
        outputMessage("This will not compile")
    }
}
```

#### 限制

上下文參數正在持續改進中，目前的一些限制包括：

*   建構函式不能宣告上下文參數。
*   帶有上下文參數的屬性不能有後備欄位或初始化式。
*   帶有上下文參數的屬性不能使用委託。

儘管有這些限制，上下文參數透過簡化的依賴注入、改進的 DSL 設計以及作用域操作簡化了依賴項的管理。

#### 如何啟用上下文參數

若要在專案中啟用上下文參數，請在命令列中使用以下編譯器選項：

```Bash
-Xcontext-parameters
```

或將其新增到您的 Gradle 建置檔的 `compilerOptions {}` 區塊中：

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

此功能計畫在未來的 Kotlin 版本中[穩定](components-stability.md#stability-levels-explained)並改進。
我們非常感謝您在我們的議題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 中提供回饋。