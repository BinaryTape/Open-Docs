[//]: # (title: Kotlin 2.0.20 の新機能)

_[リリース日: 2024年8月22日](releases.md#release-details)_

Kotlin 2.0.20 がリリースされました！ このバージョンには、Kotlin K2 コンパイラが Stable になった Kotlin 2.0.0 のパフォーマンス改善とバグ修正が含まれています。このリリースにおけるその他の主なハイライトは以下のとおりです。

*   [データクラスの `copy` 関数がコンストラクタと同じ可視性を持つように](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
*   [マルチプラットフォームプロジェクトで、デフォルトのターゲット階層からのソースセットに対する静的アクセサーが利用可能に](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
*   [Kotlin/Native のガベージコレクターで並行マーキングが可能に](#concurrent-marking-in-garbage-collector)
*   [Kotlin/Wasm の `@ExperimentalWasmDsl` アノテーションの新しい場所](#new-location-of-experimentalwasmdsl-annotation)
*   [Gradle 8.6～8.8 バージョンのサポートが追加された](#gradle)
*   [クラスファイルとして Gradle プロジェクト間で JVM アーティファクトを共有する新しいオプション](#option-to-share-jvm-artifacts-between-projects-as-class-files)
*   [Compose コンパイラが更新された](#compose-compiler)
*   [共通 Kotlin 標準ライブラリに UUID のサポートが追加された](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE サポート

2.0.20 をサポートする Kotlin プラグインは、最新の IntelliJ IDEA および Android Studio にバンドルされています。
IDE の Kotlin プラグインを更新する必要はありません。
ビルドスクリプトで Kotlin のバージョンを 2.0.20 に変更するだけです。

詳細については、[新しいリリースへの更新](releases.md#update-to-a-new-kotlin-version)を参照してください。

## 言語

Kotlin 2.0.20 では、データクラスの一貫性を改善し、実験的なコンテキストレシーバー機能を置き換えるための変更が導入され始めます。

### データクラスの `copy` 関数がコンストラクタと同じ可視性を持つように

現在、`private` コンストラクタを使用してデータクラスを作成すると、自動生成される `copy()` 関数は同じ可視性を持ちません。これは、コードの後で問題を引き起こす可能性があります。将来の Kotlin リリースでは、`copy()` 関数のデフォルトの可視性がコンストラクタと同じになるようにする動作を導入します。この変更は、コードのスムーズな移行を支援するために段階的に導入されます。

Kotlin 2.0.20 から移行計画を開始し、将来的に可視性が変更されるコードに警告を発行します。例:

```kotlin
// Triggers a warning in 2.0.20
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // Triggers a warning in 2.0.20
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

移行計画に関する最新情報については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) の対応する課題を参照してください。

この動作をより詳細に制御できるように、Kotlin 2.0.20 では 2 つのアノテーションを導入しました。

*   `@ConsistentCopyVisibility`: 後続のリリースでデフォルトになる前に、現在の動作をオプトインします。
*   `@ExposedCopyVisibility`: 動作をオプトアウトし、宣言箇所での警告を抑制します。
    このアノテーションを使用しても、`copy()` 関数が呼び出されたときにコンパイラは警告を報告します。

個々のクラスではなくモジュール全体で 2.0.20 ですでに新しい動作をオプトインしたい場合は、`-Xconsistent-data-class-copy-visibility` コンパイラオプションを使用できます。
このオプションは、モジュール内のすべてのデータクラスに `@ConsistentCopyVisibility` アノテーションを追加するのと同じ効果があります。

### コンテキストレシーバーからコンテキストパラメータへの段階的な置き換え

Kotlin 1.6.20 で、[コンテキストレシーバー](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)を[実験的](components-stability.md#stability-levels-explained)機能として導入しました。コミュニティからのフィードバックを受けて、このアプローチは継続せず、異なる方向性で進めることにしました。

将来の Kotlin リリースでは、コンテキストレシーバーはコンテキストパラメータに置き換えられます。コンテキストパラメータはまだ設計フェーズにあり、提案は [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) で確認できます。

コンテキストパラメータの実装にはコンパイラに大幅な変更が必要なため、コンテキストレシーバーとコンテキストパラメータを同時にサポートしないことにしました。この決定により、実装が大幅に簡素化され、不安定な動作のリスクが最小限に抑えられます。

コンテキストレシーバーがすでに多くの開発者によって使用されていることは理解しています。したがって、コンテキストレシーバーのサポートを段階的に削除し始めます。Kotlin 2.0.20 から移行計画を開始し、`-Xcontext-receivers` コンパイラオプションとともにコンテキストレシーバーが使用されているコードに警告が発行されます。例:

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

この警告は、将来の Kotlin リリースでエラーになります。

コードでコンテキストレシーバーを使用している場合は、コードを以下のいずれかに移行することをお勧めします。

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

*   拡張メンバー関数 (可能な場合)。

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

または、コンテキストパラメータがコンパイラでサポートされる Kotlin リリースまで待つこともできます。コンテキストパラメータは、最初は実験的な機能として導入されることに注意してください。

## Kotlin Multiplatform

Kotlin 2.0.20 では、マルチプラットフォームプロジェクトにおけるソースセット管理の改善と、Gradle の最近の変更による一部の Gradle Java プラグインとの互換性の非推奨化が行われています。

### デフォルトのターゲット階層からのソースセットに対する静的アクセサー

Kotlin 1.9.20 以降、[デフォルト階層テンプレート](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)がすべての Kotlin Multiplatform プロジェクトに自動的に適用されます。
そして、デフォルト階層テンプレートのすべてのソースセットに対して、Kotlin Gradle プラグインはタイプセーフなアクセサーを提供しました。
これにより、`by getting` や `by creating` のような構文を使用せずに、指定されたすべてのターゲットのソースセットにアクセスできるようになりました。

Kotlin 2.0.20 は、IDE 体験をさらに向上させることを目指しています。デフォルト階層テンプレートのすべてのソースセットに対して、`sourceSets {}` ブロックで静的アクセサーを提供するようになりました。
この変更により、名前によるソースセットへのアクセスがより簡単で予測可能になると考えられます。

各ソースセットには、サンプルを含む詳細な KDoc コメントと、対応するターゲットを最初に宣言せずにソースセットにアクセスしようとした場合の警告を含む診断メッセージが表示されるようになりました。

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
        // Warning: accessing source set without registering the target
        iosX64Main { }
    }
}
```

![ソースセットを名前でアクセスする](accessing-sourse-sets.png){width=700}

[Kotlin Multiplatform の階層型プロジェクト構造](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html)について詳しく学ぶ。

### Kotlin Multiplatform Gradle プラグインと Gradle Java プラグインとの互換性の非推奨化

Kotlin 2.0.20 では、Kotlin Multiplatform Gradle プラグインと以下の Gradle Java プラグインのいずれかを同じプロジェクトに適用した場合に、非推奨の警告を導入します。それらのプラグインは、[Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html)、および [Application](https://docs.gradle.org/current/userguide/application_plugin.html) です。
警告は、マルチプラットフォームプロジェクト内の別の Gradle プラグインが Gradle Java プラグインを適用する場合にも表示されます。
たとえば、[Spring Boot Gradle プラグイン](https://docs.spring.io/spring-boot/gradle-plugin/index.html)は Application プラグインを自動的に適用します。

この非推奨の警告は、Kotlin Multiplatform のプロジェクトモデルと Gradle の Java エコシステムプラグインとの間の根本的な互換性の問題のために追加しました。Gradle の Java エコシステムプラグインは現在、他のプラグインが以下のことを考慮していません。

*   Java エコシステムプラグインとは異なる方法で JVM ターゲットを公開またはコンパイルする可能性がある。
*   同じプロジェクトに JVM と Android のように 2 つの異なる JVM ターゲットを持つ可能性がある。
*   潜在的に複数の非 JVM ターゲットを持つ複雑なマルチプラットフォームプロジェクト構造を持つ可能性がある。

残念ながら、Gradle は現在これらの問題に対処するための API を提供していません。

以前、Kotlin Multiplatform では Java エコシステムプラグインとの統合を支援するためにいくつかの回避策を使用していました。
しかし、これらの回避策は互換性の問題を真に解決することはなく、Gradle 8.8 のリリース以降、これらの回避策はもはや不可能になりました。詳細については、[YouTrack の課題](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)を参照してください。

この互換性問題をどのように解決するかはまだ明確ではありませんが、Kotlin Multiplatform プロジェクトでの Java ソースコンパイルのサポートを継続することを約束します。少なくとも、Java ソースのコンパイルと、マルチプラットフォームプロジェクト内での Gradle の [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) プラグインの使用をサポートします。

その間、マルチプラットフォームプロジェクトでこの非推奨の警告が表示された場合は、以下のことをお勧めします。
1.  プロジェクトで実際に Gradle Java プラグインが必要かどうかを判断します。必要ない場合は、削除を検討してください。
2.  Gradle Java プラグインが単一のタスクにのみ使用されているかどうかを確認します。その場合、それほど労力をかけずにプラグインを削除できる可能性があります。たとえば、タスクが Gradle Java プラグインを使用して Javadoc JAR ファイルを作成する場合、代わりに Javadoc タスクを手動で定義できます。

それ以外の場合、マルチプラットフォームプロジェクトで Kotlin Multiplatform Gradle プラグインとこれらの Gradle Java プラグインの両方を使用したい場合は、以下のことをお勧めします。

1.  マルチプラットフォームプロジェクトに別のサブプロジェクトを作成します。
2.  その別のサブプロジェクトで、Java 用の Gradle プラグインを適用します。
3.  その別のサブプロジェクトで、親マルチプラットフォームプロジェクトへの依存関係を追加します。

> その個別のサブプロジェクトはマルチプラットフォームプロジェクトであってはならず、マルチプラットフォームプロジェクトへの依存関係を設定するためにのみ使用してください。
>
{style="warning"}

たとえば、`my-main-project` というマルチプラットフォームプロジェクトがあり、[Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle プラグインを使用して JVM アプリケーションを実行したいとします。

サブプロジェクト（`subproject-A` とします）を作成すると、親プロジェクトの構造は次のようになります。

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

サブプロジェクトの `build.gradle.kts` ファイルで、`plugins {}` ブロックに Application プラグインを適用します。

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
    implementation(project(":my-main-project")) // The name of your parent multiplatform project
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // The name of your parent multiplatform project
}
```

</tab>
</tabs>

これで、親プロジェクトは両方のプラグインで動作するように設定されました。

## Kotlin/Native

Kotlin/Native では、ガベージコレクターの改善と、Swift/Objective-C から Kotlin の中断関数を呼び出すための改善が行われています。

### ガベージコレクターにおける並行マーキング

Kotlin 2.0.20 では、JetBrains チームは Kotlin/Native のランタイムパフォーマンスを向上させるための新たな一歩を踏み出します。
ガベージコレクター (GC) における並行マーキングの実験的サポートを追加しました。

デフォルトでは、GC がヒープ内のオブジェクトをマーキングしている間、アプリケーションスレッドを一時停止する必要があります。これは、Compose Multiplatform で構築された UI アプリケーションなど、レイテンシーが重要なアプリケーションのパフォーマンスにとって重要な GC ポーズ時間の長さに大きく影響します。

これで、ガベージコレクションのマーキングフェーズをアプリケーションスレッドと同時に実行できるようになりました。
これにより、GC のポーズ時間が大幅に短縮され、アプリの応答性の向上に役立つはずです。

#### 有効にする方法

この機能は現在[実験的](components-stability.md#stability-levels-explained)です。
有効にするには、`gradle.properties` ファイルに次のオプションを設定します。

```none
kotlin.native.binary.gc=cms
```

問題が見つかった場合は、課題トラッカー [YouTrack](https://kotl.in/issue) まで報告してください。

### ビットコード埋め込みのサポートが削除されました

Kotlin 2.0.20 以降、Kotlin/Native コンパイラはビットコード埋め込みをサポートしなくなりました。
ビットコード埋め込みは Xcode 14 で非推奨になり、Xcode 15 で Apple のすべてのターゲットから削除されました。

現在、フレームワーク設定の `embedBitcode` パラメータ、および `-Xembed-bitcode` と `-Xembed-bitcode-marker` コマンドライン引数は非推奨です。

以前のバージョンの Xcode をまだ使用しているが Kotlin 2.0.20 にアップグレードしたい場合は、Xcode プロジェクトでビットコード埋め込みを無効にしてください。

### Signpost を使用した GC パフォーマンス監視の変更点

Kotlin 2.0.0 では、Xcode Instruments を介して Kotlin/Native ガベージコレクター (GC) のパフォーマンスを監視できるようになりました。Instruments には Signpost ツールが含まれており、GC の一時停止をイベントとして表示できます。
これは、iOS アプリでの GC 関連のフリーズをチェックする際に役立ちます。

この機能はデフォルトで有効になっていましたが、残念ながら、アプリケーションが Xcode Instruments と同時に実行されると、クラッシュにつながることがありました。
Kotlin 2.0.20 以降、次のコンパイラオプションを使用して明示的なオプトインが必要です。

```none
-Xbinary=enableSafepointSignposts=true
```

GC パフォーマンス分析の詳細については、[ドキュメント](native-memory-manager.md#monitor-gc-performance)を参照してください。

### Swift/Objective-C からメインスレッド以外で Kotlin の中断関数を呼び出す機能

以前は、Kotlin/Native にはデフォルトの制限があり、Swift および Objective-C から Kotlin の中断関数を呼び出すことができるのはメインスレッドのみに限定されていました。Kotlin 2.0.20 ではその制限が解除され、Swift/Objective-C からあらゆるスレッドで Kotlin の `suspend` 関数を実行できるようになりました。

以前、メインスレッド以外でのデフォルトの動作を `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none` バイナリオプションで切り替えていた場合は、`gradle.properties` ファイルから削除できるようになりました。

## Kotlin/Wasm

Kotlin 2.0.20 では、Kotlin/Wasm は名前付きエクスポートへの移行を継続し、`@ExperimentalWasmDsl` アノテーションを再配置します。

### デフォルトエクスポート使用時のエラー

名前付きエクスポートへの移行の一環として、Kotlin/Wasm エクスポートの JavaScript でデフォルトインポートを使用すると、以前は警告メッセージがコンソールに出力されていました。

名前付きエクスポートを完全にサポートするために、この警告はエラーに昇格されました。デフォルトインポートを使用すると、次のエラーメッセージが表示されます。

```text
Do not use default import. Use the corresponding named import instead.
```

この変更は、名前付きエクスポートへの移行のための非推奨化サイクルの一部です。各フェーズで予想される内容は次のとおりです。

*   **バージョン 2.0.0**: デフォルトエクスポートを介したエンティティのエクスポートが非推奨であることを説明する警告メッセージがコンソールに出力されます。
*   **バージョン 2.0.20**: 対応する名前付きインポートの使用を要求するエラーが発生します。
*   **バージョン 2.1.0**: デフォルトインポートの使用は完全に削除されます。

### ExperimentalWasmDsl アノテーションの新しい場所

以前、WebAssembly (Wasm) 機能の `@ExperimentalWasmDsl` アノテーションは、Kotlin Gradle プラグイン内の次の場所に配置されていました。

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

2.0.20 では、`@ExperimentalWasmDsl` アノテーションは次の場所に再配置されました。

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

以前の場所は非推奨となり、未解決の参照によるビルド失敗につながる可能性があります。

`@ExperimentalWasmDsl` アノテーションの新しい場所を反映するために、Gradle ビルドスクリプトの import ステートメントを更新してください。
新しい `@ExperimentalWasmDsl` の場所に対して明示的な import を使用します。

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

または、古いパッケージからのスターインポートステートメントを削除します。

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS では、JavaScript で静的メンバーをサポートし、JavaScript から Kotlin コレクションを作成するための実験的な機能がいくつか導入されています。

### JavaScript で Kotlin の静的メンバーを使用するサポート

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) でフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 2.0.20 以降、`@JsStatic` アノテーションを使用できるようになりました。これは [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/) と同様に機能し、コンパイラに追加の静的メソッドをターゲット宣言に対して生成するよう指示します。これにより、Kotlin コードの静的メンバーを JavaScript で直接使用できるようになります。

`@JsStatic` アノテーションは、名前付きオブジェクトで定義された関数、およびクラスやインターフェース内に宣言されたコンパニオンオブジェクトで使用できます。コンパイラは、オブジェクトの静的メソッドと、オブジェクト自体のインスタンスメソッドの両方を生成します。例:

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

これで、`callStatic()` は JavaScript で静的になりますが、`callNonStatic()` は静的ではありません。

```javascript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

`@JsStatic` アノテーションは、オブジェクトまたはコンパニオンオブジェクトのプロパティにも適用でき、その getter および setter メソッドをそのオブジェクトまたはコンパニオンオブジェクトを含むクラスの静的メンバーにします。

### JavaScript から Kotlin コレクションを作成する機能

> この機能は[実験的](components-stability.md#stability-levels-explained)です。いつでも削除または変更される可能性があります。
> 評価目的でのみ使用してください。[YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) でフィードバックをお待ちしております。
>
{style="warning"}

Kotlin 2.0.0 では、Kotlin コレクションを JavaScript (および TypeScript) にエクスポートする機能が導入されました。今回、JetBrains チームはコレクションの相互運用性を改善するためにもう一歩踏み出します。Kotlin 2.0.20 以降、JavaScript/TypeScript 側から Kotlin コレクションを直接作成できるようになりました。

JavaScript から Kotlin コレクションを作成し、それらをエクスポートされたコンストラクタまたは関数への引数として渡すことができます。
エクスポートされた宣言内でコレクションに言及するとすぐに、Kotlin は JavaScript/TypeScript で利用可能なコレクションのファクトリを生成します。

次のエクスポートされた関数を見てください。

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

`MutableMap` コレクションに言及されているため、Kotlin は JavaScript/TypeScript から利用可能なファクトリメソッドを持つオブジェクトを生成します。
このファクトリメソッドは、JavaScript の `Map` から `MutableMap` を作成します。

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

この機能は、`Set`、`Map`、`List` の Kotlin コレクション型と、それらのミュータブルな対応物で利用できます。

## Gradle

Kotlin 2.0.20 は Gradle 6.8.3 から 8.6 まで完全に互換性があります。Gradle 8.7 および 8.8 もサポートされていますが、1 つだけ例外があります。Kotlin Multiplatform Gradle プラグインを使用している場合、JVM ターゲットで `withJava()` 関数を呼び出すマルチプラットフォームプロジェクトで非推奨の警告が表示されることがあります。この問題はできるだけ早く修正する予定です。

詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning) の課題を参照してください。

また、最新の Gradle リリースまでの Gradle バージョンを使用することもできますが、その場合、非推奨の警告が表示されたり、一部の新しい Gradle 機能が動作しない可能性があることに注意してください。

このバージョンでは、JVM 履歴ファイルに基づく古いインクリメンタルコンパイルアプローチの非推奨化プロセス開始や、プロジェクト間で JVM アーティファクトを共有する新しい方法などの変更が加えられています。

### JVM 履歴ファイルに基づくインクリメンタルコンパイルの非推奨化

Kotlin 2.0.20 では、JVM 履歴ファイルに基づくインクリメンタルコンパイルのアプローチが非推奨となり、Kotlin 1.8.20 以降デフォルトで有効になっている新しいインクリメンタルコンパイルのアプローチが推奨されます。

JVM 履歴ファイルに基づくインクリメンタルコンパイルのアプローチは、[Gradle のビルドキャッシュ](https://docs.gradle.org/current/userguide/build_cache.html)で動作しない、コンパイル回避をサポートしないなどの制限がありました。
対照的に、新しいインクリメンタルコンパイルのアプローチはこれらの制限を克服し、導入以来良好なパフォーマンスを示しています。

新しいインクリメンタルコンパイルのアプローチが過去 2 回の主要な Kotlin リリースでデフォルトで使用されていることを踏まえ、Kotlin 2.0.20 では `kotlin.incremental.useClasspathSnapshot` Gradle プロパティが非推奨となりました。
したがって、これをオプトアウトに使用すると、非推奨の警告が表示されます。

### クラスファイルとしてプロジェクト間で JVM アーティファクトを共有するオプション

> この機能は[実験的](components-stability.md#stability-levels-explained)です。
> いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) でフィードバックをお待ちしております。
> オプトインが必要です（詳細は下記参照）。
>
{style="warning"}

Kotlin 2.0.20 では、JAR ファイルなど、Kotlin/JVM コンパイルの出力がプロジェクト間で共有される方法を変更する新しいアプローチを導入します。このアプローチでは、Gradle の `apiElements` 設定に、コンパイル済み `.class` ファイルを含むディレクトリへのアクセスを提供するセカンダリバリアントが追加されます。設定すると、プロジェクトはコンパイル中に圧縮された JAR アーティファクトを要求する代わりに、このディレクトリを使用します。これにより、特にインクリメンタルビルドの場合、JAR ファイルが圧縮および解凍される回数が減ります。

私たちのテストでは、この新しいアプローチが Linux および macOS ホストでビルドパフォーマンスの改善をもたらす可能性があることが示されています。
ただし、Windows ホストでは、Windows がファイル操作時に I/O 処理をどのように扱うかにより、パフォーマンスの低下が見られました。

この新しいアプローチを試すには、`gradle.properties` ファイルに次のプロパティを追加します。

```none
kotlin.jvm.addClassesVariant=true
```

デフォルトでは、このプロパティは `false` に設定されており、Gradle の `apiElements` バリアントは圧縮された JAR アーティファクトを要求します。

> Gradle には、Java のみのプロジェクトでコンパイル中に、コンパイル済み `.class` ファイルを含むディレクトリ**の代わりに**圧縮された JAR アーティファクトのみを公開するために使用できる関連プロパティがあります。
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> このプロパティとその目的の詳細については、Gradle の[「巨大なマルチプロジェクトにおける Windows での著しいビルドパフォーマンスの低下」](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance)に関するドキュメントを参照してください。
>
{style="note"}

この新しいアプローチに関するフィードバックをお待ちしております。これを使用してパフォーマンスの改善に気づきましたか？
[YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) にコメントを追加してお知らせください。

### Kotlin Gradle プラグインの依存関係の動作を `java-test-fixtures` プラグインと一致させる

Kotlin 2.0.20 以前は、プロジェクトで [`java-test-fixtures` プラグイン](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)を使用している場合、Gradle と Kotlin Gradle プラグインの間で依存関係の伝播方法に違いがありました。

Kotlin Gradle プラグインは依存関係を次のように伝播しました。

*   `java-test-fixtures` プラグインの `implementation` および `api` 依存関係タイプから `test` ソースセットのコンパイルクラスパスへ。
*   メインソースセットの `implementation` および `api` 依存関係タイプから `java-test-fixtures` プラグインのソースセットのコンパイルクラスパスへ。

しかし、Gradle は `api` 依存関係タイプのみを伝播しました。

この動作の違いにより、一部のプロジェクトではリソースファイルがクラスパスに複数回見つかるという問題が発生していました。

Kotlin 2.0.20 以降、Kotlin Gradle プラグインの動作は Gradle の `java-test-fixtures` プラグインと一致するように調整されたため、この問題や他の Gradle プラグインに関する問題は発生しなくなりました。

この変更の結果、`test` および `testFixtures` ソースセットの一部の依存関係にアクセスできなくなる可能性があります。
これが発生した場合は、依存関係宣言タイプを `implementation` から `api` に変更するか、影響を受けるソースセットに新しい依存関係宣言を追加してください。

### コンパイルタスクがアーティファクトへのタスク依存関係を欠く稀なケースにタスク依存関係を追加

2.0.20 以前では、コンパイルタスクがそのアーティファクト入力の 1 つに対するタスク依存関係を欠くシナリオがあることがわかりました。これは、依存するコンパイルタスクの結果が不安定であることを意味し、アーティファクトが時間内に生成される場合と、生成されない場合がありました。

この問題を修正するため、Kotlin Gradle プラグインはこれらのシナリオで必要なタスク依存関係を自動的に追加するようになりました。

非常に稀なケースですが、この新しい動作が循環依存関係エラーを引き起こすことがわかりました。
たとえば、複数のコンパイルがあり、1 つのコンパイルが他のすべての内部宣言を参照でき、生成されたアーティファクトが両方のコンパイルタスクの出力に依存する場合、次のようなエラーが表示される可能性があります。

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

この循環依存関係エラーを修正するため、`archivesTaskOutputAsFriendModule` という Gradle プロパティを追加しました。

デフォルトでは、このプロパティは `true` に設定されており、タスク依存関係を追跡します。アーティファクトのコンパイルタスクでの使用を無効にし、タスク依存関係が不要にするには、`gradle.properties` ファイルに以下を追加します。

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

詳細については、[YouTrack](https://youtrack.jetbrains.com/issue/KT-69330) の課題を参照してください。

## Compose コンパイラ

Kotlin 2.0.20 では、Compose コンパイラにいくつかの改善が加えられました。

### 2.0.0 で導入された不要な再コンポジションの問題の修正

Compose コンパイラ 2.0.0 には、非 JVM ターゲットを持つマルチプラットフォームプロジェクトで型の安定性を誤って推論することがあり、不要な (あるいは無限の) 再コンポジションにつながるという問題があります。Kotlin 2.0.0 で作成された Compose アプリをバージョン 2.0.10 以降に更新することを強くお勧めします。

アプリが Compose コンパイラ 2.0.10 以降でビルドされているものの、バージョン 2.0.0 でビルドされた依存関係を使用している場合、これらの古い依存関係が再コンポジションの問題を引き起こす可能性があります。
これを防ぐには、依存関係をアプリと同じ Compose コンパイラでビルドされたバージョンに更新してください。

### コンパイラオプションの新しい設定方法

トップレベルパラメータの頻繁な変更を避けるため、新しいオプション設定メカニズムを導入しました。
`composeCompiler {}` ブロックのトップレベルエントリを作成または削除することで、Compose コンパイラチームがテストを行うのは難しくなります。
そのため、強力なスキッピングモードや非スキッピンググループ最適化などのオプションは、`featureFlags` プロパティを介して有効にするようになりました。
このプロパティは、最終的にデフォルトになる新しい Compose コンパイラオプションをテストするために使用されます。

この変更は Compose コンパイラ Gradle プラグインにも適用されています。今後 feature flag を設定するには、次の構文を使用します (このコードはすべてのデフォルト値を反転させます)。

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

または、Compose コンパイラを直接設定する場合は、次の構文を使用します。

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

`enableIntrinsicRemember`、`enableNonSkippingGroupOptimization`、`enableStrongSkippingMode` プロパティは非推奨になりました。

この新しいアプローチに関するフィードバックを [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) でお寄せいただければ幸いです。

### 強力なスキッピングモードがデフォルトで有効に

Compose コンパイラの強力なスキッピングモードがデフォルトで有効になりました。

強力なスキッピングモードは、スキップできるコンポーザブル関数のルールを変更する Compose コンパイラの設定オプションです。
強力なスキッピングモードが有効になっている場合、不安定なパラメータを持つコンポーザブル関数もスキップできるようになります。
また、強力なスキッピングモードは、コンポーザブル関数で使用されるラムダを自動的に記憶するため、再コンポジションを避けるためにラムダを `remember` でラップする必要がなくなります。

詳細については、[強力なスキッピングモードのドキュメント](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)を参照してください。

### コンポジショントレースマーカーがデフォルトで有効に

`includeTraceMarkers` オプションは、コンパイラプラグインのデフォルト値と一致するように、Compose コンパイラ Gradle プラグインでデフォルトで `true` に設定されるようになりました。これにより、Android Studio のシステムトレースプロファイラーでコンポーザブル関数を確認できます。コンポジションのトレースに関する詳細については、この [Android Developers ブログ投稿](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)を参照してください。

### 非スキップグループの最適化

このリリースには、新しいコンパイラオプションが含まれています。これを有効にすると、スキップ不可および再起動不可のコンポーザブル関数は、コンポーザブル関数のボディの周りにグループを生成しなくなります。これにより、アロケーションが減少し、パフォーマンスが向上します。
このオプションは実験的でデフォルトでは無効ですが、[上記](#new-way-to-configure-compiler-options)に示すように `OptimizeNonSkippingGroups` feature flag を使用して有効にできます。

この feature flag は現在、より広範なテストの準備が整っています。機能を有効にした際に発見された問題は、[Google 課題トラッカー](https://goo.gle/compose-feedback)に報告してください。

### 抽象的なコンポーザブル関数におけるデフォルトパラメータのサポート

抽象的なコンポーザブル関数にデフォルトパラメータを追加できるようになりました。

以前は、Compose コンパイラは、これが有効な Kotlin コードであるにもかかわらず、これを行おうとするとエラーを報告していました。
今回、Compose コンパイラでこれをサポートするようになり、制限が削除されました。
これは、デフォルトの `Modifier` 値を含める場合に特に役立ちます。

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

オープンなコンポーザブル関数のデフォルトパラメータは、2.0.20 ではまだ制限されています。この制限は将来のリリースで対処される予定です。

## 標準ライブラリ

標準ライブラリは、実験的機能として UUID (普遍的に一意な識別子) をサポートし、Base64 デコードにいくつかの変更が含まれています。

### 共通 Kotlin 標準ライブラリにおける UUID のサポート

> この機能は[実験的](components-stability.md#stability-levels-explained)です。
> オプトインするには、`@ExperimentalUuidApi` アノテーションまたはコンパイラオプション `-opt-in=kotlin.uuid.ExperimentalUuidApi` を使用してください。
>
{style="warning"}

Kotlin 2.0.20 では、アイテムを一意に識別するという課題に対処するため、共通 Kotlin 標準ライブラリに [UUID (普遍的に一意な識別子)](https://en.wikipedia.org/wiki/Universally_unique_identifier) を表すクラスを導入します。

さらに、この機能は以下の UUID 関連操作のための API を提供します。

*   UUID の生成。
*   UUID を文字列形式から解析したり、文字列形式にフォーマットしたりする。
*   指定された 128 ビット値から UUID を作成する。
*   UUID の 128 ビットにアクセスする。

次のコード例は、これらの操作を示しています。

```kotlin
// Constructs a byte array for UUID creation
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

// Accesses UUID bits
val version = uuid1.toLongs { mostSignificantBits, _ ->
    ((mostSignificantBits shr 12) and 0xF).toInt()
}
println(version)
// 4

// Generates a random UUID
val randomUuid = Uuid.random()

println(uuid1 == randomUuid)
// false
```

`java.util.UUID` を使用する API との互換性を維持するため、Kotlin/JVM には `java.util.UUID` と `kotlin.uuid.Uuid` 間で変換するための 2 つの拡張関数、`.toJavaUuid()` と `.toKotlinUuid()` があります。例:

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// Converts Kotlin UUID to java.util.UUID
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// Converts Java UUID to kotlin.uuid.Uuid
val kotlinUuid = javaUuid.toKotlinUuid()
```

この機能と提供される API は、複数のプラットフォーム間でコードを共有できるようにすることで、マルチプラットフォームソフトウェア開発を簡素化します。UUID は、一意の識別子を生成することが困難な環境でも理想的です。

UUID を使用する一般的なユースケースの例としては、次のようなものがあります。

*   データベースレコードに一意の ID を割り当てる。
*   ウェブセッション識別子を生成する。
*   一意の識別または追跡を必要とするあらゆるシナリオ。

### HexFormat における `minLength` のサポート

> [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) クラスとそのプロパティは
> [実験的](components-stability.md#stability-levels-explained)です。
> オプトインするには、`@OptIn(ExperimentalStdlibApi::class)` アノテーションまたはコンパイラ
> オプション `-opt-in=kotlin.ExperimentalStdlibApi` を使用してください。
>
{style="warning"}

Kotlin 2.0.20 では、[`NumberHexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/) クラスに新しい `minLength` プロパティが追加され、[`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html) を介してアクセスできます。
このプロパティを使用すると、数値の 16 進数表現における最小桁数を指定でき、必要な長さに合わせてゼロ埋めを有効にできます。さらに、`removeLeadingZeros` プロパティを使用して、先頭のゼロをトリムすることもできます。

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

`minLength` プロパティは解析には影響しません。ただし、解析では、追加の先頭桁がゼロである場合、型の幅よりも多くの桁を持つ 16 進数文字列が許可されるようになりました。

### Base64 デコーダーの動作変更

> [`Base64` クラス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/) とその
> 関連機能は[実験的](components-stability.md#stability-levels-explained)です。
> オプトインするには、`@OptIn(ExperimentalEncodingApi::class)`
> アノテーションまたはコンパイラオプション `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi` を使用してください。
>
{style="warning"}

Kotlin 2.0.20 では、Base64 デコーダーの動作に 2 つの変更が導入されました。

*   [Base64 デコーダーでパディングが必須に](#the-base64-decoder-now-requires-padding)
*   [パディング設定のための `withPadding` 関数が追加された](#withpadding-function-for-padding-configuration)

#### Base64 デコーダーでパディングが必須に

Base64 エンコーダーはデフォルトでパディングを追加するようになり、デコーダーはデコード時にパディングを要求し、非ゼロのパディングビットを禁止するようになりました。

#### パディング設定のための `withPadding` 関数

Base64 エンコードおよびデコードのパディング動作をユーザーが制御できるように、新しい `.withPadding()` 関数が導入されました。

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

この関数により、異なるパディングオプションを持つ `Base64` インスタンスを作成できます。

| `PaddingOption`    | エンコード時   | デコード時          |
|--------------------|--------------|---------------------|
| `PRESENT`          | パディングを追加 | パディングが必須    |
| `ABSENT`           | パディングを省略 | パディングは許可されない |
| `PRESENT_OPTIONAL` | パディングを追加 | パディングはオプション |
| `ABSENT_OPTIONAL`  | パディングを省略 | パディングはオプション |

異なるパディングオプションを持つ `Base64` インスタンスを作成し、それらを使用してデータをエンコードおよびデコードできます。

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // Example data to encode
    val data = "fooba".toByteArray()

    // Creates a Base64 instance with URL-safe alphabet and PRESENT padding
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("Encoded data with PRESENT padding: $encodedDataPresent")
    // Encoded data with PRESENT padding: Zm9vYmE=

    // Creates a Base64 instance with URL-safe alphabet and ABSENT padding
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("Encoded data with ABSENT padding: $encodedDataAbsent")
    // Encoded data with ABSENT padding: Zm9vYmE

    // Decodes the data back
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

Kotlin ドキュメントはいくつかの注目すべき変更を受けました。

*   [標準入力ページ](standard-input.md)の改善 - Java Scanner と `readln()` の使用方法について学習します。
*   [K2 コンパイラ移行ガイド](k2-compiler-migration-guide.md)の改善 - パフォーマンスの改善、Kotlin ライブラリとの互換性、カスタムコンパイラプラグインの対処方法について学習します。
*   [例外ページ](exceptions.md)の改善 - 例外、それらのスローとキャッチの方法について学習します。
*   [JVM で JUnit を使用してコードをテストするチュートリアル](jvm-test-using-junit.md)の改善 - JUnit を使用してテストを作成する方法について学習します。
*   [Swift/Objective-C との相互運用性ページ](native-objc-interop.md)の改善 - Swift/Objective-C コードにおける Kotlin 宣言の使用方法、および Kotlin コードにおける Objective-C 宣言の使用方法について学習します。
*   [Swift パッケージエクスポートセットアップページ](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html)の改善 - Swift パッケージマネージャの依存関係によって使用できる Kotlin/Native 出力を設定する方法について学習します。

## Kotlin 2.0.20 のインストール

IntelliJ IDEA 2023.3 および Android Studio Iguana (2023.2.1) Canary 15 以降、Kotlin プラグインは IDE にバンドルされたプラグインとして配布されます。これは、JetBrains Marketplace からプラグインをインストールできなくなったことを意味します。

新しい Kotlin バージョンに更新するには、ビルドスクリプトで [Kotlin のバージョンを 2.0.20 に変更](releases.md#update-to-a-new-kotlin-version)します。