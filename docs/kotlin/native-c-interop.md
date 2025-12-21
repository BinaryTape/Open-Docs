[//]: # (title: 与 C 的互操作)

> C 库导入目前处于 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 阶段。所有通过 cinterop 工具从 C 库生成的 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> Kotlin/Native 随附的原生平台库（例如 Foundation、UIKit 和 POSIX）仅对某些 API 要求显式选择启用。
>
{style="note"}

本文档涵盖了 Kotlin 与 C 互操作性的一般方面。Kotlin/Native 随附了一个 cinterop 工具，
你可以使用它快速生成与外部 C 库交互所需的一切。

该工具分析 C 头文件，并将 C 类型、函数和字符串直接映射到 Kotlin 中。
然后可以将生成的存根导入到 IDE 中，以启用代码补全和导航。

> Kotlin 也提供了与 Objective-C 的互操作性。Objective-C 库同样通过 cinterop 工具导入。关于更多详情，请参见 [Swift/Objective-C 互操作](native-objc-interop.md)。
>
{style="tip"}

## 设置你的项目

以下是使用需要消耗 C 库的项目的通用工作流：

1.  创建并配置一个[定义文件](native-definition-file.md)。它描述了 cinterop 工具应将哪些内容包含到 Kotlin [绑定](#bindings)中。
2.  配置你的 Gradle 构建文件，以在构建过程中包含 cinterop。
3.  编译并运行项目以生成最终的可执行文件。

> 关于动手实践，请完成[使用 C 互操作创建应用](native-app-with-c-and-libcurl.md)教程。
>
{style="note"}

在许多情况下，无需配置与 C 库的自定义互操作性。相反，你可以使用[平台库](native-platform-libs.md)中可用的平台标准化绑定 API。例如，
Linux/macOS 平台上的 POSIX、Windows 平台上的 Win32，或者 macOS/iOS 上的 Apple frameworks 都可以通过这种方式使用。

## 绑定

### 基本互操作类型

所有支持的 C 类型在 Kotlin 中都有相应的表示形式：

*   有符号、无符号整型和浮点类型映射到具有相同宽度的对应 Kotlin 类型。
*   指针和数组映射到 `CPointer<T>?`。
*   枚举可以映射到 Kotlin 枚举或整型值，具体取决于启发式规则和[定义文件设置](native-definition-file.md#configure-enums-generation)。
*   结构体和联合体映射到可以通过点表示法访问字段的类型，例如 `someStructInstance.field1`。
*   `typedef` 表示为 `typealias`。

此外，任何 C 类型都具有表示该类型左值的 Kotlin 类型，即位于内存中的值，而不是简单的不可变、自包含的值。
可以将其类比为 C++ 引用。对于结构体（以及 `typedef` 到结构体），这种表示是主要的，并与结构体本身同名。
对于 Kotlin 枚举，它被命名为 `${type}.Var`；对于 `CPointer<T>`，它被命名为 `CPointerVar<T>`；对于大多数其他类型，它被命名为 `${type}Var`。

对于同时具有两种表示形式的类型，带有左值的表示形式具有一个可变的 `.value` 属性，用于访问该值。

#### 指针类型

`CPointer<T>` 的类型实参 `T` 必须是上述左值类型之一。例如，C 类型 `struct S*` 映射到 `CPointer<S>`，`int8_t*` 映射到 `CPointer<int_8tVar>`，而 `char**` 映射到 `CPointer<CPointerVar<ByteVar>>`。

C 空指针表示为 Kotlin 的 `null`，并且指针类型 `CPointer<T>` 不可空，但 `CPointer<T>?` 可以为空。
此类型的值支持所有与处理 `null` 相关的 Kotlin 操作，例如 `?:`、`?.`、`!!` 等：

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

由于数组也映射到 `CPointer<T>`，因此它支持使用 `[]` 操作符通过索引访问值：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` 的 `.pointed` 属性返回由该指针指向的类型 `T` 的左值。反向操作是 `.ptr`，它接收左值并返回指向它的指针。

`void*` 映射到 `COpaquePointer` —— 这个特殊指针类型是任何其他指针类型的超类型。
因此，如果 C 函数接收 `void*`，Kotlin 绑定会接受任何 `CPointer`。

指针（包括 `COpaquePointer`）的转换可以通过 `.reinterpret<T>` 完成，例如：

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

与 C 语言一样，这些 `.reinterpret` 转换是不安全的，并可能在应用程序中导致细微的内存问题。

此外，`CPointer<T>?` 与 `Long` 之间存在不安全转换，由 `.toLong()` 和 `.toCPointer<T>()` 扩展方法提供：

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 如果结果类型从上下文中已知，则可以借助类型推断省略类型实参。
> 
{style="tip"}

### 内存分配

原生内存可以使用 `NativePlacement` 接口进行分配，例如：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

val placement: NativePlacement = // See below for placement examples
val byteVar = placement.alloc<ByteVar>()
val bytePtr = placement.allocArray<ByteVar>(5)
```

最合理的放置位置是对象 `nativeHeap`。它对应于使用 `malloc` 分配原生内存，并提供额外的 `.free()` 操作来释放已分配的内存：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap` 要求手动释放内存。然而，将内存分配为生命周期绑定到词法作用域的情况通常很有用。如果此类内存能自动释放，将非常有帮助。

为解决此问题，你可以使用 `memScoped { }`。在花括号内，临时放置可用作隐式接收者，因此可以使用 `alloc` 和 `allocArray` 分配原生内存，
并且分配的内存将在离开作用域后自动释放。

例如，可以通过指针形参返回值的 C 函数可以这样使用：

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

尽管 C 指针映射到 `CPointer<T> type`，但 C 函数的指针类型形参映射到 `CValuesRef<T>`。
当将 `CPointer<T>` 作为此类形参的值传递时，它会按原样传递给 C 函数。
然而，可以传递值序列而不是指针。在这种情况下，该序列是“按值”传递的，
即 C 函数接收指向该序列临时副本的指针，该副本仅在函数返回前有效。

指针形参的 `CValuesRef<T>` 表示旨在支持 C 数组字面量，无需显式原生内存分配。
为了构建不可变、自包含的 C 值序列，提供了以下方法：

*   `${type}Array.toCValues()`，其中 `type` 是 Kotlin 原生类型
*   `Array<CPointer<T>?>.toCValues()`，`List<CPointer<T>?>.toCValues()`
*   `cValuesOf(vararg elements: ${type})`，其中 `type` 是原生类型或指针

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

与其他指针不同，类型为 `const char*` 的形参表示为 Kotlin `String`。
因此，可以将任何 Kotlin 字符串传递给期望 C 字符串的绑定。

还有一些可用于手动在 Kotlin 和 C 字符串之间进行转换的工具：

*   `fun CPointer<ByteVar>.toKString(): String`
*   `val String.cstr: CValuesRef<ByteVar>`.

要获取指针，`.cstr` 应该在原生内存中进行分配，例如：

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

在所有情况下，C 字符串都应该被编码为 UTF-8。

要跳过自动转换并确保在绑定中使用原始指针，请将[`noStringConversion` 属性](native-definition-file.md#set-up-string-conversion)添加到 `.def` 文件中：

```c
noStringConversion = LoadCursorA LoadCursorW
```

通过这种方式，任何类型为 `CPointer<ByteVar>` 的值都可以作为 `const char*` 类型的实参传递。如果需要传递 Kotlin 字符串，可以使用类似这样的代码：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### 作用域局部指针

可以使用 `memScoped {}` 下可用的 `CValues<T>.ptr` 扩展属性，为 `CValues<T>` 实例创建 C 表示的作用域稳定指针。
它允许使用需要 C 指针且生命周期绑定到特定 `MemScope` 的 API。例如：

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

在此示例中，所有传递给 C API `new_menu()` 的值都具有其所属的最内层 `memScope` 的生命周期。
一旦控制流离开 `memScoped` 作用域，C 指针就会失效。

### 按值传递和接收结构体

当 C 函数按值接收或返回结构体/联合体 `T` 时，对应的实参类型或返回类型表示为 `CValue<T>`。

`CValue<T>` 是一种不透明类型，因此无法通过相应的 Kotlin 属性访问结构体字段。
如果 API 将结构体用作不透明句柄，这可能没问题。但是，如果需要访问字段，则提供了以下转换方法：

*   [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
    将（左值）`T` 转换为 `CValue<T>`。因此，要构建 `CValue<T>`，`T` 可以被分配、填充，然后转换为 `CValue<T>`。
*   [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
    将 `CValue<T>` 临时存储在内存中，然后运行传入的 lambda 表达式，并将此放置的值 `T` 作为接收者。
    因此，要读取单个字段，可以使用以下代码：

    ```kotlin
    val fieldValue = structValue.useContents { field }
    ```
    
*   [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
    应用所提供的 `initialize` 函数在内存中分配 `T`，并将结果转换为 `CValue<T>`。
*   [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
    创建现有 `CValue<T>` 的修改副本。原始值被放置在内存中，使用 `modify()` 函数进行修改，然后再次转换为新的 `CValue<T>`。
*   [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
    将 `CValues<T>` 放置到 `AutofreeScope` 中，并返回指向已分配内存的指针。当 `AutofreeScope` 被处理时，已分配的内存将自动释放。

### 回调

要将 Kotlin 函数转换为指向 C 函数的指针，可以使用 `staticCFunction(::kotlinFunction)`。也可以
提供 lambda 表达式而不是函数引用。该函数或 lambda 表达式不得捕获任何值。

#### 向回调传递用户数据

C API 通常允许向回调传递一些用户数据。此类数据通常由用户在配置回调时提供。
例如，它作为 `void*` 传递给某个 C 函数（或写入结构体）。然而，Kotlin 对象的引用不能直接传递给 C。
因此，它们在配置回调之前需要包装，然后在回调内部解包，以便安全地从 Kotlin 经由 C 世界传递到 Kotlin。
这种包装可以通过 `StableRef` 类实现。

要包装引用：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

在这里，`voidPtr` 是一个 `COpaquePointer`，可以传递给 C 函数。

要解包引用：

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

在这里，`kotlinReference` 是原始包装的引用。

创建的 `StableRef` 最终应使用 `.dispose()` 方法手动处理，以防止内存泄漏：

```kotlin
stableRef.dispose()
```

此后它将变得无效，因此 `voidPtr` 不能再被解包。

### 宏

每个扩展为常量的 C 宏都表示为 Kotlin 属性。

当编译器可以推断类型时，没有形参的宏会受到支持：

```c
int foo(int);
#define FOO foo(42)
```

在这种情况下，`FOO` 在 Kotlin 中可用。

为了支持其他宏，你可以通过用受支持的声明包装它们来手动暴露它们。例如，
函数式宏 `FOO` 可以通过[向库添加自定义声明](native-definition-file.md#add-custom-declarations)来作为函数 `foo()` 暴露：

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 可移植性

有时 C 库的函数形参或结构体字段是平台依赖类型，例如 `long` 或 `size_t`。
Kotlin 本身不提供隐式整型转换或 C 风格整型转换（例如，`(size_t) intValue`），
因此为了在这些情况下更容易编写可移植代码，提供了 `convert` 方法：

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

这里，`type1` 和 `type2` 都必须是整型，可以是有符号的或无符号的。

`.convert<${type}>` 具有与 `.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、
`.toUShort`、`.toUInt` 或 `.toULong` 方法之一相同的语义，具体取决于 `type`。

使用 `convert` 的示例：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

此外，类型形参可以自动推断，因此在某些情况下可以省略。

### 对象固定

Kotlin 对象可以被固定，即它们在内存中的位置被保证是稳定的，直到它们被解除固定，
并且指向此类对象内部数据的指针可以传递给 C 函数。

你可以采用以下几种方法：

*   使用 [`usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 扩展函数，
    它会固定一个对象，执行一个代码块，并在正常路径和异常路径上解除固定：

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
                // Now `buffer` has raw data obtained from the `recv()` call.
            }
        }
    }
    ```

    在这里，`pinned` 是一个特殊类型 `Pinned<T>` 的对象。它提供了有用的扩展，例如 [`.addressOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/address-of.html)，
    它允许获取固定数组体的地址。

*   使用 [`.refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 扩展函数，
    它在底层功能类似，但在某些情况下可能有助于你减少样板代码：

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

    在这里，`buffer.refTo(0)` 具有 `CValuesRef` 类型，它在进入 `recv()` 函数之前固定数组，
    将数组的第零个元素的地址传递给函数，并在退出后解除固定数组。

### 前向声明

要导入前向声明，请使用 `cnames` 包。例如，要导入在 C 库中声明的 `cstructName` 前向声明（该库具有 `library.package`），
请使用特殊的前向声明包：`import cnames.structs.cstructName`。

考虑两个 cinterop 库：一个具有结构体的前向声明，另一个在另一个包中具有实际实现：

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

要在两个库之间传输对象，请在你的 Kotlin 代码中使用显式 `as` 转换：

```kotlin
// Kotlin code:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 下一步

通过完成以下教程，了解类型、函数和字符串如何在 Kotlin 和 C 之间映射：

*   [从 C 映射原生数据类型](mapping-primitive-data-types-from-c.md)
*   [从 C 映射结构体和联合体类型](mapping-struct-union-types-from-c.md)
*   [从 C 映射函数指针](mapping-function-pointers-from-c.md)
*   [从 C 映射字符串](mapping-strings-from-c.md)