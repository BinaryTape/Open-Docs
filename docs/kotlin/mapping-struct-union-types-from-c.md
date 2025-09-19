[//]: # (title: 映射 C 语言中的结构体和联合体类型 – 教程)

<tldr>
    <p>这是 **Kotlin 与 C 的映射** 系列教程的第二部分。在继续之前，请确保已完成上一步。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">映射 C 语言中的基本数据类型</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>映射 C 语言中的结构体和联合体类型</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">映射函数指针</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">映射 C 语言中的字符串</a><br/>
    </p>
</tldr>

> C 库导入功能处于 [Beta](native-c-interop-stability.md) 阶段。由 cinterop 工具从 C 库生成的所有 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 提供的原生平台库（例如 Foundation、UIKit 和 POSIX）仅对部分 API 需要选择启用。
> {style="note"}

让我们探究哪些 C 结构体和联合体声明在 Kotlin 中可见，并探究 Kotlin/Native 和 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 构建中与 C 互操作相关的进阶用例。

在本教程中，你将学习：

* [结构体和联合体类型如何映射](#mapping-struct-and-union-c-types)
* [如何在 Kotlin 中使用结构体和联合体类型](#use-struct-and-union-types-from-kotlin)

## 映射 C 语言中的结构体和联合体类型

为了理解 Kotlin 如何映射结构体和联合体类型，让我们在 C 中声明它们并探究它们在 Kotlin 中的表示方式。

在[上一个教程](mapping-primitive-data-types-from-c.md)中，你已经创建了一个包含所需文件的 C 库。
对于此步骤，请在 `---` 分隔符后更新 `interop.def` 文件中的声明：

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

## 探查 C 库生成的 Kotlin API

让我们看看 C 结构体和联合体类型如何映射到 Kotlin/Native，并更新你的项目：

1. 在 `src/nativeMain/kotlin` 中，将你[上一个教程](mapping-primitive-data-types-from-c.md)中的 `hello.kt` 文件更新为以下内容：

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

2. 为避免编译错误，请将互操作性添加到构建过程。为此，请将 `build.gradle(.kts)` 构建文件更新为以下内容：

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

3. 使用 IntelliJ IDEA 的 [转到声明](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 导航到 C 函数、结构体和联合体生成的以下 API：

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

从技术上讲，在 Kotlin 侧结构体和联合体类型之间没有区别。cinterop 工具为 C 语言的结构体和联合体声明生成 Kotlin 类型。

生成的 API 包含 `CValue<T>` 和 `CValuesRef<T>` 的完全限定包名，反映了它们在 `kotlinx.cinterop` 中的位置。`CValue<T>` 表示一个按值传递的结构体形参，而 `CValuesRef<T>?` 用于向结构体或联合体传递指针。

## 在 Kotlin 中使用结构体和联合体类型

由于生成了 API，在 Kotlin 中使用 C 结构体和联合体类型简单直接。唯一的问题是如何创建这些类型的新实例。

让我们看看接受 `MyStruct` 和 `MyUnion` 作为形参的生成函数。按值形参表示为 `kotlinx.cinterop.CValue<T>`，而指针类型形参使用 `kotlinx.cinterop.CValuesRef<T>?`。

Kotlin 提供了一个方便的 API 用于创建和使用这些类型。让我们探究如何在实践中使用它。

### 创建 CValue&lt;T&gt;

`CValue<T>` 类型用于向 C 函数调用传递按值形参。使用 `cValue` 函数创建 `CValue<T>` 实例。该函数需要一个[带接收者的 lambda 表达式](lambdas.md#function-literals-with-receiver) 来就地初始化底层 C 类型。该函数声明如下：

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

以下是如何使用 `cValue` 并传递按值形参：

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

### 创建作为 CValuesRef&lt;T&gt; 的结构体和联合体

`CValuesRef<T>` 类型在 Kotlin 中用于传递 C 函数的指针类型形参。要在原生内存中分配 `MyStruct` 和 `MyUnion`，请在 `kotlinx.cinterop.NativePlacement` 类型上使用以下扩展函数：

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement` 表示原生内存，其函数类似于 `malloc` 和 `free`。`NativePlacement` 有几种实现：

* 全局实现是 `kotlinx.cinterop.nativeHeap`，但你必须在使用后调用 `nativeHeap.free()` 来释放内存。
* 更安全的替代方案是 `memScoped()`，它创建一个短生命周期的内存作用域，其中所有分配的内存在代码块结束时自动释放：

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
  ```

有了 `memScoped()`，你调用带指针的函数的代码可能如下所示：

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

在这里，`ptr` 扩展属性（在 `memScoped {}` 代码块内可用）将 `MyStruct` 和 `MyUnion` 实例转换为原生指针。

由于内存由 `memScoped {}` 代码块内部管理，它在代码块结束时自动释放。
避免在此作用域之外使用指针以防止访问已释放的内存。如果你需要生命周期更长的分配（例如，用于 C 库中的缓存），请考虑使用 `Arena()` 或 `nativeHeap`。

### CValue&lt;T&gt; 与 CValuesRef&lt;T&gt; 之间的转换

有时你需要在一次函数调用中将结构体作为值传递，然后在另一次函数调用中将相同的结构体作为引用传递。

要做到这一点，你需要一个 `NativePlacement`，但首先，让我们看看 `CValue<T>` 如何转换为指针：

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

在这里，`memScoped {}` 的 `ptr` 扩展属性再次将 `MyStruct` 实例转换为原生指针。
这些指针仅在 `memScoped {}` 代码块内有效。

要将指针转换回按值变量，请调用 `.readValue()` 扩展函数：

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

既然你已经学会了如何在 Kotlin 代码中使用 C 声明，请尝试在你的项目中使用它们。
`hello.kt` 文件中的最终代码可能如下所示：

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

要验证一切是否按预期工作，请[在你的 IDE 中](native-get-started.md#build-and-run-the-application)运行 `runDebugExecutableNative` Gradle 任务或使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，你将学习函数指针如何在 Kotlin 和 C 之间映射：

**[继续阅读下一部分](mapping-function-pointers-from-c.md)**

### 另请参见

在 [与 C 的互操作](native-c-interop.md) 文档中了解更多，该文档涵盖了更进阶的场景。