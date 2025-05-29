[//]: # (title: 从 C 映射函数指针 – 教程)

<tldr>
    <p>这是 **Kotlin 与 C 映射** 系列教程的第三部分。在继续之前，请确保你已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">从 C 映射原始数据类型</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">从 C 映射结构体和联合类型</a><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>映射函数指针</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">从 C 映射字符串</a><br/>
    </p>
</tldr>

> C 库导入是[实验性功能](components-stability.md#stability-levels-explained)。由 cinterop 工具从 C 库生成的所有 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> Kotlin/Native 附带的原生平台库（如 Foundation、UIKit 和 POSIX）仅对某些 API 需要选择性启用。
>
{style="warning"}

让我们探索哪些 C 函数指针在 Kotlin 中可见，并研究 Kotlin/Native 和 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 构建中与 C 互操作相关的进阶用例。

在本教程中，你将：

* [了解如何将 Kotlin 函数作为 C 函数指针传递](#pass-kotlin-function-as-a-c-function-pointer)
* [在 Kotlin 中使用 C 函数指针](#use-the-c-function-pointer-from-kotlin)

## 从 C 映射函数指针类型

为了理解 Kotlin 和 C 之间的映射，让我们声明两个函数：一个接受函数指针作为参数，另一个返回函数指针。

在本系列的[第一部分](mapping-primitive-data-types-from-c.md)中，你已经创建了一个包含所需文件的 C 库。对于此步骤，请在 `interop.def` 文件中的 `---` 分隔符后更新声明：

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

`interop.def` 文件提供了在 IDE 中编译、运行或打开应用程序所需的一切。

## 检查 C 库生成的 Kotlin API

让我们看看 C 函数指针如何映射到 Kotlin/Native 中并更新你的项目：

1. 在 `src/nativeMain/kotlin` 中，使用以下内容更新[之前教程](mapping-struct-union-types-from-c.md)中的 `hello.kt` 文件：

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

2. 使用 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）导航到以下生成的 C 函数 API：

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
   ```

如你所见，C 函数指针在 Kotlin 中使用 `CPointer<CFunction<...>>` 表示。`accept_fun()` 函数接受一个可选的函数指针作为参数，而 `supply_fun()` 返回一个函数指针。

`CFunction<(Int) -> Int>` 表示函数签名，而 `CPointer<CFunction<...>>?` 表示一个可空的函数指针。所有 `CPointer<CFunction<...>>` 类型都提供 `invoke` 运算符扩展函数，允许你像调用常规 Kotlin 函数一样调用函数指针。

## 将 Kotlin 函数作为 C 函数指针传递

是时候尝试从 Kotlin 代码中使用 C 函数了。调用 `accept_fun()` 函数并将 C 函数指针传递给 Kotlin lambda 函数：

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

此调用使用 Kotlin/Native 的 `staticCFunction {}` 辅助函数将 Kotlin lambda 函数包装成 C 函数指针。它只允许未绑定且不捕获的 lambda 函数。例如，它不能捕获函数中的局部变量，只能捕获全局可见的声明。

确保该函数不会抛出任何异常。从 `staticCFunction {}` 抛出异常会导致非确定性副作用。

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

Kotlin 将函数指针的返回类型转换为可空的 `CPointer<CFunction<>>` 对象。你需要首先显式检查 `null`，这就是为什么上面代码中使用了 [Elvis 运算符](null-safety.md)。cinterop 工具允许你像常规 Kotlin 函数调用一样调用 C 函数指针：`functionFromC(42)`。

## 更新 Kotlin 代码

现在你已经看到了所有定义，尝试在你的项目中使用它们。
`hello.kt` 文件中的代码可能如下所示：

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

要验证一切是否按预期工作，请在[你的 IDE 中](native-get-started.md#build-and-run-the-application)运行 `runDebugExecutableNative` Gradle 任务或使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，你将学习字符串如何在 Kotlin 和 C 之间进行映射：

**[继续下一部分](mapping-strings-from-c.md)**

### 另请参阅

在[与 C 互操作](native-c-interop.md)文档中了解更多信息，该文档涵盖了更高级的场景。