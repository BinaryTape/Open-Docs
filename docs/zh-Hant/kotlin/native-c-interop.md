[//]: # (title: 與 C 的互通性)

> C 函式庫匯入處於 [Beta](native-c-interop-stability.md) 階段。所有由 cinterop 工具從 C 函式庫產生的 Kotlin 宣告都應具備 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 附帶的原生平台函式庫（例如 Foundation、UIKit 和 POSIX）僅需針對部分 API 選擇啟用。
>
{style="note"}

本文涵蓋 Kotlin 與 C 互通性的一般層面。Kotlin/Native 附帶一個 cinterop 工具，您可以使用它快速產生與外部 C 函式庫互動所需的一切。

該工具會分析 C 標頭檔，並將 C 類型、函數和字串直接對應到 Kotlin。產生的 stub 隨後可以匯入整合開發環境 (IDE) 中，以啟用程式碼自動完成和導覽功能。

> Kotlin 也提供與 Objective-C 的互通性。Objective-C 函式庫也透過 cinterop 工具匯入。詳情請參閱 [Swift/Objective-C 互通性](native-objc-interop.md)。
>
{style="tip"}

## 設定您的專案

以下是處理需要使用 C 函式庫的專案時的一般工作流程：

1. 建立並設定[定義檔](native-definition-file.md)。它描述了 cinterop 工具應將哪些內容納入 Kotlin [繫結](#bindings)。
2. 設定您的 Gradle 建置檔，以將 cinterop 納入建置程序。
3. 編譯並執行專案以產生最終的可執行檔。

> 如需實際操作體驗，請完成[使用 C 互通性建立應用程式](native-app-with-c-and-libcurl.md)教學課程。
>
{style="note"}

在許多情況下，無需設定與 C 函式庫的自訂互通性。相反地，您可以使用平台上稱為[平台函式庫](native-platform-libs.md)的標準化繫結中提供的 API。例如，Linux/macOS 平台上的 POSIX、Windows 平台上的 Win32 或 macOS/iOS 上的 Apple 框架均可透過這種方式使用。

## 繫結

### 基本互通類型

所有受支援的 C 類型在 Kotlin 中都有對應的表示方式：

*   有符號、無符號整數和浮點類型會對應到相同寬度的 Kotlin 對應類型。
*   指標和陣列會對應到 `CPointer<T>?`。
*   列舉可以對應到 Kotlin 列舉或整數值，具體取決於啟發式方法和[定義檔設定](native-definition-file.md#configure-enums-generation)。
*   結構和聯集會對應到透過點表示法（例如 `someStructInstance.field1`）可存取欄位的類型。
*   `typedef` 會表示為 `typealias`。

此外，任何 C 類型都具有代表該類型左值 (lvalue) 的 Kotlin 類型，亦即，位於記憶體中的值，而非簡單不可變的獨立值。可將 C++ 引用視為類似的概念。對於結構（以及 `typedef` 到結構的類型），此表示方式是主要的，並與結構本身具有相同的名稱。對於 Kotlin 列舉，它被命名為 `${type}.Var`；對於 `CPointer<T>`，它被命名為 `CPointerVar<T>`；而對於大多數其他類型，它被命名為 `${type}Var`。

對於同時具有兩種表示方式的類型，具有左值的類型具有可變的 `.value` 屬性用於存取值。

#### 指標類型

`CPointer<T>` 的類型引數 `T` 必須是上述左值類型之一。例如，C 類型 `struct S*` 會對應到 `CPointer<S>`，`int8_t*` 會對應到 `CPointer<int_8tVar>`，而 `char**` 會對應到 `CPointer<CPointerVar<ByteVar>>`。

C null 指標表示為 Kotlin 的 `null`，且指標類型 `CPointer<T>` 不可為 null，但 `CPointer<T>?` 可以。此類型的值支援所有與處理 `null` 相關的 Kotlin 操作，例如 `?:`、`?.`、`!!` 等：

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

由於陣列也對應到 `CPointer<T>`，因此它支援 `[]` 運算子，用於透過索引存取值：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` 的 `.pointed` 屬性會回傳此指標指向的 `T` 類型左值。反向操作是 `.ptr`，它接受左值並回傳指向該左值的指標。

`void*` 會對應到 `COpaquePointer` – 這是一種特殊指標類型，是任何其他指標類型的超類型。因此，如果 C 函數接受 `void*`，則 Kotlin 繫結會接受任何 `CPointer`。

指標（包括 `COpaquePointer`）的型別轉換可以使用 `.reinterpret<T>` 完成，例如：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr = bytePtr.reinterpret<IntVar>()
```

或者：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr: CPointer<IntVar> = bytePtr.reinterpret()
```

如同 C 語言，這些 `.reinterpret` 型別轉換是不安全的，可能導致應用程式中出現微妙的記憶體問題。

此外，`CPointer<T>?` 和 `Long` 之間還存在不安全的型別轉換，由 `.toLong()` 和 `.toCPointer<T>()` 擴充方法提供：

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 如果結果的類型從上下文可知，您可以利用類型推斷來省略類型引數。
>
{style="tip"}

### 記憶體配置

原生記憶體可以使用 `NativePlacement` 介面進行配置，例如：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

val placement: NativePlacement = // 請參閱下方配置範例
val byteVar = placement.alloc<ByteVar>()
val bytePtr = placement.allocArray<ByteVar>(5)
```

最合理的配置是在 `nativeHeap` 物件中。它對應於使用 `malloc` 配置原生記憶體，並提供額外的 `.free()` 操作來釋放已配置的記憶體：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap` 需要手動釋放記憶體。然而，將記憶體配置為繫結到詞法作用域的生命週期通常很有用。如果此類記憶體能自動釋放，將會有所幫助。

為了解決這個問題，您可以使用 `memScoped { }`。在花括號內，臨時配置可作為隱式接收者使用，因此可以使用 alloc 和 allocArray 配置原生記憶體，並且配置的記憶體在離開作用域後將會自動釋放。

例如，可以像這樣使用透過指標參數回傳值的 C 函數：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*
import platform.posix.*

val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### 將指標傳遞給繫結

儘管 C 指標會對應到 `CPointer<T>` 類型，但 C 函數指標類型參數會對應到 `CValuesRef<T>`。當將 `CPointer<T>` 作為此類參數的值傳遞時，它會按原樣傳遞給 C 函數。然而，可以傳遞值序列而非指標。在這種情況下，序列會「按值」傳遞，亦即 C 函數會收到該序列臨時副本的指標，該指標僅在函數回傳前有效。

指標參數的 `CValuesRef<T>` 表示旨在支援 C 陣列字面值，而無需顯式原生記憶體配置。為了建構不可變的獨立 C 值序列，提供了以下方法：

*   `${type}Array.toCValues()`，其中 `type` 是 Kotlin 基本類型
*   `Array<CPointer<T>?>.toCValues()`, `List<CPointer<T>?>.toCValues()`
*   `cValuesOf(vararg elements: ${type})`，其中 `type` 是基本類型或指標

例如：

```c
// C:
void foo(int* elements, int count);
...
int elements[] = {1, 2, 3};
foo(elements, 3);
```

```kotlin
// Kotlin:

foo(cValuesOf(1, 2, 3), 3)
```

### 字串

與其他指標不同，類型為 `const char*` 的參數會表示為 Kotlin `String`。因此，可以將任何 Kotlin 字串傳遞給預期 C 字串的繫結。

還有一些可用工具可以手動在 Kotlin 和 C 字串之間轉換：

*   `fun CPointer<ByteVar>.toKString(): String`
*   `val String.cstr: CValuesRef<ByteVar>`.

要獲取指標，`.cstr` 應配置在原生記憶體中，例如：

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

在所有情況下，C 字串都應編碼為 UTF-8。

若要跳過自動轉換並確保在繫結中使用原始指標，請將 [`noStringConversion` 屬性](native-definition-file.md#set-up-string-conversion)新增到 `.def` 檔：

```c
noStringConversion = LoadCursorA LoadCursorW
```

這樣，任何 `CPointer<ByteVar>` 類型的值都可以作為 `const char*` 類型的引數傳遞。如果應傳遞 Kotlin 字串，則可以使用以下程式碼：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // 適用於 ASCII 或 UTF-8 版本
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // 適用於 UTF-16 版本
}
```

### 作用域局部指標

可以使用 `CValues<T>.ptr` 擴充屬性，在 `memScoped {}` 範圍內為 `CValues<T>` 實例建立 C 表示的作用域穩定指標。它允許使用需要 C 指標且其生命週期繫結到特定 `MemScope` 的 API。例如：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value -> items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    // ...
}
```

在此範例中，傳遞給 C API `new_menu()` 的所有值都具有其所屬最內層 `memScope` 的生命週期。一旦控制流離開 `memScoped` 作用域，C 指標就會變得無效。

### 按值傳遞和接收結構

當 C 函數按值接受或回傳結構/聯集 `T` 時，相應的引數類型或回傳類型會表示為 `CValue<T>`。

`CValue<T>` 是一個不透明類型，因此無法使用適當的 Kotlin 屬性存取結構欄位。如果 API 將結構用作不透明句柄，這可能沒問題。但是，如果需要欄位存取，則可以使用以下轉換方法：

*   [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
    會將 (左值) `T` 轉換為 `CValue<T>`。因此，要建構 `CValue<T>`，`T` 可以先配置、填充，然後轉換為 `CValue<T>`。
*   [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
    會將 `CValue<T>` 暫時儲存在記憶體中，然後以這個已放置的值 `T` 作為接收者執行傳遞的 lambda。
    因此，要讀取單個欄位，可以使用以下程式碼：

    ```kotlin
    val fieldValue = structValue.useContents { field }
    ```
    
*   [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
    會應用提供的 `initialize` 函數在記憶體中配置 `T`，並將結果轉換為 `CValue<T>`。
*   [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
    會建立現有 `CValue<T>` 的修改副本。原始值會被放置在記憶體中，使用 `modify()` 函數進行修改，然後轉換回新的 `CValue<T>`。
*   [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
    會將 `CValues<T>` 放置到 `AutofreeScope` 中，回傳指向已配置記憶體的指標。當 `AutofreeScope` 被處置時，已配置的記憶體將會自動釋放。

### 回呼

要將 Kotlin 函數轉換為指向 C 函數的指標，可以使用 `staticCFunction(::kotlinFunction)`。也可以提供 lambda 而非函數引用。函數或 lambda 不得捕獲任何值。

#### 將使用者資料傳遞給回呼

C API 通常允許將一些使用者資料傳遞給回呼。這些資料通常由使用者在設定回呼時提供。例如，它會作為 `void*` 傳遞給某些 C 函數（或寫入結構）。然而，Kotlin 物件的引用無法直接傳遞給 C。因此，在設定回呼之前需要進行包裝，然後在回呼本身中解包，以便安全地從 Kotlin 透過 C 世界傳遞到 Kotlin。這種包裝可以使用 `StableRef` 類別實現。

要包裝引用：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

在這裡，`voidPtr` 是一個 `COpaquePointer`，可以傳遞給 C 函數。

要解包引用：

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

在這裡，`kotlinReference` 是原始的包裝引用。

建立的 `StableRef` 最終應使用 `.dispose()` 方法手動處置，以防止記憶體洩漏：

```kotlin
stableRef.dispose()
```

之後它會變得無效，因此 `voidPtr` 無法再解包。

### 巨集

每個擴展為常數的 C 巨集都會表示為 Kotlin 屬性。

在編譯器可以推斷類型的情況下，支援沒有參數的巨集：

```c
int foo(int);
#define FOO foo(42)
```

在這種情況下，`FOO` 在 Kotlin 中可用。

要支援其他巨集，您可以透過將它們包裝在支援的宣告中來手動公開它們。例如，函式式巨集 `FOO` 可以透過[將自訂宣告新增](native-definition-file.md#add-custom-declarations)到函式庫中，將其公開為函數 `foo()`：

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 可攜性

有時 C 函式庫具有平台相關類型的函數參數或結構欄位，例如 `long` 或 `size_t`。Kotlin 本身不提供隱式整數型別轉換或 C 風格整數型別轉換（例如 `(size_t) intValue`），因此為了在此類情況下更容易編寫可攜式程式碼，提供了 `convert` 方法：

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

在這裡，`type1` 和 `type2` 都必須是整數類型，無論是有符號還是無符號。

`.convert<${type}>` 與 `.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、`.toUShort`、`.toUInt` 或 `.toULong` 方法之一具有相同的語義，具體取決於 `type`。

使用 `convert` 的範例：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

此外，類型參數可以自動推斷，因此在某些情況下可以省略。

### 物件釘選

Kotlin 物件可以被釘選，亦即它們在記憶體中的位置保證穩定，直到被解除釘選為止，並且指向此類物件內部資料的指標可以傳遞給 C 函數。

有幾種方法可以採用：

*   使用 [`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 擴充函數，該函數會釘選物件，執行區塊，並在正常和例外路徑上解除釘選：

    ```kotlin
    import kotlinx.cinterop.*
    import platform.posix.*

    @OptIn(ExperimentalForeignApi::class)
    fun readData(fd: Int) {
        val buffer = ByteArray(1024)
        buffer.usePinned { pinned ->
            while (true) {
                val length = recv(fd, pinned.addressOf(0), buffer.size.convert(), 0).toInt()
                if (length <= 0) {
                    break
                }
                // 現在 `buffer` 具有從 `recv()` 呼叫中取得的原始資料。
            }
        }
    }
    ```

    在這裡，`pinned` 是 `Pinned<T>` 特殊類型的物件。它提供了有用的擴充功能，例如 [`.addressOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/address-of.html)，允許取得釘選陣列主體的位址。

*   使用 [`.refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 擴充函數，它在內部具有類似的功能，但在某些情況下可以幫助您減少樣板程式碼：

    ```kotlin
    import kotlinx.cinterop.*
    import platform.posix.*
        
    @OptIn(ExperimentalForeignApi::class)
    fun readData(fd: Int) { 
        val buffer = ByteArray(1024)
        while (true) {
            val length = recv(fd, buffer.refTo(0), buffer.size.convert(), 0).toInt()

            if (length <= 0) {
                break
            }
            // 現在 `buffer` 具有從 `recv()` 呼叫中取得的原始資料。
        }
    }
    ```

    在這裡，`buffer.refTo(0)` 具有 `CValuesRef` 類型，它會在進入 `recv()` 函數之前釘選陣列，將其第零個元素的位址傳遞給函數，並在退出後解除釘選陣列。

### 前置宣告

要匯入前置宣告，請使用 `cnames` 套件。例如，要匯入在具有 `library.package` 的 C 函式庫中宣告的 `cstructName` 前置宣告，請使用特殊的前置宣告套件：`import cnames.structs.cstructName`。

考慮兩個 cinterop 函式庫：一個具有結構的前置宣告，另一個在不同套件中具有實際實作：

```C
// 第一個 C 函式庫
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```C
// 第二個 C 函式庫
// 標頭檔:
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// 實作:
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

要在兩個函式庫之間傳輸物件，請在您的 Kotlin 程式碼中使用顯式 `as` 轉換：

```kotlin
// Kotlin 程式碼:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 接下來

透過完成以下教學課程，了解類型、函數和字串如何在 Kotlin 和 C 之間對應：

*   [從 C 對應基本資料類型](mapping-primitive-data-types-from-c.md)
*   [從 C 對應結構和聯集類型](mapping-struct-union-types-from-c.md)
*   [從 C 對應函數指標](mapping-function-pointers-from-c.md)
*   [從 C 對應字串](mapping-strings-from-c.md)