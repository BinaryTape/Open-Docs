[//]: # (title: 库作者向后兼容性指南)

创建库最常见的动机是向更广泛的社区开放功能。
这个社区可能是一个团队、一家公司、一个特定的行业或一个技术平台。
在任何情况下，向后兼容性都是一个重要的考虑因素。
社区越广泛，向后兼容性就越重要，因为你对用户是谁以及他们在什么约束下工作了解得越少。

向后兼容性不是一个单一的术语，它可以定义在二进制、源代码和行为级别。
本节提供了有关这些类型的更多信息。

请注意：

* 有可能在不破坏源代码兼容性的情况下破坏二进制兼容性，反之亦然。
* 保证源代码兼容性是理想的，但非常困难。作为库作者，你必须考虑库用户调用或实例化函数或类型的每种可能方式。
  源代码兼容性通常是一种追求，而不是一种承诺。

本节的其余部分介绍了你可以采取的操作以及可以用来帮助确保不同类型兼容性的工具。

## 兼容性类型 {initial-collapse-state="collapsed" collapsible="true"}

**二进制兼容性**意味着库的新版本可以替换库先前编译的版本。
任何针对库的先前版本编译的软件都应该能够继续正常工作。

> 欲了解更多关于二进制兼容性的信息，请参阅 [Binary compatibility validator 的 README](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#what-makes-an-incompatible-change-to-the-public-binary-api) 或 [Evolving Java-based APIs](https://github.com/eclipse-platform/eclipse.platform/blob/master/docs/Evolving-Java-based-APIs-2.md) 文档。
>
{style="tip"}

**源代码兼容性**意味着库的新版本可以替换之前的版本，而无需修改任何使用该库的源代码。然而，编译这些客户端代码的输出可能不再与编译库的输出兼容，因此必须针对库的新版本重新构建客户端代码以保证兼容性。

**行为兼容性**意味着库的新版本不会修改现有功能（修复错误除外）。涉及相同的功能，并且它们具有相同的语义。

## 使用 Binary compatibility validator

JetBrains 提供了一个 [Binary compatibility validator](https://github.com/Kotlin/binary-compatibility-validator) 工具，可用于确保 API 不同版本之间的二进制兼容性。

该工具以 Gradle 插件的形式实现，它为你的构建添加了两个任务：

* `apiDump` 任务创建一个描述 API 的人类可读的 `.api` 文件。
* `apiCheck` 任务将保存的 API 描述与当前构建中编译的类进行比较。

`apiCheck` 任务在构建时由标准的 Gradle `check` 任务调用。
当兼容性被破坏时，构建会失败。此时，你应该手动运行 `apiDump` 任务并对比新旧版本之间的差异。
如果你对更改感到满意，可以更新位于版本控制系统中的现有 `.api` 文件。

该验证器对多平台库生成的 [KLib 验证提供实验性支持](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#experimental-klib-abi-validation-support)。

### Kotlin Gradle 插件中的二进制兼容性验证

<primary-label ref="experimental-general"/>

从 2.2.0 版本开始，Kotlin Gradle 插件支持二进制兼容性验证。欲了解更多信息，请参阅 [Kotlin Gradle 插件中的二进制兼容性验证](gradle-binary-compatibility-validation.md)。

## 显式指定返回值类型

正如 [Kotlin 编码规范](coding-conventions.md#coding-conventions-for-libraries)中所讨论的，你应该始终在 API 中显式指定函数返回值类型和属性类型。另请参阅有关[显式 API 模式](api-guidelines-simplicity.md#use-explicit-api-mode)的章节。

考虑以下示例，库作者创建了一个 `JsonDeserializer`，并为了方便使用扩展函数将其与 `Int` 类型关联：

```kotlin
class JsonDeserializer<T>(private val fromJson: (String) -> T) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonDeserializer { ... }
```

假设作者将此实现替换为 `JsonOrXmlDeserializer`：

```kotlin
class JsonOrXmlDeserializer<T>(
    private val fromJson: (String) -> T,
    private val fromXML: (String) -> T
) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonOrXmlDeserializer({ ... }, { ... })
```

现有功能将继续工作，并增加了反序列化 XML 的能力。然而，这破坏了二进制兼容性。

## 避免向现有 API 函数添加实参

向公共 API 添加非默认实参会破坏二进制和源代码兼容性，因为用户在调用时需要提供比以前更多的信息。然而，即使是添加[默认形参](functions.md#parameters-with-default-values)也可能会破坏兼容性。

例如，假设你在 `lib.kt` 中有以下函数：

```kotlin
fun fib() = … // 返回零
```

以及 `client.kt` 中的以下函数：

```kotlin
fun main() {
    println(fib()) // 打印零
}
```
在 JVM 上编译这两个文件会生成输出 `LibKt.class` 和 `ClientKt.class`。

假设你重新实现并编译 `fib` 函数来表示斐波那契数列，例如 `fib(3)` 返回 2，`fib(4)` 返回 3，依此类推。
你添加了一个形参，但为了保留现有行为给它一个默认值零：

```kotlin
fun fib(input: Int = 0) = … // 返回斐波那契成员
```

你现在需要重新编译文件 `lib.kt`。你可能期望 `client.kt` 文件不需要重新编译，并且可以如下调用关联的类文件：

```shell
$ kotlin ClientKt.class
```

但如果你尝试这样做，会发生 `NoSuchMethodError`：

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'int LibKt.fib()'
       at LibKt.main(fib.kt:2)
       at LibKt.main(fib.kt)
       …
```

这是因为 Kotlin/JVM 编译器生成的字节码中方法的签名发生了变化，从而破坏了二进制兼容性。

然而，源代码兼容性得到了保留。如果你重新编译这两个文件，程序将像以前一样运行。

### 使用手动重载来保留兼容性 {initial-collapse-state="collapsed" collapsible="true"}

为了保持二进制兼容性，如果你想向函数添加新形参，你需要手动创建多个重载，而不是使用带默认形参的单个函数。在上面的示例中，这意味着为需要接收 `Int` 形参的情况创建一个单独的 `fib()` 函数：

```kotlin
fun fib() = … 
fun fib(input: Int) = …
```

在为 JVM 编写 Kotlin 代码时，向带有 `@JvmOverloads` 注解且具有默认形参的函数添加形参时要小心。该注解不会保留二进制兼容性，因此你仍然需要添加手动重载。

## 避免扩大或缩小返回值类型

在演进 API 时，通常会希望扩大或缩小函数的返回值类型。
例如，在 API 的未来版本中，你可能希望将返回值类型从 `List` 切换为 `Collection`，或者从 `Collection` 切换为 `List`。

你可能希望将类型缩小为 `List` 以满足用户对索引支持的要求。
反之，你可能希望将类型扩大为 `Collection`，因为你意识到正在处理的数据没有自然顺序。

很容易看出为什么扩大返回值类型会破坏兼容性。例如，从 `List` 转换为 `Collection` 会破坏所有使用索引的代码。

你可能认为缩小返回值类型（例如从 `Collection` 缩小到 `List`）会保留兼容性。
不幸的是，虽然源代码兼容性得到了保留，但二进制兼容性却被破坏了。

假设你在文件 `Library.kt` 中有一个演示函数：

```kotlin
public fun demo(): Number = 3
```

以及 `Client.kt` 中该函数的客户端：

```kotlin
fun main() {
    println(demo()) // 打印 3
}
```

设想一种情况，你更改了 demo 的返回值类型并且只重新编译 `Library.kt`：

```kotlin
fun demo(): Int = 3
```

当你重新运行客户端时，将发生以下错误（在 JVM 上）：

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'java.lang.Number Library.demo()'
        at ClientKt.main(call.kt:2)
        at ClientKt.main(call.kt)
        …
```

这是因为从 `main` 方法生成的字节码中包含以下指令：

```text
0: invokestatic  #12 // Method Library.demo:()Ljava/lang/Number;
```

JVM 试图调用一个名为 demo 且返回 `Number` 的静态方法。
然而，由于该方法不再存在，你破坏了二进制兼容性。

## 避免在 API 中使用数据类

在常规开发中，`data class` 的优势在于为你生成的额外函数。
在 API 设计中，这种优势变成了弱点。

例如，假设你在 API 中使用以下 `data class`：

```kotlin
data class User(
    val name: String,
    val email: String
)
```

稍后，你可能想添加一个名为 `active` 的属性：

```kotlin
data class User(
    val name: String,
    val email: String,
    val active: Boolean = true
)
```

这会以两种方式破坏二进制兼容性。首先，生成的构造函数将具有不同的签名。
此外，生成的 `copy` 方法的签名也会改变。

原始签名（在 Kotlin/JVM 上）为：

```text
public final User copy(java.lang.String, java.lang.String)
```

添加 `active` 属性后，签名变为：

```text
public final User copy(java.lang.String, java.lang.String, boolean)
```

与构造函数一样，这破坏了二进制兼容性。

可以通过手动编写次构造函数并重写 `copy` 方法来绕过这些问题。
然而，所涉及的工作量抵消了使用 `data class` 的便利性。

`data class` 的另一个问题是，更改构造函数实参的顺序会影响生成的 `componentX` 方法，这些方法用于析构。即使它没有破坏二进制兼容性，更改顺序也肯定会破坏行为兼容性。

## 使用 PublishedApi 注解的注意事项

Kotlin 允许内联函数作为库 API 的一部分。对这些函数的调用将被内联到用户编写的客户端代码中。这可能会引入兼容性问题，因此不允许这些函数调用非公共 API 声明。

如果你需要从内联公共函数调用库的内部 API，可以通过使用 `@PublishedApi` 对其进行注解来实现。
这使得内部声明实际上变为公共的，因为对它的引用最终会出现在编译后的客户端代码中。
因此，在对其进行更改时必须像对待公共声明一样对待它，因为这些更改可能会影响二进制兼容性。

## 务实地演进 API

在某些情况下，你需要通过移除或更改现有声明来随着时间的推移对库的 API 进行破坏性更改。
在本节中，我们将讨论如何务实地处理此类情况。

当用户升级到库的新版本时，他们的项目源代码中不应出现对库 API 的未解析引用。你不应立即从库的公共 API 中移除某些内容，而应遵循弃用周期。这样，你就可以给用户时间迁移到替代方案。

在旧声明上使用 `@Deprecated` 注解来表明它正在被替换。该注解的形参提供了有关弃用的重要细节：

* `message` 应解释正在更改的内容以及原因。
* 应尽可能使用 `replaceWith` 形参来提供到新 API 的自动迁移。
* 弃用级别应用于逐步弃用 API。欲了解更多信息，请参阅 [Kotlin 文档的 Deprecated 页面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)。

通常，弃用应该先产生警告，然后产生错误，最后隐藏该声明。
此过程应跨越多个次要版本进行，以便用户有时间在其项目中进行任何所需的更改。
破坏性更改（例如移除 API）应仅在主要版本中发生。
库可能会采用不同的版本控制和弃用策略，但必须将其传达给用户以建立正确的预期。

你可以在 [Kotlin 演进原则文档](kotlin-evolution-principles.md#libraries)或 KotlinConf 2023 上由 Leonid Startsev 主讲的 [Evolving your Kotlin API painlessly for clients](https://www.youtube.com/watch?v=cCgXtpVPO-o&t=1468s) 演讲中了解更多信息。

## 使用 RequiresOptIn 机制

Kotlin 标准库[提供了选择入 (opt-in) 机制](opt-in-requirements.md)，要求用户在使用 API 的一部分之前进行显式同意。
这是基于创建标记注解，这些注解本身被 `@RequiresOptIn` 注解。
你应该使用此机制来管理有关源代码和行为兼容性的预期，尤其是在向库中引入新 API 时。

如果你选择使用此机制，我们建议遵循以下最佳做法：

* 使用选择入机制为 API 的不同部分提供不同的保证。例如，你可以将功能标记为 _Preview_、_Experimental_ 和 _Delicate_。每个类别都应在你的文档和 [KDoc 注释](kotlin-doc.md)中明确说明，并附带适当的警告消息。
* 如果你的库使用了实验性 API，请将[该注解传播](opt-in-requirements.md#propagate-opt-in-requirements)给你自己的用户。这可确保你的用户意识到你具有仍在演进中的依赖项。
* 避免使用选择入机制来弃用库中已经存在的声明。请改用 `@Deprecated`，如[务实地演进 API](#evolve-apis-pragmatically) 部分所述。

## 下一步

如果你还没有查看过这些页面，请考虑查看：

* 在[最小化思维复杂度](api-guidelines-minimizing-mental-complexity.md)页面中探索最小化思维复杂度的策略。
* 有关有效文档实践的广泛概述，请参阅[信息丰富的文档](api-guidelines-informative-documentation.md)。