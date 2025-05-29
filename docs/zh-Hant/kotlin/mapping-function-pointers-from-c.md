[//]: # (title: 將 C 語言的函式指標映射至 Kotlin – 教程)

<tldr>
    <p>這是 **Kotlin 與 C 語言映射** 系列教程的第三部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">將 C 語言的基本資料型別映射至 Kotlin</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">將 C 語言的結構體與聯合體型別映射至 Kotlin</a><br/>
        <img src="icon-3.svg" width="20" alt="第三步"/> <strong>映射函式指標</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="第四步"/> <a href="mapping-strings-from-c.md">將 C 語言的字串映射至 Kotlin</a><br/>
    </p>
</tldr>

> C 函式庫匯入是 [實驗性 (Experimental)](components-stability.md#stability-levels-explained) 功能。所有由 cinterop 工具從 C 函式庫生成的 Kotlin 宣告
> 都應帶有 `@ExperimentalForeignApi` 註解。
>
> Kotlin/Native 附帶的原生平台函式庫（例如 Foundation、UIKit 和 POSIX）
> 僅部分 API 需要選擇啟用 (opt-in)。
>
{style="warning"}

讓我們來探索哪些 C 函式指標在 Kotlin 中可見，並檢視 Kotlin/Native 與
[多平台 (multiplatform)](gradle-configure-project.md#targeting-multiple-platforms) Gradle 建構中，C 語言互通 (interop) 相關的進階使用案例。

在本教程中，您將：

* [學習如何將 Kotlin 函式作為 C 函式指標傳遞](#pass-kotlin-function-as-a-c-function-pointer)
* [在 Kotlin 中使用 C 函式指標](#use-the-c-function-pointer-from-kotlin)

## 將 C 語言的函式指標型別映射至 Kotlin

為了解 Kotlin 與 C 之間的映射關係，讓我們宣告兩個函式：一個接受函式指標作為參數，
另一個則返回一個函式指標。

在本系列的[第一部分](mapping-primitive-data-types-from-c.md)中，您已經建立了一個帶有必要檔案的 C 函式庫。
對於這一步驟，請在 `---` 分隔符號之後，更新 `interop.def` 檔案中的宣告：

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

## 檢查為 C 函式庫生成的 Kotlin API

讓我們看看 C 函式指標如何映射到 Kotlin/Native 中，並更新您的專案：

1. 在 `src/nativeMain/kotlin` 中，更新您來自[前一個教程](mapping-struct-union-types-from-c.md)的 `hello.kt` 檔案，
   其內容如下：

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

2. 使用 IntelliJ IDEA 的 [前往宣告 (Go to declaration)](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）導航到以下為 C 函式生成的 API：

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
   ```

如您所見，C 函式指標在 Kotlin 中使用 `CPointer<CFunction<...>>` 來表示。`accept_fun()` 函式
接受一個可選的函式指標作為參數，而 `supply_fun()` 則返回一個函式指標。

`CFunction<(Int) -> Int>` 代表函式簽章 (function signature)，而 `CPointer<CFunction<...>>?` 則代表一個可為空 (nullable) 的
函式指標。所有 `CPointer<CFunction<...>>` 型別都提供了一個 `invoke` 運算子擴充函式 (operator extension function)，
讓您可以像呼叫常規 Kotlin 函式一樣呼叫函式指標。

## 將 Kotlin 函式作為 C 函式指標傳遞

是時候嘗試從 Kotlin 程式碼中使用 C 函式了。呼叫 `accept_fun()` 函式並將 C 函式指標傳遞給
一個 Kotlin lambda 函式：

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

此呼叫使用 Kotlin/Native 中的 `staticCFunction {}` 輔助函式 (helper function) 將 Kotlin lambda 函式包裝成 C
函式指標。它只允許無繫結 (unbound) 和非捕獲 (non-capturing) 的 lambda 函式。例如，它無法捕獲函式中的局部變數，
只能捕獲全域可見的宣告。

確保該函式不會拋出任何例外。從 `staticCFunction {}` 拋出例外
會導致非確定性副作用。

## 在 Kotlin 中使用 C 函式指標

下一步是呼叫從 `supply_fun()` 呼叫返回的 C 函式指標：

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

Kotlin 會將函式指標的返回型別轉換為一個可為空 (nullable) 的 `CPointer<CFunction<>>` 物件。您需要先明確地
檢查 `null`，這就是為什麼在上面的程式碼中使用了 [Elvis 運算子 (Elvis operator)](null-safety.md)。
cinterop 工具允許您像呼叫常規 Kotlin 函式一樣呼叫 C 函式指標：`functionFromC(42)`。

## 更新 Kotlin 程式碼

既然您已經看到了所有定義，請嘗試在您的專案中使用它們。
`hello.kt` 檔案中的程式碼可能如下所示：

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

為驗證一切運作正常，請[在您的 IDE 中](native-get-started.md#build-and-run-the-application)執行 `runDebugExecutableNative` Gradle 任務
或使用以下命令執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您將學習字串如何在 Kotlin 與 C 之間映射：

**[繼續前往下一部分](mapping-strings-from-c.md)**

### 另請參閱

在涵蓋更多進階情境的 [C 語言互通性 (Interoperability with C)](native-c-interop.md) 文件中了解更多。