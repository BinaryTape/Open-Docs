[//]: # (title: 增量处理)

增量处理是一种尽可能避免重复处理源文件的处理技术。
增量处理的主要目标是减少典型的修改-编译-测试循环的周转时间。
如需了解更多通用信息，请参阅维基百科上关于[增量计算](https://en.wikipedia.org/wiki/Incremental_computing)的文章。

为了确定哪些源文件是_脏的_（即需要重新处理的），KSP 需要处理器的帮助来识别哪些输入源文件与哪些生成的输出相对应。为了帮助解决这个通常繁琐且容易出错的过程，KSP 的设计要求只需最小集合的_根源文件_，处理器将其作为起点来导航代码结构。换句话说，如果 `KSNode` 是通过以下任何方式获得的，处理器需要将一个输出与对应的 `KSNode` 的源文件关联起来：
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

增量处理当前默认启用。要禁用它，请设置 Gradle 属性 `ksp.incremental=false`。
要启用根据依赖项和输出转储脏集合的日志，请使用 `ksp.incremental.log=true`。
您可以在 `build` 输出目录中找到这些日志文件，其文件扩展名为 `.log`。

在 JVM 上，类路径更改以及 Kotlin 和 Java 源文件更改默认都会被跟踪。
要仅跟踪 Kotlin 和 Java 源文件更改，请通过设置 `ksp.incremental.intermodule=false` Gradle 属性来禁用类路径跟踪。

## 聚合与隔离

类似于 [Gradle 注解处理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing)中的概念，KSP 支持_聚合_模式和_隔离_模式。请注意，与 Gradle 注解处理不同，KSP 将每个输出归类为聚合或隔离，而不是将整个处理器归类。

聚合输出可能会受到任何输入更改的影响，除了移除不影响其他文件的文件。这意味着任何输入更改都会导致所有聚合输出的重新构建，这反过来意味着重新处理所有相应的已注册、新建和已修改的源文件。

例如，收集具有特定注解的所有符号的输出被视为聚合输出。

隔离输出仅依赖于其指定的源文件。对其他源文件的更改不会影响隔离输出。
请注意，与 Gradle 注解处理不同，您可以为一个给定输出定义多个源文件。

例如，一个专用于其所实现接口的生成类被视为隔离的。

总结来说，如果一个输出可能依赖于新的或任何已更改的源文件，它被视为聚合的。否则，该输出是隔离的。

以下是对熟悉 Java 注解处理的读者的总结：
* 在隔离的 Java 注解处理器中，KSP 中的所有输出都是隔离的。
* 在聚合的 Java 注解处理器中，KSP 中的一些输出可以是隔离的，一些可以是聚合的。

### 实现方式

依赖项是通过输入文件和输出文件的关联来计算的，而不是注解。
这是一个多对多关系。

由于输入-输出关联引起的脏性传播规则是：
1. 如果输入文件被更改，它总是会被重新处理。
2. 如果输入文件被更改，并且它与一个输出相关联，那么与同一输出相关联的所有其他输入文件也将被重新处理。这是传递性的，即失效会反复发生，直到没有新的脏文件为止。
3. 与一个或多个聚合输出相关联的所有输入文件都将被重新处理。换句话说，如果输入文件没有与任何聚合输出相关联，它将不会被重新处理（除非它满足上述第 1 或 2 条）。

原因如下：
1. 如果输入发生更改，新信息可能会被引入，因此处理器需要再次使用该输入运行。
2. 一个输出是由一组输入生成的。处理器可能需要所有输入才能重新生成该输出。
3. `aggregating=true` 意味着输出可能依赖于新信息，这些信息可能来自新文件，或已更改的现有文件。
   `aggregating=false` 意味着处理器确信信息仅来自某些输入文件，绝不来自其他文件或新文件。

## 示例 1

一个处理器在读取 `A.kt` 中的 `A` 类和 `B.kt` 中的 `B` 类后生成 `outputForA`，其中 `A` 扩展了 `B`。
处理器通过 `Resolver.getSymbolsWithAnnotation` 获得 `A`，然后通过 `KSClassDeclaration.superTypes` 从 `A` 中获得 `B`。
因为 `B` 的包含是由于 `A`，`B.kt` 无需在 `outputForA` 的 `dependencies` 中指定。
在这种情况下，您仍然可以指定 `B.kt`，但这不是必需的。

```kotlin
// A.kt
@Interesting
class A : B()

// B.kt
open class B

// Example1Processor.kt
class Example1Processor : SymbolProcessor {
    override fun process(resolver: Resolver) {
        val declA = resolver.getSymbolsWithAnnotation("Interesting").first() as KSClassDeclaration
        val declB = declA.superTypes.first().resolve().declaration
        // B.kt 无需指定，因为它可以通过 KSP 推断为依赖项
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA 依赖于 A.kt 和 B.kt
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB
".toByteArray())
        output.close()
    }
    // ...
}
```

## 示例 2

假设一个处理器在读取 `sourceA` 后生成 `outputA`，并在读取 `sourceB` 后生成 `outputB`。

当 `sourceA` 被更改时：
* 如果 `outputB` 是聚合的，`sourceA` 和 `sourceB` 都将被重新处理。
* 如果 `outputB` 是隔离的，只有 `sourceA` 会被重新处理。

当 `sourceC` 被添加时：
* 如果 `outputB` 是聚合的，`sourceC` 和 `sourceB` 都将被重新处理。
* 如果 `outputB` 是隔离的，只有 `sourceC` 会被重新处理。

当 `sourceA` 被移除时，无需重新处理任何内容。

当 `sourceB` 被移除时，无需重新处理任何内容。

## 如何确定文件脏性

脏文件要么由用户直接_更改_，要么间接被其他脏文件_影响_。KSP 分两步传播脏性：
* 通过_解析追踪_传播：
  解析类型引用（隐式或显式）是从一个文件导航到另一个文件的唯一方式。当处理器解析类型引用时，包含可能影响解析结果的更改的已更改或受影响文件将会影响包含该引用的文件。
* 通过_输入-输出对应关系_传播：
  如果源文件被更改或受影响，所有与该文件具有共同输出的其他源文件都会受到影响。

请注意，两者都具有传递性，第二种形式构成等价类。

## 报告错误

要报告错误，请设置 Gradle 属性 `ksp.incremental=true` 和 `ksp.incremental.log=true`，并执行一次完全构建。
此构建会生成两个日志文件：

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

然后您可以运行后续的增量构建，这将生成两个额外的日志文件：

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

这些日志包含源文件和输出的文件名，以及构建的时间戳。