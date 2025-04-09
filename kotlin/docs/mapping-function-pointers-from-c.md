---
title: "C 语言中的映射函数指针 – 教程"
---
:::info
<p>
   这是 <strong>Kotlin 与 C 互操作</strong> 教程系列的第三部分。在继续之前，请确保您已完成之前的步骤。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">映射 C 语言中的基本数据类型</a><br/>
        <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">映射 C 语言中的结构体和联合体类型</a><br/>
        <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>映射函数指针</strong><br/>
        <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">映射 C 语言中的字符串</a><br/>
</p>

:::

:::caution
C 语言库导入是 [Experimental（实验性的）](components-stability#stability-levels-explained)。由 `cinterop` 工具从 C 语言库生成的所有 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。

Kotlin/Native 附带的 Native 平台库（如 Foundation、UIKit 和 POSIX）仅对某些 API 需要选择加入（opt-in）。

:::

让我们来探索哪些 C 语言函数指针在 Kotlin 中是可见的，并研究 Kotlin/Native 和 [multiplatform（多平台）](gradle-configure-project#targeting-multiple-platforms) Gradle 构建中与 C 语言互操作相关的高级用例。

在本教程中，您将：

* [学习如何将 Kotlin 函数作为 C 语言函数指针传递](#pass-kotlin-function-as-a-c-function-pointer)
* [使用 Kotlin 中的 C 语言函数指针](#use-the-c-function-pointer-from-kotlin)

## 映射 C 语言中的函数指针类型

为了理解 Kotlin 和 C 语言之间的映射，让我们声明两个函数：一个接受函数指针作为参数，另一个返回函数指针。

在本系列的[第一部分](mapping-primitive-data-types-from-c)中，您已经创建了一个包含必要文件的 C 语言库。对于此步骤，请在 `interop.def` 文件中更新 `---` 分隔符后的声明：

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

## 检查为 C 语言库生成的 Kotlin API

让我们看看 C 语言函数指针是如何映射到 Kotlin/Native 中的，并更新您的项目：

1. 在 `src/nativeMain/kotlin` 中，使用以下内容更新[之前教程](mapping-struct-union-types-from-c)中的 `hello.kt` 文件：

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

2. 使用 IntelliJ IDEA 的 [Go to declaration（跳转到声明）](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）导航到以下为 C 语言函数生成的 API：

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) `->` kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) `->` kotlin.Int>>? /* from: interop.MyFun? */
   ```

正如您所看到的，C 语言函数指针在 Kotlin 中使用 `CPointer<CFunction<...>>` 表示。`accept_fun()` 函数接受一个可选的函数指针作为参数，而 `supply_fun()` 返回一个函数指针。

`CFunction<(Int) `->` Int>` 表示函数签名，`CPointer<CFunction<...>>?` 表示一个可空的函数指针。对于所有 `CPointer<CFunction<...>>` 类型，都有一个可用的 `invoke` 运算符扩展函数，允许您像调用常规 Kotlin 函数一样调用函数指针。

## 将 Kotlin 函数作为 C 语言函数指针传递

现在是时候尝试从 Kotlin 代码中使用 C 语言函数了。调用 `accept_fun()` 函数并将 C 语言函数指针传递给 Kotlin lambda 表达式：

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

此调用使用 Kotlin/Native 中的 `staticCFunction {}` 辅助函数将 Kotlin lambda 表达式包装到 C 语言函数指针中。它只允许无绑定和非捕获的 lambda 表达式。例如，它不能从函数中捕获局部变量，只能捕获全局可见的声明。

确保该函数不会抛出任何异常。从 `staticCFunction {}` 抛出异常会导致不确定的副作用。

## 使用 Kotlin 中的 C 语言函数指针

下一步是调用从 `supply_fun()` 调用返回的 C 语言函数指针：

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

Kotlin 将函数指针返回类型转换为可空的 `CPointer<CFunction<>` 对象。您需要首先显式检查 `null`，这就是为什么在上面的代码中使用了 [Elvis 运算符](null-safety)。`cinterop` 工具允许您像调用常规 Kotlin 函数一样调用 C 语言函数指针：`functionFromC(42)`。

## 更新 Kotlin 代码

既然您已经了解了所有定义，请尝试在您的项目中使用它们。
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

要验证一切是否按预期工作，请[在 IDE 中](native-get-started#build-and-run-the-application)运行 `runDebugExecutableNative` Gradle 任务，或使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您将学习如何在 Kotlin 和 C 语言之间映射字符串：

**[进入下一部分](mapping-strings-from-c)**

### 参见

在 [与 C 语言的互操作性](native-c-interop) 文档中了解更多信息，该文档涵盖了更高级的场景。