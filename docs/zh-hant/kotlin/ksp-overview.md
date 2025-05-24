---
title: "Kotlin 符號處理 API (Kotlin Symbol Processing API)"
---
Kotlin Symbol Processing (_KSP_) 是一個 API，您可以使用它來開發輕量級的編譯器外掛程式（compiler plugins）。
KSP 提供了一個簡化的編譯器外掛程式 API，它利用 Kotlin 的強大功能，同時將學習曲線保持在最低限度。與 [kapt](kapt) 相比，使用 KSP 的註解處理器（annotation processors）的執行速度可以提高兩倍。

* 若要深入瞭解 KSP 與 kapt 的比較，請查看[為何選擇 KSP](ksp-why-ksp)。
* 若要開始編寫 KSP 處理器（processor），請查看 [KSP 快速入門](ksp-quickstart)。

## 概述

KSP API 以符合語言習慣的方式處理 Kotlin 程式。KSP 瞭解 Kotlin 特定的功能，例如擴充函式（extension functions）、宣告點變異數（declaration-site variance）和區域函式（local functions）。它還顯式地建模類型，並提供基本的類型檢查，例如等價性和賦值相容性（assign-compatibility）。

該 API 根據 [Kotlin 語法](https://kotlinlang.org/docs/reference/grammar.html)，在符號層次（symbol level）上建模 Kotlin 程式結構。當基於 KSP 的外掛程式處理原始碼程式時，處理器可以存取類別、類別成員、函式和相關參數等構造，而 `if` 區塊和 `for` 迴圈等則不能存取。

從概念上講，KSP 類似於 Kotlin 反射中的 [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)。該 API 允許處理器使用特定的類型參數，在類別宣告和相應類型之間導航，反之亦然。您還可以替換類型參數、指定變異數、套用星號投影（star projections）和標記類型的可空性（nullabilities）。

可以將 KSP 視為 Kotlin 程式的預處理器框架。透過將基於 KSP 的外掛程式視為_符號處理器_（symbol processors），或簡稱為_處理器_（processors），可以在以下步驟中描述編譯中的資料流程：

1. 處理器讀取和分析原始碼程式和資源。
2. 處理器產生程式碼或其他形式的輸出。
3. Kotlin 編譯器將原始碼程式與產生的程式碼一起編譯。

與功能完整的編譯器外掛程式不同，處理器無法修改程式碼。更改語言語意的編譯器外掛程式有時會非常令人困惑。KSP 透過將原始碼程式視為唯讀來避免這種情況。

您也可以在此影片中概覽 KSP：

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSP 如何看待原始檔

大多數處理器會瀏覽輸入原始碼的各種程式結構。在深入研究 API 的使用之前，讓我們先看看從 KSP 的角度來看，檔案可能看起來像什麼：

```text
KSFile
  packageName: KSName
  fileName: String
  annotations: List<KSAnnotation>  (檔案註解 File annotations)
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
      // 包含內部類別、成員函式、屬性等
      declarations: List<KSDeclaration>
    KSFunctionDeclaration // 頂層函式 top level function
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      functionKind: FunctionKind
      extensionReceiver: KSTypeReference?
      returnType: KSTypeReference
      parameters: List<KSValueParameter>
      // 包含區域類別、區域函式、區域變數等
      declarations: List<KSDeclaration>
    KSPropertyDeclaration // 全域變數 global variable
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

此視圖列出了檔案中宣告的常見事物：類別、函式、屬性等等。

## SymbolProcessorProvider：進入點

KSP 期望 `SymbolProcessorProvider` 介面的實作來實例化 `SymbolProcessor`：

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

`SymbolProcessor` 定義為：

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // 讓我們專注於此
    fun finish() {}
    fun onError() {}
}
```

`Resolver` 為 `SymbolProcessor` 提供對編譯器詳細資訊（例如符號）的存取權。一個處理器，找到頂層類別中的所有頂層函式和非區域函式，可能看起來像這樣：

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

* [快速入門](ksp-quickstart)
* [為何使用 KSP？](ksp-why-ksp)
* [範例](ksp-examples)
* [KSP 如何對 Kotlin 程式碼進行建模](ksp-additional-details)
* [Java 註解處理器作者的參考](ksp-reference)
* [增量處理注意事項](ksp-incremental)
* [多輪處理注意事項](ksp-multi-round)
* [KSP 在多平台專案上](ksp-multiplatform)
* [從命令列執行 KSP](ksp-command-line)
* [常見問題](ksp-faq)

## 支援的函式庫

下表包含 Android 上常用函式庫的清單，以及它們對 KSP 的各種支援階段：

| 函式庫          | 狀態                                                                                            |
|------------------|---------------------------------------------------------------------------------------------------|
| Room             | [官方支援](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02) |
| Moshi            | [官方支援](https://github.com/square/moshi/)                                          |
| RxHttp           | [官方支援](https://github.com/liujingxing/rxhttp)                                     |
| Kotshi           | [官方支援](https://github.com/ansman/kotshi)                                          |
| Lyricist         | [官方支援](https://github.com/adrielcafe/lyricist)                                    |
| Lich SavedState  | [官方支援](https://github.com/line/lich/tree/master/savedstate)                       |
| gRPC Dekorator   | [官方支援](https://github.com/mottljan/grpc-dekorator)                                |
| EasyAdapter      | [官方支援](https://github.com/AmrDeveloper/EasyAdapter)                               |
| Koin Annotations | [官方支援](https://github.com/InsertKoinIO/koin-annotations)                          |
| Glide            | [官方支援](https://github.com/bumptech/glide)                                         |
| Micronaut        | [官方支援](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)       |
| Epoxy            | [官方支援](https://github.com/airbnb/epoxy)                                           |
| Paris            | [官方支援](https://github.com/airbnb/paris)                                           |
| Auto Dagger      | [官方支援](https://github.com/ansman/auto-dagger)                                     |
| SealedX          | [官方支援](https://github.com/skydoves/sealedx)                                       |
| Ktorfit          | [官方支援](https://github.com/Foso/Ktorfit)                                           |
| Mockative        | [官方支援](https://github.com/mockative/mockative)                                    |
| DeeplinkDispatch | [透過 airbnb/DeepLinkDispatch#323 支援](https://github.com/airbnb/DeepLinkDispatch/pull/323)  |
| Dagger           | [Alpha](https://dagger.dev/dev-guide/ksp)                                                         |
| Motif            | [Alpha](https://github.com/uber/motif)                                                            |
| Hilt             | [開發中](https://dagger.dev/dev-guide/ksp)                                                   |
| Auto Factory     | [尚未支援](https://github.com/google/auto/issues/982)                                    |