[//]: # (title: 与 C 的互操作性)

> C 库导入目前处于 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 阶段。所有由 cinterop 工具从 C 库生成的 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 提供的原生平台库（如 Foundation、UIKit 和 POSIX）仅对部分 API 要求显式选择（opt-in）。
>
{style="note"}

本文档涵盖了 Kotlin 与 C 互操作性的通用方面。Kotlin/Native 附带了 cinterop 工具，你可以使用它快速生成与外部 C 库交互所需的一切。

该工具分析 C 头文件，并产生一个将 C 类型、函数和字符串直接映射到 Kotlin 的映射。生成的存根随后可以导入到 IDE 中，以启用代码补全和导航。

> Kotlin 还提供了与 Objective-C 的互操作性。Objective-C 库也是通过 cinterop 工具导入的。更多详情，请参阅 [Swift/Objective-C 互操作性](native-objc-interop.md)。
>
{style="tip"}

## 设置你的项目

以下是使用需要使用 C 库的项目时的通用工作流程：

1. 创建并配置一个[定义文件](native-definition-file.md)。它描述了 cinterop 工具应该在 Kotlin [绑定](#绑定)中包含哪些内容。
2. 配置你的 Gradle 构建文件，将 cinterop 包含在构建过程中。
3. 编译并运行项目以生成最终的可执行文件。

> 如需动手实践，请完成[使用 C 互操作创建应用](native-app-with-c-and-libcurl.md)教程。
>
{style="note"}

在许多情况下，无需配置自定义的 C 库互操作性。相反，你可以使用平台上可用的 API，这些 API 已包含在被称为[平台库](native-platform-libs.md)的标准绑定中。例如，Linux/macOS 平台上的 POSIX、Windows 平台上的 Win32 或 macOS/iOS 上的 Apple 框架都可以通过这种方式使用。

## 绑定

### 基础互操作类型

所有受支持的 C 类型在 Kotlin 中都有相应的表示：

* 有符号、无符号整型和浮点类型映射到其宽度相同的 Kotlin 对应类型。
* 指针和数组映射到 `CPointer<T>?`。
* 枚举可以映射为 Kotlin 枚举或整型值，具体取决于启发式算法和[定义文件设置](native-definition-file.md#configure-enums-generation)。
* 结构体（struct）和联合体（union）映射为可以通过点表示法访问字段的类型，即 `someStructInstance.field1`。
* `typedef` 表示为 `typealias`。

此外，任何 C 类型都有对应的 Kotlin 类型来表示该类型的左值（lvalue），即位于内存中的值，而不是简单的不可变自包含值。你可以将 C++ 引用视为类似的概念。对于结构体（以及结构体的 `typedef`），这种表示是主要的表示形式，并且与结构体本身同名。对于 Kotlin 枚举，它被命名为 `${type}.Var`；对于 `CPointer<T>`，它是 `CPointerVar<T>`；对于大多数其他类型，它是 `${type}Var`。

对于同时具有两种表示形式的类型，具有左值的类型有一个可变的 `.value` 属性用于访问该值。

#### 指针类型

`CPointer<T>` 的类型参数 `T` 必须是上述左值类型之一。例如，C 类型 `struct S*` 映射到 `CPointer<S>`，`int8_t*` 映射到 `CPointer<int_8tVar>`，而 `char**` 映射到 `CPointer<CPointerVar<ByteVar>>`。

C 空指针表示为 Kotlin 的 `null`，指针类型 `CPointer<T>` 是不可空的，但 `CPointer<T>?` 是可空的。该类型的值支持所有与处理 `null` 相关的 Kotlin 操作，例如 `?:`、`?.`、`!!` 等：

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

由于数组也映射到 `CPointer<T>`，它支持使用 `[]` 运算符通过索引访问值：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` 的 `.pointed` 属性返回该指针指向的 `T` 类型的左值。逆操作是 `.ptr`，它接受左值并返回指向它的指针。

`void*` 映射到 `COpaquePointer` —— 这是一种特殊的指针类型，它是任何其他指针类型的超类型。因此，如果 C 函数接受 `void*`，Kotlin 绑定将接受任何 `CPointer`。

可以使用 `.reinterpret<T>` 进行指针转换（包括 `COpaquePointer`），例如：

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

与 C 语言一样，这些 `.reinterpret` 转换是不安全的，可能会导致应用程序中出现微妙的内存问题。

此外，通过 `.toLong()` 和 `.toCPointer<T>()` 扩展方法，可以在 `CPointer<T>?` 和 `Long` 之间进行不安全转换：

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 如果可以从上下文中得知结果的类型，由于类型推断的存在，你可以省略类型参数。
> 
{style="tip"}

### 内存分配

可以使用 `NativePlacement` 接口分配原生内存，例如：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

val placement: NativePlacement = // 请参阅下文的放置示例
val byteVar = placement.alloc<ByteVar>()
val bytePtr = placement.allocArray<ByteVar>(5)
```

最符合逻辑的放置位置是在对象 `nativeHeap` 中。它对应于使用 `malloc` 分配原生内存，并提供了一个额外的 `.free()` 操作来释放分配的内存：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap` 要求手动释放内存。然而，通常将内存分配在与词法作用域绑定的生命周期内会更有用。如果此类内存能自动释放，将会非常有帮助。

为了解决这个问题，你可以使用 `memScoped { }`。在花括号内，临时放置（placement）作为隐式接收者可用，因此可以使用 `alloc` 和 `allocArray` 分配原生内存，并且分配的内存在离开作用域后将自动释放。

例如，一个通过指针参数返回值的 C 函数可以这样使用：

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

### 向绑定传递指针

虽然 C 指针被映射到 `CPointer<T>` 类型，但 C 函数指针类型的参数映射到 `CValuesRef<T>`。当传递一个 `CPointer<T>` 作为此类参数的值时，它会原样传递给 C 函数。然而，也可以传递一系列值来代替指针。在这种情况下，序列是“按值”传递的，即 C 函数接收到指向该序列临时副本的指针，该副本仅在函数返回之前有效。

指针参数的 `CValuesRef<T>` 表示形式旨在支持 C 数组字面量，而无需显式的原生内存分配。为了构造 C 值的不可变自包含序列，提供了以下方法：

* `${type}Array.toCValues()`，其中 `type` 是 Kotlin 原生类型
* `Array<CPointer<T>?>.toCValues()`、`List<CPointer<T>?>.toCValues()`
* `cValuesOf(vararg elements: ${type})`，其中 `type` 是原生类型或指针

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

### 字符串

与其他指针不同，类型为 `const char*` 的参数被表示为 Kotlin `String`。因此，可以将任何 Kotlin 字符串传递给期望 C 字符串的绑定。

还有一些工具可用于在 Kotlin 和 C 字符串之间手动转换：

* `fun CPointer<ByteVar>.toKString(): String`
* `val String.cstr: CValuesRef<ByteVar>`。

要获取指针，应在原生内存中分配 `.cstr`，例如：

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

在所有情况下，C 字符串都被假定为以 UTF-8 编码。

要跳过自动转换并确保在绑定中使用原始指针，请将 [`noStringConversion` 属性](native-definition-file.md#set-up-string-conversion)添加到 `.def` 文件中：

```c
noStringConversion = LoadCursorA LoadCursorW
```

这样，任何 `CPointer<ByteVar>` 类型的值都可以作为 `const char*` 类型的参数传递。如果需要传递 Kotlin 字符串，可以使用如下代码：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // 用于 ASCII 或 UTF-8 版本
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // 用于 UTF-16 版本
}
```

### 作用域局部指针

可以使用在 `memScoped {}` 下可用的 `CValues<T>.ptr` 扩展属性，为 `CValues<T>` 实例创建一个 C 表示形式的作用域稳定指针。它允许使用需要 C 指针且生命周期绑定到特定 `MemScope` 的 API。例如：

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

在此示例中，传递给 C API `new_menu()` 的所有值都具有其所属的最内层 `memScope` 的生命周期。一旦控制流离开 `memScoped` 作用域，C 指针就会失效。

### 按值传递和接收结构体

当 C 函数按值接受或返回结构体/联合体 `T` 时，相应的参数类型或返回类型表示为 `CValue<T>`。

`CValue<T>` 是一个不透明类型，因此无法使用相应的 Kotlin 属性访问结构字段。如果 API 将结构用作不透明句柄，这可能没问题。但是，如果需要访问字段，可以使用以下转换方法：

* [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
  将（左值）`T` 转换为 `CValue<T>`。因此，要构造 `CValue<T>`，可以先分配并填充 `T`，然后将其转换为 `CValue<T>`。
* [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
  临时将 `CValue<T>` 存储在内存中，然后以该放置的值 `T` 作为接收者运行传递的 lambda。因此，要读取单个字段，可以使用以下代码：

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```
  
* [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
  应用提供的 `initialize` 函数在内存中分配 `T`，并将结果转换为 `CValue<T>`。
* [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
  创建一个现有 `CValue<T>` 的修改副本。原始值被放置在内存中，使用 `modify()` 函数进行更改，然后转换回新的 `CValue<T>`。
* [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
  将 `CValues<T>` 放置在 `AutofreeScope` 中，返回指向分配内存的指针。当 `AutofreeScope` 被释放时，分配的内存将自动释放。

### 回调

要将 Kotlin 函数转换为指向 C 函数的指针，可以使用 `staticCFunction(::kotlinFunction)`。也可以提供 lambda 而不是函数引用。该函数或 lambda 不得捕获任何值。

#### 向回调传递用户数据

C API 通常允许向回调传递一些用户数据。此类数据通常由用户在配置回调时提供。例如，它以 `void*` 的形式传递给某些 C 函数（或写入结构体）。然而，Kotlin 对象的引用不能直接传递给 C。因此，在配置回调之前需要对它们进行包装，然后在回调本身中进行解包，以便安全地从 Kotlin 世界通过 C 世界游回 Kotlin。这种包装可以使用 `StableRef` 类来实现。

包装引用：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

在这里，`voidPtr` 是一个 `COpaquePointer`，可以传递给 C 函数。

解包引用：

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

在这里，`kotlinReference` 是原始的包装引用。

创建的 `StableRef` 最终必须使用 `.dispose()` 方法手动释放，以防止内存泄漏：

```kotlin
stableRef.dispose()
```

在此之后，它将失效，因此 `voidPtr` 无法再被解包。

### 宏

每个扩展为常量的 C 宏都表示为一个 Kotlin 属性。

在编译器可以推断类型的情况下，支持不带参数的宏：

```c
int foo(int);
#define FOO foo(42)
```

在这种情况下，`FOO` 在 Kotlin 中可用。

要支持其他宏，可以通过将它们包装在支持的声明中来手动公开它们。例如，通过向库[添加自定义声明](native-definition-file.md#add-custom-declarations)，可以将类函数宏 `FOO` 公开为函数 `foo()`：

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 移植性

有时 C 库具有平台相关类型的函数参数或结构体字段，例如 `long` 或 `size_t`。Kotlin 本身既不提供隐式整数转换，也不提供 C 风格的整数转换（例如 `(size_t) intValue`），因此为了在此类情况下更轻松地编写可移植代码，提供了 `convert` 方法：

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

在这里，`type1` 和 `type2` 必须都是整型，无论是有符号还是无符号。

根据 `type` 的不同，`.convert<${type}>` 具有与 `.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、`.toUShort`、`.toUInt` 或 `.toULong` 方法之一相同的语义。

使用 `convert` 的示例：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

此外，类型参数可以自动推断，因此在某些情况下可以省略。

### 对象固定

Kotlin 对象可以被固定（pinning），即保证它们在内存中的位置在解除固定之前保持稳定，并且可以将指向此类对象内部数据的指针传递给 C 函数。

你可以采取几种方法：

* 使用 [`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 扩展函数，它会固定一个对象，执行一个代码块，并在正常退出和异常路径上解除固定：

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
              // 现在 `buffer` 中有了从 `recv()` 调用中获得的原始数据。
          }
      }
  }
  ```

  在这里，`pinned` 是一个特殊类型 `Pinned<T>` 的对象。它提供了有用的扩展，例如 [`.addressOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/address-of.html)，允许获取固定数组体的地址。

* 使用 [`.refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 扩展函数，它在底层具有类似的功能，但在某些情况下，可以帮助你减少模板代码：

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
          // 现在 `buffer` 中有了从 `recv()` 调用中获得的原始数据。
      }
  }
  ```

  在这里，`buffer.refTo(0)` 具有 `CValuesRef` 类型，它在进入 `recv()` 函数之前固定数组，将第零个元素的地址传递给该函数，并在退出后解除数组的固定。

### 前向声明

要导入前向声明，请使用 `cnames` 软件包。例如，要导入在具有 `library.package` 的 C 库中声明的 `cstructName` 前向声明，请使用特殊的前向声明软件包：`import cnames.structs.cstructName`。

考虑两个 cinterop 库：一个包含结构体的前向声明，另一个在另一个软件包中包含实际实现：

```C
// 第一个 C 库
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```C
// 第二个 C 库
// 头文件:
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// 实现:
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

要在两个库之间传输对象，请在 Kotlin 代码中使用显式的 `as` 转换：

```kotlin
// Kotlin 代码:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 下一步

通过完成以下教程，了解类型、函数和字符串如何在 Kotlin 和 C 之间进行映射：

* [映射来自 C 的原始数据类型](mapping-primitive-data-types-from-c.md)
* [映射来自 C 的结构体和联合体类型](mapping-struct-union-types-from-c.md)
* [映射来自 C 的函数指针](mapping-function-pointers-from-c.md)
* [映射来自 C 的字符串](mapping-strings-from-c.md)