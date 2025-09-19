[//]: # (title: 從 C 語言映射字串 – 教學)

<tldr>
    <p>這是「<strong>映射 Kotlin 和 C 語言</strong>」教學系列的最後一部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">從 C 語言映射原始資料型別</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">從 C 語言映射結構和聯合型別</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">從 C 語言映射函式指標</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>從 C 語言映射字串</strong><br/>
    </p>
</tldr>

> C 函式庫匯入功能目前處於 [Beta](native-c-interop-stability.md) 階段。所有由 cinterop 工具從 C 函式庫產生的 Kotlin 宣告都應具有 `@ExperimentalForeignApi` 註解。
>
> Kotlin/Native 隨附的原生平台函式庫（例如 Foundation、UIKit 和 POSIX）僅有部分 API 需要選擇啟用。
>
{style="note"}
 
在本系列的最後一部分，我們將探討如何在 Kotlin/Native 中處理 C 語言字串。

在本教學中，您將學習如何：

*   [將 Kotlin 字串傳遞給 C 語言](#pass-kotlin-strings-to-c)
*   [在 Kotlin 中讀取 C 語言字串](#read-c-strings-in-kotlin)
*   [將 C 語言字串位元組接收到 Kotlin 字串中](#receive-c-string-bytes-from-kotlin)

## 處理 C 語言字串

C 語言沒有專用的字串型別。方法簽章或文件可以幫助您識別在特定情境中，給定的 `char *` 是否代表 C 語言字串。

C 語言中的字串是**以 null 終止**的，因此會在位元組序列的末尾添加一個**尾隨的零字元** `\0` 來標記字串的結束。通常使用 [UTF-8 編碼字串](https://en.wikipedia.org/wiki/UTF-8)。UTF-8 編碼使用**變寬字元**並**向後相容** [ASCII](https://en.wikipedia.org/wiki/ASCII)。Kotlin/Native 預設使用 UTF-8 字元編碼。

要了解字串如何在 Kotlin 和 C 語言之間映射，首先建立函式庫標頭檔。
在本系列的 [第一部分](mapping-primitive-data-types-from-c.md) 中，您已經建立了一個包含必要檔案的 C 函式庫。針對此步驟：

1.  使用以下處理 C 語言字串的函式宣告來更新您的 `lib.h` 檔案：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   此範例展示了在 C 語言中傳遞或接收字串的常見方式。請仔細處理 `return_string()` 函式的回傳值。確保您使用正確的 `free()` 函式來釋放回傳的 `char*`。

2.  在 `---` 分隔符號之後，更新 `interop.def` 檔案中的宣告：

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

## 檢查 C 函式庫生成的 Kotlin API

讓我們看看 C 語言字串宣告如何映射到 Kotlin/Native：

1.  在 `src/nativeMain/kotlin` 中，使用以下內容更新您在 [先前教學](mapping-function-pointers-from-c.md) 中的 `hello.kt` 檔案：

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

2.  使用 IntelliJ IDEA 的 [前往宣告](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）導覽到 C 函式的以下生成 API：

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

這些宣告很直觀。在 Kotlin 中，C 語言的 `char *` 指標會映射為參數的 `str: CValuesRef<ByteVarOf>?`，以及回傳型別的 `CPointer<ByteVarOf>?`。Kotlin 將 `char` 型別表示為 `kotlin.Byte`，因為它通常是一個 8 位元的有符號值。

在生成的 Kotlin 宣告中，`str` 被定義為 `CValuesRef<ByteVarOf<Byte>>?`。由於此型別可為 null，您可以將 `null` 作為引數值傳遞。 

## 將 Kotlin 字串傳遞給 C 語言

讓我們嘗試在 Kotlin 中使用該 API。首先呼叫 `pass_string()` 函式：

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

將 Kotlin 字串傳遞給 C 語言非常直接，這要歸功於 `String.cstr` [擴充屬性](extensions.md#extension-properties)。對於涉及 UTF-16 字元的情況，還有 `String.wcstr` 屬性。

## 在 Kotlin 中讀取 C 語言字串

現在，從 `return_string()` 函式取得回傳的 `char *` 並將其轉換為 Kotlin 字串：

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

在這裡，[`.toKString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/to-k-string.html) 擴充函式會將從 `return_string()` 函式回傳的 C 語言字串轉換為 Kotlin 字串。

Kotlin 提供了幾個擴充函式，用於根據編碼將 C 語言的 `char *` 字串轉換為 Kotlin 字串：

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // 標準函式，用於 UTF-8 字串
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // 明確轉換 UTF-8 字串
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // 轉換 UTF-16 編碼字串
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // 轉換 UTF-32 編碼字串
```

## 將 C 語言字串位元組接收到 Kotlin 字串中

這次，使用 `copy_string()` C 函式將 C 語言字串寫入給定的**緩衝區**。它接受兩個引數：一個指向應寫入字串的記憶體位置的指標，以及允許的緩衝區大小。

該函式還應回傳一些內容來指示是否成功或失敗。我們假設 `0` 表示成功，並且提供的緩衝區足夠大：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.addressOf
import kotlinx.cinterop.usePinned

@OptIn(ExperimentalForeignApi::class)
fun sendString() {
    val buf = ByteArray(255)
    buf.usePinned { pinned ->
        if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
            throw Error("Failed to read string from C")
        }
    }

    val copiedStringFromC = buf.decodeToString()
    println("Message from C: $copiedStringFromC")
}
```

在這裡，首先將一個**原生指標**傳遞給 C 函式。 [`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 擴充函式會**暫時釘選**位元組陣列的**原生記憶體位址**。C 函式會用資料**填充**該位元組陣列。另一個擴充函式 `ByteArray.decodeToString()` 會將該位元組陣列轉換為 Kotlin 字串，**假設為 UTF-8 編碼**。 

## 更新 Kotlin 程式碼

既然您已經學習了如何在 Kotlin 程式碼中使用 C 語言宣告，請嘗試在您的專案中使用它們。
最終的 `hello.kt` 檔案中的程式碼可能如下所示：
 
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

    val copyFromC = ByteArray(255).usePinned { pinned ->
        val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
        if (useMe2 != 0) throw Error("Failed to read a string from C")
        pinned.get().decodeToString()
    }

    println(copyFromC)
}
```

為了驗證一切是否按預期運作，請在 [您的 IDE](native-get-started.md) 中執行 `runDebugExecutableNative` Gradle 任務，或使用以下命令執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 接下來

在涵蓋更進階情境的 [與 C 語言的互通性](native-c-interop.md) 文件中了解更多資訊。