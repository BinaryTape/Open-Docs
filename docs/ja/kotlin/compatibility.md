<!--- TOC -->

*   [互換性](#compatibility)
*   [公開APIの種類](#public-api-types)
    *   [実験的API](#experimental-api)
    *   [FlowプレビューAPI](#flow-preview-api)
    *   [非推奨API](#obsolete-api)
    *   [内部API](#internal-api)
    *   [安定版API](#stable-api)
    *   [非推奨化サイクル](#deprecation-cycle)
*   [アノテーション付きAPIの使用](#using-annotated-api)
    *   [プログラムによる設定](#programmatically)
    *   [Gradle](#gradle)
    *   [Maven](#maven)

<!--- END -->

## 互換性
このドキュメントでは、`kotlinx.coroutines` ライブラリのバージョン1.0.0以降の互換性ポリシーと、互換性固有のアノテーションのセマンティクスについて説明します。

## 公開APIの種類
`kotlinx.coroutines` の公開APIには、安定版、実験版、非推奨版、内部版、廃止版の5種類があります。安定版を除くすべての公開APIには、対応するアノテーションが付与されています。

### 実験的API
実験的APIには、`@ExperimentalCoroutinesApi` アノテーションが付与されています。
APIは、その設計に将来的にAPIのセマンティクスの変更や非推奨化につながる可能性のある未解決の疑問点がある場合、実験版としてマークされます。

デフォルトでは、ほとんどの新しいAPIは実験版としてマークされ、新たな問題が発生しなければ、次のメジャーリリースで安定版になります。
そうでない場合は、ABIの変更なしにセマンティクスが修正されるか、APIは非推奨化サイクルに入ります。

実験的APIを使用すると危険な場合：
*   `kotlinx.coroutines` に依存するライブラリを記述しており、安定版ライブラリAPIで実験的なコルーチンAPIを使用したい場合。
    これは、ライブラリのエンドユーザーが `kotlinx.coroutines` のバージョンを更新し、実験的APIのセマンティクスがわずかに異なる場合に、望ましくない結果につながる可能性があります。
*   実験的APIを中心にアプリケーションのコアインフラストラクチャを構築したい場合。

### FlowプレビューAPI
すべての [Flow] 関連APIには、`@FlowPreview` アノテーションが付与されています。
このアノテーションは、Flow APIがプレビュー状態であることを示します。
プレビュー機能については、バイナリ、ソース、セマンティクス互換性を含む、リリース間の互換性保証は提供されません。

プレビューAPIを使用すると危険な場合：
*   ライブラリ/フレームワークを記述しており、安定版リリースまたは安定版APIで [Flow] APIを使用したい場合。
*   アプリケーションのコアインフラストラクチャで [Flow] を使用したい場合。
*   [Flow] を「一度書いたら忘れられる」ソリューションとして使用したいが、`kotlinx.coroutines` の更新時に追加のメンテナンスコストをかけられない場合。

### 非推奨API
非推奨APIには、`@ObsoleteCoroutinesApi` アノテーションが付与されています。
非推奨APIは実験的APIに似ていますが、すでに深刻な設計上の欠陥があることが知られており、その代替が検討されているものの、まだ実装されていません。

このAPIのセマンティクスは変更されませんが、代替が準備され次第、非推奨化サイクルに入ります。

### 内部API
内部APIは、`@InternalCoroutinesApi` アノテーションが付与されているか、`kotlinx.coroutines.internal` パッケージの一部です。
このAPIは安定性に関する保証がなく、将来のリリースで変更および/または削除される可能性があります。
内部APIの使用を避けられない場合は、[課題トラッカー](https://github.com/Kotlin/kotlinx.coroutines/issues/new) に報告してください。

### 安定版API
安定版APIは、そのABIとドキュメント化されたセマンティクスを維持することが保証されています。もし、ある時点で修正不可能な設計上の欠陥が発見された場合でも、このAPIは非推奨化サイクルに入り、可能な限りバイナリ互換性を維持します。

### 非推奨化サイクル
APIが非推奨化されると、複数の段階を経て、各段階の間には少なくとも1つのメジャーリリースがあります。
*   機能はコンパイル時の警告付きで非推奨化されます。ほとんどの場合、適切な代替（および対応する `replaceWith` 宣言）が提供され、IntelliJ IDEA の助けを借りて非推奨の使用箇所を自動的に移行できます。
*   非推奨レベルが `error` または `hidden` に引き上げられます。非推奨のAPIに対して新しいコードをコンパイルすることはできなくなりますが、ABIにはまだ存在します。
*   APIが完全に削除されます。我々はそうしないように最善を尽くし、APIを削除する計画はありませんが、セキュリティ上の脆弱性などの予期せぬ問題が発生した場合に備えて、この選択肢は残しています。

## アノテーション付きAPIの使用
すべてのAPIアノテーションは [kotlin.Experimental](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/) です。
これは、実験的または非推奨のAPIを使用するとコンパイル警告を生成するために行われます。
警告は、特定の呼び出しサイトに対してプログラムで無効にするか、モジュール全体でグローバルに無効にすることができます。

### プログラムによる設定
特定の呼び出しサイトの場合、`OptIn` アノテーションを使用して警告を無効にできます。
```kotlin
@OptIn(ExperimentalCoroutinesApi::class) // 実験的なコルーチンAPIに関する警告を無効にします
fun experimentalApiUsage() {
    someKotlinxCoroutinesExperimentalMethod()
}
``` 

### Gradle
Gradleプロジェクトの場合、`build.gradle` ファイルにコンパイラフラグを渡すことで警告を無効にできます。

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile).all {
    kotlinOptions.freeCompilerArgs += ["-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi"]
}

```

### Maven
Mavenプロジェクトの場合、`pom.xml` ファイルにコンパイラフラグを渡すことで警告を無効にできます。
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