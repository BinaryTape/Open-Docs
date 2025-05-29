[//]: # (title: Kotlin 2.0.20の新機能)

[リリース日: 2024年8月22日](releases.md#release-details)

Kotlin 2.0.20がリリースされました！ このバージョンには、Kotlin K2コンパイラをStableとして発表したKotlin 2.0.0に対するパフォーマンスの改善とバグ修正が含まれています。今回のリリースにおける追加のハイライトは以下のとおりです。

*   [データクラスの `copy` 関数がコンストラクタと同じ可視性を持つように変更](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
*   [デフォルトのターゲット階層からのソースセットに対する静的アクセサがマルチプラットフォームプロジェクトで利用可能に](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
*   [Kotlin/Nativeのガベージコレクタで並行マーキングが可能に](#concurrent-marking-in-garbage-collector)
*   [Kotlin/Wasmの `@ExperimentalWasmDsl` アノテーションの新しい場所](#new-location-of-experimentalwasmdsl-annotation)
*   [Gradleバージョン8.6～8.8のサポートが追加](#gradle)
*   [新しいオプションにより、JVMアーティファクトをクラスファイルとしてGradleプロジェクト間で共有可能に](#option-to-share-jvm-artifacts-between-projects-as-class-files)
*   [Composeコンパイラの更新](#compose-compiler)
*   [共通Kotlin標準ライブラリでのUUIDのサポートが追加](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDEサポート

2.0.20をサポートするKotlinプラグインは、最新のIntelliJ IDEAとAndroid Studioにバンドルされています。
IDEのKotlinプラグインを更新する必要はありません。
必要なのは、ビルドスクリプトでKotlinのバージョンを2.0.20に変更することだけです。

詳細は[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version)を参照してください。

## 言語

Kotlin 2.0.20では、データクラスの一貫性を改善し、Experimentalなコンテキストレシーバ機能を置き換えるための変更が導入され始めます。

### データクラスの `copy` 関数がコンストラクタと同じ可視性を持つように変更

現在、`private` コンストラクタを使用してデータクラスを作成すると、自動生成される `copy()` 関数は同じ可視性を持ちません。これにより、後のコードで問題が発生する可能性があります。今後のKotlinリリースでは、`copy()` 関数のデフォルトの可視性がコンストラクタと同じになる動作を導入します。この変更は、コードのスムーズな移行を支援するために段階的に導入されます。

当社の移行計画はKotlin 2.0.20から始まり、将来的に可視性が変更されるコードに警告を発行します。例えば、以下のような警告が表示されます。

```kotlin
// 2.0.20 で警告をトリガーします
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // 2.0.20 で警告をトリガーします
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: 非公開のプライマリコンストラクタが、データクラスの生成された「copy()」メソッドを介して公開されています。
    // 生成された「copy()」の可視性は今後のリリースで変更されます。
}
```

移行計画に関する最新の情報については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-11914)の対応する課題を参照してください。

この動作をより細かく制御できるように、Kotlin 2.0.20では2つのアノテーションを導入しました。

*   `@ConsistentCopyVisibility`: 今後のリリースでデフォルトになる前に、この動作をオプトインします。
*   `@ExposedCopyVisibility`: この動作をオプトアウトし、宣言サイトでの警告を抑制します。
    このアノテーションを使用しても、`copy()` 関数が呼び出されるとコンパイラは警告を報告することに注意してください。

モジュール全体で、個々のクラスではなく2.0.20で新しい動作をオプトインしたい場合は、`-Xconsistent-data-class-copy-visibility` コンパイラオプションを使用できます。
このオプションは、モジュール内のすべてのデータクラスに `@ConsistentCopyVisibility` アノテーションを追加するのと同じ効果があります。

### コンテキストレシーバの段階的なコンテキストパラメータへの置き換え

Kotlin 1.6.20では、[コンテキストレシーバ](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)を[実験的](components-stability.md#stability-levels-explained)機能として導入しました。コミュニティからのフィードバックに耳を傾けた結果、このアプローチを継続しないことを決定し、異なる方向性を取ることにしました。

今後のKotlinリリースでは、コンテキストレシーバはコンテキストパラメータに置き換えられます。コンテキストパラメータはまだ設計段階にあり、提案は[KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)で確認できます。

コンテキストパラメータの実装にはコンパイラに大幅な変更が必要となるため、コンテキストレシーバとコンテキストパラメータを同時にサポートしないことを決定しました。この決定により、実装が大幅に簡素化され、不安定な動作のリスクが最小限に抑えられます。

コンテキストレシーバがすでに多くの開発者によって使用されていることを理解しています。そのため、コンテキストレシーバのサポートを段階的に削除し始めます。当社の移行計画はKotlin 2.0.20から始まり、`-Xcontext-receivers` コンパイラオプションとともにコンテキストレシーバを使用すると、コードに警告が発行されます。例えば、以下のような警告が表示されます。

```kotlin
class MyContext

context(MyContext)
// Warning: 実験的なコンテキストレシーバは非推奨であり、コンテキストパラメータに置き換えられます。
// コンテキストレシーバを使用しないでください。代わりに、明示的にパラメータを渡すか、拡張付きのメンバーを使用してください。
fun someFunction() {
}
```

この警告は、今後のKotlinリリースでエラーになります。

コードでコンテキストレシーバを使用している場合は、以下のいずれかを使用するようにコードを移行することをお勧めします。

*   明示的なパラメータ。

    <table>
        <tr>
            <td>Before</td>
            <td>After</td>
        </tr>
        <tr>
    <td>

    ```kotlin
    context(ContextReceiverType)
    fun someFunction() {
        contextReceiverMember()
    }
    ```

    </td>
    <td>

    ```kotlin
    fun someFunction(explicitContext: ContextReceiverType) {
        explicitContext.contextReceiverMember()
    }
    ```

    </td>
    </tr>
    </table>

*   拡張メンバー関数（可能な場合）。

    <table>
        <tr>
            <td>Before</td>
            <td>After</td>
        </tr>
        <tr>
    <td>

    ```kotlin
    context(ContextReceiverType)
    fun contextReceiverMember() = TODO()

    context(ContextReceiverType)
    fun someFunction() {
        contextReceiverMember()
    }
    ```

    </td>
    <td>

    ```kotlin
    class ContextReceiverType {
        fun contextReceiverMember() = TODO()
    }

    fun ContextReceiverType.someFunction() {
        contextReceiverMember()
    }
    ```

    </td>
    </tr>
    </table>

あるいは、コンテキストパラメータがコンパイラでサポートされるKotlinリリースまで待つこともできます。コンテキストパラメータは当初、実験的機能として導入されることに注意してください。

## Kotlin Multiplatform

Kotlin 2.0.20では、マルチプラットフォームプロジェクトのソースセット管理が改善され、Gradleの最近の変更により一部のGradle Javaプラグインとの互換性が非推奨になります。

### デフォルトのターゲット階層からのソースセットに対する静的アクセサ

Kotlin 1.9.20以降、[デフォルト階層テンプレート](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)はすべてのKotlin Multiplatformプロジェクトに自動的に適用されます。
そして、デフォルト階層テンプレートからのすべてのソースセットに対して、Kotlin Gradleプラグインはタイプセーフなアクセサを提供しました。
これにより、`by getting` や `by creating` のようなコンストラクトを使用することなく、指定されたすべてのターゲットのソースセットにアクセスできるようになりました。

Kotlin 2.0.20は、IDEエクスペリエンスをさらに向上させることを目指しています。現在、デフォルト階層テンプレートからのすべてのソースセットに対して、`sourceSets {}` ブロックで静的アクセサを提供します。
この変更により、名前によるソースセットへのアクセスがより簡単になり、予測可能になると考えています。

各ソースセットには、サンプルを含む詳細なKDocコメントと、対応するターゲットを最初に宣言せずにソースセットにアクセスしようとした場合の警告を含む診断メッセージが追加されました。

```kotlin
kotlin {
    jvm()
    linuxX64()
    linuxArm64()
    mingwX64()

    sourceSets {
        commonMain.languageSettings {
            progressiveMode = true
        }

        jvmMain { }
        linuxX64Main { }
        linuxArm64Main { }
        // Warning: ターゲットを登録せずにソースセットにアクセスしています
        iosX64Main { }
    }
}
```

![ソースセットに名前でアクセスする](accessing-sourse-sets.png){width=700}

[Kotlin Multiplatformの階層型プロジェクト構造](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)について詳しく学ぶ。

### Kotlin Multiplatform GradleプラグインとGradle Javaプラグインとの互換性が非推奨に

Kotlin 2.0.20では、Kotlin Multiplatform Gradleプラグインと以下のGradle Javaプラグインのいずれかを同じプロジェクトに適用すると、非推奨警告が表示されるようになりました。これらは[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html)、[Application](https://docs.gradle.org/current/userguide/application_plugin.html)です。
警告は、マルチプラットフォームプロジェクト内の別のGradleプラグインがGradle Javaプラグインを適用する場合にも表示されます。
例えば、[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html)は自動的にApplicationプラグインを適用します。

この非推奨警告は、Kotlin MultiplatformのプロジェクトモデルとGradleのJavaエコシステムプラグインとの間の根本的な互換性の問題により追加されました。GradleのJavaエコシステムプラグインは現在、他のプラグインが以下の可能性があることを考慮していません。

*   Javaエコシステムプラグインとは異なる方法でJVMターゲットに対して公開またはコンパイルする。
*   同じプロジェクト内にJVMとAndroidのような2つの異なるJVMターゲットを持つ。
*   潜在的に複数の非JVMターゲットを持つ複雑なマルチプラットフォームプロジェクト構造を持つ。

残念ながら、Gradleは現在、これらの問題に対処するためのAPIを提供していません。

以前、Kotlin MultiplatformではJavaエコシステムプラグインとの統合を支援するためにいくつかの回避策を使用していました。
しかし、これらの回避策は互換性の問題を真に解決することはなく、Gradle 8.8のリリース以降、これらの回避策はもはや不可能です。詳細については、[YouTrackの課題](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)を参照してください。

この互換性問題をどのように解決するかはまだ正確には分かっていませんが、Kotlin Multiplatformプロジェクト内でのJavaソースコンパイルの何らかの形式のサポートを継続することにコミットしています。少なくとも、JavaソースのコンパイルとGradleの[`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html)プラグインのマルチプラットフォームプロジェクト内での使用をサポートします。

その間、マルチプラットフォームプロジェクトでこの非推奨警告が表示された場合は、以下のことをお勧めします。
1.  プロジェクトで実際にGradle Javaプラグインが必要かどうかを判断します。必要ない場合は、削除を検討してください。
2.  Gradle Javaプラグインが単一のタスクのみに使用されているかどうかを確認します。その場合、プラグインをそれほど手間なく削除できるかもしれません。例えば、タスクがJavadoc JARファイルを作成するためにGradle Javaプラグインを使用している場合、代わりにJavadocタスクを手動で定義できます。

そうでない場合、Kotlin Multiplatform GradleプラグインとこれらのGradle Javaプラグインの両方をマルチプラットフォームプロジェクトで使用したい場合は、以下のことをお勧めします。

1.  マルチプラットフォームプロジェクト内に別のサブプロジェクトを作成します。
2.  その別のサブプロジェクトに、Java用のGradleプラグインを適用します。
3.  その別のサブプロジェクトに、親マルチプラットフォームプロジェクトへの依存関係を追加します。

> その別のサブプロジェクトは、マルチプラットフォームプロジェクトであっては**なりません**。また、マルチプラットフォームプロジェクトへの依存関係を設定するためにのみ使用してください。
>
{style="warning"}

例えば、`my-main-project` というマルチプラットフォームプロジェクトがあり、JVMアプリケーションを実行するために[Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradleプラグインを使用したいとします。

サブプロジェクト（ここでは `subproject-A` とします）を作成すると、親プロジェクトの構造は以下のようになります。

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

サブプロジェクトの `build.gradle.kts` ファイルで、`plugins {}` ブロックにApplicationプラグインを適用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("application")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('application')
}
```

</tab>
</tabs>

サブプロジェクトの `build.gradle.kts` ファイルで、親マルチプラットフォームプロジェクトへの依存関係を追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 親マルチプラットフォームプロジェクトの名前
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 親マルチプラットフォームプロジェクトの名前
}
```

</tab>
</tabs>

これで、親プロジェクトが両方のプラグインで動作するように設定されました。

## Kotlin/Native

Kotlin/Nativeは、ガベージコレクタの改善と、Swift/Objective-CからKotlinのサスペンド関数を呼び出すための改善が施されました。

### ガベージコレクタにおける並行マーキング

Kotlin 2.0.20では、JetBrainsチームはKotlin/Nativeランタイムパフォーマンスを向上させるための新たな一歩を踏み出しました。
ガベージコレクタ (GC) における並行マーキングの実験的サポートを追加しました。

デフォルトでは、GCがヒープ内のオブジェクトをマーキングする際、アプリケーションスレッドは一時停止する必要があります。これはGCの一時停止時間に大きく影響し、Compose Multiplatformで構築されたUIアプリケーションなど、レイテンシに厳しいアプリケーションのパフォーマンスにとって重要です。

現在、ガベージコレクションのマーキングフェーズはアプリケーションスレッドと同時に実行できるようになりました。
これにより、GCの一時停止時間が大幅に短縮され、アプリの応答性の向上に役立つはずです。

#### 有効化方法

この機能は現在[実験的](components-stability.md#stability-levels-explained)です。
有効にするには、`gradle.properties` ファイルに次のオプションを設定します。

```none
kotlin.native.binary.gc=cms
```

何か問題が発生した場合は、[YouTrack](https://kotl.in/issue)の課題トラッカーにご報告ください。

### ビットコード埋め込みのサポートが削除されました

Kotlin 2.0.20以降、Kotlin/Nativeコンパイラはビットコード埋め込みをサポートしなくなりました。
ビットコード埋め込みはXcode 14で非推奨となり、Xcode 15でAppleのすべてのターゲットから削除されました。

現在、フレームワーク構成の `embedBitcode` パラメータ、および `-Xembed-bitcode` と `-Xembed-bitcode-marker` コマンドライン引数は非推奨です。

以前のバージョンのXcodeを使用しているものの、Kotlin 2.0.20にアップグレードしたい場合は、Xcodeプロジェクトでビットコード埋め込みを無効にしてください。

### SignpostによるGCパフォーマンス監視の変更点

Kotlin 2.0.0では、Xcode Instrumentsを介してKotlin/Nativeガベージコレクタ（GC）のパフォーマンスを監視できるようになりました。Instrumentsには、GCの一時停止をイベントとして表示できるsignpostツールが含まれています。
これは、iOSアプリにおけるGC関連のフリーズをチェックする際に非常に便利です。

この機能はデフォルトで有効になっていましたが、残念ながら、アプリケーションをXcode Instrumentsと同時に実行するとクラッシュすることがありました。
Kotlin 2.0.20以降、以下のコンパイラオプションを使用して明示的にオプトインする必要があります。

```none
-Xbinary=enableSafepointSignposts=true
```

GCパフォーマンス分析の詳細については、[ドキュメント](native-memory-manager.md#monitor-gc-performance)を参照してください。

### Swift/Objective-Cからメインスレッド以外のスレッドでKotlinのサスペンド関数を呼び出す機能

これまでKotlin/Nativeには、SwiftおよびObjective-CからKotlinのサスペンド関数を呼び出す能力をメインスレッドのみに制限するというデフォルトの制約がありました。Kotlin 2.0.20はこの制限を解除し、Swift/Objective-Cから任意のKotlin `suspend` 関数を任意のthreadで実行できるようになりました。

以前に `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none` バイナリオプションを使用してメインスレッド以外のスレッドに対するデフォルトの動作を切り替えていた場合、`gradle.properties` ファイルからそのオプションを削除できるようになりました。

## Kotlin/Wasm

Kotlin 2.0.20では、Kotlin/Wasmは名前付きエクスポートへの移行を続け、`@ExperimentalWasmDsl` アノテーションの場所が変更されました。

### デフォルトエクスポート使用時のエラー

名前付きエクスポートへの移行の一環として、Kotlin/WasmエクスポートのJavaScriptにおけるデフォルトインポートを使用すると、以前はコンソールに警告メッセージが表示されていました。

名前付きエクスポートを完全にサポートするために、この警告はエラーに格上げされました。デフォルトインポートを使用すると、次のエラーメッセージが表示されます。

```text
Do not use default import. Use the corresponding named import instead.
```

この変更は、名前付きエクスポートへの移行のための非推奨サイクルの一部です。各フェーズで期待できることは次のとおりです。

*   **バージョン2.0.0**: コンソールに警告メッセージが表示され、デフォルトエクスポートによるエンティティのエクスポートが非推奨であることが説明されます。
*   **バージョン2.0.20**: 対応する名前付きインポートを使用するように要求するエラーが発生します。
*   **バージョン2.1.0**: デフォルトインポートの使用が完全に削除されます。

### ExperimentalWasmDslアノテーションの新しい場所

以前、WebAssembly (Wasm) 機能の `@ExperimentalWasmDsl` アノテーションは、Kotlin Gradleプラグイン内で次の場所に配置されていました。

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

2.0.20では、`@ExperimentalWasmDsl` アノテーションは以下の場所に移動されました。

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

以前の場所は非推奨となり、未解決の参照によりビルドの失敗を引き起こす可能性があります。

`@ExperimentalWasmDsl` アノテーションの新しい場所を反映させるには、Gradleビルドスクリプトのインポートステートメントを更新してください。
新しい `@ExperimentalWasmDsl` の場所に対して明示的なインポートを使用します。

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

あるいは、古いパッケージからのスターインポートステートメントを削除します。

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JSは、JavaScriptでの静的メンバーをサポートし、JavaScriptからKotlinコレクションを作成するためのいくつかの実験的機能を導入しました。

### JavaScriptでKotlinの静的メンバーを使用するためのサポート

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。これに関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic)にてお待ちしております。
>
{style="warning"}

Kotlin 2.0.20以降、`@JsStatic` アノテーションを使用できるようになりました。これは[@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/)と同様に機能し、コンパイラに追加の静的メソッドをターゲット宣言に対して生成するように指示します。これにより、KotlinコードからJavaScriptで静的メンバーを直接使用できるようになります。

`@JsStatic` アノテーションは、名前付きオブジェクトで定義された関数や、クラスやインターフェース内に宣言されたコンパニオンオブジェクト内の関数に使用できます。コンパイラは、オブジェクトの静的メソッドと、オブジェクト自体のインスタンスメソッドの両方を生成します。例:

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

これで、`callStatic()` はJavaScriptで静的になり、`callNonStatic()` は静的ではなくなります。

```javascript
C.callStatic();              // 動作します。静的関数にアクセスしています
C.callNonStatic();           // エラーです。生成されたJavaScriptでは静的関数ではありません
C.Companion.callStatic();    // インスタンスメソッドは残ります
C.Companion.callNonStatic(); // これが動作する唯一の方法
```

`@JsStatic` アノテーションは、オブジェクトまたはコンパニオンオブジェクトのプロパティにも適用でき、そのゲッターメソッドとセッターメソッドをそのオブジェクトまたはコンパニオンオブジェクトを含むクラスの静的メンバーにします。

### JavaScriptからKotlinコレクションを作成する機能

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。これに関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript)にてお待ちしております。
>
{style="warning"}

Kotlin 2.0.0では、KotlinコレクションをJavaScript（およびTypeScript）にエクスポートする機能が導入されました。今回、JetBrainsチームはコレクションの相互運用性を改善するためのさらなる一歩を踏み出しました。Kotlin 2.0.20以降、JavaScript/TypeScript側から直接Kotlinコレクションを作成できるようになりました。

JavaScriptからKotlinコレクションを作成し、エクスポートされたコンストラクタや関数に引数として渡すことができます。
エクスポートされた宣言内でコレクションに言及するとすぐに、KotlinはJavaScript/TypeScriptで利用可能なコレクションのファクトリを生成します。

以下のエクスポートされた関数を見てください。

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

`MutableMap` コレクションが言及されているため、KotlinはJavaScript/TypeScriptから利用可能なファクトリメソッドを持つオブジェクトを生成します。
このファクトリメソッドは、JavaScriptの `Map` から `MutableMap` を作成します。

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

この機能は、`Set`、`Map`、`List` のKotlinコレクションタイプおよびそれらの可変対応するタイプで利用できます。

## Gradle

Kotlin 2.0.20は、Gradle 6.8.3から8.6までと完全に互換性があります。Gradle 8.7および8.8もサポートされていますが、1つの例外があります。Kotlin Multiplatform Gradleプラグインを使用している場合、JVMターゲットで `withJava()` 関数を呼び出すマルチプラットフォームプロジェクトで非推奨警告が表示されることがあります。この問題はできるだけ早く修正する予定です。

詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)の課題を参照してください。

また、最新のGradleリリースまでのバージョンを使用することもできますが、その場合、非推奨警告が表示されたり、新しいGradle機能が動作しない可能性があることに注意してください。

このバージョンでは、JVMヒストリファイルに基づく古い増分コンパイルアプローチの非推奨化の開始や、プロジェクト間でJVMアーティファクトを共有する新しい方法などの変更が加えられています。

### JVMヒストリファイルに基づく増分コンパイルが非推奨に

Kotlin 2.0.20では、JVMヒストリファイルに基づく増分コンパイルアプローチは非推奨となり、Kotlin 1.8.20以降デフォルトで有効になっている新しい増分コンパイルアプローチが推奨されます。

JVMヒストリファイルに基づく増分コンパイルアプローチは、[Gradleのビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)で動作しない、コンパイル回避をサポートしないといった制限がありました。
対照的に、新しい増分コンパイルアプローチはこれらの制限を克服し、導入以来良好なパフォーマンスを示しています。

新しい増分コンパイルアプローチが過去2つの主要なKotlinリリースでデフォルトで使用されているため、`kotlin.incremental.useClasspathSnapshot` GradleプロパティはKotlin 2.0.20で非推奨になりました。
したがって、それを使用してオプトアウトしている場合、非推奨警告が表示されます。

### JVMアーティファクトをクラスファイルとしてプロジェクト間で共有するオプション

> この機能は[実験的](components-stability.md#stability-levels-explained)です。
> いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
> これに関するフィードバックは[YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts)にてお待ちしております。
> オプトインが必要です（詳細は下記参照）。
>
{style="warning"}

Kotlin 2.0.20では、Kotlin/JVMコンパイルの出力（JARファイルなど）がプロジェクト間で共有される方法を変更する新しいアプローチを導入しました。このアプローチでは、Gradleの `apiElements` 設定にセカンダリバリアントが追加され、コンパイル済みの `.class` ファイルを含むディレクトリへのアクセスを提供します。構成すると、プロジェクトはコンパイル中に圧縮されたJARアーティファクトを要求する代わりに、このディレクトリを使用します。これにより、特に増分ビルドにおいて、JARファイルの圧縮と解凍の回数が減ります。

当社のテストでは、この新しいアプローチがLinuxおよびmacOSホストでビルドパフォーマンスの改善を提供できることが示されています。
ただし、Windowsホストでは、Windowsがファイル操作時のI/O処理をどのように行うかにより、パフォーマンスの低下が見られました。

この新しいアプローチを試すには、`gradle.properties` ファイルに次のプロパティを追加します。

```none
kotlin.jvm.addClassesVariant=true
```

デフォルトでは、このプロパティは `false` に設定されており、Gradleの `apiElements` バリアントは圧縮されたJARアーティファクトを要求します。

> Gradleには、Javaのみのプロジェクトで使用できる関連プロパティがあり、コンパイル済み`.class`ファイルを含むディレクトリ**の代わりに**、圧縮されたJARアーティファクトのみをコンパイル中に公開します。
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> このプロパティとその目的の詳細については、Gradleの[「大規模マルチプロジェクトでのWindowsにおけるビルドパフォーマンスの大幅な低下」](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance)に関するドキュメントを参照してください。
>
{style="note"}

この新しいアプローチに関するフィードバックをお待ちしております。使用中にパフォーマンスの改善に気づきましたか？
[YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts)にコメントを追加してお知らせください。

### Kotlin Gradleプラグインの依存関係の動作を`java-test-fixtures`プラグインと整合

Kotlin 2.0.20より前では、プロジェクトで[`java-test-fixtures`プラグイン](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)を使用している場合、GradleとKotlin Gradleプラグインの間で依存関係の伝播方法に違いがありました。

Kotlin Gradleプラグインは、以下の依存関係を伝播していました。

*   `java-test-fixtures` プラグインの `implementation` および `api` 依存関係タイプから `test` ソースセットのコンパイルクラスパスへ。
*   メインソースセットの `implementation` および `api` 依存関係タイプから `java-test-fixtures` プラグインのソースセットコンパイルクラスパスへ。

しかし、Gradleは `api` 依存関係タイプのみを伝播していました。

この動作の違いにより、一部のプロジェクトでクラスパス内にリソースファイルが複数回見つかるという問題が発生していました。

Kotlin 2.0.20からは、Kotlin Gradleプラグインの動作がGradleの `java-test-fixtures` プラグインと整合されるため、この問題や他のGradleプラグインに関する問題は発生しなくなりました。

この変更の結果、`test` および `testFixtures` ソースセット内の一部の依存関係にアクセスできなくなる場合があります。
この問題が発生した場合、依存関係の宣言タイプを `implementation` から `api` に変更するか、影響を受けるソースセットに新しい依存関係宣言を追加してください。

### コンパイルタスクがアーティファクトに対するタスク依存関係を欠く稀なケースでタスク依存関係を追加

2.0.20以前では、コンパイルタスクがそのアーティファクト入力の1つに対するタスク依存関係を欠くシナリオがあることが判明しました。これは、依存するコンパイルタスクの結果が不安定になることを意味しました。アーティファクトが時間内に生成される場合と、そうでない場合があったためです。

この問題を解決するために、Kotlin Gradleプラグインはこれらのシナリオで必要なタスク依存関係を自動的に追加するようになりました。

ごく稀に、この新しい動作によって循環依存エラーが発生することが判明しました。
例えば、複数のコンパイルがあり、あるコンパイルが他のコンパイルのすべての内部宣言を見ることができ、生成されたアーティファクトが両方のコンパイルタスクの出力に依存している場合、次のようなエラーが表示されることがあります。

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

この循環依存エラーを修正するために、Gradleプロパティ `archivesTaskOutputAsFriendModule` を追加しました。

デフォルトでは、このプロパティはタスク依存関係を追跡するために `true` に設定されています。コンパイルタスクでのアーティファクトの使用を無効にし、タスク依存関係が不要になるようにするには、`gradle.properties` ファイルに以下を追加します。

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-69330)の課題を参照してください。

## Composeコンパイラ

Kotlin 2.0.20では、Composeコンパイラにいくつかの改善が加えられました。

### 2.0.0で導入された不必要なリコンポジション問題の修正

Composeコンパイラ2.0.0には、JVM以外のターゲットを持つマルチプラットフォームプロジェクトで型の安定性を誤って推論し、不必要な（あるいは無限の）リコンポジションを引き起こす問題がありました。Kotlin 2.0.0向けに作成されたComposeアプリをバージョン2.0.10以降に更新することを強くお勧めします。

アプリがComposeコンパイラ2.0.10以降でビルドされているが、バージョン2.0.0でビルドされた依存関係を使用している場合、これらの古い依存関係が依然としてリコンポジション問題を引き起こす可能性があります。
これを防ぐには、依存関係をアプリと同じComposeコンパイラでビルドされたバージョンに更新してください。

### コンパイラオプション設定の新しい方法

トップレベルのパラメータの変動を避けるため、新しいオプション設定メカニズムを導入しました。
Composeコンパイラチームにとって、`composeCompiler {}` ブロックのトップレベルのエントリを作成または削除してテストを行うことは困難です。
そのため、ストロングスキッピングモードや非スキッピンググループ最適化などのオプションは、`featureFlags` プロパティを介して有効化されるようになりました。
このプロパティは、最終的にデフォルトとなる新しいComposeコンパイラオプションをテストするために使用されます。

この変更はComposeコンパイラGradleプラグインにも適用されています。今後、機能フラグを設定するには、次の構文を使用します（このコードはすべてのデフォルト値を反転させます）。

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

あるいは、Composeコンパイラを直接設定する場合は、次の構文を使用します。

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization`、`enableStrongSkippingMode` プロパティは、これに伴い非推奨になりました。

この新しいアプローチに関するフィードバックは、[YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags)にてお待ちしております。

### ストロングスキッピングモードがデフォルトで有効に

Composeコンパイラのストロングスキッピングモードがデフォルトで有効になりました。

ストロングスキッピングモードは、スキップできるコンポーザブルのルールを変更するComposeコンパイラの設定オプションです。
ストロングスキッピングモードが有効な場合、不安定なパラメータを持つコンポーザブルもスキップできるようになりました。
また、ストロングスキッピングモードは、コンポーザブル関数で使用されるラムダを自動的に記憶するため、リコンポジションを避けるためにラムダを `remember` でラップする必要がなくなります。

詳細については、[ストロングスキッピングモードのドキュメント](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)を参照してください。

### コンポジショントレースマーカーがデフォルトで有効に

`includeTraceMarkers` オプションは、コンパイラプラグインのデフォルト値と一致するように、ComposeコンパイラGradleプラグインでデフォルトで `true` に設定されました。これにより、Android Studioのシステムトレースプロファイラでコンポーザブル関数を確認できます。コンポジショントレースの詳細については、この[Android Developersブログ投稿](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)を参照してください。

### 非スキッピンググループの最適化

このリリースには新しいコンパイラオプションが含まれています。これを有効にすると、スキップ不可および再起動不可のコンポーザブル関数は、コンポーザブルの本体の周囲にグループを生成しなくなります。これにより、割り当てが減り、パフォーマンスが向上します。
このオプションは実験的であり、デフォルトでは無効ですが、[上記](#new-way-to-configure-compiler-options)で示されているように、機能フラグ `OptimizeNonSkippingGroups` を使用して有効にできます。

この機能フラグは現在、広範なテストの準備が整っています。この機能を有効にした際に発見された問題は、[Google issue tracker](https://goo.gle/compose-feedback)に提出してください。

### 抽象コンポーザブル関数におけるデフォルトパラメータのサポート

抽象コンポーザブル関数にデフォルトパラメータを追加できるようになりました。

以前は、有効なKotlinコードであっても、これを試みるとComposeコンパイラがエラーを報告していました。
今回、Composeコンパイラでこの機能がサポートされ、制限が解除されました。
これは、デフォルトの `Modifier` 値を含める場合に特に役立ちます。

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

openなコンポーザブル関数のデフォルトパラメータは、2.0.20では依然として制限されています。この制限は今後のリリースで対処される予定です。

## 標準ライブラリ

標準ライブラリは、実験的機能としてUUIDをサポートし、Base64デコードにいくつかの変更が加えられました。

### 共通Kotlin標準ライブラリでのUUIDのサポート

> この機能は[実験的](components-stability.md#stability-levels-explained)です。
> オプトインするには、`@ExperimentalUuidApi` アノテーションを使用するか、コンパイラオプション `-opt-in=kotlin.uuid.ExperimentalUuidApi` を使用してください。
>
{style="warning"}

Kotlin 2.0.20では、一意のアイテムを識別するという課題に対処するため、共通Kotlin標準ライブラリに[UUID（Universally Unique Identifier）](https://en.wikipedia.org/wiki/Universally_unique_identifier)を表すクラスが導入されました。

さらに、この機能は以下のUUID関連操作のためのAPIを提供します。

*   UUIDの生成。
*   文字列表現からのUUIDのパースと文字列へのフォーマット。
*   指定された128ビット値からのUUIDの作成。
*   UUIDの128ビットへのアクセス。

以下のコード例はこれらの操作を示しています。

```kotlin
// UUID作成用のバイト配列を構築
val byteArray = byteArrayOf(
    0x55, 0x0E, 0x84.toByte(), 0x00, 0xE2.toByte(), 0x9B.toByte(), 0x41, 0xD4.toByte(),
    0xA7.toByte(), 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00
)

val uuid1 = Uuid.fromByteArray(byteArray)
val uuid2 = Uuid.fromULongs(0x550E8400E29B41D4uL, 0xA716446655440000uL)
val uuid3 = Uuid.parse("550e8400-e29b-41d4-a716-446655440000")

println(uuid1)
// 550e8400-e29b-41d4-a716-446655440000
println(uuid1 == uuid2)
// true
println(uuid2 == uuid3)
// true

// UUIDビットにアクセス
val version = uuid1.toLongs { mostSignificantBits, _ ->
    ((mostSignificantBits shr 12) and 0xF).toInt()
}
println(version)
// 4

// ランダムなUUIDを生成
val randomUuid = Uuid.random()

println(uuid1 == randomUuid)
// false
```

`java.util.UUID` を使用するAPIとの互換性を維持するために、Kotlin/JVMには `java.util.UUID` と `kotlin.uuid.Uuid` 間で変換するための2つの拡張関数、`.toJavaUuid()` と `.toKotlinUuid()` があります。例えば:

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// Kotlin UUIDをjava.util.UUIDに変換
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// Java UUIDをkotlin.uuid.Uuidに変換
val kotlinUuid = javaUuid.toKotlinUuid()
```

この機能と提供されるAPIは、複数のプラットフォーム間でコードを共有できるため、マルチプラットフォームソフトウェア開発を簡素化します。UUIDは、一意の識別子を生成するのが難しい環境でも理想的です。

UUIDを使用する一般的なユースケースには、以下のようなものがあります。

*   データベースレコードへの一意のIDの割り当て。
*   ウェブセッション識別子の生成。
*   一意の識別または追跡が必要なあらゆるシナリオ。

### HexFormatにおける `minLength` のサポート

> [`HexFormat` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/)とそのプロパティは
> [実験的](components-stability.md#stability-levels-explained)です。
> オプトインするには、`@OptIn(ExperimentalStdlibApi::class)` アノテーションを使用するか、コンパイラ
> オプション `-opt-in=kotlin.ExperimentalStdlibApi` を使用してください。
>
{style="warning"}

Kotlin 2.0.20では、[`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html)を通じてアクセスされる[`NumberHexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/)クラスに新しい `minLength` プロパティが追加されました。
このプロパティを使用すると、数値の16進数表現における最小桁数を指定でき、必要な長さに合わせてゼロパディングを有効にできます。さらに、`removeLeadingZeros` プロパティを使用して先頭のゼロをトリミングできます。

```kotlin
fun main() {
    println(93.toHexString(HexFormat {
        number.minLength = 4
        number.removeLeadingZeros = true
    }))
    // "005d"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-minlength-hexformat" validate="false"}

`minLength` プロパティはパースには影響しません。ただし、パースは現在、余分な先行桁がゼロであれば、型の幅よりも多くの桁を持つ16進数文字列を許可します。

### Base64のデコーダの動作の変更点

> [`Base64` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/)とそれに関連する機能は
> [実験的](components-stability.md#stability-levels-explained)です。
> オプトインするには、`@OptIn(ExperimentalEncodingApi::class)`
> アノテーションを使用するか、コンパイラオプション `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi` を使用してください。
>
{style="warning"}

Kotlin 2.0.20では、Base64デコーダの動作に2つの変更が導入されました。

*   [Base64デコーダがパディングを要求するように変更](#the-base64-decoder-now-requires-padding)
*   [パディング設定のための `withPadding` 関数が追加](#withpadding-function-for-padding-configuration)

#### Base64デコーダがパディングを要求するように変更

Base64エンコーダはデフォルトでパディングを追加するようになり、デコーダはデコード時にパディングを要求し、ゼロ以外のパディングビットを禁止するようになりました。

#### パディング設定のための `withPadding` 関数

Base64エンコードおよびデコードのパディング動作をユーザーが制御できるように、新しい `.withPadding()` 関数が導入されました。

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

この関数により、異なるパディングオプションを持つ `Base64` インスタンスを作成できます。

| `PaddingOption`    | エンコード時    | デコード時           |
|--------------------|-------------------|----------------------|
| `PRESENT`          | パディングを追加  | パディングが必須     |
| `ABSENT`           | パディングを省略  | パディングは許可されない |
| `PRESENT_OPTIONAL` | パディングを追加  | パディングはオプション |
| `ABSENT_OPTIONAL`  | パディングを省略  | パディングはオプション |

異なるパディングオプションを持つ `Base64` インスタンスを作成し、それらを使用してデータをエンコードおよびデコードできます。

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // エンコードするデータ例
    val data = "fooba".toByteArray()

    // URLセーフなアルファベットとPRESENTパディングを持つBase64インスタンスを作成
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("Encoded data with PRESENT padding: $encodedDataPresent")
    // Encoded data with PRESENT padding: Zm9vYmE=

    // URLセーフなアルファベットとABSENTパディングを持つBase64インスタンスを作成
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("Encoded data with ABSENT padding: $encodedDataAbsent")
    // Encoded data with ABSENT padding: Zm9vYmE

    // データをデコードして元に戻す
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("Decoded data with PRESENT padding: ${String(decodedDataPresent)}")
    // Decoded data with PRESENT padding: fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("Decoded data with ABSENT padding: ${String(decodedDataAbsent)}")
    // Decoded data with ABSENT padding: fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## ドキュメントの更新

Kotlinドキュメントにはいくつかの注目すべき変更が加えられました。

*   [標準入力ページ](standard-input.md)の改善 - Java Scannerと `readln()` の使用方法を学びます。
*   [K2コンパイラ移行ガイド](k2-compiler-migration-guide.md)の改善 - パフォーマンスの向上、Kotlinライブラリとの互換性、カスタムコンパイラプラグインの対処法について学びます。
*   [例外ページ](exceptions.md)の改善 - 例外、それらをスローおよびキャッチする方法について学びます。
*   [JVMでJUnitを使用したテストコード - チュートリアル](jvm-test-using-junit.md)の改善 - JUnitを使用してテストを作成する方法を学びます。
*   [Swift/Objective-Cとの相互運用ページ](native-objc-interop.md)の改善 - Kotlin宣言をSwift/Objective-Cコードで、Objective-C宣言をKotlinコードで使用する方法を学びます。
*   [Swiftパッケージエクスポート設定ページ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-spm-export.html)の改善 - Swiftパッケージマネージャの依存関係によって消費できるKotlin/Native出力を設定する方法を学びます。

## Kotlin 2.0.20のインストール

IntelliJ IDEA 2023.3およびAndroid Studio Iguana (2023.2.1) Canary 15以降、KotlinプラグインはIDEにバンドルされたプラグインとして配布されるようになりました。これは、JetBrains Marketplaceからプラグインをインストールできなくなったことを意味します。

新しいKotlinバージョンに更新するには、[ビルドスクリプトでKotlinのバージョンを2.0.20に変更](releases.md#update-to-a-new-kotlin-version)してください。