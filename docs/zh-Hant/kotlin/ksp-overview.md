[//]: # (title: Kotlin 符號處理 API)

Kotlin 符號處理（_KSP_）是一個 API，您可以使用它來開發輕量級的編譯器外掛。
KSP 提供了一個簡化的編譯器外掛 API，它充分利用了 Kotlin 的強大功能，同時將學習曲線保持在
最低水準。與 [kapt](kapt.md) 相比，使用 KSP 的註解處理器執行速度可提高兩倍。

* 若要深入了解 KSP 與 kapt 的比較，請查看 [為何選擇 KSP](ksp-why-ksp.md)。
* 若要開始編寫 KSP 處理器，請參閱 [KSP 快速入門](ksp-quickstart.md)。

## 概述

KSP API 以慣用的方式處理 Kotlin 程式。KSP 理解 Kotlin 特有的功能，例如擴充函數、
宣告點變異和局部函數。它還明確地模型化類型，並提供基本的類型檢查，
例如等價性和賦值相容性。

該 API 根據 [Kotlin 語法](https://kotlinlang.org/docs/reference/grammar.html) 在符號層級模型化 Kotlin 程式結構。
當基於 KSP 的外掛處理原始程式時，類別、類別成員、函數和相關參數等結構可供
處理器存取，而像 `if` 區塊和 `for` 迴圈則無法存取。

概念上，KSP 類似於 Kotlin 反射中的 [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)。
該 API 允許處理器從類別宣告導航到具有特定類型引數的對應類型，反之亦然。
您還可以替換類型引數、指定變異、應用星號投影，並標記類型的可空性。

另一種看待 KSP 的方式是將其視為 Kotlin 程式的預處理器框架。將基於 KSP 的外掛視為
_符號處理器_，或簡稱 _處理器_，編譯中的資料流可以描述為以下步驟：

1. 處理器讀取並分析原始程式和資源。
2. 處理器生成程式碼或其他形式的輸出。
3. Kotlin 編譯器將原始程式與生成的程式碼一起編譯。

與成熟的編譯器外掛不同，處理器不能修改程式碼。
改變語言語義的編譯器外掛有時會非常令人困惑。
KSP 通過將原始程式視為唯讀來避免這種情況。

您也可以在這段影片中獲得 KSP 的概述：

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSP 如何看待原始檔

大多數處理器會導航輸入原始碼的各種程式結構。
在深入了解 API 的用法之前，讓我們先看看一個檔案從 KSP 的角度來看可能長什麼樣：

```text
KSFile
  packageName: KSName
  fileName: String
  annotations: List<KSAnnotation>  (File annotations)
  declarations: List<KSDeclaration>
    KSClassDeclaration // class, interface, object
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      classKind: ClassKind
      primaryConstructor: KSFunctionDeclaration
      superTypes: List<KSTypeReference>
      // contains inner classes, member functions, properties, etc.
      declarations: List<KSDeclaration>
    KSFunctionDeclaration // top level function
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      functionKind: FunctionKind
      extensionReceiver: KSTypeReference?
      returnType: KSTypeReference
      parameters: List<KSValueParameter>
      // contains local classes, local functions, local variables, etc.
      declarations: List<KSDeclaration>
    KSPropertyDeclaration // global variable
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

此視圖列出了檔案中宣告的常見內容：類別、函數、屬性等等。

## SymbolProcessorProvider：入口點

KSP 期望 `SymbolProcessorProvider` 介面的實作來實例化 `SymbolProcessor`：

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

而 `SymbolProcessor` 定義為：

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // Let's focus on this
    fun finish() {}
    fun onError() {}
}
```

`Resolver` 為 `SymbolProcessor` 提供對編譯器細節（例如符號）的存取。
一個尋找所有頂層函數和頂層類別中非局部函數的處理器可能看起來像
以下這樣：

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

## 資源

* [快速入門](ksp-quickstart.md)
* [為何使用 KSP？](ksp-why-ksp.md)
* [範例](ksp-examples.md)
* [KSP 如何模型化 Kotlin 程式碼](ksp-additional-details.md)
* [Java 註解處理器作者參考](ksp-reference.md)
* [增量處理注意事項](ksp-incremental.md)
* [多輪處理注意事項](ksp-multi-round.md)
* [多平台專案中的 KSP](ksp-multiplatform.md)
* [從命令列執行 KSP](ksp-command-line.md)
* [常見問題](ksp-faq.md)

## 支援的函式庫

下表包含 Android 上流行函式庫的清單及其對 KSP 的不同支援階段：

| 函式庫          | 狀態                                                                                            |
|------------------|---------------------------------------------------------------------------------------------------|
| Room             | [官方支援](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)           |
| Moshi            | [官方支援](https://github.com/square/moshi/)                                                      |
| RxHttp           | [官方支援](https://github.com/liujingxing/rxhttp)                                                 |
| Kotshi           | [官方支援](https://github.com/ansman/kotshi)                                                      |
| Lyricist         | [官方支援](https://github.com/adrielcafe/lyricist)                                                |
| Lich SavedState  | [官方支援](https://github.com/line/lich/tree/master/savedstate)                                   |
| gRPC Dekorator   | [官方支援](https://github.com/mottljan/grpc-dekorator)                                            |
| EasyAdapter      | [官方支援](https://github.com/AmrDeveloper/EasyAdapter)                                           |
| Koin Annotations | [官方支援](https://github.com/InsertKoinIO/koin-annotations)                                      |
| Glide            | [官方支援](https://github.com/bumptech/glide)                                                     | 
| Micronaut        | [官方支援](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)                   |
| Epoxy            | [官方支援](https://github.com/airbnb/epoxy)                                                       |
| Paris            | [官方支援](https://github.com/airbnb/paris)                                                       |
| Auto Dagger      | [官方支援](https://github.com/ansman/auto-dagger)                                                 |
| SealedX          | [官方支援](https://github.com/skydoves/sealedx)                                                   |
| Ktorfit          | [官方支援](https://github.com/Foso/Ktorfit)                                                       |
| Mockative        | [官方支援](https://github.com/mockative/mockative)                                                |
| DeeplinkDispatch | [透過 airbnb/DeepLinkDispatch#323 支援](https://github.com/airbnb/DeepLinkDispatch/pull/323)    |
| Dagger           | [Alpha](https://dagger.dev/dev-guide/ksp)                                                         |
| Motif            | [Alpha](https://github.com/uber/motif)                                                            |
| Hilt             | [進行中](https://dagger.dev/dev-guide/ksp)                                                        |
| Auto Factory     | [尚不支援](https://github.com/google/auto/issues/982)                                             |