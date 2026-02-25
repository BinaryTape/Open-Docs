[//]: # (title: 對應來自 C 的函式指標 – 教學)

<tldr>
    <p>這是<strong>對應 Kotlin 與 C</strong> 教學系列的第三部分。在繼續之前，請確保你已完成之前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">對應來自 C 的原始資料型別</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">對應來自 C 的結構 (struct) 與等位 (union) 型別</a><br/>
        <img src="icon-3.svg" width="20" alt="第三步"/> <strong>對應來自 C 的函式指標</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="第四步"/> <a href="mapping-strings-from-c.md">對應來自 C 的字串</a><br/>
    </p>
</tldr>

> C 程式庫匯入目前處於 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 階段。所有由 cinterop 工具從 C 程式庫產生的 Kotlin 宣告都應具有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台程式庫（如 Foundation、UIKit 和 POSIX）僅針對部分 API 需要選擇性加入 (opt-in)。
>
{style="note"}

讓我們探索從 Kotlin 中可以看到哪些 C 函式指標，並查看與 Kotlin/Native 和[多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 組建相關的高階 C 互通使用案例。

在本教學中，你將：

* [了解如何將 Kotlin 函式作為 C 函式指標傳遞](#pass-kotlin-function-as-a-c-function-pointer)
* [在 Kotlin 中使用 C 函式指標](#use-the-c-function-pointer-from-kotlin)

## 對應來自 C 的函式指標型別

為了理解 Kotlin 與 C 之間的對應關係，我們宣告兩個函式：一個接受函式指標作為參數，另一個則回傳函式指標。

在[本系列的第一部分](mapping-primitive-data-types-from-c.md)中，你已經建立了一個包含必要檔案的 C 程式庫。在此步驟中，請更新 `interop.def` 檔案中 `---` 分隔線後的宣告：

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

## 檢查為 C 程式庫產生的 Kotlin API

讓我們看看 C 函式指標如何對應到 Kotlin/Native 並更新你的專案：

1. 在 `src/nativeMain/kotlin` 中，使用以下內容更新[前一個教學](mapping-struct-union-types-from-c.md)中的 `hello.kt` 檔案：

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

2. 使用 IntelliJ IDEA 的[跳轉到宣告](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)指令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 導覽至以下產生的 C 函式 API：

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
   ```

如你所見，C 函式指標在 Kotlin 中使用 `CPointer<CFunction<...>>` 來表示。`accept_fun()` 函式接受一個可為 null 的函式指標作為參數，而 `supply_fun()` 則回傳一個函式指標。

`CFunction<(Int) -> Int>` 代表函式簽章，而 `CPointer<CFunction<...>>?` 代表一個可為 null 的函式指標。所有 `CPointer<CFunction<...>>` 型別都有一個可用的 [`.invoke()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/invoke.html) 運算子擴充方法，讓你可以像呼叫一般 Kotlin 函式一樣呼叫函式指標。

## 將 Kotlin 函式作為 C 函式指標傳遞

現在來嘗試在 Kotlin 程式碼中使用 C 函式。呼叫 `accept_fun()` 函式並將 C 函式指標傳遞給 Kotlin Lambda：

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

此呼叫使用 Kotlin/Native 的 `staticCFunction {}` 輔助函式，將 Kotlin Lambda 函式包裝成 C 函式指標。它僅允許未繫結 (unbound) 且非擷取 (non-capturing) 的 Lambda 函式。例如，它不能從函式中擷取區域變數，只能擷取全域可見的宣告。

請確保該函式不會拋出任何例外。從 `staticCFunction {}` 中拋出例外會導致非確定性的副作用。

## 在 Kotlin 中使用 C 函式指標

下一步是呼叫從 `supply_fun()` 呼叫中回傳的 C 函式指標：

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

Kotlin 會將函式指標回傳型別轉換為可為 null 的 `CPointer<CFunction<>>` 物件。你必須先明確檢查 `null`，這就是為什麼在上面的程式碼中使用了 [Elvis 運算子](null-safety.md)。cinterop 工具允許你像一般的 Kotlin 函式呼叫一樣呼叫 C 函式指標：`functionFromC(42)`。

## 更新 Kotlin 程式碼

現在你已經看過所有的定義，請嘗試在你的專案中使用它們。`hello.kt` 檔案中的程式碼可能如下所示：

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

要驗證一切是否如預期運作，請[在你的 IDE 中](native-get-started.md#build-and-run-the-application)執行 `runDebugExecutableNative` Gradle 任務，或使用以下指令來執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，你將學習如何在 Kotlin 和 C 之間對應字串：

**[繼續前往下一部分](mapping-strings-from-c.md)**

### 延伸閱讀

在 [與 C 互通](native-c-interop.md) 文件中了解更多資訊，該文件涵蓋了更進階的情境。