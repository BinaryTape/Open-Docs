[//]: # (title: 映射 C 函数指针 – 教程)

<tldr>
    <p>这是 **Kotlin 与 C 的映射** 教程系列的第三部分。在继续之前，请确保你已完成前面步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">映射 C 原生数据类型</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">映射 C 结构体与联合类型</a><br/>
        <img src="icon-3.svg" width="20" alt="第三步"/> <strong>映射 C 函数指针</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="第四步"/> <a href="mapping-strings-from-c.md">映射 C 字符串</a><br/>
    </p>
</tldr>

> C 库导入处于 [Beta](native-c-interop-stability.md) 阶段。所有由 cinterop 工具从 C 库生成的 Kotlin 声明都应具有 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 附带的原生平台库（例如 Foundation、UIKit 和 POSIX）仅对部分 API 需要显式选择启用 (opt-in)。
>
{style="note"}

让我们探究从 Kotlin 中哪些 C 函数指针可见，并检查 Kotlin/Native 和 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 构建中 C 互操作相关的进阶用例。

在本教程中，你将：

* [学习如何将 Kotlin 函数作为 C 函数指针传递](#pass-kotlin-function-as-a-c-function-pointer)
* [在 Kotlin 中使用 C 函数指针](#use-the-c-function-pointer-from-kotlin)

## 从 C 映射函数指针类型

为了理解 Kotlin 与 C 之间的映射，让我们声明两个函数：一个接受函数指针作为形参，另一个返回函数指针。

在本系列[第一部分](mapping-primitive-data-types-from-c.md)中，你已经创建了一个包含必要文件的 C 库。对于此步骤，请在 `---` 分隔符之后更新 `interop.def` 文件中的声明：

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

`interop.def` 文件提供了所有必需内容，用于在 IDE 中编译、运行或打开应用程序。

## 探查 C 库生成的 Kotlin API

让我们看看 C 函数指针是如何映射到 Kotlin/Native 的，并更新你的项目：

1. 在 `src/nativeMain/kotlin` 中，使用以下内容更新[上一教程](mapping-struct-union-types-from-c.md)中的 `hello.kt` 文件：

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

2. 使用 IntelliJ IDEA 的 [转到声明](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 导航到以下生成的 C 函数 API：

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
   ```

如你所见，C 函数指针在 Kotlin 中表示为 `CPointer<CFunction<...>>`。`accept_fun()` 函数接受一个可选的函数指针作为形参，而 `supply_fun()` 返回一个函数指针。

`CFunction<(Int) -> Int>` 表示函数签名，而 `CPointer<CFunction<...>>?` 表示一个可空的函数指针。所有 `CPointer<CFunction<...>>` 类型都提供一个 [`.invoke()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/invoke.html) 操作符扩展函数，允许你像调用常规 Kotlin 函数一样调用函数指针。

## 将 Kotlin 函数作为 C 函数指针传递

是时候尝试在 Kotlin 代码中使用 C 函数了。调用 `accept_fun()` 函数并将 C 函数指针传递给 Kotlin lambda 表达式：

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

此调用使用了来自 Kotlin/Native 的 `staticCFunction {}` 辅助函数，将 Kotlin lambda 表达式函数包装成 C 函数指针。它只允许非绑定且不捕获的 lambda 表达式函数。例如，它不能捕获函数中的局部变量，只能捕获全局可见的声明。

确保该函数不会抛出任何异常。从 `staticCFunction {}` 中抛出异常会导致非确定性副作用。

## 在 Kotlin 中使用 C 函数指针

下一步是调用从 `supply_fun()` 调用返回的 C 函数指针：

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

Kotlin 将函数指针返回类型转换为可空的 `CPointer<CFunction<>` 对象。你需要首先显式检测 `null`，这就是为什么代码中使用了 [Elvis 操作符](null-safety.md)。cinterop 工具允许你将 C 函数指针作为常规 Kotlin 函数调用：`functionFromC(42)`。

## 更新 Kotlin 代码

既然你已经看到了所有定义，尝试在你的项目中使用它们。`hello.kt` 文件中的代码可能如下所示：

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

为了验证一切是否按预期工作，[在你的 IDE 中](native-get-started.md#build-and-run-the-application)运行 `runDebugExecutableNative` Gradle 任务，或使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，你将学习字符串如何在 Kotlin 和 C 之间映射：

**[继续到下一部分](mapping-strings-from-c.md)**

### 另请参阅

在 [与 C 的互操作性](native-c-interop.md) 文档中了解更多信息，该文档涵盖了更进阶的场景。