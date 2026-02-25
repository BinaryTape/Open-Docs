[//]: # (title: Kotlin Symbol Processing API)

Kotlin Symbol Processing (_KSP_) は、軽量なコンパイラプラグインを開発するためのAPIです。
KSPは、Kotlinのパワーを活用しつつ学習コストを最小限に抑えた、簡素化されたコンパイラプラグインAPIを提供します。[kapt](kapt.md) と比較して、KSPを使用するアノテーションプロセッサは最大2倍高速に動作します。

* KSPとkaptの比較についての詳細は、[なぜKSPか](ksp-why-ksp.md) を確認してください。
* KSPプロセッサの作成を開始するには、[KSPクイックスタート](ksp-quickstart.md) をご覧ください。

## 概要

KSP APIは、Kotlinプログラムを慣用的に処理します。KSPは、拡張関数、宣言区の変異（declaration-site variance）、ローカル関数といったKotlin特有の機能を理解しています。また、型を明示的にモデル化し、等価性や代入互換性などの基本的な型チェックも提供します。

このAPIは、[Kotlinの文法](https://kotlinlang.org/grammar/) に従って、プログラム構造をシンボルレベルでモデル化します。KSPベースのプラグインがソースプログラムを処理する際、クラス、クラスメンバー、関数、および関連するパラメータなどの構成要素にはプロセッサからアクセスできますが、`if` ブロックや `for` ループなどはアクセス対象外となります。

概念的に、KSPはKotlinリフレクションの [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) に似ています。このAPIを使用すると、プロセッサはクラス宣言から特定の型引数を持つ対応する型へ、またその逆へとナビゲートできます。また、型引数の置換、変異（variance）の指定、スター投影（star projections）の適用、型のNULL許容性のマークなども可能です。

KSPの別の捉え方として、Kotlinプログラムのプリプロセッサフレームワークと考えることもできます。KSPベースのプラグインを「シンボルプロセッサ（symbol processors）」、あるいは単に「プロセッサ」と呼ぶ場合、コンパイルにおけるデータフローは以下のステップで説明できます。

1. プロセッサがソースプログラムとリソースを読み取り、分析する。
2. プロセッサがコードまたはその他の形式の出力を生成する。
3. Kotlinコンパイラが、ソースプログラムを生成されたコードと一緒にコンパイルする。

本格的なコンパイラプラグインとは異なり、プロセッサは既存のコードを変更することはできません。言語のセマンティクス（意味論）を変更するコンパイラプラグインは、時に非常に混乱を招くことがあります。KSPは、ソースプログラムを読み取り専用として扱うことで、その問題を回避しています。

KSPの概要については、こちらの動画（英語）でもご確認いただけます：

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## KSPがソースファイルをどのように見るか

ほとんどのプロセッサは、入力ソースコードのさまざまなプログラム構造を辿ります。APIの使用方法に入る前に、KSPの視点からファイルがどのように見えるかを確認してみましょう。

```text
KSFile
  packageName: KSName
  fileName: String
  annotations: List<KSAnnotation>  (ファイルの注釈)
  declarations: List<KSDeclaration>
    KSClassDeclaration // クラス、インターフェース、オブジェクト
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      classKind: ClassKind
      primaryConstructor: KSFunctionDeclaration
      superTypes: List<KSTypeReference>
      // 内部クラス、メンバー関数、プロパティなどを含む
      declarations: List<KSDeclaration>
    KSFunctionDeclaration // トップレベル関数
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      functionKind: FunctionKind
      extensionReceiver: KSTypeReference?
      returnType: KSTypeReference
      parameters: List<KSValueParameter>
      // ローカルクラス、ローカル関数、ローカル変数などを含む
      declarations: List<KSDeclaration>
    KSPropertyDeclaration // グローバル変数
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

このビューには、ファイル内で宣言されている一般的な要素（クラス、関数、プロパティなど）がリストされています。

## SymbolProcessorProvider: エントリポイント

KSPは、`SymbolProcessor` をインスタンス化するために `SymbolProcessorProvider` インターフェースの実装を必要とします。

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

また、`SymbolProcessor` は次のように定義されています。

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // これに注目します
    fun finish() {}
    fun onError() {}
}
```

`Resolver` は、シンボルなどのコンパイラの詳細へのアクセスを `SymbolProcessor` に提供します。すべてのトップレベル関数と、トップレベルクラス内の非ローカル関数を見つけるプロセッサは、以下のようになります。

```kotlin
class HelloFunctionFinderProcessor : SymbolProcessor() {
    // ...
    val functions = mutableListOf<KSFunctionDeclaration>()
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

* [クイックスタート](ksp-quickstart.md)
* [なぜKSPを使うのか？](ksp-why-ksp.md)
* [例 (Examples)](ksp-examples.md)
* [KSPがどのようにKotlinコードをモデル化するか](ksp-additional-details.md)
* [Javaアノテーションプロセッサ作成者のためのリファレンス](ksp-reference.md)
* [インクリメンタル処理に関するメモ](ksp-incremental.md)
* [マルチラウンド処理に関するメモ](ksp-multi-round.md)
* [マルチプラットフォームプロジェクトでのKSP](ksp-multiplatform.md)
* [コマンドラインからのKSPの実行](ksp-command-line.md)
* [FAQ](ksp-faq.md)

## サポートされているライブラリ

以下の表は、Androidで人気のライブラリと、それらのKSPサポート状況のリストです。

| ライブラリ | ステータス |
|------------------|---------------------------------------------------------------------------------------------------|
| Room             | [公式サポート済み](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02) |
| Moshi            | [公式サポート済み](https://github.com/square/moshi/)                                          |
| RxHttp           | [公式サポート済み](https://github.com/liujingxing/rxhttp)                                     |
| Kotshi           | [公式サポート済み](https://github.com/ansman/kotshi)                                          |
| Lyricist         | [公式サポート済み](https://github.com/adrielcafe/lyricist)                                    |
| Lich SavedState  | [公式サポート済み](https://github.com/line/lich/tree/master/savedstate)                       |
| gRPC Dekorator   | [公式サポート済み](https://github.com/mottljan/grpc-dekorator)                                |
| EasyAdapter      | [公式サポート済み](https://github.com/AmrDeveloper/EasyAdapter)                               |
| Koin Annotations | [公式サポート済み](https://github.com/InsertKoinIO/koin-annotations)                          |
| Glide            | [公式サポート済み](https://github.com/bumptech/glide)                                         | 
| Micronaut        | [公式サポート済み](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)       |
| Epoxy            | [公式サポート済み](https://github.com/airbnb/epoxy)                                           |
| Paris            | [公式サポート済み](https://github.com/airbnb/paris)                                           |
| Auto Dagger      | [公式サポート済み](https://github.com/ansman/auto-dagger)                                     |
| SealedX          | [公式サポート済み](https://github.com/skydoves/sealedx)                                       |
| Ktorfit          | [公式サポート済み](https://github.com/Foso/Ktorfit)                                           |
| Mockative        | [公式サポート済み](https://github.com/mockative/mockative)                                    |
| DeeplinkDispatch | [airbnb/DeepLinkDispatch#323 経由でサポート](https://github.com/airbnb/DeepLinkDispatch/pull/323)  |
| Dagger           | [アルファ](https://dagger.dev/dev-guide/ksp)                                                         |
| Motif            | [アルファ](https://github.com/uber/motif)                                                            |
| Hilt             | [進行中](https://dagger.dev/dev-guide/ksp)                                                   |
| Auto Factory     | [未対応](https://github.com/google/auto/issues/982)                                    |