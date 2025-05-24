---
title: "從 C 語言對應函式指標 – 教學"
---
:::info
<p>
   這是 <strong>Kotlin 與 C 對應</strong>教學系列的第三部分。在繼續之前，請確保您已完成之前的步驟。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">對應 C 的基本資料類型（Mapping primitive data types from C）</a><br/>
        <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">對應 C 的結構與聯合類型（Mapping struct and union types from C）</a><br/>
        <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>對應函數指標（Mapping function pointers）</strong><br/>
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">對應 C 的字串（Mapping strings from C）</a><br/>
</p>

:::

:::caution
C 函式庫導入是 [實驗性的（Experimental）](components-stability#stability-levels-explained)。由 cinterop 工具從 C 函式庫產生的所有 Kotlin 宣告都應該具有 `@ExperimentalForeignApi` 註解（annotation）。

與 Kotlin/Native 一起發布的原生平台函式庫（例如 Foundation、UIKit 和 POSIX）僅需要選擇加入（opt-in）某些 API。

:::

讓我們探索哪些 C 函數指標可以從 Kotlin 中看見，並檢驗 Kotlin/Native 和 [多平台（multiplatform）](gradle-configure-project#targeting-multiple-platforms) Gradle 建置的進階 C 互通相關使用案例。

在本教學中，您將：

* [學習如何將 Kotlin 函數作為 C 函數指標傳遞](#pass-kotlin-function-as-a-c-function-pointer)
* [從 Kotlin 中使用 C 函數指標](#use-the-c-function-pointer-from-kotlin)

## 對應 C 的函數指標類型（Mapping function pointer types from C）

為了理解 Kotlin 和 C 之間的對應關係，讓我們宣告兩個函數：一個接受函數指標作為參數，另一個返回函數指標。

在本系列的[第一部分](mapping-primitive-data-types-from-c)中，您已經建立了一個包含必要檔案的 C 函式庫。對於此步驟，請在 `interop.def` 檔案中的 `---` 分隔符號後更新宣告：

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

`interop.def` 檔案提供了編譯、執行或在 IDE 中開啟應用程式所需的一切。

## 檢視為 C 函式庫產生的 Kotlin API（Inspect generated Kotlin APIs for a C library）

讓我們看看 C 函數指標如何對應到 Kotlin/Native，並更新您的專案：

1. 在 `src/nativeMain/kotlin` 中，使用以下內容更新[前一個教學](mapping-struct-union-types-from-c)中的 `hello.kt` 檔案：

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

2. 使用 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   指令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 以導覽至以下為 C 函數產生的 API：

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) `->` kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) `->` kotlin.Int>>? /* from: interop.MyFun? */
   ```

如您所見，C 函數指標在 Kotlin 中使用 `CPointer<CFunction<...>>` 表示。`accept_fun()` 函數接受一個可選的函數指標作為參數，而 `supply_fun()` 則返回一個函數指標。

`CFunction<(Int) `->` Int>` 表示函數簽名，而 `CPointer<CFunction<...>>?` 表示一個可為空的函數指標。所有 `CPointer<CFunction<...>>` 類型都有一個可用的 `invoke` 運算子擴充函數，允許您像呼叫常規 Kotlin 函數一樣呼叫函數指標。

## 將 Kotlin 函數作為 C 函數指標傳遞（Pass Kotlin function as a C function pointer）

現在是時候嘗試從 Kotlin 程式碼中使用 C 函數了。呼叫 `accept_fun()` 函數並將 C 函數指標傳遞給 Kotlin 匿名函數（lambda）：

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

此呼叫使用 Kotlin/Native 中的 `staticCFunction {}` 輔助函數將 Kotlin 匿名函數包裝到 C 函數指標中。它只允許未綁定和非捕獲的匿名函數。例如，它不能從函數中捕獲局部變數，只能捕獲全域可見的宣告。

確保該函數不會拋出任何例外。從 `staticCFunction {}` 拋出例外會導致非確定性的副作用。

## 從 Kotlin 中使用 C 函數指標（Use the C function pointer from Kotlin）

下一步是調用從 `supply_fun()` 呼叫返回的 C 函數指標：

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

Kotlin 將函數指標返回類型轉換為可為空的 `CPointer<CFunction<>` 物件。您需要先顯式檢查 `null`，這就是為什麼在上面的程式碼中使用了 [Elvis 運算子](null-safety)。cinterop 工具允許您像常規 Kotlin 函數呼叫一樣呼叫 C 函數指標：`functionFromC(42)`。

## 更新 Kotlin 程式碼（Update Kotlin code）

現在您已經看到了所有的定義，請嘗試在您的專案中使用它們。
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

若要驗證一切是否按預期工作，請[在您的 IDE 中](native-get-started#build-and-run-the-application)執行 `runDebugExecutableNative` Gradle 任務，或使用以下指令執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步（Next step）

在本系列的下一部分中，您將學習如何在 Kotlin 和 C 之間對應字串：

**[前往下一部分](mapping-strings-from-c)**

### 參見（See also）

在 [與 C 的互通性（Interoperability with C）](native-c-interop) 文件中了解更多資訊，其中涵蓋了更進階的場景。