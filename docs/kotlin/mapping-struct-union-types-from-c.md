[//]: # (title: 从 C 映射 struct 和 union 类型 – 教程)

<tldr>
    <p>这是<strong>从 Kotlin 映射 C</strong> 教程系列的第二部分。在继续之前，请确保你已经完成了上一步。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">从 C 映射基本数据类型</a><br/>
       <img src="icon-2.svg" width="20" alt="第二步"/> <strong>从 C 映射 struct 和 union 类型</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> <a href="mapping-function-pointers-from-c.md">从 C 映射函数指针</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> <a href="mapping-strings-from-c.md">从 C 映射字符串</a><br/>
    </p>
</tldr>

> C 库导入目前处于 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 阶段。所有由 cinterop 工具从 C 库生成的 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 提供的原生平台库（如 Foundation、UIKit 和 POSIX）仅对部分 API 要求选择性加入（opt-in）。
>
{style="note"}

让我们来探索哪些 C struct 和 union 声明在 Kotlin 中可见，并研究 Kotlin/Native 以及[多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 构建中与 C 互操作相关的高级用例。

在本教程中，你将学习：

* [struct 和 union 类型如何映射](#mapping-struct-and-union-c-types)
* [如何在 Kotlin 中使用 struct 和 union 类型](#use-struct-and-union-types-from-kotlin)

## 映射 C 语言中的 struct 和 union 类型

为了理解 Kotlin 如何映射 struct 和 union 类型，我们先在 C 中声明它们，并检查它们在 Kotlin 中是如何表示的。

在[上一个教程](mapping-primitive-data-types-from-c.md)中，你已经创建了一个包含必要文件的 C 库。对于这一步，请更新 `interop.def` 文件中 `---` 分隔符之后的声明：

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

`interop.def` 文件提供了在 IDE 中编译、运行或打开应用程序所需的一切。

## 检查为 C 库生成的 Kotlin API

让我们看看 C struct 和 union 类型是如何映射到 Kotlin/Native 的，并更新你的项目：

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

2. 为了避免编译器错误，请将互操作性添加到构建过程中。为此，请使用以下内容更新你的 `build.gradle(.kts)` 构建文件：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        macosArm64()    // Apple 芯片上的 macOS
        // linuxArm64() // ARM64 平台上的 Linux
        // linuxX64()   // x86_64 平台上的 Linux
        // mingwX64()   // Windows 上

        targets.withType<KotlinNativeTarget>().configureEach {
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
        macosArm64()    // Apple 芯片上的 macOS
        // linuxArm64() // ARM64 平台上的 Linux
        // linuxX64()   // x86_64 平台上的 Linux
        // mingwX64()   // Windows 上

        targets.withType(KotlinNativeTarget).configureEach {
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

3. 使用 IntelliJ IDEA 的[转到定义](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）导航到以下为 C 函数、struct 和 union 生成的 API：

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

从技术上讲，在 Kotlin 侧，struct 和 union 类型之间没有区别。cinterop 工具会为 C 语言的 struct 和 union 声明生成 Kotlin 类型。

生成的 API 包含 `CValue<T>` 和 `CValuesRef<T>` 的完全限定包名，反映了它们在 `kotlinx.cinterop` 中的位置。`CValue<T>` 表示按值传递的结构体形参，而 `CValuesRef<T>?` 则用于传递指向结构体或 union 的指针。

## 如何在 Kotlin 中使用 struct 和 union 类型

得益于生成的 API，在 Kotlin 中使用 C struct 和 union 类型非常直接。唯一的问题是如何创建这些类型的新实例。

让我们看看这些将 `MyStruct` 和 `MyUnion` 作为形参的生成函数。按值传递的形参表示为 `kotlinx.cinterop.CValue<T>`，而指针类型的形参使用 `kotlinx.cinterop.CValuesRef<T>?`。

Kotlin 提供了一个便捷的 API 来创建和使用这些类型。让我们看看如何在实践中使用它。

### 创建 CValue&lt;T&gt;

`CValue<T>` 类型用于向 C 函数调用传递按值形参。使用 `cValue` 函数来创建 `CValue<T>` 实例。该函数需要一个[带有接收者的 lambda 函数](lambdas.md#function-literals-with-receiver)来原地初始化底层的 C 类型。该函数的声明如下：

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

以下是如何使用 `cValue` 并传递按值形参的方法：

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

### 将 struct 和 union 创建为 CValuesRef&lt;T&gt;

在 Kotlin 中，`CValuesRef<T>` 类型用于传递 C 函数的指针类型形参。要在原生内存中分配 `MyStruct` 和 `MyUnion`，请对 `kotlinx.cinterop.NativePlacement` 类型使用以下扩展函数：

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement` 表示原生内存，其具备类似于 `malloc` 和 `free` 的函数。`NativePlacement` 有几种实现：

* 全局实现是 `kotlinx.cinterop.nativeHeap`，但你必须在调用后使用 `nativeHeap.free()` 来释放内存。
* 一个更安全的替代方案是 `memScoped()`，它会创建一个短期的内存作用域，其中所有的分配都会在代码块结束时自动释放：

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
  ```

使用 `memScoped()`，你调用带指针函数的代码如下所示：

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

这里，`ptr` 扩展属性（在 `memScoped {}` 块中可用）将 `MyStruct` 和 `MyUnion` 实例转换为原生指针。

由于内存是在 `memScoped {}` 块内管理的，它会在块结束时自动释放。避免在此作用域之外使用指针，以防止访问已释放的内存。如果你需要更长周期的分配（例如用于 C 库中的缓存），请考虑使用 `Arena()` 或 `nativeHeap`。

### CValue&lt;T&gt; 与 CValuesRef&lt;T&gt; 之间的转换

有时你需要在一次函数调用中将结构体作为值传递，然后在另一次调用中将同一个结构体作为引用传递。

为此，你需要一个 `NativePlacement`，但首先，让我们看看如何将 `CValue<T>` 转换为指针：

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

这里再次使用了来自 `memScoped {}` 的 `ptr` 扩展属性将 `MyStruct` 实例转换为原生指针。这些指针仅在 `memScoped {}` 块内有效。

要将指针转回按值变量，请调用 `.readValue()` 扩展函数：

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

既然你已经学习了如何在 Kotlin 代码中使用 C 声明，请尝试在你的项目中使用它们。`hello.kt` 文件中的最终代码可能如下所示：

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

要验证一切是否如预期工作，请[在 IDE 中](native-get-started.md#build-and-run-the-application)运行 `runDebugExecutable<YourTargetName>` Gradle 任务，或在本示例中使用控制台命令：

```bash
./gradlew runDebugExecutableMacosArm64
```

## 下一步

在本系列的下一部分中，你将学习如何在 Kotlin 和 C 之间映射函数指针：

**[继续下一步](mapping-function-pointers-from-c.md)**

### 另请参阅

在[与 C 互操作](native-c-interop.md)文档中了解更多信息，该文档涵盖了更多高级场景。