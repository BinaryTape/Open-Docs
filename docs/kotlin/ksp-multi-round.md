[//]: # (title: 多轮处理)

KSP 支持多轮处理，即跨多轮处理文件。每一轮处理的输出都将作为每一后续轮次的额外输入。

要使用多轮处理，请将 `SymbolProcessor.process()` 的延迟符号作为 `List<KSAnnotated>` 返回。KSP 将在下一轮中处理这些符号。

要延迟无效符号，请使用 `KSAnnotated.validate()` 进行过滤，例如：

```kotlin
override fun process(resolver: Resolver): List<KSAnnotated> {
    val symbols = resolver.getSymbolsWithAnnotation("com.example.annotation.Builder")
    val result = symbols.filter { !it.validate() }
    symbols
        .filter { it is KSClassDeclaration && it.validate() }
        .map { it.accept(BuilderVisitor(), Unit) }
    return result
}
```

当一整轮处理没有产生新文件时，多轮处理结束。如果仍有延迟符号未处理，KSP 将为每个带有剩余延迟符号的处理器记录一条错误。

## 将符号延迟到下一轮

当需要来自其他处理器的额外信息时，处理器可以将符号延迟到后续轮次。处理器可以跨多轮持续延迟某个符号，直到所需信息可用。一旦信息可用，处理器即可处理该符号。

仅在以下情况下延迟符号：

* 在处理该符号之前需要额外信息。

* 该符号源自源代码。

    > 切勿延迟来自类路径的符号。KSP 会自动过滤掉类路径符号。
    > 
    {style="note"}

例如，为被注解的类生成构建器的处理器可能要求其所有构造函数形参类型都解析为具体类型。在第一轮中，其中一个形参类型可能无法解析。在后续轮次中，由于在此期间生成了文件，它可能变得可以解析。随后处理器即可处理该类。

## 验证符号

验证是决定是否将符号延迟到后续轮次的便捷方法。处理器应定义正确处理符号所需的信息。

> 验证通常需要类型解析，这可能开销巨大。仅检查处理符号所需的信息。
>
{style="tip"}

默认验证行为可能并不适用于所有用例。要自定义验证，请使用 `KSValidateVisitor` 并提供一个用于选择要验证符号的 `predicate` lambda表达式。

在实现自定义验证时，请使用 `KSType.isError` 来确定类型是否有效。如果 `isError` 为 `true`，则表示 KSP 无法解析该类型。利用此信息来决定是否将处理延迟到后续轮次。

## 访问文件和符号

新生成的文件和现有文件均可通过 `Resolver` 访问。

KSP 提供了两个用于访问文件的 API：

* `Resolver.getAllFiles()` 返回之前已存在文件和新生成文件的列表。

* `Resolver.getNewFiles()` 仅返回上一轮中生成的文件。

使用 `Resolver.getSymbolsWithAnnotation()` 作为获取相关符号的主要入口点。

在每一轮中，`Resolver.getSymbolsWithAnnotation()` 仅返回来自新生成文件的符号以及从上一轮延迟的符号。这有助于避免不必要的重复处理。

## 处理器实例化

KSP 仅创建一次处理器实例。您可以在处理器实例中存储信息，并跨多轮重用这些信息。

然而，并非所有 KSP 符号都可以在轮次之间重用。当处理器生成新文件时，符号解析结果可能会发生变化，这可能会影响之前已解析符号的有效性。

> 仅使用在当前轮次中传递给处理器的 `Resolver` 实例。不要存储 `Resolver` 并跨轮次重用它。
> 
{style="note"}

## 错误和异常处理

### 错误

处理器通过调用 `KSPLogger.error()` 来报告错误。

当处理器报告错误时，KSP 将调用 `SymbolProcessor.onError()` 而不是 `SymbolProcessor.finish()`。处理将在当前轮次完成后停止。

在该轮次期间，其他处理器仍会正常继续处理。KSP 仅在所有处理器完成当前轮次后才处理错误。

### 异常

KSP 区分来自 KSP 的异常和来自处理器的异常。这两种类型都会立即终止处理，并由 `KSPLogger` 记录为错误。

> 请将 KSP 抛出的异常报告给 KSP 开发者以便调查。请在 [KSP 问题跟踪器](https://github.com/google/ksp/issues)中创建一个问题。
>
{style="note"}

在发生错误或异常的轮次结束时，KSP 会对所有处理器调用 `SymbolProcessor.onError()`。`SymbolProcessor` 提供了 `onError()` 的默认无操作 (no-op) 实现。重写此方法以实现自定义错误处理逻辑。