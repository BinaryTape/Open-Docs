[//]: # (title: Kotlin Symbol Processing API)

Kotlin Symbol Processing (_KSP_) は、軽量なコンパイラプラグインを開発するために使用できるAPIです。
KSPは、Kotlinの能力を活用しつつ、学習コストを最小限に抑えることができる、簡素化されたコンパイラプラグインAPIを提供します。
[kapt](kapt.md)と比較して、KSPを使用するアノテーションプロセッサは最大2倍高速に動作します。

*   KSPとkaptの比較についてさらに詳しく知りたい場合は、[KSPを使う理由](ksp-why-ksp.md)を参照してください。
*   KSPプロセッサの作成を開始するには、[KSPクイックスタート](ksp-quickstart.md)をご覧ください。

## 概要

KSP APIは、Kotlinプログラムをイディオム的に処理します。
KSPは、拡張関数、宣言サイトの変性、ローカル関数など、Kotlin固有の機能を理解します。
また、型を明示的にモデル化し、等価性や代入互換性などの基本的な型チェックを提供します。

このAPIは、[Kotlin文法](https://kotlinlang.org/docs/reference/grammar.html)に従ってKotlinプログラムの構造をシンボルレベルでモデル化します。
KSPベースのプラグインがソースプログラムを処理する際、クラス、クラスメンバー、関数、および関連するパラメータのような構造はプロセッサからアクセスできますが、`if`ブロックや`for`ループのようなものはアクセスできません。

概念的に、KSPはKotlinリフレクションにおける[KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)に似ています。
このAPIにより、プロセッサはクラス宣言から特定の型引数を持つ対応する型へ、またその逆へとナビゲートできます。
また、型引数の置き換え、変性の指定、スタープロジェクションの適用、型のヌル許容性のマーク付けも可能です。

KSPをKotlinプログラムのプリプロセッサフレームワークと考えることもできます。
KSPベースのプラグインを_シンボルプロセッサ_、または単に_プロセッサ_と見なすと、コンパイルにおけるデータフローは以下のステップで記述できます。

1.  プロセッサはソースプログラムとリソースを読み込み、分析します。
2.  プロセッサはコードまたは他の形式の出力を生成します。
3.  Kotlinコンパイラは、生成されたコードとともにソースプログラムをコンパイルします。

完全なコンパイラプラグインとは異なり、プロセッサはコードを変更できません。
言語のセマンティクスを変更するコンパイラプラグインは、時には非常に混乱を招く可能性があります。
KSPは、ソースプログラムを読み取り専用として扱うことで、これを回避します。

KSPの概要はこのビデオでも確認できます。

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSPがソースファイルをどのように見るか

ほとんどのプロセッサは、入力ソースコードの様々なプログラム構造をナビゲートします。
APIの使用方法について深く掘り下げる前に、KSPの視点からファイルがどのように見えるかを見てみましょう。

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

このビューは、ファイル内で宣言されている一般的なもの（クラス、関数、プロパティなど）をリストしています。

## SymbolProcessorProvider: エントリポイント

KSPは、`SymbolProcessor`をインスタンス化するために`SymbolProcessorProvider`インターフェースの実装を期待します。

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

`SymbolProcessor`は次のように定義されています。

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // Let's focus on this
    fun finish() {}
    fun onError() {}
}
```

`Resolver`は`SymbolProcessor`にシンボルなどのコンパイラの詳細へのアクセスを提供します。
トップレベルの関数およびトップレベルのクラス内の非ローカル関数をすべて見つけるプロセッサは、次のようになります。

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
*   [KSPがKotlinコードをどのようにモデル化するか](ksp-additional-details.md)
*   [Javaアノテーションプロセッサ作成者向けリファレンス](ksp-reference.md)
*   [インクリメンタル処理に関する注意点](ksp-incremental.md)
*   [マルチラウンド処理に関する注意点](ksp-multi-round.md)
*   [マルチプラットフォームプロジェクトでのKSP](ksp-multiplatform.md)
*   [コマンドラインからのKSPの実行](ksp-command-line.md)
*   [よくある質問](ksp-faq.md)

## サポートされているライブラリ

この表には、Androidで人気のあるライブラリと、KSPに対するそれらの様々なサポート状況がリストされています。

| ライブラリ         | ステータス                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| Room             | [公式にサポートされています](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02) |
| Moshi            | [公式にサポートされています](https://github.com/square/moshi/)                                          |
| RxHttp           | [公式にサポートされています](https://github.com/liujingxing/rxhttp)                                     |
| Kotshi           | [公式にサポートされています](https://github.com/ansman/kotshi)                                          |
| Lyricist         | [公式にサポートされています](https://github.com/adrielcafe/lyricist)                                    |
| Lich SavedState  | [公式にサポートされています](https://github.com/line/lich/tree/master/savedstate)                       |
| gRPC Dekorator   | [公式にサポートされています](https://github.com/mottljan/grpc-dekorator)                                |
| EasyAdapter      | [公式にサポートされています](https://github.com/AmrDeveloper/EasyAdapter)                               |
| Koin Annotations | [公式にサポートされています](https://github.com/InsertKoinIO/koin-annotations)                          |
| Glide            | [公式にサポートされています](https://github.com/bumptech/glide)                                         |
| Micronaut        | [公式にサポートされています](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)       |
| Epoxy            | [公式にサポートされています](https://github.com/airbnb/epoxy)                                           |
| Paris            | [公式にサポートされています](https://github.com/airbnb/paris)                                           |
| Auto Dagger      | [公式にサポートされています](https://github.com/ansman/auto-dagger)                                     |
| SealedX          | [公式にサポートされています](https://github.com/skydoves/sealedx)                                       |
| Ktorfit          | [公式にサポートされています](https://github.com/Foso/Ktorfit)                                           |
| Mockative        | [公式にサポートされています](https://github.com/mockative/mockative)                                    |
| DeeplinkDispatch | [airbnb/DeepLinkDispatch#323 を介してサポートされています](https://github.com/airbnb/DeepLinkDispatch/pull/323)  |
| Dagger           | アルファ版                                                                                                |
| Motif            | アルファ版                                                                                                |
| Hilt             | 進行中                                                                                                |
| Auto Factory     | 未サポート                                                                                                |