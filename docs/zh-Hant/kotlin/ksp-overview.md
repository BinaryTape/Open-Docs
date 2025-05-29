[//]: # (title: Kotlin 符號處理 API)

Kotlin 符號處理 (Symbol Processing) (_KSP_) 是一個可用於開發輕量級編譯器外掛程式 (compiler plugins) 的 API。KSP 提供一個簡化的編譯器外掛程式 API，它利用 Kotlin 的強大功能，同時將學習曲線保持在最低限度。相較於 [kapt](kapt.md)，使用 KSP 的註解處理器 (annotation processors) 執行速度可提高兩倍。

*   若要深入瞭解 KSP 如何與 kapt 比較，請參閱 [為什麼選擇 KSP](ksp-why-ksp.md)。
*   若要開始編寫 KSP 處理器 (processor)，請參考 [KSP 快速入門](ksp-quickstart.md)。

## 概述

KSP API 以慣用的方式處理 Kotlin 程式。KSP 理解 Kotlin 特有的功能，例如擴充函數 (extension functions)、宣告點變異 (declaration-site variance) 和局部函數 (local functions)。它還明確地建模類型，並提供基本的類型檢查，例如等價 (equivalence) 和賦值相容性 (assign-compatibility)。

該 API 根據 [Kotlin 文法](https://kotlinlang.org/docs/reference/grammar.html) 在符號層級建模 Kotlin 程式結構。當基於 KSP 的外掛程式處理原始程式時，類別、類別成員、函數和相關參數等構造對於處理器而言是可存取的，而 `if` 區塊和 `for` 迴圈等則不可存取。

從概念上講，KSP 與 Kotlin 反射 (reflection) 中的 [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) 相似。該 API 允許處理器從類別宣告導航到具有特定類型參數 (type arguments) 的相應類型，反之亦然。您還可以替換類型參數、指定變異 (variances)、應用星形投影 (star projections) 和標記類型的可空性 (nullabilities)。

另一種看待 KSP 的方式是將其視為 Kotlin 程式的前處理器框架 (preprocessor framework)。將基於 KSP 的外掛程式視為 _符號處理器_，或簡稱為 _處理器_，編譯中的資料流可以透過以下步驟描述：

1.  處理器讀取並分析原始程式和資源。
2.  處理器產生程式碼或其他形式的輸出。
3.  Kotlin 編譯器將原始程式與產生的程式碼一起編譯。

不同於一個功能齊全的編譯器外掛程式，處理器無法修改程式碼。改變語言語義 (semantics) 的編譯器外掛程式有時會非常令人困惑。KSP 透過將原始程式視為唯讀 (read-only) 來避免這種情況。

您也可以透過此影片瞭解 KSP 概述：

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSP 如何看待原始碼檔案

大多數處理器會遍歷輸入原始碼的各種程式結構。在深入探討 API 的使用之前，讓我們看看 KSP 如何看待一個檔案：

```text
KSFile
  packageName: KSName
  fileName: String
  annotations: List<KSAnnotation>  (檔案註解)
  declarations: List<KSDeclaration>
    KSClassDeclaration // 類別、介面、物件
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      classKind: ClassKind
      primaryConstructor: KSFunctionDeclaration
      superTypes: List<KSTypeReference>
      // 包含內部類別、成員函數、屬性等。
      declarations: List<KSDeclaration>
    KSFunctionDeclaration // 頂層函數
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      functionKind: FunctionKind
      extensionReceiver: KSTypeReference?
      returnType: KSTypeReference
      parameters: List<KSValueParameter>
      // 包含局部類別、局部函數、局部變數等。
      declarations: List<KSDeclaration>
    KSPropertyDeclaration // 全域變數
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

這種視圖列出了檔案中宣告的常見內容：類別、函數、屬性等等。

## SymbolProcessorProvider：入口點

KSP 期望 `SymbolProcessorProvider` 介面的實作來實例化 `SymbolProcessor`：

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

而 `SymbolProcessor` 則定義為：

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // 讓我們專注於此
    fun finish() {}
    fun onError() {}
}
```

`Resolver` 提供 `SymbolProcessor` 存取編譯器詳細資訊，例如符號。尋找所有頂層函數和頂層類別中非局部函數的處理器可能看起來像以下這樣：

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

*   [快速入門](ksp-quickstart.md)
*   [為何使用 KSP？](ksp-why-ksp.md)
*   [範例](ksp-examples.md)
*   [KSP 如何建模 Kotlin 程式碼](ksp-additional-details.md)
*   [Java 註解處理器作者參考](ksp-reference.md)
*   [增量處理注意事項](ksp-incremental.md)
*   [多輪處理注意事項](ksp-multi-round.md)
*   [多平台專案上的 KSP](ksp-multiplatform.md)
*   [從命令列執行 KSP](ksp-command-line.md)
*   [常見問題](ksp-faq.md)

## 支援的函式庫

下表列出了 Android 上流行的函式庫及其對 KSP 的各種支援階段：

| 函式庫          | 狀態                                                                                            |
|------------------|---------------------------------------------------------------------------------------------------|
| Room             | [官方支援](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)               |
| Moshi            | [官方支援](https://github.com/square/moshi/)                                                      |
| RxHttp           | [官方支援](https://github.com/liujingxing/rxhttp)                                                 |
| Kotshi           | [官方支援](https://github.com/ansman/kotshi)                                                      |
| Lyricist         | [官方支援](https://github.com/adrielcafe/lyricist)                                                |
| Lich SavedState  | [官方支援](https://github.com/line/lich/tree/master/savedstate)                                   |
| gRPC Dekorator   | [官方支援](https://github.com/mottljan/grpc-dekorator)                                            |
| EasyAdapter      | [官方支援](https://github.com/AmrDeveloper/EasyAdapter)                                          |
| Koin Annotations | [官方支援](https://github.com/InsertKoinIO/koin-annotations)                                      |
| Glide            | [官方支援](https://github.com/bumptech/glide)                                                     |
| Micronaut        | [官方支援](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)                   |
| Epoxy            | [官方支援](https://github.com/airbnb/epoxy)                                                       |
| Paris            | [官方支援](https://github.com/airbnb/paris)                                                       |
| Auto Dagger      | [官方支援](https://github.com/ansman/auto-dagger)                                                 |
| SealedX          | [官方支援](https://github.com/skydoves/sealedx)                                                   |
| Ktorfit          | [官方支援](https://github.com/Foso/Ktorfit)                                                       |
| Mockative        | [官方支援](https://github.com/mockative/mockative)                                                |
| DeeplinkDispatch | [透過 airbnb/DeepLinkDispatch#323 支援](https://github.com/airbnb/DeepLinkDispatch/pull/323) |
| Dagger           | Alpha                                                                                             |
| Motif            | Alpha                                                                                             |
| Hilt             | 進行中                                                                                            |
| Auto Factory     | 尚未支援                                                                                          |