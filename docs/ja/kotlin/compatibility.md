<!--- TOC -->

* [互換性](#compatibility)
* [パブリックAPIの種類](#public-api-types)
  * [実験的API](#experimental-api)
  * [FlowプレビューAPI](#flow-preview-api)
  * [廃止予定API](#obsolete-api)
  * [内部API](#internal-api)
  * [安定版API](#stable-api)
  * [非推奨サイクル](#deprecation-cycle)
* [アノテーション付きAPIの使用](#using-annotated-api)
  * [プログラムから](#programmatically)
  * [Gradle](#gradle)
  * [Maven](#maven)

<!--- END -->

## 互換性
このドキュメントでは、`kotlinx.coroutines`ライブラリのバージョン1.0.0以降の互換性ポリシーと、互換性固有のアノテーションのセマンティクスについて説明します。

## パブリックAPIの種類
`kotlinx.coroutines`のパブリックAPIには、安定版、実験的、廃止予定、内部、非推奨の5種類があります。安定版を除くすべてのパブリックAPIには、対応するアノテーションが付けられています。

### 実験的API
実験的APIは、[`@ExperimentalCoroutinesApi`][ExperimentalCoroutinesApi]アノテーションでマークされています。
APIのデザインに未解決の疑問点があり、最終的にAPIのセマンティクス変更や非推奨化につながる可能性がある場合、APIは実験的としてマークされます。

デフォルトでは、ほとんどの新しいAPIは実験的としてマークされ、新たな問題が発生しなければ、次期メジャーリリースで安定版となります。
そうでない場合、ABIに変更を加えることなくセマンティクスが修正されるか、APIは非推奨サイクルを経ます。

実験的APIを使用すると危険な場合:
* `kotlinx.coroutines`に依存するライブラリを開発しており、安定版のライブラリAPIで実験的コルーチンAPIを使用したい場合。ライブラリのエンドユーザーが`kotlinx.coroutines`のバージョンを更新した際に、実験的APIのセマンティクスがわずかに異なり、望ましくない結果につながる可能性があります。
* 実験的APIを中心にアプリケーションのコアインフラストラクチャを構築したい場合。

### FlowプレビューAPI
すべての[Flow]関連APIは、[`@FlowPreview`][FlowPreview]アノテーションでマークされています。
このアノテーションは、Flow APIがプレビューステータスであることを示します。
プレビュー機能については、バイナリ互換性、ソース互換性、セマンティクス互換性を含む、リリース間の互換性は保証されません。

プレビューAPIを使用すると危険な場合:
* ライブラリ/フレームワークを開発しており、安定版リリースまたは安定版APIで[Flow] APIを使用したい場合。
* アプリケーションのコアインフラストラクチャで[Flow]を使用したい場合。
* [Flow]を「一度書いたら忘れる」ソリューションとして使用したいが、`kotlinx.coroutines`の更新に伴う追加のメンテナンスコストをかけられない場合。

### 廃止予定API
廃止予定APIは、[`@ObsoleteCoroutinesApi`][ObsoleteCoroutinesApi]アノテーションでマークされています。
廃止予定APIは実験的APIに似ていますが、すでに深刻な設計上の欠陥があることが知られており、潜在的な代替案があるものの、その代替案はまだ実装されていません。

このAPIのセマンティクスは変更されませんが、代替案が準備でき次第、非推奨サイクルを経ます。

### 内部API
内部APIは、[`@InternalCoroutinesApi`][InternalCoroutinesApi]でマークされているか、`kotlinx.coroutines.internal`パッケージの一部です。
このAPIは安定性が保証されておらず、将来のリリースで変更されたり、削除されたりする可能性があります。
内部APIの使用を避けられない場合は、[課題トラッカー](https://github.com/Kotlin/kotlinx.coroutines/issues/new)に報告してください。

### 安定版API
安定版APIは、そのABIとドキュメント化されたセマンティクスを維持することが保証されています。もし、修正不可能な設計上の欠陥が発見された場合、このAPIは非推奨サイクルを経ますが、可能な限りバイナリ互換性を維持します。

### 非推奨サイクル
APIが非推奨になると、複数のステージを経て、各ステージ間に少なくとも1つのメジャーリリースがあります。
* 機能はコンパイル警告を伴って非推奨になります。ほとんどの場合、IntelliJ IDEAの助けを借りて非推奨の使用箇所を自動的に移行するために、適切な代替（および対応する`replaceWith`宣言）が提供されます。
* 非推奨レベルが`error`または`hidden`に引き上げられます。非推奨APIに対して新しいコードをコンパイルすることはできなくなりますが、API自体はABIに残っています。
* APIが完全に削除されます。そうならないよう最善を尽くし、APIを削除する計画はありませんが、セキュリティホールなどの予期せぬ問題が発生した場合に備え、このオプションは残しています。

## アノテーション付きAPIの使用
すべてのAPIアノテーションは、[kotlin.Experimental](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/)です。
これは、実験的または廃止予定APIの使用に関するコンパイル警告を生成するために行われます。
警告は、特定の呼び出しサイトでプログラムから無効にするか、モジュール全体でグローバルに無効にすることができます。

### プログラムから
特定の呼び出しサイトでは、[`OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/)アノテーションを使用することで警告を無効にできます。
```kotlin
@OptIn(ExperimentalCoroutinesApi::class) // 実験的コルーチンAPIに関する警告を無効にします
fun experimentalApiUsage() {
    someKotlinxCoroutinesExperimentalMethod()
}
``` 

### Gradle
Gradleプロジェクトの場合、`build.gradle`ファイルにコンパイラフラグを渡すことで警告を無効にできます。

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile).all {
    kotlinOptions.freeCompilerArgs += ["-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi"]
}

```

### Maven
Mavenプロジェクトの場合、`pom.xml`ファイルにコンパイラフラグを渡すことで警告を無効にできます。
```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    ... your configuration ...
    <configuration>
        <args>
            <arg>-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi</arg>
        </args>
    </configuration>
</plugin>
```

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines.flow -->

[Flow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html

<!--- INDEX kotlinx.coroutines -->

[ExperimentalCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-experimental-coroutines-api/index.html
[FlowPreview]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-flow-preview/index.html
[ObsoleteCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-obsolete-coroutines-api/index.html
[InternalCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-internal-coroutines-api/index.html

<!--- END -->