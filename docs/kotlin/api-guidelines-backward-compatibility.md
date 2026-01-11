[//]: # (title: 针对库作者的向后兼容性指南)

创建库最常见的动机是向更广泛的社区暴露功能性。这个社区可能是一个单个团队、一家公司、一个特定行业或一个技术平台。在每种情况下，向后兼容性都将是一个重要考量。社区越广泛，向后兼容性就越重要，因为你将越不清楚你的用户是谁以及他们工作所受的限制。

向后兼容性并非单一术语，而可以在二进制、源代码和行为层面定义。本节将提供关于这些类型的更多信息。

请注意：

*   在不破坏源代码兼容性的情况下，可能会破坏二进制兼容性，反之亦然。
*   保证源代码兼容性是期望的，但非常困难。作为库作者，你必须考虑库用户可能调用或实例化函数或类型的每种可能方式。源代码兼容性通常是一种愿望，而非承诺。

本节的其余部分将描述你可以采取的行动以及可以使用的工具，以帮助确保不同类型的兼容性。

## 兼容性类型 {initial-collapse-state="collapsed" collapsible="true"}

**二进制兼容性**意味着库的新版本可以替换之前编译的库版本。任何针对先前库版本编译的软件都应继续正常工作。

> 关于二进制兼容性，请参阅 [Binary compatibility validator 的 README](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#what-makes-an-incompatible-change-to-the-public-binary-api) 或 [演进基于 Java 的 API](https://github.com/eclipse-platform/eclipse.platform/blob/master/docs/Evolving-Java-based-APIs-2.md) 文档。
>
{style="tip"}

**源代码兼容性**意味着库的新版本可以替换旧版本，而无需修改使用该库的任何源代码。然而，编译此客户端代码的输出可能不再与编译库的输出兼容，因此客户端代码必须针对库的新版本重新构建以保证兼容性。

**行为兼容性**意味着库的新版本不会修改现有功能性，除非是为了修复 bug。所涉及的特性保持不变，并且它们具有相同的语义。

## 使用 Binary compatibility validator

JetBrains 提供了一个 [Binary compatibility validator](https://github.com/Kotlin/binary-compatibility-validator) 工具，可用于确保 API 不同版本间的二进制兼容性。

该工具实现为一个 Gradle 插件，它会为你的构建添加两个任务：

*   `apiDump` 任务创建一个人类可读的 `.api` 文件，用于描述你的 API。
*   `apiCheck` 任务将已保存的 API 描述与当前构建中编译的类进行比较。

`apiCheck` 任务在构建时由标准 Gradle `check` 任务调用。当兼容性被破坏时，构建会失败。此时，你应该手动运行 `apiDump` 任务，并比较旧版本和新版本之间的差异。如果你对更改满意，可以更新位于你的版本控制系统中的现有 `.api` 文件。

该验证器对多平台库生成的 [KLibs 验证提供了实验性支持](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#experimental-klib-abi-validation-support)。

### Kotlin Gradle 插件中的二进制兼容性验证

<primary-label ref="experimental-general"/>

从 2.2.0 版本开始，Kotlin Gradle 插件支持二进制兼容性验证。关于更多信息，请参见 [Kotlin Gradle 插件中的二进制兼容性验证](gradle-binary-compatibility-validation.md)。

## 显式指定返回类型

正如 [Kotlin 编码规范](coding-conventions.md#coding-conventions-for-libraries) 中讨论的，你应该始终在 API 中显式指定函数返回类型和属性类型。另请参见关于 [显式 API 模式](api-guidelines-simplicity.md#use-explicit-api-mode) 的部分。

考虑以下示例，其中库作者创建了一个 `JsonDeserializer`，并为了方便，使用一个扩展函数将其与 `Int` 类型关联：

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

现有功能性将继续工作，并增加了反序列化 XML 的能力。然而，这会破坏二进制兼容性。

## 避免向现有 API 函数添加实参

向公共 API 添加非默认实参会破坏二进制兼容性**和**源代码兼容性，因为用户在调用时需要提供比以前更多的信息。然而，即使添加 [默认实参](functions.md#parameters-with-default-values) 也可能破坏兼容性。

例如，假设你在 `lib.kt` 文件中有以下函数：

```kotlin
fun fib() = … // 返回零
```

以及在 `client.kt` 文件中的以下函数：

```kotlin
fun main() {
    println(fib()) // 打印零
}
```
在 JVM 上编译这两个文件将生成 `LibKt.class` 和 `ClientKt.class` 文件。

假设你重新实现并编译 `fib` 函数以表示斐波那契数列，使得 `fib(3)` 返回 2，`fib(4)` 返回 3，等等。你添加了一个形参，但赋予它一个默认值零以保留现有行为：

```kotlin
fun fib(input: Int = 0) = … // 返回斐波那契数列成员
```

现在你需要重新编译 `lib.kt` 文件。你可能期望 `client.kt` 文件不需要重新编译，并且相关联的类文件可以按如下方式调用：

```shell
$ kotlin ClientKt.class
```

但是如果你尝试这样做，会发生 `NoSuchMethodError`：

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'int LibKt.fib()'
       at LibKt.main(fib.kt:2)
       at LibKt.main(fib.kt)
       …
```

这是因为该方法的签名在 Kotlin/JVM 编译器生成的字节码中发生了改变，从而破坏了二进制兼容性。

然而，源代码兼容性得以保留。如果你重新编译这两个文件，程序将像以前一样运行。

### 使用重载保留兼容性 {initial-collapse-state="collapsed" collapsible="true"}

为了保留二进制兼容性，如果你想向函数添加新形参，你需要手动创建多个重载，而不是只使用一个带有默认实参的函数。在上面的示例中，这意味着为需要接受 `Int` 形参的情况创建一个单独的 `fib` 函数：

```kotlin
fun fib() = … 
fun fib(input: Int) = …
```

在为 JVM 编写 Kotlin 代码时，当向带有默认实参且被 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/) 注解的函数添加形参时，请务必小心。该注解不保留二进制兼容性，因此你仍然需要添加手动重载。

## 避免拓宽或窄化返回类型

在演进 API 时，通常会想要拓宽或窄化函数的返回类型。例如，在 API 的即将发布版本中，你可能希望将返回类型从 `List` 切换到 `Collection`，或从 `Collection` 切换到 `List`。

你可能希望将类型窄化为 `List` 以满足用户对索引支持的需求。相反地，你可能希望将类型拓宽为 `Collection`，因为你意识到你正在处理的数据没有自然顺序。

很容易理解为什么拓宽返回类型会破坏兼容性。例如，将返回类型从 `List` 转换为 `Collection` 会破坏所有使用索引的代码。

你可能认为窄化返回类型，例如从 `Collection` 到 `List`，会保留兼容性。不幸的是，虽然源代码兼容性得以保留，但二进制兼容性却被破坏了。

假设你在 `Library.kt` 文件中有一个演示函数：

```kotlin
public fun demo(): Number = 3
```

以及在 `Client.kt` 文件中该函数的客户端：

```kotlin
fun main() {
    println(demo()) // 打印 3
}
```

设想一个场景，你改变了 `demo` 的返回类型，并且只重新编译 `Library.kt`：

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

这发生是因为从 `main` 方法生成的字节码中包含以下指令：

```text
0: invokestatic  #12 // Method Library.demo:()Ljava/lang/Number;
```

JVM 正在尝试调用一个名为 `demo` 且返回 `Number` 的静态方法。然而，由于此方法不再存在，你已破坏了二进制兼容性。

## 避免在 API 中使用数据类

在常规开发中，数据类的优点在于它会为你生成额外的函数。在 API 设计中，这个优点却变成了缺点。

例如，假设你在 API 中使用以下数据类：

```kotlin
data class User(
    val name: String,
    val email: String
)
```

之后，你可能想要添加一个名为 `active` 的属性：

```kotlin
data class User(
    val name: String,
    val email: String,
    val active: Boolean = true
)
```

这会以两种方式破坏二进制兼容性。首先，生成的构造函数将具有不同的签名。此外，生成的 `copy` 方法的签名也发生了变化。

原始签名（在 Kotlin/JVM 上）将是：

```text
public final User copy(java.lang.String, java.lang.String)
```

添加 `active` 属性后，签名变为：

```text
public final User copy(java.lang.String, java.lang.String, boolean)
```

与构造函数一样，这会破坏二进制兼容性。

通过手动编写辅助构造函数并覆盖 `copy` 方法，可以解决这些问题。然而，所涉及的努力抵消了使用数据类的便利性。

数据类的另一个问题是，改变构造函数实参的顺序会影响生成的 `componentX` 方法，这些方法用于解构。即使它不破坏二进制兼容性，改变顺序也肯定会破坏行为兼容性。

## 使用 PublishedApi 注解的考量

Kotlin 允许内联函数成为库 API 的一部分。对这些函数的调用将被内联到用户编写的客户端代码中。这可能引入兼容性问题，因此这些函数不允许调用非公共 API 声明。

如果你需要从内联的公共函数中调用库的内部 API，你可以通过使用 [`@PublishedApi`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-published-api/) 注解来实现。这使得内部声明实际上成为公共的，因为对它的引用最终将出现在编译后的客户端代码中。因此，在对其进行更改时，必须将其视为与公共声明相同，因为这些更改可能会影响二进制兼容性。

## 务实地演进 API

在某些情况下，你可能需要随着时间的推移，通过删除或更改现有声明来对库的 API 进行破坏性更改。在本节中，我们将讨论如何务实地处理此类情况。

当用户升级到库的新版本时，他们不应在项目源代码中遇到对库 API 的未解析引用。与其立即从库的公共 API 中移除某些内容，不如遵循弃用周期。这样，你可以给用户时间迁移到替代方案。

在旧声明上使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 注解，以表明它正在被替换。此注解的形参提供了关于弃用的重要详细信息：

*   `message` 应解释正在更改什么以及为什么。
*   在可能的情况下，应使用 `replaceWith` 形参来提供到新 API 的自动迁移。
*   应使用弃用级别来逐步弃用 API。欲了解更多信息，请参见 [Kotlin 文档的 Deprecated 页面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)。

通常，弃用应首先产生警告，然后是错误，最后隐藏该声明。此过程应跨多个次要版本发生，给用户时间在其项目中进行任何所需的更改。破坏性更改，例如移除 API，应只发生在主要版本中。库可以采用不同的版本控制和弃用策略，但这必须告知其用户以设定正确的预期。

你可以在 [Kotlin 演进原则文档](kotlin-evolution-principles.md#libraries) 或 Leonid Startsev 在 KotlinConf 2023 上发表的 [为客户端无痛演进你的 Kotlin API 演讲](https://www.youtube.com/watch?v=cCgXtpVPO-o&t=1468s) 中了解更多信息。

## 使用 RequiresOptIn 机制

Kotlin 标准库 [提供了 opt-in 机制](opt-in-requirements.md)，要求用户在使用你 API 的一部分之前显式同意。这基于创建标记注解，这些注解本身被 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 注解。你应该使用此机制来管理关于源代码和行为兼容性的预期，特别是在向库引入新 API 时。

如果你选择使用此机制，我们建议遵循以下最佳实践：

*   使用 opt-in 机制为 API 的不同部分提供不同的保证。例如，你可以将特性标记为 _预览_、_实验性_ 和 _敏感_。每个类别都应在你的文档和 [KDoc 注释](kotlin-doc.md) 中清晰解释，并附带适当的警告消息。
*   如果你的库使用了实验性的 API，请 [将注解传播](opt-in-requirements.md#propagate-opt-in-requirements) 给你的用户。这确保你的用户了解你存在仍在演进的依赖项。
*   避免使用 opt-in 机制弃用库中已存在的声明。相反，请使用 `@Deprecated`，正如 [务实地演进 API](#evolve-apis-pragmatically) 部分中所述。

## 接下来

如果你还没有，请考虑查看以下页面：

*   在 [最小化心智复杂性](api-guidelines-minimizing-mental-complexity.md) 页面中探索最小化心智复杂性的策略。
*   关于有效文档实践的全面概述，请参见 [信息丰富的文档](api-guidelines-informative-documentation.md)。