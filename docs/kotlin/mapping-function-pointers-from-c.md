[//]: # (title: 映射来自 C 的函数指针 – 教程)

<tldr>
    <p>这是<strong>映射 Kotlin 与 C</strong> 教程系列的第三部分。在继续之前，请确保您已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">映射来自 C 的基本数据类型</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">映射来自 C 的结构与联合类型</a><br/>
        <img src="icon-3.svg" width="20" alt="第三步"/> <strong>映射来自 C 的函数指针</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="第四步"/> <a href="mapping-strings-from-c.md">映射来自 C 的字符串</a><br/>
    </p>
</tldr>

> C 库导入目前处于 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 阶段。由 cinterop 工具从 C 库生成的。所有 Kotlin 声明都应包含 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 提供的原生平台库（如 Foundation、UIKit 和 POSIX）仅对某些 API 要求选择性使用（opt-in）。
>
{style="note"}

让我们探索从 Kotlin 中可以看到哪些 C 函数指针，并研究 Kotlin/Native 和[多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 构建中与 C 互操作相关的高级用例。

在本教程中，您将：

* [学习如何将 Kotlin 函数作为 C 函数指针传递](#pass-kotlin-function-as-a-c-function-pointer)
* [从 Kotlin 中使用 C 函数指针](#use-the-c-function-pointer-from-kotlin)

## 映射来自 C 的函数指针类型

为了理解 Kotlin 和 C 之间的映射，我们声明两个函数：一个接受函数指针作为形参，另一个返回函数指针。

在[本系列的第一个部分](mapping-primitive-data-types-from-c.md)中，您已经创建了一个包含必要文件的 C 库。对于这一步，请在 `---` 分隔符之后更新 `interop.def` 文件中的声明：

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

`interop.def` 文件提供了编译、运行或在 IDE 中打开应用程序所需的一切。

## 检查生成的 C 库 Kotlin API

让我们看看 C 函数指针是如何映射到 Kotlin/Native 的，并更新您的项目：

1. 在 `src/nativeMain/kotlin` 中，使用以下内容更新您在[上一个教程](mapping-struct-union-types-from-c.md)中的 `hello.kt` 文件：

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

2. 使用 IntelliJ IDEA 的[转到定义](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）导航到以下生成的 C 函数 API：

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
   ```

如您所见，C 函数指针在 Kotlin 中使用 `CPointer<CFunction<...>>` 表示。`accept_fun()` 函数接受一个可选的函数指针作为形参，而 `supply_fun()` 返回一个函数指针。

`CFunction<(Int) -> Int>` 代表函数签名，而 `CPointer<CFunction<...>>?` 代表一个可为 null 的函数指针。所有 `CPointer<CFunction<...>>` 类型都有一个可用的 [`.invoke()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/invoke.html) 运算符扩展函数，允许您像调用常规 Kotlin 函数一样调用函数指针。

## 将 Kotlin 函数作为 C 函数指针传递

是时候尝试从 Kotlin 代码中使用 C 函数了。调用 `accept_fun()` 函数并将 C 函数指针传递给 Kotlin lambda 表达式：

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

此调用使用 Kotlin/Native 的 `staticCFunction {}` 辅助函数将 Kotlin lambda 表达式函数包装为 C 函数指针。它仅允许非绑定且非捕获的 lambda 表达式。例如，它不能从函数中捕获局部变量，只能捕获全局可见的声明。

确保该函数不会抛出任何异常。从 `staticCFunction {}` 中抛出异常会导致不确定的副作用。

## 从 Kotlin 中使用 C 函数指针

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

Kotlin 将函数指针返回值类型转换为可为 null 的 `CPointer<CFunction<>>` 对象。您需要首先显式检查 `null`，这就是为什么在上面的代码中使用 [Elvis 运算符](null-safety.md)的原因。cinterop 工具允许您像调用常规 Kotlin 函数一样调用 C 函数指针：`functionFromC(42)`。

## 更新 Kotlin 代码

既然您已经看过了所有的定义，请尝试在您的项目中使用它们。`hello.kt` 文件中的代码可能如下所示：

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

要验证一切是否按预期运行，请[在您的 IDE 中](native-get-started.md#build-and-run-the-application)运行 `runDebugExecutableNative` Gradle 任务，或使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您将学习如何在 Kotlin 和 C 之间映射字符串：

**[继续下一步](mapping-strings-from-c.md)**

### 另请参阅

在涵盖更多高级场景的[与 C 互操作](native-c-interop.md)文档中了解更多信息。