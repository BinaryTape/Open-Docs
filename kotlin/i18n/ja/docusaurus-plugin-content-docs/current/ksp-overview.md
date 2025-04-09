---
title: "Kotlin Symbol Processing API"
---
Kotlin Symbol Processing（_KSP_）は、軽量なコンパイラプラグインを開発するために使用できるAPIです。
KSPは、Kotlinの能力を活用しつつ、学習のハードルを最小限に抑えた、簡素化されたコンパイラプラグインAPIを提供します。
[kapt](kapt)と比較して、KSPを使用するアノテーションプロセッサは最大2倍高速に実行できます。

* KSPとkaptの比較については、[KSPの利点](ksp-why-ksp)をご覧ください。
* KSPプロセッサの作成を開始するには、[KSPクイックスタート](ksp-quickstart)をご覧ください。

## 概要

KSP APIは、Kotlinプログラムを慣用的に処理します。KSPは、拡張関数、宣言場所の変性、ローカル関数など、Kotlin固有の機能を理解しています。また、型を明示的にモデル化し、同値性や代入互換性などの基本的な型チェックを提供します。

このAPIは、[Kotlin grammar](https://kotlinlang.org/docs/reference/grammar.html)に従って、シンボルレベルでKotlinプログラムの構造をモデル化します。
KSPベースのプラグインがソースプログラムを処理する場合、クラス、クラスメンバ、関数、および関連するパラメータなどの構成要素にプロセッサからアクセスできますが、`if`ブロックや`for`ループなどの要素にはアクセスできません。

概念的には、KSPはKotlinリフレクションの[KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)に似ています。
このAPIを使用すると、プロセッサは、特定の型引数を持つクラス宣言から対応する型へ、またはその逆方向にナビゲートできます。
また、型引数の置換、変性の指定、スタープロジェクションの適用、型のNull許容のマークも可能です。

KSPはKotlinプログラムのプリプロセッサフレームワークと考えることもできます。KSPベースのプラグインを_シンボルプロセッサ_、または単に_プロセッサ_と考えると、コンパイルにおけるデータフローは次のステップで説明できます。

1. プロセッサは、ソースプログラムとリソースを読み取り、分析します。
2. プロセッサは、コードまたはその他の形式の出力を生成します。
3. Kotlinコンパイラは、ソースプログラムを生成されたコードとともにコンパイルします。

本格的なコンパイラプラグインとは異なり、プロセッサはコードを変更できません。
言語セマンティクスを変更するコンパイラプラグインは、非常に紛らわしい場合があります。
KSPは、ソースプログラムを読み取り専用として扱うことで、それを回避します。

KSPの概要については、次のビデオをご覧ください。

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSPによるソースファイルの表示方法

ほとんどのプロセッサは、入力ソースコードのさまざまなプログラム構造をナビゲートします。
APIの使用方法に入る前に、KSPの視点から見たファイルがどのように見えるかを見てみましょう。

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

このビューは、ファイル内で宣言されている一般的なもの（クラス、関数、プロパティなど）をリストします。

## SymbolProcessorProvider：エントリポイント

KSPは、`SymbolProcessor`をインスタンス化するために、`SymbolProcessorProvider`インターフェースの実装を必要とします。

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

`SymbolProcessor`は次のように定義されます。

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // Let's focus on this
    fun finish() {}
    fun onError() {}
}
```

`Resolver`は、`SymbolProcessor`にシンボルなどのコンパイラ詳細へのアクセスを提供します。
トップレベル関数とトップレベルクラスの非ローカル関数をすべて検索するプロセッサは、次のようになります。

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

## リソース

* [クイックスタート](ksp-quickstart)
* [KSPを使用する理由](ksp-why-ksp)
* [例](ksp-examples)
* [KSPによるKotlinコードのモデル化方法](ksp-additional-details)
* [Javaアノテーションプロセッサ作成者向けのリファレンス](ksp-reference)
* [インクリメンタル処理に関する注意](ksp-incremental)
* [複数ラウンド処理に関する注意](ksp-multi-round)
* [マルチプラットフォームプロジェクトでのKSP](ksp-multiplatform)
* [コマンドラインからのKSPの実行](ksp-command-line)
* [FAQ](ksp-faq)

## サポートされているライブラリ

次の表は、Android上の一般的なライブラリと、KSPのさまざまなサポート段階を示しています。

| ライブラリ         | ステータス                                                                                              |
|-----------------|-----------------------------------------------------------------------------------------------------|
| Room            | [公式サポート](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)                         |
| Moshi           | [公式サポート](https://github.com/square/moshi/)                                                            |
| RxHttp          | [公式サポート](https://github.com/liujingxing/rxhttp)                                                       |
| Kotshi          | [公式サポート](https://github.com/ansman/kotshi)                                                           |
| Lyricist        | [公式サポート](https://github.com/adrielcafe/lyricist)                                                          |
| Lich SavedState | [公式サポート](https://github.com/line/lich/tree/master/savedstate)                                        |
| gRPC Dekorator  | [公式サポート](https://github.com/mottljan/grpc-dekorator)                                                    |
| EasyAdapter     | [公式サポート](https://github.com/AmrDeveloper/EasyAdapter)                                                 |
| Koin Annotations| [公式サポート](https://github.com/InsertKoinIO/koin-annotations)                                            |
| Glide           | [公式サポート](https://github.com/bumptech/glide)                                                           |
| Micronaut       | [公式サポート](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)                          |
| Epoxy           | [公式サポート](https://github.com/airbnb/epoxy)                                                            |
| Paris           | [公式サポート](https://github.com/airbnb/paris)                                                            |
| Auto Dagger     | [公式サポート](https://github.com/ansman/auto-dagger)                                                       |
| SealedX         | [公式サポート](https://github.com/skydoves/sealedx)                                                         |
| Ktorfit         | [公式サポート](https://github.com/Foso/Ktorfit)                                                             |
| Mockative       | [公式サポート](https://github.com/mockative/mockative)                                                       |
| DeeplinkDispatch| [airbnb/DeepLinkDispatch#323経由でサポート](https://github.com/airbnb/DeepLinkDispatch/pull/323)             |
| Dagger          | [Alpha](https://dagger.dev/dev-guide/ksp)                                                                  |
| Motif           | [Alpha](https://github.com/uber/motif)                                                                     |
| Hilt            | [開発中](https://dagger.dev/dev-guide/ksp)                                                                |
| Auto Factory    | [まだサポートされていません](https://github.com/google/auto/issues/982)                                              |