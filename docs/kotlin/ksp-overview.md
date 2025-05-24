---
title: "Kotlin 符号处理 API"
---
Kotlin 符号处理 (_KSP_) 是一个你可以用来开发轻量级编译器插件的 API。

KSP 提供了一个简化的编译器插件 API，它利用了 Kotlin 的强大功能，同时将学习曲线降至最低。与 [kapt](kapt) 相比，使用 KSP 的注解处理器可以运行速度提高两倍。

* 要了解更多关于 KSP 与 kapt 的比较，请查看 [为什么选择 KSP](ksp-why-ksp)。
* 要开始编写 KSP 处理器，请查看 [KSP 快速入门](ksp-quickstart)。

## 概述

KSP API 以符合语言习惯的方式处理 Kotlin 程序。KSP 了解 Kotlin 特有的特性，例如扩展函数、声明点变异和局部函数。它还显式地对类型进行建模，并提供基本的类型检查，例如等价性和赋值兼容性。

该 API 根据 [Kotlin 语法](https://kotlinlang.org/docs/reference/grammar.html) 在符号级别对 Kotlin 程序结构进行建模。当基于 KSP 的插件处理源程序时，类、类成员、函数和关联参数等构造可供处理器访问，而 `if` 块和 `for` 循环等内容则不可访问。

从概念上讲，KSP 类似于 Kotlin 反射中的 [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)。该 API 允许处理器从类声明导航到具有特定类型参数的相应类型，反之亦然。你还可以替换类型参数、指定变异、应用星型投影，并标记类型的可空性。

可以将 KSP 视为 Kotlin 程序的预处理器框架。通过将基于 KSP 的插件视为 _符号处理器_（symbol processors），或简称为 _处理器_（processors），可以在以下步骤中描述编译中的数据流：

1. 处理器读取和分析源程序和资源。
2. 处理器生成代码或其他形式的输出。
3. Kotlin 编译器将源程序与生成的代码一起编译。

与成熟的编译器插件不同，处理器无法修改代码。更改语言语义的编译器插件有时可能会非常令人困惑。KSP 通过将源程序视为只读来避免这种情况。

你也可以在此视频中获得 KSP 的概述：

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSP 如何看待源文件

大多数处理器会浏览输入源代码的各种程序结构。在深入了解 API 的用法之前，让我们从 KSP 的角度看一下文件可能是什么样子：

```text
KSFile
  packageName: KSName
  fileName: String
  annotations: List<KSAnnotation>  (文件注解)
  declarations: List<KSDeclaration>
    KSClassDeclaration // class, interface, object （类、接口、对象）
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      classKind: ClassKind
      primaryConstructor: KSFunctionDeclaration
      superTypes: List<KSTypeReference>
      // contains inner classes, member functions, properties, etc.（包含内部类、成员函数、属性等）
      declarations: List<KSDeclaration>
    KSFunctionDeclaration // top level function（顶层函数）
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      functionKind: FunctionKind
      extensionReceiver: KSTypeReference?
      returnType: KSTypeReference
      parameters: List<KSValueParameter>
      // contains local classes, local functions, local variables, etc.（包含局部类、局部函数、局部变量等）
      declarations: List<KSDeclaration>
    KSPropertyDeclaration // global variable（全局变量）
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

此视图列出了文件中声明的常见内容：类、函数、属性等。

## SymbolProcessorProvider：入口点

KSP 期望 `SymbolProcessorProvider` 接口的实现来实例化 `SymbolProcessor`：

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

`SymbolProcessor` 定义为：

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // Let's focus on this（让我们关注这个）
    fun finish() {}
    fun onError() {}
}
```

`Resolver` 为 `SymbolProcessor` 提供对编译器详细信息（例如符号）的访问权限。一个查找顶层函数和顶层类中的非局部函数的处理器可能如下所示：

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

* [快速入门](ksp-quickstart)
* [为什么要使用 KSP？](ksp-why-ksp)
* [示例](ksp-examples)
* [KSP 如何对 Kotlin 代码建模](ksp-additional-details)
* [Java 注解处理器作者参考](ksp-reference)
* [增量处理说明](ksp-incremental)
* [多轮处理说明](ksp-multi-round)
* [多平台项目上的 KSP](ksp-multiplatform)
* [从命令行运行 KSP](ksp-command-line)
* [常见问题解答](ksp-faq)

## 支持的库

该表包含 Android 上流行的库及其对 KSP 的各种支持阶段的列表：

| 库             | 状态                                                                                              |
|------------------|---------------------------------------------------------------------------------------------------|
| Room             | [官方支持](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)             |
| Moshi            | [官方支持](https://github.com/square/moshi/)                                                      |
| RxHttp           | [官方支持](https://github.com/liujingxing/rxhttp)                                                 |
| Kotshi           | [官方支持](https://github.com/ansman/kotshi)                                                      |
| Lyricist         | [官方支持](https://github.com/adrielcafe/lyricist)                                                 |
| Lich SavedState  | [官方支持](https://github.com/line/lich/tree/master/savedstate)                                    |
| gRPC Dekorator   | [官方支持](https://github.com/mottljan/grpc-dekorator)                                             |
| EasyAdapter      | [官方支持](https://github.com/AmrDeveloper/EasyAdapter)                                             |
| Koin Annotations | [官方支持](https://github.com/InsertKoinIO/koin-annotations)                                        |
| Glide            | [官方支持](https://github.com/bumptech/glide)                                                      |
| Micronaut        | [官方支持](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)                  |
| Epoxy            | [官方支持](https://github.com/airbnb/epoxy)                                                       |
| Paris            | [官方支持](https://github.com/airbnb/paris)                                                       |
| Auto Dagger      | [官方支持](https://github.com/ansman/auto-dagger)                                                 |
| SealedX          | [官方支持](https://github.com/skydoves/sealedx)                                                   |
| Ktorfit          | [官方支持](https://github.com/Foso/Ktorfit)                                                       |
| Mockative        | [官方支持](https://github.com/mockative/mockative)                                                |
| DeeplinkDispatch | [通过 airbnb/DeepLinkDispatch#323 支持](https://github.com/airbnb/DeepLinkDispatch/pull/323)    |
| Dagger           | [Alpha](https://dagger.dev/dev-guide/ksp)                                                         |
| Motif            | [Alpha](https://github.com/uber/motif)                                                            |
| Hilt             | [开发中](https://dagger.dev/dev-guide/ksp)                                                        |
| Auto Factory     | [尚未支持](https://github.com/google/auto/issues/982)                                              |