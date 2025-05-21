---
title: "從 C 語言對應字串 – 教學"
---
:::info
<p>
   這是<strong>Kotlin 與 C 對應</strong>教學系列的最後一部分。在繼續之前，請確保您已完成之前的步驟。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">對應 C 的基本資料型別 (Mapping primitive data types from C)</a><br/>
        <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">對應 C 的結構和聯合型別 (Mapping struct and union types from C)</a><br/>
      <img src="/img/icon-3-done.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">對應函數指標 (Mapping function pointers)</a><br/>
      <img src="/img/icon-4.svg" width="20" alt="Fourth step"/> <strong>對應 C 的字串 (Mapping strings from C)</strong><br/>
</p>

:::

:::caution
C 程式庫匯入是 [實驗性 (Experimental)](components-stability#stability-levels-explained)。由 cinterop 工具從 C 程式庫產生的所有 Kotlin 宣告都應該具有 `@ExperimentalForeignApi` 註釋 (annotation)。

與 Kotlin/Native 一起提供的原生平台程式庫（例如 Foundation、UIKit 和 POSIX）僅需要選擇加入某些 API。

:::
 
在本系列的最後一部分中，讓我們看看如何在 Kotlin/Native 中處理 C 字串。

在本教學中，您將學習如何：

* [將 Kotlin 字串傳遞給 C](#pass-kotlin-strings-to-c)
* [在 Kotlin 中讀取 C 字串](#read-c-strings-in-kotlin)
* [將 C 字串位元組接收到 Kotlin 字串中](#receive-c-string-bytes-from-kotlin)

## 使用 C 字串 (Working with C strings)

C 沒有專用的字串類型。方法簽章或文件可以幫助您識別給定的 `char *` 在特定上下文中是否表示 C 字串。

C 語言中的字串以 null 結尾，因此在位元組序列的末尾添加一個尾隨零字元 `\0` 以標記字串的結尾。通常，使用 [UTF-8 編碼字串](https://en.wikipedia.org/wiki/UTF-8)。UTF-8 編碼使用可變寬度字元，並且與 [ASCII](https://en.wikipedia.org/wiki/ASCII) 向後相容。Kotlin/Native 預設使用 UTF-8 字元編碼。

為了理解字串如何在 Kotlin 和 C 之間對應，首先建立程式庫標頭。在 [本系列的第一部分](mapping-primitive-data-types-from-c) 中，您已經建立了一個包含必要檔案的 C 程式庫。對於此步驟：

1. 使用以下處理 C 字串的函數宣告來更新您的 `lib.h` 檔案：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   此範例顯示了在 C 語言中傳遞或接收字串的常用方法。小心處理 `return_string()` 函數的傳回值。確保您使用正確的 `free()` 函數來釋放傳回的 `char*`。

2. 在 `---` 分隔符號後更新 `interop.def` 檔案中的宣告：

   ```c
   ---
   
   void pass_string(char* str) {
   }
   
   char* return_string() {
     return "C string";
   }
   
   int copy_string(char* str, int size) {
       *str++ = 'C';
       *str++ = ' ';
       *str++ = 'K';
       *str++ = '/';
       *str++ = 'N';
       *str++ = 0;
       return 0;
   }
   ```

`interop.def` 檔案提供了在 IDE 中編譯、執行或開啟應用程式所需的一切。

## 檢查 C 程式庫產生的 Kotlin API (Inspect generated Kotlin APIs for a C library)

讓我們看看 C 字串宣告如何對應到 Kotlin/Native：

1. 在 `src/nativeMain/kotlin` 中，使用 [先前的教學](mapping-function-pointers-from-c) 中的以下內容更新您的 `hello.kt` 檔案：

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi
  
   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")

       pass_string(/*fix me*/)
       val useMe = return_string()
       val useMe2 = copy_string(/*fix me*/)
   }
   ```

2. 使用 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 以導覽至以下為 C 函數產生的 API：

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

這些宣告很簡單。在 Kotlin 中，C `char *` 指標對應到 `str: CValuesRef<ByteVarOf>?` 作為參數，對應到 `CPointer<ByteVarOf>?` 作為傳回類型。Kotlin 將 `char` 類型表示為 `kotlin.Byte`，因為它通常是一個 8 位元帶符號值。

在產生的 Kotlin 宣告中，`str` 被定義為 `CValuesRef<ByteVarOf<Byte>>?`。由於此類型可為 null，因此您可以傳遞 `null` 作為引數值。

## 將 Kotlin 字串傳遞給 C (Pass Kotlin strings to C)

讓我們嘗試從 Kotlin 使用 API。首先呼叫 `pass_string()` 函數：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cstr

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val str = "This is a Kotlin string"
    pass_string(str.cstr)
}
```

由於 `String.cstr` [擴充屬性 (extension property)](extensions#extension-properties)，將 Kotlin 字串傳遞給 C 非常簡單。對於涉及 UTF-16 字元的情況，還有 `String.wcstr` 屬性。

## 在 Kotlin 中讀取 C 字串 (Read C strings in Kotlin)

現在從 `return_string()` 函數中取得傳回的 `char *`，並將其轉換為 Kotlin 字串：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.toKString

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val stringFromC = return_string()?.toKString()

    println("Returned from C: $stringFromC")
}
```

在這裡，`.toKString()` 擴充函數將從 `return_string()` 函數傳回的 C 字串轉換為 Kotlin 字串。

Kotlin 提供了多個擴充函數，用於將 C `char *` 字串轉換為 Kotlin 字串，具體取決於編碼：

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // 用於 UTF-8 字串的標準函數 (Standard function for UTF-8 strings)
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // 明確轉換 UTF-8 字串 (Explicitly converts UTF-8 strings)
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // 轉換 UTF-16 編碼字串 (Converts UTF-16 encoded strings)
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // 轉換 UTF-32 編碼字串 (Converts UTF-32 encoded strings)
```

## 從 Kotlin 接收 C 字串位元組 (Receive C string bytes from Kotlin)

這次，使用 `copy_string()` C 函數將 C 字串寫入給定的緩衝區。它採用兩個引數：指向應寫入字串的記憶體位置的指標，以及允許的緩衝區大小。

該函數還應該傳回一些內容來指示它是否成功或失敗。讓我們假設 `0` 表示它成功了，並且提供的緩衝區足夠大：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.addressOf
import kotlinx.cinterop.usePinned

@OptIn(ExperimentalForeignApi::class)
fun sendString() {
    val buf = ByteArray(255)
    buf.usePinned { pinned `->`
        if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
            throw Error("Failed to read string from C")
        }
    }

    val copiedStringFromC = buf.decodeToString()
    println("Message from C: $copiedStringFromC")
}
```

在這裡，首先將原生指標傳遞給 C 函數。`.usePinned` 擴充函數暫時固定位元組陣列的原生記憶體位址。C 函數用資料填寫位元組陣列。另一個擴充函數 `ByteArray.decodeToString()` 假設使用 UTF-8 編碼，將位元組陣列轉換為 Kotlin 字串。

## 更新 Kotlin 程式碼 (Update Kotlin code)

現在您已經學習瞭如何在 Kotlin 程式碼中使用 C 宣告，請嘗試在您的專案中使用它們。最終 `hello.kt` 檔案中的程式碼可能如下所示：
 
```kotlin
import interop.*
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val str = "This is a Kotlin string"
    pass_string(str.cstr)

    val useMe = return_string()?.toKString() ?: error("null pointer returned")
    println(useMe)

    val copyFromC = ByteArray(255).usePinned { pinned `->`
        val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
        if (useMe2 != 0) throw Error("Failed to read a string from C")
        pinned.get().decodeToString()
    }

    println(copyFromC)
}
```

為了驗證一切是否按預期工作，[在您的 IDE](native-get-started) 中執行 `runDebugExecutableNative` Gradle 任務，或使用以下命令執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 接下來是什麼 (What's next)

在 [與 C 的互通性 (Interoperability with C)](native-c-interop) 文件中了解更多資訊，該文件涵蓋了更進階的場景。