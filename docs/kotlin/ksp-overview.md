[//]: # (title: Kotlin 符号处理 API)

Kotlin 符号处理 (KSP) 是一个可用于开发轻量级编译器插件的 API。
KSP 提供了一个简化的编译器插件 API，它充分利用 Kotlin 的强大功能，同时最大限度地降低了学习曲线。与 [kapt](kapt.md) 相比，使用 KSP 的注解处理器运行速度可快达两倍。

*   要详细了解 KSP 与 kapt 的比较，请查阅 [为何使用 KSP](ksp-why-ksp.md)。
*   要开始编写 KSP 处理器，请查看 [KSP 快速入门](ksp-quickstart.md)。

## 概述

KSP API 以惯用的方式处理 Kotlin 程序。KSP 理解 Kotlin 特有特性，例如扩展函数、声明处型变和局部函数。它还显式地建模类型，并提供基本的类型检测，例如等价性和赋值兼容性。

该 API 在符号层面根据 [Kotlin 语法](https://kotlinlang.org/docs/reference/grammar.html) 对 Kotlin 程序结构进行建模。当基于 KSP 的插件处理源程序时，诸如类、类成员、函数和相关参数之类的构造可供处理器访问，而诸如 `if` 代码块和 `for` 循环之类的则不可访问。

从概念上讲，KSP 与 Kotlin 反射中的 [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) 相似。
该 API 允许处理器从类声明导航到具有特定类型实参的相应类型，反之亦然。你还可以替换类型实参、指定型变、应用星型投影并标记类型的可空性。

考虑 KSP 的另一种方式是将其视为 Kotlin 程序的预处理器框架。通过将基于 KSP 的插件视为 _符号处理器_，或简称为 _处理器_，编译过程中的数据流可以按以下步骤描述：

1.  处理器读取并分析源程序和资源。
2.  处理器生成代码或其他形式的输出。
3.  Kotlin 编译器将源程序与生成的代码一起编译。

与功能完备的编译器插件不同，处理器不能修改代码。
改变语言语义的编译器插件有时会让人非常困惑。
KSP 通过将源程序视为只读来避免这种情况。

你还可以通过此视频了解 KSP 概览：

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin 符号处理 (KSP)"/>

## KSP 如何看待源文件

大多数处理器会遍历输入源代码的各种程序结构。
在深入了解 API 的用法之前，让我们看看文件从 KSP 的视角看是怎样的：

```text
KSFile
  packageName: KSName                 // 包名
  fileName: String                    // 文件名
  annotations: List<KSAnnotation>    // 注解 (文件注解)
  declarations: List<KSDeclaration>  // 声明
    KSClassDeclaration              // 类、接口、对象
      simpleName: KSName              // 简单名称
      qualifiedName: KSName           // 限定名称
      containingFile: String          // 所在文件
      typeParameters: KSTypeParameter // 类型形参
      parentDeclaration: KSDeclaration// 父声明
      classKind: ClassKind            // 类类型
      primaryConstructor: KSFunctionDeclaration // 主构造函数
      superTypes: List<KSTypeReference> // 父类型
      // 包含内部类、成员函数、属性等
      declarations: List<KSDeclaration> // 声明
    KSFunctionDeclaration           // 顶层函数
      simpleName: KSName              // 简单名称
      qualifiedName: KSName           // 限定名称
      containingFile: String          // 所在文件
      typeParameters: KSTypeParameter // 类型形参
      parentDeclaration: KSDeclaration// 父声明
      functionKind: FunctionKind      // 函数类型
      extensionReceiver: KSTypeReference? // 扩展接收者
      returnType: KSTypeReference     // 返回类型
      parameters: List<KSValueParameter> // 形参
      // 包含局部类、局部函数、局部变量等
      declarations: List<KSDeclaration> // 声明
    KSPropertyDeclaration           // 全局变量
      simpleName: KSName              // 简单名称
      qualifiedName: KSName           // 限定名称
      containingFile: String          // 所在文件
      typeParameters: KSTypeParameter // 类型形参
      parentDeclaration: KSDeclaration// 父声明
      extensionReceiver: KSTypeReference? // 扩展接收者
      type: KSTypeReference           // 类型
      getter: KSPropertyGetter        // getter
        returnType: KSTypeReference   // 返回类型
      setter: KSPropertySetter        // setter
        parameter: KSValueParameter   // 形参
```

此视图列出了文件中声明的常见内容：类、函数、属性等。

## SymbolProcessorProvider：入口点

KSP 需要 `SymbolProcessorProvider` 接口的实现来实例化 `SymbolProcessor`：

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

而 `SymbolProcessor` 的定义如下：

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // 让我们关注这里
    fun finish() {}
    fun onError() {}
}
```

`Resolver` 为 `SymbolProcessor` 提供访问编译器详细信息（例如符号）的能力。
一个查找所有顶层函数和顶层类中非局部函数的处理器可能如下所示：

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
*   [为何使用 KSP？](ksp-why-ksp.md)
*   [示例](ksp-examples.md)
*   [KSP 如何建模 Kotlin 代码](ksp-additional-details.md)
*   [面向 Java 注解处理器作者的参考资料](ksp-reference.md)
*   [增量处理说明](ksp-incremental.md)
*   [多轮处理说明](ksp-multi-round.md)
*   [多平台项目中的 KSP](ksp-multiplatform.md)
*   [从命令行运行 KSP](ksp-command-line.md)
*   [常见问题解答](ksp-faq.md)

## 支持的库

下表列出了 Android 上一些常用库及其对 KSP 的支持阶段：

| 库               | 状态                                                                                            |
|------------------|---------------------------------------------------------------------------------------------------|
| Room             | [官方支持](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)             |
| Moshi            | [官方支持](https://github.com/square/moshi/)                                                      |
| RxHttp           | [官方支持](https://github.com/liujingxing/rxhttp)                                                 |
| Kotshi           | [官方支持](https://github.com/ansman/kotshi)                                                      |
| Lyricist         | [官方支持](https://github.com/adrielcafe/lyricist)                                                |
| Lich SavedState  | [官方支持](https://github.com/line/lich/tree/master/savedstate)                                   |
| gRPC Dekorator   | [官方支持](https://github.com/mottljan/grpc-dekorator)                                            |
| EasyAdapter      | [官方支持](https://github.com/AmrDeveloper/EasyAdapter)                                           |
| Koin Annotations | [官方支持](https://github.com/InsertKoinIO/koin-annotations)                                      |
| Glide            | [官方支持](https://github.com/bumptech/glide)                                                     | 
| Micronaut        | [官方支持](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)                   |
| Epoxy            | [官方支持](https://github.com/airbnb/epoxy)                                                       |
| Paris            | [官方支持](https://github.com/airbnb/paris)                                                       |
| Auto Dagger      | [官方支持](https://github.com/ansman/auto-dagger)                                                 |
| SealedX          | [官方支持](https://github.com/skydoves/sealedx)                                                   |
| Ktorfit          | [官方支持](https://github.com/Foso/Ktorfit)                                                       |
| Mockative        | [官方支持](https://github.com/mockative/mockative)                                                |
| DeeplinkDispatch | [通过 airbnb/DeepLinkDispatch#323 支持](https://github.com/airbnb/DeepLinkDispatch/pull/323)  |
| Dagger           | [Alpha](https://dagger.dev/dev-guide/ksp)                                                         |
| Motif            | [Alpha](https://github.com/uber/motif)                                                            |
| Hilt             | [开发中](https://dagger.dev/dev-guide/ksp)                                                        |
| Auto Factory     | [暂不支持](https://github.com/google/auto/issues/982)                                             |