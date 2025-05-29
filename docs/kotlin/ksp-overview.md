[//]: # (title: Kotlin 符号处理 API)

Kotlin 符号处理 (KSP) 是一个可用于开发轻量级编译器插件的 API。KSP 提供了一个简化的编译器插件 API，它利用了 Kotlin 的强大功能，同时将学习曲线保持在最低限度。与 [kapt](kapt.md) 相比，使用 KSP 的注解处理器运行速度最高可快两倍。

*   要了解 KSP 与 kapt 相比的更多信息，请查阅 [为什么选择 KSP](ksp-why-ksp.md)。
*   要开始编写 KSP 处理器，请查看 [KSP 快速入门](ksp-quickstart.md)。

## 概述

KSP API 以符合 Kotlin 习惯的方式处理 Kotlin 程序。KSP 理解 Kotlin 特有的功能，例如扩展函数、声明处变型和局部函数。它还显式地建模类型，并提供基本的类型检查，例如等价性和赋值兼容性。

该 API 根据 [Kotlin 语法](https://kotlinlang.org/docs/reference/grammar.html) 在符号级别建模 Kotlin 程序结构。当基于 KSP 的插件处理源程序时，类、类成员、函数以及相关参数等构造对于处理器是可访问的，而 `if` 块和 `for` 循环等则不可访问。

从概念上讲，KSP 类似于 Kotlin 反射中的 [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)。该 API 允许处理器从类声明导航到具有特定类型参数的相应类型，反之亦然。你还可以替换类型参数、指定变型、应用星投影，并标记类型的可空性。

另一种理解 KSP 的方式是将其视为 Kotlin 程序的预处理器框架。通过将基于 KSP 的插件视为_符号处理器_，或简称为_处理器_，编译中的数据流可以通过以下步骤描述：

1.  处理器读取并分析源程序和资源。
2.  处理器生成代码或其他形式的输出。
3.  Kotlin 编译器将源程序与生成的代码一起编译。

与成熟的编译器插件不同，处理器不能修改代码。改变语言语义的编译器插件有时会非常令人困惑。KSP 通过将源程序视为只读来避免这种情况。

你也可以通过此视频了解 KSP 的概述：

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSP 如何看待源文件

大多数处理器会遍历输入源代码的各种程序结构。在深入了解 API 的用法之前，让我们看看从 KSP 的角度看一个文件可能是什么样子：

```text
KSFile
  packageName: KSName
  fileName: String
  annotations: List<KSAnnotation>  (文件注解)
  declarations: List<KSDeclaration>
    KSClassDeclaration // 类、接口、对象
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      classKind: ClassKind
      primaryConstructor: KSFunctionDeclaration
      superTypes: List<KSTypeReference>
      // 包含内部类、成员函数、属性等。
      declarations: List<KSDeclaration>
    KSFunctionDeclaration // 顶层函数
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      functionKind: FunctionKind
      extensionReceiver: KSTypeReference?
      returnType: KSTypeReference
      parameters: List<KSValueParameter>
      // 包含局部类、局部函数、局部变量等。
      declarations: List<KSDeclaration>
    KSPropertyDeclaration // 全局变量
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      extensionReceiver: KSTypeReference?
      type: KSTypeReference
      getter: KSPropertyGetter
        returnType: KSTypeReference
      setter: KSPropertySetter
        parameter: KSValueParameter
```

此视图列出了文件中声明的常见事物：类、函数、属性等。

## SymbolProcessorProvider：入口点

KSP 期望 `SymbolProcessorProvider` 接口的一个实现来实例化 `SymbolProcessor`：

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

而 `SymbolProcessor` 定义为：

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // Let's focus on this
    fun finish() {}
    fun onError() {}
}
```

`Resolver` 为 `SymbolProcessor` 提供访问编译器详细信息（例如符号）的权限。一个查找所有顶层函数和顶层类中非局部函数的处理器可能看起来像这样：

```kotlin
class HelloFunctionFinderProcessor : SymbolProcessor() {
    // ...
    val functions = mutableListOf<KSClassDeclaration>()
    val visitor = FindFunctionsVisitor()

    override fun process(resolver: Resolver) {
        resolver.getAllFiles().forEach { it.accept(visitor, Unit) }
    }

    inner class FindFunctionsVisitor : KSVisitorVoid() {
        override fun visitClassDeclaration(classDeclaration: KSClassDeclaration, data: Unit) {
            classDeclaration.getDeclaredFunctions().forEach { it.accept(this, Unit) }
        }

        override fun visitFunctionDeclaration(function: KSFunctionDeclaration, data: Unit) {
            functions.add(function)
        }

        override fun visitFile(file: KSFile, data: Unit) {
            file.declarations.forEach { it.accept(this, Unit) }
        }
    }
    // ...
    
    class Provider : SymbolProcessorProvider {
        override fun create(environment: SymbolProcessorEnvironment): SymbolProcessor = TODO()
    }
}
```

## 资源

*   [快速入门](ksp-quickstart.md)
*   [为什么使用 KSP？](ksp-why-ksp.md)
*   [示例](ksp-examples.md)
*   [KSP 如何建模 Kotlin 代码](ksp-additional-details.md)
*   [Java 注解处理器作者参考](ksp-reference.md)
*   [增量处理说明](ksp-incremental.md)
*   [多轮处理说明](ksp-multi-round.md)
*   [多平台项目中的 KSP](ksp-multiplatform.md)
*   [从命令行运行 KSP](ksp-command-line.md)
*   [常见问题](ksp-faq.md)

## 支持的库

该表格列出了 Android 上一些流行的库及其对 KSP 的各种支持阶段：

| 库               | 状态                                                                                                |
|:-----------------|:----------------------------------------------------------------------------------------------------|
| Room             | [官方支持](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)               |
| Moshi            | [官方支持](https://github.com/square/moshi/)                                                        |
| RxHttp           | [官方支持](https://github.com/liujingxing/rxhttp)                                                   |
| Kotshi           | [官方支持](https://github.com/ansman/kotshi)                                                        |
| Lyricist         | [官方支持](https://github.com/adrielcafe/lyricist)                                                  |
| Lich SavedState  | [官方支持](https://github.com/line/lich/tree/master/savedstate)                                     |
| gRPC Dekorator   | [官方支持](https://github.com/mottljan/grpc-dekorator)                                              |
| EasyAdapter      | [官方支持](https://github.com/AmrDeveloper/EasyAdapter)                                             |
| Koin Annotations | [官方支持](https://github.com/InsertKoinIO/koin-annotations)                                        |
| Glide            | [官方支持](https://github.com/bumptech/glide)                                                       |
| Micronaut        | [官方支持](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)                     |
| Epoxy            | [官方支持](https://github.com/airbnb/epoxy)                                                         |
| Paris            | [官方支持](https://github.com/airbnb/paris)                                                         |
| Auto Dagger      | [官方支持](https://github.com/ansman/auto-dagger)                                                   |
| SealedX          | [官方支持](https://github.com/skydoves/sealedx)                                                     |
| Ktorfit          | [官方支持](https://github.com/Foso/Ktorfit)                                                         |
| Mockative        | [官方支持](https://github.com/mockative/mockative)                                                  |
| DeeplinkDispatch | [通过 airbnb/DeepLinkDispatch#323 支持](https://github.com/airbnb/DeepLinkDispatch/pull/323)        |
| Dagger           | Alpha ([dagger.dev/dev-guide/ksp](https://dagger.dev/dev-guide/ksp))                                |
| Motif            | Alpha ([github.com/uber/motif](https://github.com/uber/motif))                                      |
| Hilt             | 正在进行中 ([dagger.dev/dev-guide/ksp](https://dagger.dev/dev-guide/ksp))                           |
| Auto Factory     | 暂不支持 ([github.com/google/auto/issues/982](https://github.com/google/auto/issues/982))           |