[//]: # (title: KotlinシンボルプロセッシングAPI)

Kotlin Symbol Processing (_KSP_) は、軽量なコンパイラプラグインを開発するために使用できるAPIです。
KSPは、Kotlinの能力を活用しつつ学習曲線を最小限に抑える、簡素化されたコンパイラプラグインAPIを提供します。
[kapt](kapt.md)と比較して、KSPを使用するアノテーションプロセッサは最大2倍高速に実行できます。

* KSPがkaptと比較してどうかを詳しく知るには、[KSPを使用する理由](ksp-why-ksp.md)をご覧ください。
* KSPプロセッサの記述を始めるには、[KSPクイックスタート](ksp-quickstart.md)をご覧ください。

## 概要

KSP APIは、Kotlinプログラムを慣用的に処理します。KSPは、拡張関数、宣言サイトの分散（declaration-site variance）、ローカル関数など、Kotlin固有の機能を理解します。
また、型を明示的にモデル化し、等価性や代入互換性などの基本的な型チェックも提供します。

このAPIは、[Kotlinの文法](https://kotlinlang.org/docs/reference/grammar.html)に従ってKotlinプログラムの構造をシンボルレベルでモデル化します。
KSPベースのプラグインがソースプログラムを処理する際、クラス、クラスメンバー、関数、および関連するパラメータのような構造がプロセッサからアクセス可能になりますが、`if`ブロックや`for`ループのようなものはアクセスできません。

概念的には、KSPはKotlinリフレクションの[KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)に似ています。
このAPIにより、プロセッサはクラス宣言から特定の型引数を持つ対応する型へ、またその逆へのナビゲーションを可能にします。
また、型引数を置換し、分散を指定し、スタースプロジェクションを適用し、型のnull許容性をマークできます。

KSPをKotlinプログラムのプリプロセッサフレームワークと考えることもできます。KSPベースのプラグインを
_シンボルプロセッサ_、または単に_プロセッサ_と見なすことで、コンパイルにおけるデータフローを次のステップで記述できます。

1.  プロセッサはソースプログラムとリソースを読み込み、分析します。
2.  プロセッサはコードやその他の形式の出力を生成します。
3.  Kotlinコンパイラは、ソースプログラムと生成されたコードを一緒にコンパイルします。

本格的なコンパイラプラグインとは異なり、プロセッサはコードを変更することはできません。
言語の意味を変更するコンパイラプラグインは、時に非常に混乱を招く可能性があります。
KSPは、ソースプログラムを読み取り専用として扱うことで、これを回避します。

KSPの概要は、こちらのビデオでも確認できます。

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSPがソースファイルをどのように見ているか

ほとんどのプロセッサは、入力ソースコードの様々なプログラム構造をナビゲートします。
APIの利用法に入る前に、KSPの視点からファイルがどのように見えるかを見てみましょう。

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

このビューには、ファイル内で宣言される一般的なもの、例えばクラス、関数、プロパティなどがリストされています。

## SymbolProcessorProvider: エントリポイント

KSPは、`SymbolProcessor`をインスタンス化するために`SymbolProcessorProvider`インターフェースの実装を期待します。

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

一方、`SymbolProcessor`は次のように定義されています。

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // Let's focus on this
    fun finish() {}
    fun onError() {}
}
```

`Resolver`は、シンボルなどのコンパイラの詳細へのアクセスを`SymbolProcessor`に提供します。
すべてのトップレベル関数と、トップレベルクラス内の非ローカル関数を見つけるプロセッサは、次のようになるでしょう。

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

*   [クイックスタート](ksp-quickstart.md)
*   [KSPを使用する理由](ksp-why-ksp.md)
*   [例](ksp-examples.md)
*   [KSPがKotlinコードをモデル化する方法](ksp-additional-details.md)
*   [Javaアノテーションプロセッサ作成者向けリファレンス](ksp-reference.md)
*   [インクリメンタル処理の注意点](ksp-incremental.md)
*   [複数ラウンド処理の注意点](ksp-multi-round.md)
*   [マルチプラットフォームプロジェクトにおけるKSP](ksp-multiplatform.md)
*   [コマンドラインからのKSP実行](ksp-command-line.md)
*   [FAQ](ksp-faq.md)

## サポートされているライブラリ

以下の表は、Androidで人気のあるライブラリと、KSPの様々なサポート段階を示しています。

| ライブラリ         | ステータス                                                                                        |
| :-----------------| :--------------------------------------------------------------------------------------------------|
| Room             | [公式サポート](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)           |
| Moshi            | [公式サポート](https://github.com/square/moshi/)                                                    |
| RxHttp           | [公式サポート](https://github.com/liujingxing/rxhttp)                                               |
| Kotshi           | [公式サポート](https://github.com/ansman/kotshi)                                                    |
| Lyricist         | [公式サポート](https://github.com/adrielcafe/lyricist)                                              |
| Lich SavedState  | [公式サポート](https://github.com/line/lich/tree/master/savedstate)                                 |
| gRPC Dekorator   | [公式サポート](https://github.com/mottljan/grpc-dekorator)                                          |
| EasyAdapter      | [公式サポート](https://github.com/AmrDeveloper/EasyAdapter)                                         |
| Koin Annotations | [公式サポート](https://github.com/InsertKoinIO/koin-annotations)                                    |
| Glide            | [公式サポート](https://github.com/bumptech/glide)                                                   |
| Micronaut        | [公式サポート](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)                 |
| Epoxy            | [公式サポート](https://github.com/airbnb/epoxy)                                                     |
| Paris            | [公式サポート](https://github.com/airbnb/paris)                                                     |
| Auto Dagger      | [公式サポート](https://github.com/ansman/auto-dagger)                                               |
| SealedX          | [公式サポート](https://github.com/skydoves/sealedx)                                                 |
| Ktorfit          | [公式サポート](https://github.com/Foso/Ktorfit)                                                     |
| Mockative        | [公式サポート](https://github.com/mockative/mockative)                                              |
| DeeplinkDispatch | [airbnb/DeepLinkDispatch#323](https://github.com/airbnb/DeepLinkDispatch/pull/323)を介してサポート  |
| Dagger           | [アルファ](https://dagger.dev/dev-guide/ksp)                                                        |
| Motif            | [アルファ](https://github.com/uber/motif)                                                           |
| Hilt             | [進行中](https://dagger.dev/dev-guide/ksp)                                                          |
| Auto Factory     | [未サポート](https://github.com/google/auto/issues/982)                                             |