---
title: 增量处理
---
增量处理是一种尽可能避免重新处理源文件的处理技术。增量处理的主要目标是减少典型的“更改-编译-测试”周期的周转时间（turn-around time）。有关常规信息，请参阅维基百科上关于[增量计算](https://en.wikipedia.org/wiki/Incremental_computing)的文章。

为了确定哪些源文件是“脏的”（_dirty_，需要重新处理的），KSP 需要处理器的帮助来识别哪些输入源文件对应于哪些生成的输出文件。为了帮助处理这个通常繁琐且容易出错的过程，KSP 被设计为仅需要最少的_根源文件_（root sources），处理器可以使用这些根源文件作为起点来浏览代码结构。换句话说，如果 `KSNode` 是从以下任何一项获得的，则处理器需要将输出与相应 `KSNode` 的源文件相关联：
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

增量处理目前默认启用。要禁用它，请设置 Gradle 属性 `ksp.incremental=false`。要启用输出根据依赖关系和输出的脏集（dirty set）的日志，请使用 `ksp.incremental.log=true`。您可以在 `build` 输出目录中找到这些日志文件，其文件扩展名为 `.log`。

在 JVM 上，默认情况下会跟踪 classpath 更改以及 Kotlin 和 Java 源代码更改。要仅跟踪 Kotlin 和 Java 源代码更改，请通过设置 `ksp.incremental.intermodule=false` Gradle 属性来禁用 classpath 跟踪。

## 聚合 vs 隔离

类似于 [Gradle 注解处理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing) 中的概念，KSP 支持_聚合_（aggregating）和_隔离_（isolating）两种模式。请注意，与 Gradle 注解处理不同，KSP 将每个输出分类为聚合或隔离，而不是整个处理器。

聚合输出可能会受到任何输入更改的影响，但删除不影响其他文件的文件除外。这意味着任何输入更改都会导致重建所有聚合输出，进而意味着重新处理所有相应的已注册、新建和修改的源文件。

例如，收集具有特定注解的所有符号的输出被认为是聚合输出。

隔离输出仅依赖于其指定的源文件。对其他源文件的更改不会影响隔离输出。请注意，与 Gradle 注解处理不同，您可以为给定的输出定义多个源文件。

例如，专用于它所实现的接口的生成类被认为是隔离的。

总而言之，如果输出可能依赖于新的或任何已更改的源文件，则它被认为是聚合的。否则，该输出是隔离的。

以下是为熟悉 Java 注解处理的读者提供的摘要：
* 在隔离的 Java 注解处理器中，所有输出在 KSP 中都是隔离的。
* 在聚合的 Java 注解处理器中，某些输出在 KSP 中可以是隔离的，而某些输出可以是聚合的。

### 如何实现

依赖关系是通过输入和输出文件的关联来计算的，而不是通过注解。这是一个多对多的关系。

由于输入-输出关联而产生的脏污传播规则是：
1. 如果输入文件已更改，它将始终被重新处理。
2. 如果输入文件已更改，并且它与一个输出相关联，那么与同一输出相关联的所有其他输入文件也将被重新处理。这是可传递的，也就是说，失效会重复发生，直到没有新的脏文件为止。
3. 与一个或多个聚合输出相关联的所有输入文件都将被重新处理。换句话说，如果输入文件未与任何聚合输出相关联，则不会重新处理它（除非它满足上述 1 或 2）。

原因如下：
1. 如果输入已更改，则可以引入新信息，因此处理器需要再次使用输入运行。
2. 输出由一组输入组成。处理器可能需要所有输入来重新生成输出。
3. `aggregating=true` 意味着输出可能依赖于新信息，这些信息可能来自新文件或已更改的现有文件。
   `aggregating=false` 意味着处理器确信该信息仅来自某些输入文件，而绝不来自其他文件或新文件。

## 示例 1

一个处理器在读取了 `A.kt` 中的类 `A` 和 `B.kt` 中的类 `B` 后生成 `outputForA`，其中 `A` 扩展了 `B`。该处理器通过 `Resolver.getSymbolsWithAnnotation` 获得了 `A`，然后通过 `KSClassDeclaration.superTypes` 从 `A` 获得了 `B`。由于 `B` 的包含是由于 `A`，因此 `B.kt` 不需要在 `outputForA` 的 `dependencies` 中指定。您仍然可以在这种情况下指定 `B.kt`，但这是不必要的。

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
        // B.kt 不是必需的，因为 KSP 可以将其推断为依赖项
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

当 `sourceA` 更改时：
* 如果 `outputB` 是聚合的，则 `sourceA` 和 `sourceB` 都会被重新处理。
* 如果 `outputB` 是隔离的，则只有 `sourceA` 会被重新处理。

当添加 `sourceC` 时：
* 如果 `outputB` 是聚合的，则 `sourceC` 和 `sourceB` 都会被重新处理。
* 如果 `outputB` 是隔离的，则只有 `sourceC` 会被重新处理。

当删除 `sourceA` 时，不需要重新处理任何内容。

当删除 `sourceB` 时，不需要重新处理任何内容。

## 如何确定文件脏污状态

脏文件要么是用户直接_更改_（changed）的，要么是间接受到其他脏文件的_影响_（affected）的。 KSP 分两个步骤传播脏污状态：
* 通过_解析追踪_（resolution tracing）传播：
  解析类型引用（隐式或显式）是从一个文件导航到另一个文件的唯一方法。当类型引用被处理器解析时，包含可能潜在影响解析结果的更改的已更改或受影响的文件将影响包含该引用的文件。
* 通过_输入-输出对应关系_（input-output correspondence）传播：
  如果源文件已更改或受影响，则与其他文件具有相同输出的所有其他源文件都会受到影响。

请注意，它们都是可传递的，第二个形成等价类。

## 报告 Bug

要报告 bug，请设置 Gradle 属性 `ksp.incremental=true` 和 `ksp.incremental.log=true`，并执行清理构建（clean build）。此构建会生成两个日志文件：

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

然后，您可以运行连续的增量构建，这将生成两个额外的日志文件：

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

这些日志包含源文件和输出文件的文件名，以及构建的时间戳。