[//]: # (title: 從 C 映射函式指標 – 教學)

<tldr>
    <p>這是「**映射 Kotlin 與 C**」教學系列文章的第三部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">從 C 映射基本資料型別</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">從 C 映射結構和聯集型別</a><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>從 C 映射函式指標</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">從 C 映射字串</a><br/>
    </p>
</tldr>

> C 函式庫匯入功能目前為 [Beta 版](native-c-interop-stability.md)。cinterop 工具從 C 函式庫產生的所有 Kotlin 宣告都應帶有 `@ExperimentalForeignApi` 註解。
>
> Kotlin/Native 隨附的原生平台函式庫（例如 Foundation、UIKit 和 POSIX）僅需針對部分 API 選擇啟用 (opt-in)。
>
{style="note"}

讓我們探索哪些 C 函式指標可從 Kotlin 中可見，並檢視 Kotlin/Native 和 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 建置中與 C 互通 (interop) 相關的進階使用案例。

在本教學中，您將會：

* [學習如何將 Kotlin 函式作為 C 函式指標傳遞](#pass-kotlin-function-as-a-c-function-pointer)
* [從 Kotlin 中使用 C 函式指標](#use-the-c-function-pointer-from-kotlin)

## 從 C 映射函式指標型別

為了理解 Kotlin 和 C 之間的映射，讓我們宣告兩個函式：一個接受函式指標作為參數，另一個則返回函式指標。

在本系列的[第一部分](mapping-primitive-data-types-from-c.md)中，您已經建立了一個包含必要檔案的 C 函式庫。針對此步驟，請在 `---` 分隔符號後更新 `interop.def` 檔案中的宣告：

```c 

---

int myFun(int i) {
  return i+1;
}

typedef int  (*MyFun)(int);

void accept_fun(MyFun f) {
  f(42);
}

MyFun supply_fun() {
  return myFun;
}
``` 

`interop.def` 檔案提供了在 IDE 中編譯、執行或開啟應用程式所需的一切。

## 檢查 C 函式庫產生的 Kotlin API

讓我們看看 C 函式指標如何映射到 Kotlin/Native，並更新您的專案：

1. 在 `src/nativeMain/kotlin` 中，使用以下內容更新您[先前教學](mapping-struct-union-types-from-c.md)中的 `hello.kt` 檔案：

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi
   
   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")
      
       accept_fun(/* fix me*/)
       val useMe = supply_fun()
   }
   ```

2. 使用 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 導航至 C 函式生成的以下 API：

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
   ```

如您所見，C 函式指標在 Kotlin 中使用 `CPointer<CFunction<...>>` 表示。`accept_fun()` 函式將一個可選的函式指標作為參數，而 `supply_fun()` 則返回一個函式指標。

`CFunction<(Int) -> Int>` 代表函式簽章，而 `CPointer<CFunction<...>>?` 則代表一個可空的函式指標。對於所有 `CPointer<CFunction<...>>` 型別，都有一個 [`.invoke()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/invoke.html) 運算子擴充函式可用，允許您像呼叫常規 Kotlin 函式一樣呼叫函式指標。

## 將 Kotlin 函式作為 C 函式指標傳遞

是時候嘗試從 Kotlin 程式碼中使用 C 函式了。呼叫 `accept_fun()` 函式並將 C 函式指標傳遞給 Kotlin lambda：

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

此呼叫使用 Kotlin/Native 中的 `staticCFunction {}` 輔助函式將 Kotlin lambda 函式封裝為 C 函式指標。它只允許未綁定且非捕獲 (non-capturing) 的 lambda 函式。例如，它不能捕獲函式中的局部變數，只能捕獲全局可見的宣告。

請確保該函式不會拋出任何例外。從 `staticCFunction {}` 拋出例外會導致非確定性副作用。

## 從 Kotlin 使用 C 函式指標

下一步是調用從 `supply_fun()` 呼叫返回的 C 函式指標：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.invoke

@OptIn(ExperimentalForeignApi::class)
fun myFun2() {
    val functionFromC = supply_fun() ?: error("No function is returned")

    functionFromC(42)
}
```

Kotlin 會將函式指標的返回型別轉換為可空的 `CPointer<CFunction<>` 物件。您需要先明確檢查 `null`，這就是為什麼在上面的程式碼中使用了 [Elvis 運算子](null-safety.md)。cinterop 工具允許您像呼叫常規 Kotlin 函式一樣呼叫 C 函式指標：`functionFromC(42)`。

## 更新 Kotlin 程式碼

現在您已經看過所有定義，請嘗試在您的專案中使用它們。`hello.kt` 檔案中的程式碼可能如下所示：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.invoke
import kotlinx.cinterop.staticCFunction

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val cFunctionPointer = staticCFunction<Int, Int> { it + 1 }
    accept_fun(cFunctionPointer)

    val funFromC = supply_fun() ?: error("No function is returned")
    funFromC(42)
}
```

為了驗證一切運作正常，請在[您的 IDE 中](native-get-started.md#build-and-run-the-application)執行 `runDebugExecutableNative` Gradle 任務，或使用以下命令執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您將學習字串如何在 Kotlin 和 C 之間進行映射：

**[繼續至下一部分](mapping-strings-from-c.md)**

### 另請參閱

在[與 C 的互通性](native-c-interop.md)文件中了解更多，該文件涵蓋了更進階的場景。