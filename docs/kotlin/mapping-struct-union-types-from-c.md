[//]: # (title: 映射 C 语言的结构体和联合体类型 – 教程)

<tldr>
    <p>这是《<strong>Kotlin 与 C 语言的映射</strong>》教程系列的第二部分。在继续之前，请确保你已完成上一步。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">映射 C 语言的原始数据类型</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>映射 C 语言的结构体和联合体类型</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">映射函数指针</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">映射 C 语言的字符串</a><br/>
    </p>
</tldr>

> C 库导入是 [实验性](components-stability.md#stability-levels-explained) 功能。所有由 cinterop 工具从 C 库生成的 Kotlin 声明都应具有 `@ExperimentalForeignApi` 注解。
>
> Kotlin/Native 随附的原生平台库（如 Foundation、UIKit 和 POSIX）仅对某些 API 需要显式选择启用。
>
{style="warning"}

让我们探索从 Kotlin 中哪些 C 结构体 (struct) 和联合体 (union) 声明是可见的，并考察 Kotlin/Native 和 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 构建中 C 互操作相关的进阶使用案例。

在本教程中，你将学习：

* [结构体和联合体类型如何映射](#mapping-struct-and-union-c-types)
* [如何在 Kotlin 中使用结构体和联合体类型](#use-struct-and-union-types-from-kotlin)

## 映射 C 语言的结构体和联合体类型

为了理解 Kotlin 如何映射结构体和联合体类型，让我们在 C 中声明它们，并考察它们在 Kotlin 中如何表示。

在[上一个教程](mapping-primitive-data-types-from-c.md)中，你已经创建了一个包含必要文件的 C 库。对于此步骤，请在 `---` 分隔符之后更新 `interop.def` 文件中的声明：

```c

---

typedef struct {
  int a;
  double b;
} MyStruct;

void struct_by_value(MyStruct s) {}
void struct_by_pointer(MyStruct* s) {}

typedef union {
  int a;
  MyStruct b;
  float c;
} MyUnion;

void union_by_value(MyUnion u) {}
void union_by_pointer(MyUnion* u) {}
``` 

`interop.def` 文件提供了编译、运行或在 IDE 中打开应用程序所需的一切。

## 检查为 C 库生成的 Kotlin API

让我们看看 C 结构体和联合体类型如何映射到 Kotlin/Native 并更新你的项目：

1. 在 `src/nativeMain/kotlin` 中，使用以下内容更新你从[上一个教程](mapping-primitive-data-types-from-c.md)中创建的 `hello.kt` 文件：

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi

   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")

       struct_by_value(/* fix me*/)
       struct_by_pointer(/* fix me*/)
       union_by_value(/* fix me*/)
       union_by_pointer(/* fix me*/)
   }
   ```

2. 为了避免编译器错误，请将互操作性添加到构建过程。为此，请使用以下内容更新你的 `build.gradle(.kts)` 构建文件：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        macosArm64("native") {    // macOS on Apple Silicon
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms 
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // on Windows
            val main by compilations.getting
            val interop by main.cinterops.creating {
                definitionFile.set(project.file("src/nativeInterop/cinterop/interop.def"))
            }
        
            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
            compilations.main.cinterops {
                interop {   
                    definitionFile = project.file('src/nativeInterop/cinterop/interop.def')
                }
            }
        
            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    </tabs> 

3. 使用 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）导航到为 C 函数、结构体和联合体生成的以下 API：

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

从技术上讲，在 Kotlin 侧结构体和联合体类型之间没有区别。cinterop 工具为 C 结构体和联合体声明都生成 Kotlin 类型。

生成的 API 包含了 `CValue<T>` 和 `CValuesRef<T>` 的完全限定包名，反映了它们在 `kotlinx.cinterop` 中的位置。`CValue<T>` 表示按值传递的结构体参数，而 `CValuesRef<T>?` 用于传递结构体或联合体的指针。

## 在 Kotlin 中使用结构体和联合体类型

由于生成的 API，在 Kotlin 中使用 C 结构体和联合体类型非常直接。唯一的问题是如何创建这些类型的新实例。

让我们看看那些将 `MyStruct` 和 `MyUnion` 作为参数的生成函数。按值传递的参数表示为 `kotlinx.cinterop.CValue<T>`，而指针类型参数使用 `kotlinx.cinterop.CValuesRef<T>?`。

Kotlin 提供了一个方便的 API 用于创建和使用这些类型。让我们探讨如何在实际操作中使用它。

### 创建 CValue&lt;T&gt;

`CValue<T>` 类型用于将按值传递的参数传递给 C 函数调用。使用 `cValue` 函数创建一个 `CValue<T>` 实例。该函数需要一个[带接收器的 Lambda 函数](lambdas.md#function-literals-with-receiver)来原地初始化底层 C 类型。该函数声明如下：

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

以下是如何使用 `cValue` 并传递按值传递的参数：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue

@OptIn(ExperimentalForeignApi::class)
fun callValue() {

    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }
    struct_by_value(cStruct)

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    union_by_value(cUnion)
}
```

### 将结构体和联合体创建为 CValuesRef&lt;T&gt;

`CValuesRef<T>` 类型在 Kotlin 中用于传递 C 函数的指针类型参数。要在原生内存中分配 `MyStruct` 和 `MyUnion`，请使用 `kotlinx.cinterop.NativePlacement` 类型上的以下扩展函数：

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement` 表示原生内存，具有类似于 `malloc` 和 `free` 的函数。`NativePlacement` 有几种实现：

* 全局实现是 `kotlinx.cinterop.nativeHeap`，但使用后你必须调用 `nativeHeap.free()` 来释放内存。
* 更安全的替代方案是 `memScoped()`，它创建一个短生命周期的内存作用域，其中所有分配都会在代码块结束时自动释放：

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
  ```

使用 `memScoped()`，你的调用带指针参数的函数的代码可以如下所示：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ptr

@OptIn(ExperimentalForeignApi::class)
fun callRef() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_pointer(cStruct.ptr)

        val cUnion = alloc<MyUnion>()
        cUnion.b.a = 5
        cUnion.b.b = 2.7182

        union_by_pointer(cUnion.ptr)
    }
}
```

在这里，`ptr` 扩展属性（在 `memScoped {}` 代码块中可用）将 `MyStruct` 和 `MyUnion` 实例转换为原生指针。

由于内存是在 `memScoped {}` 代码块内部管理的，它会在代码块结束时自动释放。避免在此作用域之外使用指针，以防止访问已释放的内存。如果你需要更长生命周期的分配（例如，用于 C 库中的缓存），请考虑使用 `Arena()` 或 `nativeHeap`。

### CValue&lt;T&gt; 和 CValuesRef&lt;T&gt; 之间的转换

有时你需要在一个函数调用中将结构体作为值传递，然后在另一个函数调用中将相同的结构体作为引用传递。

为此，你需要一个 `NativePlacement`，但首先，让我们看看 `CValue<T>` 如何转换为指针：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped

@OptIn(ExperimentalForeignApi::class)
fun callMix_ref() {
    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }

    memScoped {
        struct_by_pointer(cStruct.ptr)
    }
}
```

在这里，`memScoped {}` 的 `ptr` 扩展属性再次将 `MyStruct` 实例转换为原生指针。这些指针仅在 `memScoped {}` 代码块内有效。

要将指针转换回按值传递的变量，请调用 `.readValue()` 扩展函数：

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.readValue

@OptIn(ExperimentalForeignApi::class)
fun callMix_value() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_value(cStruct.readValue())
    }
}
```

## 更新 Kotlin 代码

现在你已经学习了如何在 Kotlin 代码中使用 C 声明，尝试在你的项目中应用它们。`hello.kt` 文件中的最终代码可能如下所示：

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.ptr
import kotlinx.cinterop.readValue
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    memScoped {
        union_by_value(cUnion)
        union_by_pointer(cUnion.ptr)
    }

    memScoped {
        val cStruct = alloc<MyStruct> {
            a = 42
            b = 3.14
        }

        struct_by_value(cStruct.readValue())
        struct_by_pointer(cStruct.ptr)
    }
}
```

为了验证一切是否按预期工作，在你的 IDE 中运行 `runDebugExecutableNative` Gradle 任务或使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

本系列的下一部分，你将学习函数指针如何在 Kotlin 和 C 之间映射：

**[继续下一部分](mapping-function-pointers-from-c.md)**

### 参见

在 [C 语言互操作性](native-c-interop.md) 文档中了解更多信息，该文档涵盖了更高级的场景。