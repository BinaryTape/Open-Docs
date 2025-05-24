---
title: "與 C 的互通性"
---
:::note
C 函式庫的匯入為 [實驗性質](components-stability#stability-levels-explained)。
所有由 cinterop 工具從 C 函式庫產生的 Kotlin 宣告都應該具有 `@ExperimentalForeignApi` 註解。

Kotlin/Native 隨附的原生平台函式庫（例如 Foundation、UIKit 和 POSIX）
僅需要針對某些 API 選擇啟用。

本文檔涵蓋 Kotlin 與 C 互通性的一般方面。 Kotlin/Native 隨附一個 cinterop 工具，
您可以使用它來快速產生與外部 C 函式庫互動所需的一切。

該工具會分析 C 標頭，並將 C 類型、函式和常數直接對應到 Kotlin 中。
然後，可以將產生的 Stub 匯入到 IDE 中，以啟用程式碼完成和導覽功能。

Kotlin 也提供與 Objective-C 的互通性。 Objective-C 函式庫也透過 cinterop 工具匯入。
如需更多詳細資訊，請參閱 [Swift/Objective-C 互通性](native-objc-interop)。

## 設定專案

以下是使用需要取用 C 函式庫的專案時的一般工作流程：

1. 建立並設定一個[定義檔](native-definition-file)。 它描述了 cinterop 工具應該
   包含到 Kotlin [綁定](#bindings)中的內容。
2. 設定您的 Gradle 組建檔案，以在組建過程中包含 cinterop。
3. 編譯並執行專案以產生最終可執行檔。

若要獲得實作經驗，請完成[使用 C 互通性建立應用程式](native-app-with-c-and-libcurl)教學課程。

:::

在許多情況下，不需要設定與 C 函式庫的自訂互通性。 相反，您可以使用平台上可用的 API 標準化綁定，稱為[平台函式庫](native-platform-libs)。 例如，
Linux/macOS 平台上的 POSIX、Windows 平台上的 Win32 或 macOS/iOS 上的 Apple framework 都可以透過這種方式使用。

## 綁定（Bindings）

### 基本互通類型

所有支援的 C 類型在 Kotlin 中都有對應的表示形式：

* 帶正負號、不帶正負號的整數和浮點類型會對應到 Kotlin 中具有相同寬度的對應類型。
* 指標和陣列會對應到 `CPointer<T>?`。
* 列舉可以對應到 Kotlin 列舉或整數值，具體取決於啟發式方法和
  [定義檔設定](native-definition-file#configure-enums-generation)。
* 結構和聯合會對應到具有欄位的類型，這些欄位可透過點表示法存取，即 `someStructInstance.field1`。
* `typedef` 表示為 `typealias`。

此外，任何 C 類型都有 Kotlin 類型，表示此類型的左值，即位於記憶體中的值，而不是
一個簡單的不可變的獨立值。 可以將 C++ 參考視為類似的概念。 對於結構（和 `typedef` 到結構），此表示形式是主要的表示形式，並且與結構本身具有相同的名稱。 對於 Kotlin 列舉，它被命名為 `${type}.Var`；對於 `CPointer<T>`，它是 `CPointerVar<T>`；對於大多數其他類型，它是 `${type}Var`。

對於同時具有兩種表示形式的類型，具有左值的類型具有可變的 `.value` 屬性，用於存取該值。

#### 指標類型

`CPointer<T>` 的類型引數 `T` 必須是上述其中一種左值類型。 例如，C 類型
`struct S*` 會對應到 `CPointer<S>`，`int8_t*` 會對應到 `CPointer<int_8tVar>`，而 `char**` 會對應到
`CPointer<CPointerVar<ByteVar>>`。

C 的 null 指標表示為 Kotlin 的 `null`，並且指標類型 `CPointer<T>` 不可為 null，但
`CPointer<T>?` 可以為 null。 此類型的值支援所有與處理 `null` 相關的 Kotlin 運算，例如
`?:`、`?.`、`!!` 等：

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

由於陣列也對應到 `CPointer<T>`，因此它支援 `[]` 運算子，用於按索引存取值：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` 的 `.pointed` 屬性會傳回此指標指向的類型 `T` 的左值。 反向運算
是 `.ptr`，它會採用左值並傳回指向它的指標。

`void*` 會對應到 `COpaquePointer` – 一種特殊的指標類型，它是任何其他指標類型的超類型。
因此，如果 C 函式採用 `void*`，則 Kotlin 綁定會接受任何 `CPointer`。

轉換指標（包括 `COpaquePointer`）可以使用 `.reinterpret<T>` 來完成，例如：

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

與 C 一樣，這些 `.reinterpret` 轉換是不安全的，並且可能會導致應用程式中出現微妙的記憶體問題。

此外，`CPointer<T>?` 和 `Long` 之間也存在不安全的轉換，由 `.toLong()` 和 `.toCPointer<T>()` 提供
擴充方法：

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

:::tip
如果從上下文中知道結果的類型，則可以省略類型引數，這要歸功於類型推斷。

:::

### 記憶體分配

可以使用 `NativePlacement` 介面來分配原生記憶體，例如：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val byteVar = placement.alloc<ByteVar>()
```

或者：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val bytePtr = placement.allocArray<ByteVar>(5)
```

最符合邏輯的放置位置是在物件 `nativeHeap` 中。 它對應於使用 `malloc` 分配原生記憶體，並且
提供額外的 `.free()` 運算來釋放已分配的記憶體：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap` 需要手動釋放記憶體。 但是，分配具有綁定到詞法範圍的生命週期的記憶體通常很有用。 如果自動釋放此類記憶體，則會很有幫助。

為了處理這個問題，您可以使用 `memScoped { }`。 在大括號內，臨時放置位置可用作隱式
接收器，因此可以使用 alloc 和 allocArray 分配原生記憶體，並且分配的記憶體將在離開範圍後自動釋放。

例如，C 函式透過指標參數傳回值可以像這樣使用：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### 將指標傳遞給綁定

雖然 C 指標對應到 `CPointer<T> type`，但 C 函式指標類型的參數會對應到
`CValuesRef<T>.` 當傳遞 `CPointer<T>` 作為此類參數的值時，它會按原樣傳遞給 C 函式。
但是，可以傳遞一系列值而不是指標。 在這種情況下，該序列是「按值」傳遞的，即
C 函式接收指向該序列的臨時副本的指標，該指標僅在函式傳回之前有效。

指標參數的 `CValuesRef<T>` 表示形式旨在支援 C 陣列文字，而無需顯式原生
記憶體分配。 為了建構 C 值的不變獨立序列，提供了以下方法：

* `${type}Array.toCValues()`，其中 `type` 是 Kotlin 原始類型
* `Array<CPointer<T>?>.toCValues()`、`List<CPointer<T>?>.toCValues()`
* `cValuesOf(vararg elements: ${type})`，其中 `type` 是原始類型或指標

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

與其他指標不同，類型為 `const char*` 的參數表示為 Kotlin `String`。 因此可以
將任何 Kotlin 字串傳遞給期望 C 字串的綁定。

還有一些工具可用於手動在 Kotlin 和 C 字串之間轉換：

* `fun CPointer<ByteVar>.toKString(): String`
* `val String.cstr: CValuesRef<ByteVar>`.

若要取得指標，應在原生記憶體中分配 `.cstr`，例如：

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

在所有情況下，C 字串都應該編碼為 UTF-8。

若要跳過自動轉換並確保在綁定中使用原始指標，請新增
[`noStringConversion` 屬性](native-definition-file#set-up-string-conversion)到 `.def` 檔案：

```c
noStringConversion = LoadCursorA LoadCursorW
```

這樣，類型為 `CPointer<ByteVar>` 的任何值都可以作為 `const char*` 類型的引數傳遞。 如果 Kotlin 字串
應該傳遞，可以使用如下的程式碼：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### 範圍本機指標

可以使用 `CValues<T>.ptr` 為 `CValues<T>` 執行個體建立 C 表示形式的範圍穩定指標
擴充屬性，可在 `memScoped {}` 下使用。 它允許將需要 C 指標的 API 與綁定到某個
`MemScope` 的生命週期一起使用。 例如：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value `->` items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    // ...
}
```

在此範例中，傳遞給 C API `new_menu()` 的所有值的生命週期都是它所屬的最內層 `memScope`。
一旦控制流程離開 `memScoped` 範圍，C 指標就會失效。

### 按值傳遞和接收結構

當 C 函式按值取得或傳回結構/聯合 `T` 時，對應的引數類型或傳回類型會
表示為 `CValue<T>`。

`CValue<T>` 是一種不透明類型，因此結構欄位無法使用適當的 Kotlin 屬性存取。
如果 API 使用結構作為不透明控制代碼，這可能沒問題。 但是，如果需要欄位存取，則可以使用以下
轉換方法：

* [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
  將 (左值) `T` 轉換為 `CValue<T>`。 因此，若要建構 `CValue<T>`，
  可以分配、填寫 `T`，然後將其轉換為 `CValue<T>`。
* [`CValue<T>.useContents(block: T.() `->` R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
  暫時將 `CValue<T>` 儲存在記憶體中，然後使用此放置的值 `T` 作為接收器執行傳遞的 Lambda 運算式。
  因此，若要讀取單個欄位，可以使用以下程式碼：

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```
  
* [`fun cValue(initialize: T.() `->` Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
  將提供的 `initialize` 函式套用到記憶體中分配的 `T`，並將結果轉換為 `CValue<T>`。
* [`fun CValue<T>.copy(modify: T.() `->` Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
  建立現有 `CValue<T>` 的修改副本。 原始值放置在記憶體中，使用 `modify()` 進行修改
  函式，然後轉換回新的 `CValue<T>`。
* [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
  將 `CValues<T>` 放入 `AutofreeScope` 中，傳回指向已分配記憶體的指標。 已分配的記憶體是
  在處置 `AutofreeScope` 時自動釋放。

### 回呼

若要將 Kotlin 函式轉換為 C 函式的指標，可以使用 `staticCFunction(::kotlinFunction)`。 也可以
提供 Lambda 運算式而不是函式參考。 函式或 Lambda 運算式不得捕獲任何值。

#### 將使用者資料傳遞給回呼

通常，C API 允許將一些使用者資料傳遞給回呼。 此類資料通常由使用者在設定
回呼時提供。 例如，它會作為 `void*` 傳遞給某些 C 函式（或寫入結構）。 但是，對
Kotlin 物件的參考無法直接傳遞給 C。 因此，它們需要在設定回呼之前進行包裝，然後
在回呼本身中解包，以便安全地從 Kotlin 進入 C 世界再回到 Kotlin。 可以使用
`StableRef` 類別進行此類包裝。

若要包裝參考：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

在這裡，`voidPtr` 是一個 `COpaquePointer`，可以傳遞給 C 函式。

若要解包參考：

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

在這裡，`kotlinReference` 是原始包裝的參考。

建立的 `StableRef` 最終會使用 `.dispose()` 方法手動處置，以防止記憶體洩漏：

```kotlin
stableRef.dispose()
```

之後它就會失效，因此無法再解包 `voidPtr`。

### 巨集

每個展開為常數的 C 巨集都表示為 Kotlin 屬性。

當編譯器可以推斷類型時，支援沒有參數的巨集：

```c
int foo(int);
#define FOO foo(42)
```

在這種情況下，`FOO` 在 Kotlin 中可用。

若要支援其他巨集，您可以透過使用支援的宣告包裝它們來手動公開它們。 例如，
函式型巨集 `FOO` 可以透過
[將自訂宣告新增](native-definition-file#add-custom-declarations)到函式庫中來公開為函式 `foo()`：

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 可移植性

有時，C 函式庫具有平台相關類型的函式參數或結構欄位，例如 `long` 或
`size_t`。 Kotlin 本身不提供隱式整數轉換或 C 樣式的整數轉換（例如
`(size_t) intValue`），因此為了使在這種情況下更輕鬆地編寫可移植的程式碼，提供了 `convert` 方法：

```kotlin
fun $.convert<$>(): $
```

在這裡，`type1` 和 `type2` 必須是整數類型，無論帶正負號還是不帶正負號。

`.convert<${type}>` 具有與 `.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、
`.toUShort`、`.toUInt` 或 `.toULong` 方法之一相同的語意，具體取決於 `type`。

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

### 物件固定

Kotlin 物件可以固定，即保證它們在記憶體中的位置在取消固定之前保持穩定，
並且可以將指向此類物件內部資料的指標傳遞給 C 函式。

您可以採取幾種方法：

* 使用 [`usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 服務函式
  ，該函式固定物件、執行程式碼區塊，並在正常和異常路徑上取消固定：

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*

  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) {
      val buffer = ByteArray(1024)
      buffer.usePinned { pinned `->`
          while (true) {
              val length = recv(fd, pinned.addressOf(0), buffer.size.convert(), 0).toInt()
              if (length <= 0) {
                  break
              }
              // Now `buffer` has raw data obtained from the `recv()` call.
          }
      }
  }
  ```

  在這裡，`pinned` 是一個特殊類型 `Pinned<T>` 的物件。 它提供了有用的擴充功能，例如 `addressOf`，可讓您
  取得固定陣列主體（body）的位址。

* 使用 [`refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 函式，它具有
  底層類似的功能，但在某些情況下，可以幫助您減少樣板程式碼：

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
          // Now `buffer` has raw data obtained from the `recv()` call.
      }
  }
  ```

  在這裡，`buffer.refTo(0)` 具有 `CValuesRef` 類型，該類型在進入 `recv()` 函式之前固定陣列，
  將其第零個元素的位址傳遞給該函式，並在退出後取消固定該陣列。

### 前置宣告

若要匯入前置宣告，請使用 `cnames` 套件。 例如，若要匯入 C 函式庫中宣告的 `cstructName` 前置宣告
帶有 `library.package`，使用特殊的前置宣告套件：
`import cnames.structs.cstructName`。

考慮兩個 cinterop 函式庫：一個具有結構的前置宣告，另一個
在另一個套件中具有實際實作：

```C
// First C library
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```C
// Second C library
// Header:
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// Implementation:
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

若要在兩個函式庫之間傳輸物件，請在您的 Kotlin 程式碼中使用明確的 `as` 轉換：

```kotlin
// Kotlin code:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 接下來是什麼

透過完成以下教學課程，了解類型、函式和常數如何在 Kotlin 和 C 之間對應：

* [從 C 對應原始資料類型](mapping-primitive-data-types-from-c)
* [從 C 對應結構和聯合類型](mapping-function-pointers-from-c)
* [從 C 對應函式指標](mapping-function-pointers-from-c)
* [從 C 對應字串](mapping-strings-from-c)
  ```